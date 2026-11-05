import { useEffect, useId, useRef, useState } from "react";
import { useWindowSize } from "~/hooks";
import { requestFinderPath } from "./apps/finder/finderNav";

export interface DesktopFolderDef {
  id: string;
  label: string;
  /** Finder path opened through the window manager (same UI as Finder). */
  path: string[];
}

const FOLDERS: DesktopFolderDef[] = [
  { id: "resume", label: "Resume", path: ["home", "resume"] },
  { id: "projects", label: "Projects", path: ["home", "projects"] },
];

/** Grid cell size for snap-to-grid (icon slot). */
const CELL_W = 104;
const CELL_H = 112;
const ORIGIN_TOP = 48;
const ORIGIN_RIGHT = 16;

interface Cell {
  col: number;
  row: number;
}

function loadPositions(): Record<string, Cell> {
  const fallback: Record<string, Cell> = {
    resume: { col: 0, row: 0 },
    projects: { col: 0, row: 1 },
  };
  try {
    const raw = localStorage.getItem("macos-desktop-icon-positions");
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Record<string, Cell>;
    for (const f of FOLDERS) {
      const c = parsed[f.id];
      if (!c || typeof c.col !== "number" || typeof c.row !== "number") return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

/** Modern macOS blue folder: gradient back plate + lighter front plate. */
function BlueFolderIcon({ size }: { size: number }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const backId = `deskfolder-back-${uid}`;
  const frontId = `deskfolder-front-${uid}`;
  return (
    <svg
      width={size}
      height={size * 0.82}
      viewBox="0 0 64 52"
      aria-hidden
      style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}
    >
      <defs>
        <linearGradient id={backId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FB6EE" />
          <stop offset="1" stopColor="#4E8BD8" />
        </linearGradient>
        <linearGradient id={frontId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C4E0FB" />
          <stop offset="0.5" stopColor="#A9CDF5" />
          <stop offset="1" stopColor="#82B4EC" />
        </linearGradient>
      </defs>
      <path
        d="M6 10 Q6 6 10 6 H24 L28 11 H54 Q58 11 58 15 V42 Q58 46 54 46 H10 Q6 46 6 42 Z"
        fill={`url(#${backId})`}
      />
      <path
        d="M2 22 Q2 18 6 18 H58 Q62 18 62 22 V44 Q62 48 58 48 H6 Q2 48 2 44 Z"
        fill={`url(#${frontId})`}
      />
      <path
        d="M2 22 Q2 18 6 18 H58 Q62 18 62 22 L61 24 H3 Z"
        fill="#ffffff"
        opacity="0.35"
      />
    </svg>
  );
}

export default function DesktopFolderIcons({ openApp }: { openApp: (id: string) => void }) {
  const { winWidth, isMobile } = useWindowSize();
  const [positions, setPositions] = useState<Record<string, Cell>>(loadPositions);
  const [selected, setSelected] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; col: number; row: number } | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const gesture = useRef<{
    id: string;
    startX: number;
    startY: number;
    moved: boolean;
    downAt: number;
    pointerType: string;
  } | null>(null);

  // Clicking empty desktop deselects (dispatched by Desktop root).
  useEffect(() => {
    const onDeselect = () => setSelected(null);
    window.addEventListener("desktop:deselect-icons", onDeselect);
    return () => window.removeEventListener("desktop:deselect-icons", onDeselect);
  }, []);

  // Touch devices: taps are handled per-icon; hide nothing here —
  // on small screens the mobile app grid takes over instead.
  if (isMobile) return null;

  const persist = (next: Record<string, Cell>) => {
    setPositions(next);
    try {
      localStorage.setItem("macos-desktop-icon-positions", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const cellToXY = (cell: Cell) => ({
    // Anchor the grid to the top-right so it survives resizes.
    right: ORIGIN_RIGHT + cell.col * CELL_W,
    top: ORIGIN_TOP + cell.row * CELL_H,
  });

  const pointToCell = (clientX: number, clientY: number): Cell => {
    const col = Math.max(
      0,
      Math.round((winWidth - ORIGIN_RIGHT - 48 - clientX) / CELL_W)
    );
    const row = Math.max(0, Math.round((clientY - ORIGIN_TOP - 40) / CELL_H));
    return { col, row };
  };

  const commitDrag = (id: string, cell: Cell) => {
    const next = { ...positions };
    // Swap with any icon already in the target cell.
    for (const f of FOLDERS) {
      if (f.id !== id && next[f.id].col === cell.col && next[f.id].row === cell.row) {
        next[f.id] = positions[id];
      }
    }
    next[id] = cell;
    persist(next);
  };

  const openFolder = (folder: DesktopFolderDef) => {
    // Both folders open inside the real Finder app (shared UI).
    openApp("finder");
    requestFinderPath(folder.path);
  };

  const onPointerDown = (e: React.PointerEvent, id: string) => {
    gesture.current = {
      id,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      downAt: Date.now(),
      pointerType: e.pointerType,
    };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent, id: string) => {
    const g = gesture.current;
    if (!g || g.id !== id) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (!g.moved && Math.hypot(dx, dy) > 6) {
      g.moved = true;
      setSelected(id);
    }
    if (g.moved) setDrag({ id, ...pointToCell(e.clientX, e.clientY) });
  };

  const onPointerUp = (e: React.PointerEvent, folder: DesktopFolderDef) => {
    const g = gesture.current;
    gesture.current = null;
    setDrag(null);
    if (!g) return;
    if (g.moved) {
      commitDrag(folder.id, pointToCell(e.clientX, e.clientY));
      return;
    }
    // Tap / click without drag.
    if (g.pointerType === "touch") {
      // Touch devices: single tap opens.
      setSelected(folder.id);
      openFolder(folder);
    } else {
      setSelected(folder.id);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number, folder: DesktopFolderDef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      openFolder(folder);
      return;
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      const dir = e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 1;
      const next = FOLDERS[(index + dir + FOLDERS.length) % FOLDERS.length];
      setSelected(next.id);
      btnRefs.current[next.id]?.focus();
    }
  };

  return (
    <div
      role="listbox"
      aria-label="Desktop folders"
      aria-orientation="vertical"
      style={{ position: "fixed", inset: 0, zIndex: 55, pointerEvents: "none" }}
    >
      {FOLDERS.map((folder, index) => {
        const cell = drag?.id === folder.id ? { col: drag.col, row: drag.row } : positions[folder.id];
        const { right, top } = cellToXY(cell);
        const isSelected = selected === folder.id;
        return (
          <button
            key={folder.id}
            ref={(el) => {
              btnRefs.current[folder.id] = el;
            }}
            role="option"
            aria-selected={isSelected}
            aria-label={`${folder.label} folder`}
            data-desktop-icon={folder.id}
            onPointerDown={(e) => onPointerDown(e, folder.id)}
            onPointerMove={(e) => onPointerMove(e, folder.id)}
            onPointerUp={(e) => onPointerUp(e, folder)}
            onDoubleClick={() => openFolder(folder)}
            onKeyDown={(e) => onKeyDown(e, index, folder)}
            onFocus={() => setSelected(folder.id)}
            style={{
              position: "absolute",
              top,
              right,
              width: 96,
              padding: "6px 4px",
              background: "none",
              border: "none",
              cursor: "default",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              pointerEvents: "auto",
              touchAction: "none",
              opacity: drag?.id === folder.id ? 0.85 : 1,
            }}
          >
            <span
              style={{
                borderRadius: 10,
                padding: 4,
                background: isSelected ? "rgba(10,132,255,0.35)" : "transparent",
                border: isSelected
                  ? "1px solid rgba(255,255,255,0.55)"
                  : "1px solid transparent",
                filter: isSelected ? "brightness(0.92)" : "none",
                transition: "background 0.1s ease",
              }}
            >
              <BlueFolderIcon size={56} />
            </span>
            <span
              style={{
                fontSize: 12,
                lineHeight: "15px",
                color: "#fff",
                textAlign: "center",
                fontFamily: "var(--font-system)",
                textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                background: isSelected ? "var(--accent-blue)" : "transparent",
                borderRadius: 5,
                padding: "1px 6px",
                maxWidth: 92,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                overflowWrap: "break-word",
              }}
            >
              {folder.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

