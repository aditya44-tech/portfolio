import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "~/hooks/useWindowSize";
import profile from "~/config/profile";
import { useProjectsData, type ProjectData } from "~/hooks/useProjectsData";
import { languageColor, timeAgo } from "~/hooks/useGithub";
import { consumePendingFinderPath } from "./finder/finderNav";
import {
  findNode,
  formatBytes,
  githubContentUrl,
  type FSNode,
} from "./finder/finderTypes";
import { FileTypeIcon } from "./finder/FileTypeIcon";
import FinderContextMenu from "./finder/FinderContextMenu";
import QuickLook, { type QuickLookTarget } from "./finder/QuickLook";

// ─── Types ───────────────────────────────────────────────────────────────────
type ViewMode = "icons" | "list" | "columns";
type SortKey = "name" | "date" | "size" | "kind";

interface FileItem {
  id: string;
  name: string;
  kind: "folder" | "file";
  ext?: string;
  size?: string;
  date: string;
  icon: string;
  color?: string;
  children?: FileItem[];
  /** Present on live project nodes (Resume file + GitHub repos). */
  repo?: { repo: string; branch: string; path: string; title: string };
  /** Snapshot README text shown without a network fetch. */
  virtualReadme?: string;
  /** Local PDF served from /public (resume). */
  pdfUrl?: string;
  /** Raw byte size for preview guards (repo files). */
  sizeBytes?: number;
}

// ─── Live locations ───────────────────────────────────────────────────────────
// "resume" and "projects" are first-class Finder locations (sidebar + home).
// Repo folders/files use ids "repo:{Repo}" and "file:repo:{Repo}/{path}".
const RESUME_ID = "resume";
const PROJECTS_ID = "projects";
const repoFolderId = (repo: string, rel = "") => `repo:${repo}${rel ? `/${rel}` : ""}`;
const isRepoId = (id: string) => id.startsWith("repo:");
const parseRepoId = (id: string): { repo: string; rel: string } | null => {
  if (!isRepoId(id)) return null;
  const rest = id.slice("repo:".length);
  const slash = rest.indexOf("/");
  if (slash === -1) return { repo: rest, rel: "" };
  return { repo: rest.slice(0, slash), rel: rest.slice(slash + 1) };
};

function shortDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

// ─── Mock Filesystem ─────────────────────────────────────────────────────────
const FILESYSTEM: Record<string, FileItem[]> = {
  home: [
    {
      id: "desktop",
      name: "Desktop",
      kind: "folder",
      date: "Today",
      icon: "/img/icons/sf-icons/desktop.svg",
      color: "#4A90E2",
      children: [
        { id: "readme", name: "README.md", kind: "file", ext: "md", size: "2 KB", date: "Today", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "notes", name: "notes.txt", kind: "file", ext: "txt", size: "1 KB", date: "Yesterday", icon: "/img/icons/sf-icons/doc.svg" },
      ],
    },
    {
      id: "documents",
      name: "Documents",
      kind: "folder",
      date: "Yesterday",
      icon: "/img/icons/sf-icons/folder.svg",
      color: "#F5A623",
      children: [
        { id: "resume", name: "Aditya_Resume.pdf", kind: "file", ext: "pdf", size: "340 KB", date: "Jun 1", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "cover", name: "CoverLetter.docx", kind: "file", ext: "docx", size: "28 KB", date: "Jun 2", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "projects-folder", name: "Projects", kind: "folder", date: "Jun 3", icon: "/img/icons/sf-icons/folder.svg", color: "#F5A623" },
      ],
    },
    {
      id: "downloads",
      name: "Downloads",
      kind: "folder",
      date: "Today",
      icon: "/img/icons/sf-icons/download.svg",
      color: "#7B68EE",
      children: [
        { id: "react-zip", name: "react-18.zip", kind: "file", ext: "zip", size: "2.1 MB", date: "Today", icon: "/img/icons/sf-icons/doc.svg" },
        { id: "wallpaper", name: "macOS_Tahoe.jpg", kind: "file", ext: "jpg", size: "4.8 MB", date: "Today", icon: "/img/icons/sf-icons/image.svg" },
      ],
    },
    {
      id: "pictures",
      name: "Pictures",
      kind: "folder",
      date: "Jun 3",
      icon: "/img/icons/sf-icons/image.svg",
      color: "#FF6B6B",
      children: [
        { id: "avatar", name: "avatar.png", kind: "file", ext: "png", size: "120 KB", date: "May 28", icon: "/img/icons/sf-icons/image.svg" },
      ],
    },
    {
      id: "music",
      name: "Music",
      kind: "folder",
      date: "Jun 2",
      icon: "/img/icons/sf-icons/sound.svg",
      color: "#FF2D55",
      children: [
        { id: "faded", name: "faded.mp3", kind: "file", ext: "mp3", size: "3.5 MB", date: "May 20", icon: "/img/icons/sf-icons/sound.svg" },
        { id: "samantha", name: "Samantha Legacy.wav", kind: "file", ext: "wav", size: "280 KB", date: "Jun 1", icon: "/img/icons/sf-icons/sound.svg" },
      ],
    },
    {
      id: "repos",
      name: "Repositories",
      kind: "folder",
      date: "Today",
      icon: "/img/icons/sf-icons/desktop.svg",
      color: "#34C759",
      children: [
        { id: "macos-portfolio", name: "macOS-Portfolio", kind: "folder", date: "Today", icon: "/img/icons/sf-icons/folder.svg", color: "#34C759" },
        { id: "lib-project", name: "lib", kind: "folder", date: "Jun 3", icon: "/img/icons/sf-icons/folder.svg", color: "#34C759" },
      ],
    },
  ],
};

