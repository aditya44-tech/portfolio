import { useEffect, useRef, useState } from "react";

export interface FinderMenuItem {
  label: string;
  hint?: string;
  disabled?: boolean;
  onClick?: () => void;
}

/** Small macOS-style context menu, fixed at the cursor. */
export default function FinderContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: FinderMenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const [pos] = useState(() => ({
    left: Math.min(x, window.innerWidth - 250),
    top: Math.min(y, window.innerHeight - items.length * 28 - 40),
  }));

  return (
    <div
      ref={ref}
      role="menu"
      className="menu-box"
      style={{
        position: "fixed",
        left: Math.max(8, pos.left),
        top: Math.max(8, pos.top),
        width: 230,
        padding: "5px 0",
        zIndex: 100000,
        fontFamily: "var(--font-system)",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) => (
        <FinderMenuRow key={i} item={item} onClose={onClose} />
      ))}
    </div>
  );
}

function FinderMenuRow({ item, onClose }: { item: FinderMenuItem; onClose: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      role="menuitem"
      aria-disabled={item.disabled}
      className="text-black dark:text-white"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "3px 10px",
        fontSize: 13.5,
        lineHeight: "18px",
        cursor: "default",
        borderRadius: 4,
        userSelect: "none",
        margin: "1px 5px",
        background: hovered && !item.disabled ? "var(--accent-blue)" : "transparent",
        color: hovered && !item.disabled ? "#fff" : "inherit",
        opacity: item.disabled ? 0.5 : 1,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!item.disabled && item.onClick) {
          item.onClick();
          onClose();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span>{item.label}</span>
      {item.hint && (
        <span style={{ fontSize: 12, opacity: 0.6, marginLeft: "auto" }}>{item.hint}</span>
      )}
    </div>
  );
}
