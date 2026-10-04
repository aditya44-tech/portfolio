import type { CSSProperties } from "react";

interface GlyphProps {
  size?: number;
  style?: CSSProperties;
  title?: string;
}

const base = (size: number, style?: CSSProperties) => ({
  width: size,
  height: size,
  flexShrink: 0 as const,
  display: "block" as const,
  ...style,
});

/** Default — mountain landscape / photo glyph for stock macOS wallpapers. */
export const DefaultWallpaperGlyph = ({ size = 18, style, title }: GlyphProps) => (
  <svg viewBox="0 0 24 24" style={base(size, style)} fill="currentColor" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
    {title && <title>{title}</title>}
    <circle cx="9" cy="8" r="2.6" />
    <path d="M2.5 19.5l6-7.5 4 5 3-3.8 6 6.3z" />
  </svg>
);

/** Gaming — crossed swords for the Souls / ember-tone collection. */
export const GamingGlyph = ({ size = 18, style, title }: GlyphProps) => (
  <svg viewBox="0 0 24 24" style={base(size, style)} fill="none" stroke="currentColor" strokeLinecap="round" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
    {title && <title>{title}</title>}
    {/* blades */}
    <path d="M6 3.5L20.5 18" strokeWidth="2.4" />
    <path d="M18 3.5L3.5 18" strokeWidth="2.4" />
    {/* crossguards */}
    <path d="M15.2 16.2l4.6 1.2" strokeWidth="2" />
    <path d="M8.8 16.2l-4.6 1.2" strokeWidth="2" />
    {/* pommels */}
    <circle cx="18.6" cy="19.4" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="5.4" cy="19.4" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

/** Anime — cherry blossom (sakura) for the moonlit collection. */
export const AnimeGlyph = ({ size = 18, style, title }: GlyphProps) => (
  <svg viewBox="0 0 24 24" style={base(size, style)} fill="currentColor" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
    {title && <title>{title}</title>}
    <ellipse cx="12" cy="6.8" rx="2.7" ry="4.1" />
    <ellipse cx="12" cy="6.8" rx="2.7" ry="4.1" transform="rotate(72 12 12)" />
    <ellipse cx="12" cy="6.8" rx="2.7" ry="4.1" transform="rotate(144 12 12)" />
    <ellipse cx="12" cy="6.8" rx="2.7" ry="4.1" transform="rotate(216 12 12)" />
    <ellipse cx="12" cy="6.8" rx="2.7" ry="4.1" transform="rotate(288 12 12)" />
    <circle cx="12" cy="12" r="1.7" opacity="0.55" />
  </svg>
);

/** Editing — clapperboard silhouette for the color-grade / timeline collection. */
export const EditingGlyph = ({ size = 18, style, title }: GlyphProps) => (
  <svg viewBox="0 0 24 24" style={base(size, style)} fill="currentColor" aria-hidden={title ? undefined : true} role={title ? "img" : undefined}>
    {title && <title>{title}</title>}
    <rect x="3" y="10.5" width="18" height="10" rx="2.2" />
    <path d="M4.2 8.8L5.6 4.6c.2-.6.8-1 1.4-.9l11.3 1.7c.7.1 1.1.8 1 1.5l-.9 3.4z" />
    <circle cx="5.4" cy="12.6" r="1" opacity="0.55" />
  </svg>
);

export const CATEGORY_GLYPHS = {
  default: DefaultWallpaperGlyph,
  gaming: GamingGlyph,
  anime: AnimeGlyph,
  editing: EditingGlyph,
} as const;

export type WallpaperGlyphCategory = keyof typeof CATEGORY_GLYPHS;
