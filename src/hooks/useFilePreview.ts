import { MAX_PREVIEW_BYTES } from "~/components/apps/finder/finderTypes";

export interface FilePreviewTarget {
  user: string;
  repo: string;
  branch: string;
  /** Repo-relative path, e.g. "src/index.ts". */
  path: string;
  name: string;
  size?: number;
}

export type FilePreview =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "image"; url: string }
  | { status: "markdown"; text: string }
  | { status: "code"; text: string; language: string }
  | { status: "text"; text: string }
  | { status: "binary" }
  | { status: "too-large"; size?: number };

const IMAGE_EXTS = new Set(["png", "jpg", "jpeg", "gif", "webp", "ico"]);
const MARKDOWN_EXTS = new Set(["md", "markdown"]);
const BINARY_EXTS = new Set([
  "zip", "gz", "tgz", "tar", "rar", "7z", "exe", "dmg", "pkg",
  "icns", "ttf", "otf", "woff", "woff2", "eot", "mp3", "wav",
  "mp4", "mov", "m4a", "aac", "flac", "avi", "mkv", "sqlite", "db",
  "o", "a", "so", "dylib", "class", "pyc", "pdf",
]);

/** Prism language names supported for highlighting; anything else → plain text. */
const PRISM_LANGS: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  py: "python",
  rb: "ruby",
  php: "php",
  java: "java",
  c: "c",
  h: "c",
  cpp: "cpp",
  hpp: "cpp",
  cs: "csharp",
  go: "go",
  rs: "rust",
  kt: "kotlin",
  swift: "swift",
  css: "css",
  scss: "scss",
  less: "less",
  html: "markup",
  xml: "markup",
  svg: "markup",
  json: "json",
  yml: "yaml",
  yaml: "yaml",
  toml: "toml",
  ini: "ini",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  dockerfile: "docker",
  gitignore: "ignore",
  env: "ignore",
};

function extOf(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
}

export function rawFileUrl(user: string, repo: string, branch: string, path: string): string {
  const encoded = path
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");
  return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${encoded}`;
}

/**
 * Lazily fetch a repo file for preview. Images resolve instantly to a URL;
 * text/code/markdown are fetched on demand; binaries and oversized files
 * short-circuit without any network call.
 */
export function useFilePreview(target: FilePreviewTarget | null): FilePreview {
  const [preview, setPreview] = useState<FilePreview>({ status: "idle" });

  useEffect(() => {
    if (!target) {
      setPreview({ status: "idle" });
      return;
    }
    const ext = extOf(target.name);
    if (typeof target.size === "number" && target.size > MAX_PREVIEW_BYTES) {
      setPreview({ status: "too-large", size: target.size });
      return;
    }
    if (IMAGE_EXTS.has(ext)) {
      setPreview({
        status: "image",
        url: rawFileUrl(target.user, target.repo, target.branch, target.path),
      });
      return;
    }
    if (BINARY_EXTS.has(ext)) {
      setPreview({ status: "binary" });
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setPreview({ status: "loading" });
    fetch(rawFileUrl(target.user, target.repo, target.branch, target.path), {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        // Guard against huge responses the snapshot didn't know about.
        const text = await res.text();
        if (text.length > MAX_PREVIEW_BYTES * 2) {
          if (!cancelled) setPreview({ status: "too-large" });
          return;
        }
        if (cancelled) return;
        if (text.includes("\0")) {
          setPreview({ status: "binary" });
        } else if (MARKDOWN_EXTS.has(ext)) {
          setPreview({ status: "markdown", text });
        } else {
          const language = PRISM_LANGS[ext];
          setPreview(
            language
              ? { status: "code", text, language }
              : { status: "text", text }
          );
        }
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        if (e instanceof DOMException && e.name === "AbortError") return;
        setPreview({ status: "error", message: "Couldn't load this preview." });
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [
    target?.user,
    target?.repo,
    target?.branch,
    target?.path,
    target?.name,
    target?.size,
  ]);

  return preview;
}
