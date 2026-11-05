import githubSnapshotRaw from "~/data/githubSnapshot.json";
import profile, { type ProjectEntry } from "~/config/profile";
import {
  buildNestedTree,
  shouldIgnoreTreeItem,
  type FSNode,
  type GithubSnapshotFile,
  type GitTreeItem,
  type RepoSnapshotEntry,
} from "~/components/apps/finder/finderTypes";

const snapshot = githubSnapshotRaw as unknown as GithubSnapshotFile;

export interface ProjectMeta {
  branch: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
  homepage: string | null;
  htmlUrl: string;
}

export interface ProjectData {
  entry: ProjectEntry;
  /** True for repos listed in profile.projects (shown first). */
  configured: boolean;
  meta: ProjectMeta;
  nodes: FSNode[];
  readme: string | null;
  /** Live refresh in flight (snapshot content shown meanwhile). */
  refreshing: boolean;
  /** True once live API data replaced the snapshot this session. */
  live: boolean;
  /** Set only when neither snapshot nor live data exists. */
  error: string | null;
}

interface LiveCacheEntry {
  at: number;
  meta: ProjectMeta;
  items: GitTreeItem[];
  readme: string | null;
}
const liveCache = new Map<string, LiveCacheEntry>();
const LIVE_TTL = 10 * 60 * 1000;
/** Repo names already present in state (snapshot keys), so catalog merges stay additive. */
const knownRepos = new Set<string>(Object.keys(snapshot?.repos ?? {}));

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

interface RepoApiMeta {
  name: string;
  default_branch: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  homepage: string | null;
  html_url: string;
  fork: boolean;
}

interface TreesApiResponse {
  tree?: { path?: string; type?: string; size?: number }[];
}

function metaFromApiMeta(repo: string, title: string, branch: string, m: RepoApiMeta): ProjectMeta {
  return {
    branch,
    description: m.description,
    language: m.language,
    stars: m.stargazers_count,
    updatedAt: m.updated_at,
    homepage: m.homepage || null,
    htmlUrl: m.html_url,
  };
}

function entryFromSnapshot(
  repo: string,
  title: string,
  branchOverride: string | undefined,
  configured: boolean,
  snap: RepoSnapshotEntry | undefined
): ProjectData {
  return {
    entry: { repo, title, branch: branchOverride },
    configured,
    meta: {
      branch: branchOverride ?? snap?.branch ?? "main",
      description: snap?.description ?? null,
      language: snap?.language ?? null,
      stars: snap?.stars ?? 0,
      updatedAt: snap?.updatedAt ?? "",
      homepage: snap?.homepage ?? null,
      htmlUrl: snap?.htmlUrl ?? `https://github.com/${profile.githubUser}/${repo}`,
    },
    nodes: snap?.tree ? buildNestedTree(snap.tree) : [],
    readme: snap?.readme ?? null,
    refreshing: false,
    live: false,
    error: snap?.tree ? null : "Snapshot missing — will try the live API.",
  };
}

function configuredEntry(repo: string): { title: string; branch?: string } {
  const found = profile.projects.find((p) => p.repo.toLowerCase() === repo.toLowerCase());
  return { title: found?.title ?? repo, branch: found?.branch };
}

function initialData(): Record<string, ProjectData> {
  const out: Record<string, ProjectData> = {};
  // Configured projects first (profile order), then every other synced repo A–Z.
  for (const p of profile.projects) {
    const key = Object.keys(snapshot?.repos ?? {}).find((r) => r.toLowerCase() === p.repo.toLowerCase());
    const snapKey = key ?? p.repo;
    out[snapKey] = entryFromSnapshot(
      snapKey,
      p.title,
      p.branch,
      true,
      snapshot?.repos?.[snapKey]
    );
  }
  for (const repo of Object.keys(snapshot?.repos ?? {}).sort((a, b) => a.localeCompare(b))) {
    if (out[repo]) continue;
    const { title } = configuredEntry(repo);
    out[repo] = entryFromSnapshot(repo, title, undefined, false, snapshot.repos[repo]);
  }
  return out;
}