const SIDEBAR_SECTIONS = [
  {
    title: "",
    items: [
      { id: "recents", label: "Recents", icon: "/img/icons/sf-icons/clock.svg" },
      { id: "shared", label: "Shared", icon: "/img/icons/sf-icons/shared.svg" },
    ],
  },
  {
    title: "Favorites",
    items: [
      { id: "home", label: "Applications", icon: "/img/icons/sf-icons/applications.svg" },
      { id: "desktop", label: "Desktop", icon: "/img/icons/sf-icons/desktop.svg", parent: "home" },
      { id: "documents", label: "Documents", icon: "/img/icons/sf-icons/doc.svg", parent: "home" },
      { id: "downloads", label: "Downloads", icon: "/img/icons/sf-icons/download.svg", parent: "home" },
      { id: "pictures", label: "Screenshots", icon: "/img/icons/sf-icons/image.svg", parent: "home" },
      { id: "resume", label: "Resume", icon: "/img/icons/sf-icons/doc.svg", parent: "home" },
      { id: "projects", label: "Projects", icon: "/img/icons/sf-icons/folder.svg", parent: "home" },
    ],
  },
  {
    title: "iCloud",
    items: [
      { id: "icloud-drive", label: "iCloud Drive", icon: "/img/icons/sf-icons/cloud.svg" },
    ],
  },
  {
    title: "Locations",
    items: [
      { id: "macintosh-hd", label: "Macintosh HD", icon: "/img/icons/sf-icons/hard-drive.svg" },
      { id: "airdrop", label: "AirDrop", icon: "/img/icons/sf-icons/airdrop.svg" },
      { id: "network", label: "Network", icon: "/img/icons/sf-icons/network.svg" },
      { id: "trash", label: "Trash", icon: "/img/icons/sf-icons/trash.svg" },
    ],
  },
  {
    title: "Tags",
    items: [
      { id: "tag-red", label: "Red", tagColor: "#FF3B30" },
      { id: "tag-orange", label: "Orange", tagColor: "#FF9500" },
      { id: "tag-blue", label: "Blue", tagColor: "#007AFF" },
      { id: "tag-green", label: "Green", tagColor: "#34C759" },
    ],
  },
];

// ─── File Icon Component ──────────────────────────────────────────────────────
const FileIcon = ({ item, size = 56 }: { item: FileItem; size?: number }) => {
  // Live repo / resume files get crisp type icons (md, code, JSON, image, PDF).
  if (item.kind === "file" && (item.repo || item.pdfUrl)) {
    return <FileTypeIcon node={{ name: item.name, kind: "file", ext: item.ext }} size={size} />;
  }
  if (item.kind === "folder") {
    let customImg = "/img/icons/folder-generic.png";
    if (item.id === "repos" || item.id === "projects-folder" || isRepoId(item.id)) {
      customImg = "/img/icons/folder-dock.png";
    } else if (item.id === "home") {
      customImg = "/img/icons/folder-home.png";
    }

    return (
      <img
        src={customImg}
        alt={item.name}
        style={{ width: size, height: size, display: "inline-block", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))", objectFit: "contain" }}
      />
    );
  }

  let customImg = "/img/icons/codefile.png";
  if (["mp3", "wav", "m4a", "flac", "audio"].includes(item.ext || "")) {
    customImg = "/img/icons/audio_Tahoe.png";
  } else if (["mp4", "mov", "avi", "mkv", "video"].includes(item.ext || "")) {
    customImg = "/img/icons/icnsFile_f693c769fe5bb58a3d33adfcd9901ecb_m4a_Tahoe.png";
  }

  return (
    <img
      src={customImg}
      alt={item.name}
      style={{ width: size, height: size, display: "inline-block", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))", objectFit: "contain" }}
    />
  );
};

