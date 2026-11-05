import type { ProjectEntry } from "~/config/profile";

/** Flat tree item as returned by the GitHub Trees API (and our snapshot). */
export interface GitTreeItem {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

/** Nested file-system node used by FinderWindow. */
export interface FSNode {
  name: string;
  kind: "folder" | "file";
  size?: number;
  ext?: string;
  children?: FSNode[];
}

/** Per-repo snapshot entry (src/data/githubSnapshot.json). */
export interface RepoSnapshotEntry {
  repo: string;
  title: string;
  branch: string;
  description: string | null;
  language: string | null;
  stars: number;
  updatedAt: string;
  homepage: string | null;
  htmlUrl: string;
  tree: GitTreeItem[];
  readme: string | null;
}

export interface GithubSnapshotFile {
  generatedAt: string;
  user: string;
  repos: Record<string, RepoSnapshotEntry>;
}

/** Noise skipped from trees: deps, VCS, build output, lockfiles, huge blobs. */
const IGNORED_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".turbo", "coverage"]);
const IGNORED_FILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",
]);
export const MAX_PREVIEW_BYTES = 1024 * 1024; // 1 MB

export function shouldIgnoreTreeItem(path: string, size?: number): boolean {
  const segs = path.split("/");
  if (segs.some((s) => IGNORED_DIRS.has(s))) return true;
  if (IGNORED_FILES.has(segs[segs.length - 1])) return true;
  if (typeof size === "number" && size > MAX_PREVIEW_BYTES) return true;
  return false;
}

/** Build a nested, Finder-sorted tree (folders first, then A–Z) from flat items. */
export function buildNestedTree(items: GitTreeItem[]): FSNode[] {
  const root: FSNode[] = [];
  const dirMap = new Map<string, FSNode>();

  const sorted = [...items].sort((a, b) => a.path.localeCompare(b.path));
  for (const item of sorted) {
    const segs = item.path.split("/");
    let parentList = root;
    let parentPath = "";
    for (let i = 0; i < segs.length; i++) {
      const seg = segs[i];
      const isLast = i === segs.length - 1;
      const fullPath = parentPath ? `${parentPath}/${seg}` : seg;
      if (isLast && item.type === "blob") {
        const dot = seg.lastIndexOf(".");
        parentList.push({
          name: seg,
          kind: "file",
          size: item.size,
          ext: dot > 0 ? seg.slice(dot + 1).toLowerCase() : undefined,
        });
      } else {
        let dir = dirMap.get(fullPath);
        if (!dir) {
          dir = { name: seg, kind: "folder", children: [] };
          dirMap.set(fullPath, dir);
          parentList.push(dir);
        }
        parentList = dir.children!;
        parentPath = fullPath;
      }
    }
  }
  sortNodes(root);
  return root;
}

function sortNodes(nodes: FSNode[]): void {
  nodes.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
  for (const n of nodes) {
    if (n.children) sortNodes(n.children);
  }
}

/** Find a nested node by repo-relative path segments. */
export function findNode(nodes: FSNode[], segs: string[]): FSNode | null {
  let list = nodes;
  let found: FSNode | null = null;
  for (const seg of segs) {
    found = list.find((n) => n.name === seg) ?? null;
    if (!found || !found.children) return found && segs[segs.length - 1] === seg ? found : null;
    list = found.children;
  }
  return found;
}

export function formatBytes(size?: number): string {
  if (size === undefined || size === null) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 102.4) / 10} KB`;
  return `${Math.round(size / 104857.6) / 10} MB`;
}

export function kindLabel(node: FSNode): string {
  if (node.kind === "folder") return "Folder";
  switch ((node.ext ?? "").toLowerCase()) {
    case "md":
    case "markdown":
      return "Markdown";
    case "pdf":
      return "PDF";
    case "json":
      return "JSON";
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "webp":
    case "svg":
    case "ico":
      return "Image";
    case "js":
    case "jsx":
      return "JavaScript";
    case "ts":
      return "TypeScript";
    case "tsx":
      return "TypeScript React";
    case "py":
      return "Python";
    case "css":
      return "CSS";
    case "html":
      return "HTML";
    case "txt":
      return "Text";
    default:
      return node.ext ? `${node.ext.toUpperCase()} file` : "File";
  }
}

/** web URL for a file inside a repo (/blob/…), folder (/tree/…) or repo root. */
export function githubContentUrl(
  htmlUrl: string,
  branch: string,
  repoPath: string,
  kind: "folder" | "file"
): string {
  if (!repoPath) return htmlUrl;
  const encoded = repoPath
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
  return kind === "folder"
    ? `${htmlUrl}/tree/${branch}/${encoded}`
    : `${htmlUrl}/blob/${branch}/${encoded}`;
}

/** Resolve which project entries still need applying to a snapshot (for warnings). */
export function missingSnapshotRepos(
  snapshot: GithubSnapshotFile | null,
  projects: ProjectEntry[]
): string[] {
  if (!snapshot) return projects.map((p) => p.repo);
  return projects.map((p) => p.repo).filter((r) => !snapshot.repos[r]?.tree);
}
