import { useId } from "react";
import type { FSNode } from "./finderTypes";

/** Crisp inline-SVG file-type icons (folder, markdown, code, JSON, image, PDF, generic). */

function MiniFolder({ size }: { size: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg width={size} height={size * 0.82} viewBox="0 0 64 52" aria-hidden>
      <defs>
        <linearGradient id={`fb${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FB6EE" />
          <stop offset="1" stopColor="#4E8BD8" />
        </linearGradient>
        <linearGradient id={`ff${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C4E0FB" />
          <stop offset="0.5" stopColor="#A9CDF5" />
          <stop offset="1" stopColor="#82B4EC" />
        </linearGradient>
      </defs>
      <path
        d="M6 10 Q6 6 10 6 H24 L28 11 H54 Q58 11 58 15 V42 Q58 46 54 46 H10 Q6 46 6 42 Z"
        fill={`url(#fb${uid})`}
      />
      <path
        d="M2 22 Q2 18 6 18 H58 Q62 18 62 22 V44 Q62 48 58 48 H6 Q2 48 2 44 Z"
        fill={`url(#ff${uid})`}
      />
      <path d="M2 22 Q2 18 6 18 H58 Q62 18 62 22 L61 24 H3 Z" fill="#fff" opacity="0.35" />
    </svg>
  );
}

const BAND_COLORS: Record<string, string> = {
  MD: "#0A84FF",
  JS: "#E8C33A",
  JSX: "#61DAFB",
  TS: "#3178C6",
  TSX: "#3178C6",
  JSON: "#8E8E93",
  PY: "#3572A5",
  CSS: "#B14BDF",
  HTML: "#E34C26",
  PDF: "#E1251B",
  TXT: "#8E8E93",
};

function DocIcon({ size, label }: { size: number; label?: string }) {
  const band = label ? (BAND_COLORS[label] ?? "#8E8E93") : null;
  const lightText = label === "PDF" || label === "TS" || label === "TSX" || label === "PY" || label === "HTML";
  return (
    <svg width={size * 0.78} height={size} viewBox="0 0 40 52" aria-hidden>
      <path
        d="M6 2 H26 L36 12 V46 Q36 50 32 50 H6 Q2 50 2 46 V6 Q2 2 6 2 Z"
        fill="#FFFFFF"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1"
      />
      <path d="M26 2 V10 Q26 12 28 12 H36 Z" fill="rgba(0,0,0,0.08)" />
      {[20, 25, 30].map((y) => (
        <rect key={y} x="8" y={y} width="20" height="2.4" rx="1.2" fill="rgba(0,0,0,0.14)" />
      ))}
      {band && label && (
        <>
          <rect x="2" y="36" width="34" height="12" fill={band} />
          <text
            x="19"
            y="45"
            textAnchor="middle"
            fontSize={label.length > 3 ? 7 : 8.5}
            fontWeight="800"
            fontFamily="var(--font-system)"
            fill={lightText ? "#fff" : label === "JS" ? "#1c1c1e" : "#fff"}
          >
            {label}
          </text>
        </>
      )}
    </svg>
  );
}

function ImageIcon({ size }: { size: number }) {
  return (
    <svg width={size * 0.9} height={size * 0.8} viewBox="0 0 46 38" aria-hidden>
      <rect x="1" y="1" width="44" height="36" rx="5" fill="#fff" stroke="rgba(0,0,0,0.12)" />
      <circle cx="14" cy="12" r="4" fill="#FFCC00" />
      <path d="M4 31 L17 17 L26 26 L31 21 L42 31 V33 H4 Z" fill="#34C759" opacity="0.85" />
      <path d="M4 31 L17 17 L26 26 L31 21 L42 31" fill="none" stroke="#248A3D" strokeWidth="1.4" />
    </svg>
  );
}

/** Map a node to its icon + accessible label. */
export function FileTypeIcon({ node, size = 40 }: { node: FSNode; size?: number }) {
  if (node.kind === "folder") return <MiniFolder size={size} />;
  const ext = (node.ext ?? "").toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp", "ico"].includes(ext)) return <ImageIcon size={size} />;
  // SVG renders as code (it is text) — show a doc badge instead.
  const labelMap: Record<string, string> = {
    md: "MD",
    markdown: "MD",
    js: "JS",
    jsx: "JSX",
    ts: "TS",
    tsx: "TSX",
    json: "JSON",
    py: "PY",
    css: "CSS",
    html: "HTML",
    pdf: "PDF",
    txt: "TXT",
  };
  return <DocIcon size={size} label={labelMap[ext]} />;
}
