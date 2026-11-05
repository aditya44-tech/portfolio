/**
 * Build-time GitHub snapshot.
 *
 * Run:  npm run sync:github
 * Also runs automatically before every build (npm "prebuild" hook).
 *
 * 1. Fetches the full public repo catalog (1 API call).
 * 2. For every non-fork repo it fetches:
 *      GET .../git/trees/{branch}?recursive=1 → full file tree
 *      README.md via raw.githubusercontent.com
 *    ...and writes everything to src/data/githubSnapshot.json.
 *
 * The app reads the snapshot first (instant, zero API calls) and only
 * refreshes from the live API in the background at runtime.
 *
 * NEVER fails the build: any network/rate-limit error keeps the previous
 * snapshot and exits 0. Set GITHUB_TOKEN to raise the limit to 5,000/hr
 * (17 calls for 8 repos otherwise counts against the 60/hr allowance).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import profile from "../src/config/profile.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "src", "data", "githubSnapshot.json");

const IGNORED_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".turbo", "coverage"]);
const IGNORED_FILES = new Set(["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb"]);
const MAX_BYTES = 1024 * 1024;

function ignored(path: string, size?: number): boolean {
  const segs = path.split("/");
  if (segs.some((s) => IGNORED_DIRS.has(s))) return true;
  if (IGNORED_FILES.has(segs[segs.length - 1])) return true;
  return typeof size === "number" && size > MAX_BYTES;
}

function headers(): Record<string, string> {
  const h: Record<string, string> = {
    "User-Agent": "macos-portfolio-sync",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function getJSON(url: string): Promise<any | null> {
  const res = await fetch(url, { headers: headers() });
  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    throw new Error(`rate limited (remaining=${remaining})`);
  }
  if (!res.ok) return null;
  return res.json();
}

async function getText(url: string): Promise<string | null> {
  const res = await fetch(url, { headers: { "User-Agent": "macos-portfolio-sync" } });
  if (!res.ok) return null;
  const text = await res.text();
  return text.length > 200_000 ? text.slice(0, 200_000) : text;
}

function readExisting(): any {
  try {
    return JSON.parse(readFileSync(OUT, "utf8"));
  } catch {
    return { generatedAt: new Date(0).toISOString(), user: profile.githubUser, repos: {} };
  }
}

function configuredTitle(repo: string): string | undefined {
  return profile.projects.find((p) => p.repo.toLowerCase() === repo.toLowerCase())?.title;
}

function configuredBranch(repo: string): string | undefined {
  return profile.projects.find((p) => p.repo.toLowerCase() === repo.toLowerCase())?.branch;
}

async function main(): Promise<void> {
  const user = profile.githubUser;
  const prev = readExisting();
  const repos: Record<string, any> = { ...(prev.repos ?? {}) };

  const catalog = await getJSON(`https://api.github.com/users/${user}/repos?per_page=100`);
  if (!Array.isArray(catalog)) {
    console.warn("[sync:github] couldn't fetch repo catalog — keeping existing snapshot.");
    return;
  }
  const visible = catalog.filter((r) => r && !r.fork && typeof r.name === "string");
  console.log(`[sync:github] catalog: ${visible.length} public repos.`);

  const seen = new Set<string>();
  for (const meta of visible) {
    const name: string = meta.name;
    seen.add(name);
    try {
      const branch: string = configuredBranch(name) ?? meta.default_branch;
      const trees = await getJSON(
        `https://api.github.com/repos/${user}/${name}/git/trees/${branch}?recursive=1`
      );
      const items: { path: string; type: string; size?: number }[] = [];
      for (const t of trees?.tree ?? []) {
        if (!t?.path || (t.type !== "blob" && t.type !== "tree")) continue;
        if (ignored(t.path, t.size)) continue;
        items.push({ path: t.path, type: t.type, ...(typeof t.size === "number" ? { size: t.size } : {}) });
      }
      let readme: string | null = null;
      for (const n of ["README.md", "readme.md", "Readme.md"]) {
        readme = await getText(`https://raw.githubusercontent.com/${user}/${name}/${branch}/${n}`);
        if (readme) break;
      }
      repos[name] = {
        repo: name,
        title: configuredTitle(name) ?? name,
        branch,
        description: meta.description ?? null,
        language: meta.language ?? null,
        stars: meta.stargazers_count ?? 0,
        updatedAt: meta.updated_at ?? "",
        homepage: meta.homepage || null,
        htmlUrl: meta.html_url ?? `https://github.com/${user}/${name}`,
        tree: items,
        readme,
      };
      console.log(`[sync:github] ${name}@${branch}: ${items.length} paths${readme ? " + README" : ""}.`);
    } catch (e) {
      console.warn(`[sync:github] ${name}: ${(e as Error).message} — keeping previous snapshot entry.`);
    }
  }

  // Prune entries for repos that no longer exist upstream.
  for (const key of Object.keys(repos)) {
    if (!seen.has(key)) {
      console.log(`[sync:github] ${key} no longer on GitHub — dropping.`);
      delete repos[key];
    }
  }

  writeFileSync(
    OUT,
    JSON.stringify({ generatedAt: new Date().toISOString(), user, repos }, null, 2) + "\n"
  );
  console.log(`[sync:github] snapshot written (${Object.keys(repos).length} repos).`);
}

try {
  await main();
} catch (e) {
  // Never break `npm run build`: keep the old snapshot and exit 0.
  console.warn(`[sync:github] failed (${(e as Error).message}) — keeping existing snapshot.`);
}
