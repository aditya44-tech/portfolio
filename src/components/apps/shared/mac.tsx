import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { useStore } from "~/stores";

/**
 * Tiny native-macOS UI kit shared by the GitHub, LinkedIn and Mail apps.
 * Mirrors Finder / Mail anatomy: translucent toolbar + sidebar materials,
 * SF-symbol style glyph badges, neutral sidebar selection, hairline
 * dividers and a Finder-style status bar. All surfaces follow the desktop
 * light/dark mode automatically.
 */

export function useMacSurfaces() {
  const dark = useStore((s) => s.dark);
  return {
    dark,
    /** Translucent sidebar / toolbar material (needs backdrop blur). */
    material: dark ? "rgba(40,40,42,0.72)" : "rgba(242,242,246,0.72)",
    hairline: "1px solid var(--c-border)",
    rowHover: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.045)",
    /** Neutral Finder-style sidebar selection. */
    selectedRow: dark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.075)",
    font: "var(--font-system)",
  };
}

export const macBlur: CSSProperties = {
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
};

/** Colored rounded-square glyph badge, like Finder / Settings sidebar icons. */
export function SideBadge({ glyph, color }: { glyph: string; color: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: "26px",
        height: "26px",
        borderRadius: "7px",
        background: color,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.12)",
      }}
    >
      <span className={glyph} style={{ width: "15px", height: "15px", color: "#fff" }} />
    </span>
  );
}

/** One sidebar row: badge + label + optional count pill. */
export function SideRow({
  active,
  onClick,
  badge,
  label,
  count,
  ariaLabel,
}: {
  active: boolean;
  onClick: () => void;
  badge: ReactNode;
  label: string;
  count?: number;
  ariaLabel?: string;
}) {
  const { selectedRow, font } = useMacSurfaces();
  return (
    <button
      aria-label={ariaLabel ?? label}
      aria-current={active ? "true" : undefined}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        width: "100%",
        minHeight: "34px",
        padding: "4px 8px",
        borderRadius: "7px",
        margin: "1px 0",
        border: "none",
        cursor: "pointer",
        background: active ? selectedRow : "transparent",
        color: "var(--c-text)",
        fontSize: "13px",
        fontWeight: active ? 600 : 400,
        fontFamily: font,
        textAlign: "left",
        transition: "background 0.12s ease",
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "var(--c-bg-tertiary)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {badge}
      <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
      {typeof count === "number" && count > 0 && (
        <span
          style={{
            background: "rgba(120,120,128,0.25)",
            color: "var(--c-text)",
            borderRadius: "10px",
            fontSize: "11px",
            fontWeight: 600,
            padding: "1px 7px",
            minWidth: "22px",
            textAlign: "center",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/** Small caps section header used at the top of sidebar groups. */
export function SideSectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: "var(--c-text-tertiary)",
        padding: "8px 10px 4px",
        userSelect: "none",
      }}
    >
      {children}
    </div>
  );
}

/** 52px translucent NSToolbar-style bar with hairline bottom border. */
export function MacToolbar({ left, right }: { left?: ReactNode; right?: ReactNode }) {
  const { material, hairline } = useMacSurfaces();
  return (
    <div
      role="toolbar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        minHeight: "52px",
        padding: "8px 12px",
        background: material,
        ...macBlur,
        borderBottom: hairline,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "4px", minWidth: 0 }}>{left}</div>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>{right}</div>
    </div>
  );
}

/** Native 30px toolbar icon button with tooltip + disabled state. */
export function ToolButton({
  glyph,
  label,
  onClick,
  disabled,
  active,
}: {
  glyph: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  const { dark } = useMacSurfaces();
  return (
    <button
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: "32px",
        height: "30px",
        borderRadius: "6px",
        border: "none",
        cursor: disabled ? "default" : "pointer",
        background: active ? (dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.08)") : "transparent",
        color: disabled ? "var(--c-text-tertiary)" : "var(--c-text-secondary)",
        opacity: disabled ? 0.45 : 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.12s ease",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active)
          (e.currentTarget as HTMLElement).style.background = "var(--c-bg-tertiary)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      <span className={glyph} style={{ width: "17px", height: "17px" }} aria-hidden />
    </button>
  );
}

/** Native pill search field with magnifier + clear button. */
export function SearchField({
  value,
  onChange,
  placeholder,
  label,
  width,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  width?: number | string;
}) {
  const { dark, font } = useMacSurfaces();
  return (
    <div
      role="search"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
        height: "28px",
        width: width ?? 190,
        maxWidth: "100%",
        background: dark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.055)",
        borderRadius: "14px",
        padding: "0 8px",
        border: "0.5px solid rgba(128,128,128,0.25)",
      }}
    >
      <span
        className="i-ph:magnifying-glass"
        aria-hidden
        style={{ width: "13px", height: "13px", opacity: 0.55, flexShrink: 0 }}
      />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        style={{
          background: "none",
          border: "none",
          outline: "none",
          fontSize: "13px",
          width: "100%",
          color: "var(--c-text)",
          fontFamily: font,
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          style={{
            background: "rgba(128,128,128,0.35)",
            border: "none",
            borderRadius: "50%",
            width: "15px",
            height: "15px",
            cursor: "pointer",
            color: "#fff",
            fontSize: "10px",
            lineHeight: 1,
            padding: 0,
            flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}

/** Native push button (Big Sur style): default gray, or accent primary. */
export function PushButton({
  primary,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }) {
  const { dark, font } = useMacSurfaces();
  const enabled = !rest.disabled;
  return (
    <button
      {...rest}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        minHeight: "26px",
        padding: "4px 14px",
        borderRadius: "7px",
        border: "0.5px solid rgba(128,128,128,0.3)",
        cursor: enabled ? "pointer" : "default",
        background: primary
          ? "#0A84FF"
          : enabled
            ? dark
              ? "rgba(255,255,255,0.12)"
              : "rgba(255,255,255,0.9)"
            : "var(--c-bg-tertiary)",
        color: primary ? "#fff" : enabled ? "var(--c-text)" : "var(--c-text-tertiary)",
        fontSize: "13px",
        fontWeight: 400,
        fontFamily: font,
        boxShadow: enabled ? "0 0.5px 1.5px rgba(0,0,0,0.12)" : "none",
        opacity: enabled ? 1 : 0.7,
        ...(rest.style ?? {}),
      }}
    >
      {children}
    </button>
  );
}

/** Finder-style status bar pinned to the bottom of a pane. */
export function StatusBar({ children }: { children: ReactNode }) {
  const { material, hairline, font } = useMacSurfaces();
  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        minHeight: "26px",
        padding: "4px 12px",
        background: material,
        ...macBlur,
        borderTop: hairline,
        fontSize: "12px",
        color: "var(--c-text-secondary)",
        fontFamily: font,
        fontWeight: 600,
        flexShrink: 0,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}
