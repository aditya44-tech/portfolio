import { useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useStore } from "~/stores";
import { useFilePreview, type FilePreviewTarget } from "~/hooks/useFilePreview";
import { formatBytes, type FSNode } from "./finderTypes";
import { FileTypeIcon } from "./FileTypeIcon";

export interface QuickLookTarget {
  node: FSNode;
  /** Secondary line, e.g. repo-relative path. */
  subtitle?: string;
  /** Local PDF to embed (resume). */
  pdfUrl?: string;
  /** Preloaded markdown (snapshot README) — no fetch needed. */
  inlineMarkdown?: string;
  /** Lazy remote file preview (repo files). */
  fileTarget?: FilePreviewTarget | null;
  downloadUrl?: string;
  githubUrl?: string;
  liveDemoUrl?: string;
}

function ExternalButton({ href, label, primary }: { href: string; label: string; primary?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 12px",
        borderRadius: 7,
        fontSize: 12.5,
        fontWeight: 500,
        fontFamily: "var(--font-system)",
        textDecoration: "none",
        background: primary ? "#0A84FF" : "var(--c-bg-tertiary)",
        color: primary ? "#fff" : "var(--c-text)",
        border: "0.5px solid rgba(128,128,128,0.3)",
      }}
    >
      {label}
    </a>
  );
}

function SkeletonBlock({ height }: { height: number }) {
  return (
    <motion.div
      aria-hidden
      animate={{ opacity: [0.4, 0.9, 0.4] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      style={{ height, borderRadius: 6, background: "var(--c-bg-tertiary)", marginBottom: 8 }}
    />
  );
}

const markdownStyle: React.CSSProperties = {
  fontSize: 13,
  lineHeight: 1.65,
  overflowWrap: "break-word",
};

function MarkdownBody({ text }: { text: string }) {
  return (
    <div style={{ padding: "16px 20px" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]]}
        components={{
          img: ({ src, alt }) => (
            <img src={src} alt={alt ?? ""} style={{ maxWidth: "100%", borderRadius: 8 }} loading="lazy" />
          ),
          pre: ({ children }) => <div style={{ overflowX: "auto" }}>{children}</div>,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

function RepoFileBody({ target }: { target: FilePreviewTarget }) {
  const dark = useStore((s) => s.dark);
  const preview = useFilePreview(target);

  if (preview.status === "loading" || preview.status === "idle") {
    return (
      <div style={{ padding: 20 }} aria-label="Loading preview">
        <SkeletonBlock height={18} />
        <SkeletonBlock height={14} />
        <SkeletonBlock height={14} />
        <SkeletonBlock height={14} />
      </div>
    );
  }
  if (preview.status === "image") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 16, minHeight: 200 }}>
        <img
          src={preview.url}
          alt={target.name}
          loading="lazy"
          style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8, objectFit: "contain" }}
        />
      </div>
    );
  }
  if (preview.status === "markdown") return <MarkdownBody text={preview.text} />;
  if (preview.status === "code") {
    return (
      <div style={{ overflow: "auto", fontSize: 12 }}>
        <SyntaxHighlighter
          language={preview.language}
          style={(dark ? dracula : prism) as Record<string, React.CSSProperties>}
          showLineNumbers
          customStyle={{ margin: 0, background: "transparent", padding: "14px 0" }}
        >
          {preview.text}
        </SyntaxHighlighter>
      </div>
    );
  }
  if (preview.status === "text") {
    return (
      <pre
        style={{
          margin: 0,
          padding: "16px 20px",
          fontSize: 12,
          lineHeight: 1.6,
          fontFamily: "var(--font-mono)",
          whiteSpace: "pre-wrap",
          overflowWrap: "break-word",
        }}
      >
        {preview.text}
      </pre>
    );
  }
  return (
    <PreviewFallback
      title={preview.status === "too-large" ? "File is too large to preview" : "Preview not available"}
      detail={
        preview.status === "too-large" && preview.size
          ? `${formatBytes(preview.size)} — open it on GitHub instead.`
          : "This file can't be previewed here — open it on GitHub instead."
      }
    />
  );
}

export function PreviewFallback({ title, detail }: { title: string; detail: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: 32,
        textAlign: "center",
      }}
    >
      <span className="i-ph:file-x" style={{ width: 40, height: 40, color: "var(--c-text-tertiary)" }} aria-hidden />
      <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
      <div style={{ fontSize: 12.5, color: "var(--c-text-secondary)", maxWidth: 340 }}>{detail}</div>
    </div>
  );
}

/**
 * Centered floating Quick Look panel with blurred backdrop.
 * Lives inside the Finder window (absolute overlay). Esc/Space or X closes.
 */
export default function QuickLook({ target, onClose }: { target: QuickLookTarget; onClose: () => void }) {
  const { node } = target;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.25)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        padding: 24,
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Quick Look ${node.name}`}
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        style={{
          width: "min(680px, 100%)",
          height: "min(540px, 100%)",
          background: "var(--c-bg)",
          color: "var(--c-text)",
          borderRadius: 12,
          border: "1px solid var(--c-border)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          fontFamily: "var(--font-system)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderBottom: "1px solid var(--c-border)",
            background: "var(--c-bg-secondary)",
            flexShrink: 0,
          }}
        >
          <FileTypeIcon node={node} size={28} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {node.name}
            </div>
            {target.subtitle && (
              <div
                style={{
                  fontSize: 11.5,
                  color: "var(--c-text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {target.subtitle}
              </div>
            )}
          </div>
          {target.liveDemoUrl && (
            <ExternalButton href={target.liveDemoUrl} label="Live Demo" primary />
          )}
          {target.downloadUrl && (
            <a
              href={target.downloadUrl}
              download
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "4px 12px",
                borderRadius: 7,
                fontSize: 12.5,
                fontFamily: "var(--font-system)",
                textDecoration: "none",
                background: "var(--c-bg-tertiary)",
                color: "var(--c-text)",
                border: "0.5px solid rgba(128,128,128,0.3)",
              }}
            >
              Download
            </a>
          )}
          {target.githubUrl && <ExternalButton href={target.githubUrl} label="Open on GitHub" />}
          <button
            autoFocus
            onClick={onClose}
            aria-label="Close Quick Look"
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              background: "var(--c-bg-tertiary)",
              color: "var(--c-text-secondary)",
              fontSize: 15,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", ...markdownStyle }}>
          {target.pdfUrl ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
              <iframe
                title={`${node.name} preview`}
                src={target.pdfUrl}
                style={{ flex: 1, border: "none", minHeight: 300, background: "#fff" }}
              />
              <div style={{ padding: "8px 16px", fontSize: 12, color: "var(--c-text-secondary)", textAlign: "center" }}>
                Can&apos;t see the PDF?{" "}
                <a href={target.pdfUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-blue)" }}>
                  Open it in a new tab
                </a>
              </div>
            </div>
          ) : target.inlineMarkdown !== undefined ? (
            <MarkdownBody text={target.inlineMarkdown} />
          ) : target.fileTarget ? (
            <RepoFileBody target={target.fileTarget} />
          ) : node.kind === "folder" ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
              <FileTypeIcon node={node} size={96} />
              <div style={{ fontSize: 13, color: "var(--c-text-secondary)" }}>
                {node.children ? `${node.children.length} items` : "Folder"}
              </div>
            </div>
          ) : (
            <PreviewFallback title="Preview not available" detail="Open it on GitHub instead." />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