async function fetchRepoTree(
  repo: string,
  branch: string
): Promise<{ items: GitTreeItem[]; readme: string | null } | null> {
  const trees = await getJSON<TreesApiResponse>(
    `https://api.github.com/repos/${profile.githubUser}/${repo}/git/trees/${branch}?recursive=1`
  );
  if (!trees?.tree) return null;
  const items: GitTreeItem[] = [];
  for (const t of trees.tree) {
    if (!t.path || (t.type !== "blob" && t.type !== "tree")) continue;
    if (shouldIgnoreTreeItem(t.path, t.size)) continue;
    items.push({ path: t.path, type: t.type, size: t.size });
  }
  let readme: string | null = null;
  for (const name of ["README.md", "readme.md", "Readme.md"]) {
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/${profile.githubUser}/${repo}/${branch}/${name}`
      );
      if (res.ok) {
        readme = await res.text();
        break;
      }
    } catch {
      // try next candidate
    }
  }
  return { items, readme };
}

/**
 * Snapshot-first data for EVERY public repo (configured projects first).
 * Reads src/data/githubSnapshot.json instantly, refreshes configured repos
 * + the catalog in the background, and lazily loads any repo missing from
 * the snapshot via ensureRepo. Live failures fall back silently.
 */
export function useProjectsData(): {
  byRepo: Record<string, ProjectData>;
  /** Configured projects (profile order), then the rest A–Z. */
  ordered: ProjectData[];
  ensureRepo: (repo: string) => void;
} {
  const [data, setData] = useState<Record<string, ProjectData>>(initialData);
  const [nonce, setNonce] = useState(0);
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    let cancelled = false;

    const applyLive = (repo: string, meta: ProjectMeta, items: GitTreeItem[], readme: string | null) => {
      if (cancelled) return;
      liveCache.set(repo, { at: Date.now(), meta, items, readme });
      setData((prev) => {
        const existing = prev[repo];
        if (!existing) return prev;
        return {
          ...prev,
          [repo]: {
            ...existing,
            meta,
            nodes: buildNestedTree(items),
            readme: readme ?? existing.readme,
            refreshing: false,
            live: true,
            error: null,
          },
        };
      });
    };

    const refreshOne = async (repo: string, knownBranch?: string) => {
      const cached = liveCache.get(repo);
      if (cached && Date.now() - cached.at < LIVE_TTL) {
        applyLive(repo, cached.meta, cached.items, cached.readme);
        return;
      }
      setData((prev) =>
        prev[repo] ? { ...prev, [repo]: { ...prev[repo], refreshing: true } } : prev
      );
      const apiMeta = await getJSON<RepoApiMeta>(
        `https://api.github.com/repos/${profile.githubUser}/${repo}`
      );
      if (cancelled) return;
      if (!apiMeta) {
        setData((prev) =>
          prev[repo] ? { ...prev, [repo]: { ...prev[repo], refreshing: false } } : prev
        );
        return;
      }
      const { title } = configuredEntry(apiMeta.name);
      const branch = knownBranch ?? apiMeta.default_branch;
      const tree = await fetchRepoTree(apiMeta.name, branch);
      if (cancelled) return;
      if (!tree) {
        setData((prev) =>
          prev[repo] ? { ...prev, [repo]: { ...prev[repo], refreshing: false } } : prev
        );
        return;
      }
      applyLive(apiMeta.name, metaFromApiMeta(apiMeta.name, title, branch, apiMeta), tree.items, tree.readme);
    };

    (async () => {
      // Refresh the catalog of all public repos, then configured projects.
      const catalog = await getJSON<RepoApiMeta[]>(
        `https://api.github.com/users/${profile.githubUser}/repos?per_page=100`
      );
      if (cancelled) return;
      if (catalog) {
        const fresh = catalog.filter(
          (m) => m && !m.fork && typeof m.name === "string" && !knownRepos.has(m.name)
        );
        for (const m of fresh) knownRepos.add(m.name);
        if (fresh.length > 0) {
          setData((prev) => {
            const next = { ...prev };
            for (const m of fresh) {
              if (next[m.name]) continue;
              const { title } = configuredEntry(m.name);
              next[m.name] = {
                entry: { repo: m.name, title },
                configured: false,
                meta: metaFromApiMeta(m.name, title, m.default_branch, m),
                nodes: [],
                readme: null,
                refreshing: true,
                live: false,
                error: "Snapshot missing — will try the live API.",
              };
            }
            return next;
          });
          // Lazily fill their trees right away (cached, silent on failure).
          for (const m of fresh) {
            if (cancelled) break;
            await refreshOne(m.name, m.default_branch);
          }
        }
      }
      for (const entry of Object.values(dataRef.current)) {
        if (cancelled) break;
        // Configured repos always refresh; others only when missing data.
        if (entry.configured) await refreshOne(entry.entry.repo, entry.entry.branch);
        else if (entry.nodes.length === 0 && !entry.live) await refreshOne(entry.entry.repo);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Static config + manual retries only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  const ensureRepo = (repo: string) => {
    const cached = liveCache.get(repo);
    if (cached && Date.now() - cached.at < LIVE_TTL) return;
    setNonce((n) => n + 1);
  };

  const ordered = useMemo(() => {
    const list = Object.values(data);
    const rank = (d: ProjectData) => {
      const idx = profile.projects.findIndex(
        (p) => p.repo.toLowerCase() === d.entry.repo.toLowerCase()
      );
      return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
    };
    return [...list].sort((a, b) => {
      const r = rank(a) - rank(b);
      if (r !== 0) return r;
      if (a.configured !== b.configured) return a.configured ? -1 : 1;
      return a.entry.title.localeCompare(b.entry.title);
    });
  }, [data]);

  return { byRepo: data, ordered, ensureRepo };
}

/** Look up one project's data by display title. */
export function projectDataByTitle(
  byRepo: Record<string, ProjectData>,
  title: string
): ProjectData | null {
  for (const d of Object.values(byRepo)) {
    if (d.entry.title === title) return d;
  }
  return null;
}