// ─── Main Finder Component ───────────────────────────────────────────────────
export default function Finder() {
  const [location, setLocation] = useState<string>("home");
  const [pathStack, setPathStack] = useState<string[]>(["home"]);
  const [viewMode, setViewMode] = useState<ViewMode>("icons");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [quickLook, setQuickLook] = useState<QuickLookTarget | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileItem | null } | null>(null);
  const [resumeState, setResumeState] = useState<"checking" | "ok" | "missing">("checking");

  const { byRepo, ordered: projectsOrdered } = useProjectsData();

  const size = useWindowSize();
  const isMobile = size.winWidth < 768;
  const [mobileView, setMobileView] = useState<"sidebar" | "content">("content");

  // Resume PDF existence check (friendly state instead of a blank window).
  useEffect(() => {
    let live = true;
    fetch(profile.resume.file, { method: "HEAD" })
      .then((r) => {
        if (r.ok) {
          if (live) setResumeState("ok");
        } else {
          fetch(profile.resume.file)
            .then((g) => live && setResumeState(g.ok ? "ok" : "missing"))
            .catch(() => live && setResumeState("missing"));
        }
      })
      .catch(() => live && setResumeState("missing"));
    return () => {
      live = false;
    };
  }, []);

  // Deep-link into Finder (desktop folder icons): open at the requested path.
  useEffect(() => {
    const apply = (stack: string[]) => {
      setPathStack(stack);
      setLocation(stack[stack.length - 1]);
      setSelected(null);
      setQuickLook(null);
      setMobileView("content");
    };
    const pending = consumePendingFinderPath();
    if (pending) apply(pending);
    const onNav = () => {
      const p = consumePendingFinderPath();
      if (p) apply(p);
    };
    window.addEventListener("finder:navigate", onNav);
    return () => window.removeEventListener("finder:navigate", onNav);
  }, []);

  const resumeFolderItem: FileItem = {
    id: RESUME_ID, name: "Resume", kind: "folder", date: "Today",
    icon: "/img/icons/sf-icons/folder.svg", color: "#4A90E2",
  };
  const projectsFolderItem: FileItem = {
    id: PROJECTS_ID, name: "Projects", kind: "folder", date: "Today",
    icon: "/img/icons/sf-icons/folder.svg", color: "#0A84FF",
  };

  const resumeChildren = (): FileItem[] =>
    resumeState === "ok"
      ? [{
          id: "resume-file", name: profile.resume.displayName, kind: "file", ext: "pdf",
          date: "Today", icon: "/img/icons/sf-icons/doc.svg", pdfUrl: profile.resume.file,
        }]
      : [];

  const toFileItem = (
    repo: string, branch: string, title: string, relPath: string, node: FSNode, readme: string | null
  ): FileItem => {
    const id = node.kind === "folder" ? repoFolderId(repo, relPath) : `file:${repoFolderId(repo)}/${relPath}`;
    return {
      id,
      name: node.name,
      kind: node.kind,
      ext: node.ext,
      size: node.size !== undefined ? formatBytes(node.size) : undefined,
      date: "—",
      icon: "/img/icons/sf-icons/doc.svg",
      repo: { repo, branch, path: relPath, title },
      ...(node.kind === "file" && node.ext === "md" && node.name === "README.md" && readme
        ? { virtualReadme: readme }
        : {}),
      ...(node.size !== undefined ? { sizeBytes: node.size } : {}),
    };
  };

  /** Raw children of a repo folder ("" = repo root, README first). */
  const repoItems = (repo: string, rel: string): FileItem[] => {
    const d = byRepo[repo];
    if (!d || d.nodes.length === 0) return [];
    const list = rel === "" ? d.nodes : (findNode(d.nodes, rel.split("/"))?.children ?? []);
    const items: FileItem[] = [];
    if (rel === "" && d.readme) {
      items.push({
        id: `file:${repoFolderId(repo)}/README.md`, name: "README.md", kind: "file", ext: "md",
        date: shortDate(d.meta.updatedAt), icon: "/img/icons/sf-icons/doc.svg",
        repo: { repo, branch: d.meta.branch, path: "README.md", title: d.entry.title },
        virtualReadme: d.readme,
      });
    }
    for (const n of list) {
      if (rel === "" && n.name.toLowerCase() === "readme.md" && d.readme) continue;
      const rp = rel ? `${rel}/${n.name}` : n.name;
      items.push(toFileItem(repo, d.meta.branch, d.entry.title, rp, n, d.readme));
    }
    return items;
  };

  const repoStatus = (repo: string): { loading: boolean; error: string | null } => {
    const d = byRepo[repo];
    if (!d) return { loading: false, error: `Unknown project "${repo}".` };
    if (d.nodes.length === 0) {
      return {
        loading: d.refreshing,
        error: d.refreshing
          ? null
          : (d.error ?? "Couldn't load this folder. Check your connection, or open it on GitHub."),
      };
    }
    return { loading: false, error: null };
  };

  const projectRootItems = (): FileItem[] =>
    projectsOrdered.map((d) => ({
      id: repoFolderId(d.entry.repo),
      name: d.entry.title,
      kind: "folder",
      date: shortDate(d.meta.updatedAt),
      icon: "/img/icons/sf-icons/folder.svg",
      color: d.configured ? "#0A84FF" : undefined,
      repo: { repo: d.entry.repo, branch: d.meta.branch, path: "", title: d.entry.title },
    }));

  // Get current items
  const currentItems = (): FileItem[] => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const mock = Object.values(FILESYSTEM)
        .flat()
        .flatMap((f) => [f, ...(f.children ?? [])])
        .filter((f) => f.name.toLowerCase().includes(q));
      const live: FileItem[] = [...resumeChildren(), ...projectRootItems()].filter((f) =>
        f.name.toLowerCase().includes(q)
      );
      return [...mock, ...live];
    }

    if (location === "home") return [...FILESYSTEM.home, resumeFolderItem, projectsFolderItem];
    if (location === RESUME_ID) return resumeChildren();
    if (location === PROJECTS_ID) return projectRootItems();
    const parsed = parseRepoId(location);
    if (parsed) return repoItems(parsed.repo, parsed.rel);

    const rootItem = FILESYSTEM.home.find((f) => f.id === location);
    if (rootItem?.children) return rootItem.children;
    // nested
    for (const root of FILESYSTEM.home) {
      const nested = root.children?.find((c) => c.id === location);
      if (nested?.children) return nested.children;
    }
    return [];
  };

  const sorted = [...currentItems()].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
    if (sortKey === "name") return a.name.localeCompare(b.name);
    if (sortKey === "date") return a.date.localeCompare(b.date);
    if (sortKey === "kind") return (a.ext ?? "folder").localeCompare(b.ext ?? "folder");
    return 0;
  });

  const labelFor = (seg: string): string => {
    if (seg === "home") return "Aditya";
    if (seg === RESUME_ID) return "Resume";
    if (seg === PROJECTS_ID) return "Projects";
    const parsed = parseRepoId(seg);
    if (parsed) {
      const d = byRepo[parsed.repo];
      const base = d ? d.entry.title : parsed.repo;
      return parsed.rel ? (parsed.rel.split("/").pop() ?? base) : base;
    }
    const root = FILESYSTEM.home.find((f) => f.id === seg);
    if (root) return root.name;
    for (const r of FILESYSTEM.home) {
      const nested = r.children?.find((c) => c.id === seg);
      if (nested) return nested.name;
    }
    return seg;
  };

  const toFSNode = (item: FileItem, childNames?: string[]): FSNode => ({
    name: item.name,
    kind: item.kind,
    ext: item.ext,
    children:
      item.kind === "folder"
        ? (childNames ?? []).map((n) => ({ name: n, kind: "file" as const }))
        : undefined,
  });

  const githubUrlFor = (item: FileItem): string | undefined => {
    if (!item.repo) return undefined;
    const d = byRepo[item.repo.repo];
    if (!d) return undefined;
    return githubContentUrl(d.meta.htmlUrl, d.meta.branch, item.repo.path, item.kind);
  };

  const openQuickLook = (item: FileItem) => {
    if (item.pdfUrl) {
      setQuickLook({
        node: toFSNode(item),
        subtitle: "Resume",
        pdfUrl: item.pdfUrl,
        downloadUrl: item.pdfUrl,
      });
      return;
    }
    if (!item.repo) return;
    const d = byRepo[item.repo.repo];
    if (!d) return;
    const githubUrl = githubUrlFor(item);
    const liveDemoUrl = d.meta.homepage ?? undefined;
    if (item.virtualReadme !== undefined) {
      setQuickLook({
        node: toFSNode(item),
        subtitle: `${item.repo.title}/README.md`,
        inlineMarkdown: item.virtualReadme,
        githubUrl: d.meta.htmlUrl,
        liveDemoUrl,
      });
      return;
    }
    if (item.kind === "folder") {
      const kids = repoItems(item.repo.repo, item.repo.path).map((c) => c.name);
      setQuickLook({
        node: toFSNode(item, kids),
        subtitle: item.repo.path ? `${item.repo.title}/${item.repo.path}` : item.repo.title,
        githubUrl,
        liveDemoUrl,
      });
      return;
    }
    setQuickLook({
      node: toFSNode(item),
      subtitle: `${item.repo.title}/${item.repo.path}`,
      fileTarget: {
        user: profile.githubUser,
        repo: item.repo.repo,
        branch: item.repo.branch,
        path: item.repo.path,
        name: item.name,
        size: item.sizeBytes,
      },
      githubUrl,
      liveDemoUrl,
    });
  };

  const navigate = (item: FileItem) => {
    if (item.kind === "folder") {
      setPathStack((p) => [...p, item.id]);
      setLocation(item.id);
      setSelected(null);
    } else {
      openQuickLook(item);
    }
  };

  const goBack = () => {
    if (pathStack.length <= 1) return;
    const newStack = pathStack.slice(0, -1);
    setPathStack(newStack);
    setLocation(newStack[newStack.length - 1]);
    setSelected(null);
  };

  const goForward = () => { };

  const locationLabel = () => labelFor(location);

  // ── Sidebar click handler ─────────────────────────────────────────────────
  const sidebarClick = (id: string, parent?: string) => {
    if (id === "google-drive" || id === "icloud-drive" || id === "macintosh-hd") {
      setLocation("home");
      setPathStack(["home"]);
      setMobileView("content");
      return;
    }
    if (parent === "home") {
      setPathStack(["home", id]);
      setLocation(id);
    } else {
      setPathStack(["home"]);
      setLocation("home");
    }
    setSelected(null);
    setMobileView("content");
  };

  // ── Toolbar contextual actions (resume + repo links) ──────────────────────
  /** Repo scope of the current location, if any. */
  const currentRepo: ProjectData | null = (() => {
    if (location === PROJECTS_ID) return null;
    const parsed = parseRepoId(location);
    if (parsed) return byRepo[parsed.repo] ?? null;
    return null;
  })();

  const selectedItem: FileItem | null = selected
    ? (sorted.find((i) => i.id === selected) ?? null)
    : null;

  const actionBtn: React.CSSProperties = {
    fontSize: "12px",
    background: "var(--c-bg-tertiary)",
    borderRadius: "6px",
    padding: "4px 10px",
    color: "var(--c-text)",
    textDecoration: "none",
    whiteSpace: "nowrap",
    fontWeight: 500,
  };
  const actionPrimary: React.CSSProperties = { ...actionBtn, background: "#0A84FF", color: "#fff" };

  const selectedUrl = selectedItem ? githubUrlFor(selectedItem) : undefined;
  const folderUrl = (() => {
    if (location === PROJECTS_ID) return undefined;
    const parsed = parseRepoId(location);
    if (!parsed) return undefined;
    const d = byRepo[parsed.repo];
    if (!d) return undefined;
    return githubContentUrl(d.meta.htmlUrl, d.meta.branch, parsed.rel, "folder");
  })();
  const toolbarGitHubUrl = selectedUrl ?? folderUrl;
  const toolbarDemoRepo =
    (selectedItem?.repo ? byRepo[selectedItem.repo.repo] : undefined) ?? currentRepo;
  const toolbarDemoUrl = toolbarDemoRepo?.meta.homepage ?? undefined;

  // Repo loading / error status for the current location.
  const repoStatusHere = (() => {
    const parsed = parseRepoId(location);
    if (!parsed) return { loading: false, error: null as string | null };
    return repoStatus(parsed.repo);
  })();

  // ── Render items ──────────────────────────────────────────────────────────

  // Helpers shared by Columns (miller) view
  const getChildrenOf = (id: string): FileItem[] => {
    if (id === "home") return [...FILESYSTEM.home, resumeFolderItem, projectsFolderItem];
    if (id === RESUME_ID) return resumeChildren();
    if (id === PROJECTS_ID) return projectRootItems();
    const parsed = parseRepoId(id);
    if (parsed) return repoItems(parsed.repo, parsed.rel);
    const root = FILESYSTEM.home.find((f) => f.id === id);
    if (root?.children) return root.children;
    for (const r of FILESYSTEM.home) {
      const nested = r.children?.find((c) => c.id === id);
      if (nested?.children) return nested.children;
    }
    return [];
  };

  const copyLink = async (url: string | undefined) => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard unavailable — no-op
    }
    setContextMenu(null);
  };

  const menuItemsFor = (item: FileItem | null) => {
    const url = item ? githubUrlFor(item) : undefined;
    const items: { label: string; hint?: string; onClick?: () => void }[] = [];
    if (item) {
      items.push({ label: "Open", onClick: () => navigate(item) });
      items.push({ label: "Quick Look", hint: "Space", onClick: () => openQuickLook(item) });
    }
    if (url) {
      items.push({
        label: "Open on GitHub",
        onClick: () => window.open(url, "_blank", "noopener,noreferrer"),
      });
      items.push({ label: "Copy link", onClick: () => copyLink(url) });
    } else if (item?.pdfUrl) {
      items.push({
        label: "Copy link",
        onClick: () => copyLink(`${window.location.origin}${item.pdfUrl}`),
      });
    }
    return items;
  };

  const openContextMenu = (item: FileItem, x: number, y: number) => {
    setSelected(item.id);
    setContextMenu({ x, y, item });
  };

  const onContentKeyDown = (e: React.KeyboardEvent) => {
    const el = e.target as HTMLElement;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (sorted.length === 0) return;
      const idx = sorted.findIndex((i) => i.id === (selected ?? sorted[0].id));
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const next = sorted[(idx + dir + sorted.length) % sorted.length];
      setSelected(next.id);
    } else if (e.key === "Enter") {
      const item = sorted.find((i) => i.id === selected);
      if (item) {
        e.preventDefault();
        navigate(item);
      }
    } else if (e.key === " ") {
      const item = sorted.find((i) => i.id === selected);
      if (item && (item.repo || item.pdfUrl)) {
        e.preventDefault();
        openQuickLook(item);
      }
    }
  };

  const sortItems = (items: FileItem[]) =>
    [...items].sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  const renderColumns = () => (
    <div style={{ display: "flex", height: "100%", minHeight: "100%" }}>
      {pathStack.map((segId, colIdx) => {
        const items = sortItems(getChildrenOf(segId));
        const activeChild = pathStack[colIdx + 1]; // highlighted = the path we descended into
        return (
          <div
            key={segId + colIdx}
            style={{
              width: "200px",
              flexShrink: 0,
              borderRight: "0.5px solid var(--c-border)",
              overflowY: "auto",
              padding: "6px 6px",
            }}
          >
            {items.length === 0 && (
              <div style={{ fontSize: "11px", color: "var(--c-text-tertiary)", padding: "8px" }}>
                Empty
              </div>
            )}
            {items.map((item) => {
              const isActive = item.id === activeChild;
              const isSelected = colIdx === pathStack.length - 1 && item.id === selected;
              const highlight = isActive || isSelected;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.kind === "folder") {
                      setPathStack([...pathStack.slice(0, colIdx + 1), item.id]);
                      setLocation(item.id);
                      setSelected(null);
                    } else {
                      setPathStack(pathStack.slice(0, colIdx + 1));
                      setLocation(segId);
                      setSelected(item.id);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openContextMenu(item, e.clientX, e.clientY);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    cursor: "default",
                    userSelect: "none",
                    background: highlight ? "rgba(0,122,255,0.9)" : "transparent",
                    color: highlight ? "#fff" : "var(--c-text)",
                    transition: "background 0.1s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (!highlight)
                      (e.currentTarget as HTMLElement).style.background = "rgba(120,120,128,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    if (!highlight)
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <FileIcon item={item} size={16} />
                  <span
                    style={{
                      fontSize: "12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {item.name}
                  </span>
                  {item.kind === "folder" && (
                    <div
                      style={{
                        width: "11px",
                        height: "11px",
                        backgroundColor: highlight ? "rgba(255,255,255,0.9)" : "var(--c-text-tertiary)",
                        WebkitMask: `url(/img/icons/sf-icons/caret-right.svg) center/contain no-repeat`,
                        mask: `url(/img/icons/sf-icons/caret-right.svg) center/contain no-repeat`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  const renderIcons = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))",
        gap: "8px",
        padding: "20px",
      }}
    >
      {sorted.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.025, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          onClick={() => setSelected(item.id)}
          onDoubleClick={() => navigate(item)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openContextMenu(item, e.clientX, e.clientY);
          }}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "8px 4px",
            borderRadius: "10px",
            cursor: "default",
            background:
              selected === item.id ? "rgba(0,122,255,0.2)" : "transparent",
            border:
              selected === item.id
                ? "1.5px solid rgba(0,122,255,0.4)"
                : "1.5px solid transparent",
            transition: "background 0.15s ease, border 0.15s ease",
            userSelect: "none",
          }}
          onMouseEnter={(e) => {
            if (selected !== item.id)
              (e.currentTarget as HTMLElement).style.background =
                "rgba(120,120,128,0.12)";
          }}
          onMouseLeave={(e) => {
            if (selected !== item.id)
              (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <FileIcon item={item} size={64} />
          <span
            style={{
              marginTop: "6px",
              fontSize: "12px",
              color: "var(--c-text, #1c1c1e)",
              textAlign: "center",
              lineHeight: "1.3",
              maxWidth: "96px",
              minHeight: "31px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {item.name}
          </span>
        </motion.div>
      ))}
    </div>
  );

  const renderList = () => (
    <div style={{ padding: "0" }}>
      {/* List header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 80px 80px 80px",
          padding: "4px 16px",
          borderBottom: "0.5px solid var(--c-border)",
          background: "var(--c-bg-secondary)",
        }}
      >
        {["Name", "Date", "Size", "Kind"].map((h) => (
          <button
            key={h}
            onClick={() => setSortKey(h.toLowerCase() as SortKey)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: sortKey === h.toLowerCase() ? 600 : 400,
              color:
                sortKey === h.toLowerCase() ? "#007AFF" : "var(--c-text-tertiary)",
              textAlign: "left",
              padding: 0,
            }}
          >
            {h} {sortKey === h.toLowerCase() ? "↑" : ""}
          </button>
        ))}
      </div>
      {sorted.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02, duration: 0.2 }}
          onClick={() => setSelected(item.id)}
          onDoubleClick={() => navigate(item)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openContextMenu(item, e.clientX, e.clientY);
          }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 80px 80px 80px",
            padding: "5px 16px",
            cursor: "default",
            background:
              selected === item.id
                ? "rgba(0,122,255,0.15)"
                : i % 2 === 0
                  ? "transparent"
                  : "rgba(0,0,0,0.015)",
            transition: "background 0.1s ease",
            borderRadius: "4px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileIcon item={item} size={18} />
            <span
              style={{
                fontSize: "12px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.name}
            </span>
          </div>
          <span style={{ fontSize: "11px", color: "var(--c-text-tertiary)", alignSelf: "center" }}>
            {item.date}
          </span>
          <span style={{ fontSize: "11px", color: "var(--c-text-tertiary)", alignSelf: "center" }}>
            {item.size ?? "—"}
          </span>
          <span style={{ fontSize: "11px", color: "var(--c-text-tertiary)", alignSelf: "center" }}>
            {item.kind === "folder" ? "Folder" : item.ext?.toUpperCase() ?? "File"}
          </span>
        </motion.div>
      ))}
    </div>
  );

  // ── Toolbar ───────────────────────────────────────────────────────────────
  const toolbarBtn = (label: string, icon: string, active = false, action = () => { }) => (
    <motion.button
      title={label}
      onClick={action}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.1 }}
      style={{
        background: active ? "rgba(0,122,255,0.15)" : "transparent",
        border: active ? "0.5px solid rgba(0,122,255,0.25)" : "0.5px solid transparent",
        borderRadius: "6px",
        cursor: "pointer",
        padding: "4px 7px",
        fontSize: "14px",
        color: active ? "#0A84FF" : "var(--c-text-secondary)",
        transition: "background 0.12s ease, border-color 0.12s ease, color 0.12s ease",
        lineHeight: 1,
      }}
    >
      {icon}
    </motion.button>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",

        background: "var(--c-bg)",
        color: "var(--c-text)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Toolbar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 12px",
          borderBottom: "0.5px solid var(--c-border)",
          background: "var(--c-bg-secondary)",
          backdropFilter: "blur(20px)",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {isMobile && (
          <button
            onClick={() => setMobileView(mobileView === "sidebar" ? "content" : "sidebar")}
            style={{
               background: "none",
               border: "none",
               cursor: "pointer",
               fontSize: "14px",
               fontWeight: 500,
               color: "#007AFF",
               padding: "4px 8px",
            }}
          >
            {mobileView === "sidebar" ? "Done" : "Browse"}
          </button>
        )}
        
        {/* Back / Forward */}
        <button
          onClick={goBack}
          disabled={pathStack.length <= 1}
          style={{
            background: "none",
            border: "none",
            cursor: pathStack.length > 1 ? "pointer" : "default",
            fontSize: "16px",
            opacity: pathStack.length > 1 ? 1 : 0.3,
            padding: "2px 6px",
          }}
        >
          ‹
        </button>
        <button
          onClick={goForward}
          style={{ background: "none", border: "none", fontSize: "16px", opacity: 0.3, padding: "2px 6px" }}
        >
          ›
        </button>

        {/* Location label */}
        <span
          style={{
            flex: 1,
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--c-text)",
            textAlign: "center",
          }}
        >
          {locationLabel()}
        </span>

        {/* Contextual actions */}
        {location === RESUME_ID && resumeState === "ok" && (
          <>
            <a href={profile.resume.file} download={profile.resume.displayName} style={actionBtn}>
              Download
            </a>
            <a href={profile.resume.file} target="_blank" rel="noopener noreferrer" style={actionBtn}>
              New Tab
            </a>
          </>
        )}
        {toolbarGitHubUrl && (
          <a href={toolbarGitHubUrl} target="_blank" rel="noopener noreferrer" style={actionPrimary}>
            GitHub
          </a>
        )}
        {toolbarDemoUrl && (
          <a href={toolbarDemoUrl} target="_blank" rel="noopener noreferrer" style={actionBtn}>
            Live Demo
          </a>
        )}

        {/* View mode */}
        <div style={{ display: "flex", gap: "2px", background: "var(--c-bg-tertiary)", borderRadius: "8px", padding: "2px" }}>
          {toolbarBtn("Icons", "⊞", viewMode === "icons", () => setViewMode("icons"))}
          {toolbarBtn("List", "≡", viewMode === "list", () => setViewMode("list"))}
          {toolbarBtn("Columns", "⊟", viewMode === "columns", () => setViewMode("columns"))}
        </div>

        {/* Sort */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          style={{
            fontSize: "11px",
            background: "var(--c-bg-tertiary)",
            border: "none",
            borderRadius: "5px",
            padding: "3px 6px",
            cursor: "pointer",
            outline: "none",
            color: "var(--c-text)",
          }}
        >
          <option value="name">Name</option>
          <option value="date">Date</option>
          <option value="size">Size</option>
          <option value="kind">Kind</option>
        </select>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--c-bg-tertiary)",
            borderRadius: "6px",
            padding: "2px 8px",
            gap: "4px",
          }}
        >
          <div style={{ width: "11px", height: "11px", opacity: 0.5, backgroundColor: "currentColor", WebkitMask: "url(/img/icons/sf-icons/magnifying-glass.svg) center/contain no-repeat", mask: "url(/img/icons/sf-icons/magnifying-glass.svg) center/contain no-repeat" }} />
          <input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "none",
              border: "none",
              outline: "none",
              fontSize: "12px",
              width: "130px",
              color: "var(--c-text)",
            }}
          />
        </div>
      </div>

      {/* ── Tab strip (breadcrumb tabs) ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2px",
          padding: "3px 12px",
          borderBottom: "0.5px solid var(--c-border)",
          background: "var(--c-bg-secondary)",
          overflowX: "auto",
        }}
      >
        {pathStack.map((seg, i) => {
          const label = labelFor(seg);
          const isActive = i === pathStack.length - 1;
          return (
            <button
              key={seg}
              onClick={() => {
                const newStack = pathStack.slice(0, i + 1);
                setPathStack(newStack);
                setLocation(newStack[newStack.length - 1]);
              }}
              style={{
                background: isActive ? "rgba(0,0,0,0.09)" : "transparent",
                border: "none",
                borderRadius: "6px",
                padding: "2px 10px",
                fontSize: "12px",
                fontWeight: isActive ? 600 : 400,
                color: "var(--c-text)",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Repo info bar (repo root only) ── */}
      {(() => {
        const parsed = parseRepoId(location);
        const d = parsed && parsed.rel === "" ? byRepo[parsed.repo] : null;
        if (!d) return null;
        return (
          <div
            style={{
              padding: "8px 16px",
              borderBottom: "0.5px solid var(--c-border)",
              background: "var(--c-bg-secondary)",
              flexShrink: 0,
            }}
          >
            {d.meta.description && (
              <div style={{ fontSize: "12.5px", lineHeight: 1.5, marginBottom: 6 }}>{d.meta.description}</div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: "11.5px", color: "var(--c-text-secondary)" }}>
              {d.meta.language && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <span aria-hidden style={{ width: 9, height: 9, borderRadius: "50%", background: languageColor(d.meta.language) }} />
                  {d.meta.language}
                </span>
              )}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                <span className="i-ph:star" style={{ width: 12, height: 12 }} aria-hidden />
                {d.meta.stars}
              </span>
              {d.meta.updatedAt && <span>Updated {timeAgo(d.meta.updatedAt)}</span>}
              {d.refreshing && <span>Refreshing…</span>}
            </div>
          </div>
        );
      })()}

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        {(!isMobile || mobileView === "sidebar") && (
          <div
            style={{
              width: isMobile ? "100%" : "180px",
              flexShrink: 0,
              borderRight: isMobile ? "none" : "var(--lg-border)",
              background: "var(--lg-bg-tinted)",
              backdropFilter: "var(--lg-blur-light)",
              WebkitBackdropFilter: "var(--lg-blur-light)",
              overflowY: "auto",
              padding: "8px 0",
            }}
          >
          {SIDEBAR_SECTIONS.map((section) => (
            <div key={section.title} style={{ marginBottom: "4px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "var(--c-text-tertiary)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  padding: "8px 12px 2px",
                }}
              >
                {section.title}
              </div>
              {section.items.map((item: any) => {
                const active = location === item.id || (item.id === "home" && location === "home");
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => sidebarClick(item.id, item.parent)}
                    whileHover={{ x: 1 }}
                    transition={{ duration: 0.1 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "5px 12px",
                      background: active ? "var(--c-bg-tertiary)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      borderRadius: "6px",
                      margin: "0 4px",
                      width: "calc(100% - 8px)",
                      transition: "background 0.12s ease",
                      position: "relative",
                    }}
                  >
                    {item.tagColor ? (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.tagColor, flexShrink: 0 }} />
                    ) : (
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          flexShrink: 0,
                          backgroundColor: "var(--accent-blue)",
                          WebkitMask: `url(${item.icon}) center/contain no-repeat`,
                          mask: `url(${item.icon}) center/contain no-repeat`,
                        }}
                      />
                    )}
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--c-text)",
                        fontWeight: active ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
        )}

        {/* Content */}
        {(!isMobile || mobileView === "content") && (
        <div
          style={{ flex: 1, overflowY: "auto", overflowX: viewMode === "columns" && !search.trim() ? "auto" : "hidden" }}
          tabIndex={0}
          role="region"
          aria-label={`${locationLabel()} contents`}
          onKeyDown={onContentKeyDown}
          onFocus={(e) => {
            if (e.target === e.currentTarget)
              (e.currentTarget as HTMLElement).style.outline = "2px solid var(--accent-blue)";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLElement).style.outline = "none";
          }}
        >
          {repoStatusHere.loading ? (
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }} aria-label="Loading folder">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  aria-hidden
                  animate={{ opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ display: "flex", gap: 12, alignItems: "center" }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--c-bg-tertiary)" }} />
                  <div style={{ flex: 1, height: 14, borderRadius: 6, background: "var(--c-bg-tertiary)" }} />
                </motion.div>
              ))}
            </div>
          ) : repoStatusHere.error ? (
            <div
              role="alert"
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 32, textAlign: "center" }}
            >
              <span className="i-ph:warning-circle" style={{ width: 40, height: 40, color: "var(--c-text-tertiary)" }} aria-hidden />
              <div style={{ fontSize: 14, fontWeight: 600 }}>Couldn&apos;t load this folder</div>
              <div style={{ fontSize: 12.5, color: "var(--c-text-secondary)", maxWidth: 380 }}>{repoStatusHere.error}</div>
              {(() => {
                const parsed = parseRepoId(location);
                const d = parsed ? byRepo[parsed.repo] : null;
                const url = d?.meta.htmlUrl ?? (parsed ? `https://github.com/${profile.githubUser}/${parsed.repo}` : undefined);
                return url ? (
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ ...actionPrimary, textDecoration: "none" }}>
                    Open on GitHub
                  </a>
                ) : null;
              })()}
            </div>
          ) : location === RESUME_ID && resumeState === "missing" ? (
            <div
              role="alert"
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 32, textAlign: "center" }}
            >
              <span className="i-ph:file-x" style={{ width: 44, height: 44, color: "var(--c-text-tertiary)" }} aria-hidden />
              <div style={{ fontSize: 14, fontWeight: 600 }}>Resume not found</div>
              <div style={{ fontSize: 12.5, color: "var(--c-text-secondary)", maxWidth: 400, lineHeight: 1.6 }}>
                Place your PDF at <code style={{ fontFamily: "var(--font-mono)" }}>public/resume/Aditya_Salunkhe_Resume.pdf</code> and
                reload — it will appear here automatically.
              </div>
            </div>
          ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={location + viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={viewMode === "columns" && !search.trim() ? { height: "100%" } : undefined}
            >
              {search.trim()
                ? renderIcons()
                : viewMode === "columns"
                  ? renderColumns()
                  : viewMode === "list"
                    ? renderList()
                    : renderIcons()}
            </motion.div>
          </AnimatePresence>
          )}
        </div>
        )}
      </div>

      {/* ── Path bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 12px",
          borderTop: "0.5px solid var(--c-border)",
          background: "var(--c-bg-secondary)",
          fontSize: "11px",
          color: "var(--c-text-tertiary)",
        }}
      >
        {pathStack.map((seg, i) => {
          const label = labelFor(seg);
          return (
            <React.Fragment key={seg}>
              {i > 0 && <span>›</span>}
              <button
                onClick={() => {
                  const newStack = pathStack.slice(0, i + 1);
                  setPathStack(newStack);
                  setLocation(newStack[newStack.length - 1]);
                }}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "11px",
                  color: i === pathStack.length - 1 ? "var(--c-text)" : "#007AFF",
                  fontWeight: i === pathStack.length - 1 ? 500 : 400,
                  padding: "0 2px",
                }}
              >
                {label}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Item context menu */}
      {contextMenu && (
        <FinderContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={menuItemsFor(contextMenu.item)}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Quick Look preview */}
      <AnimatePresence>
        {quickLook && <QuickLook target={quickLook} onClose={() => setQuickLook(null)} />}
      </AnimatePresence>
    </div>
  );
}
