/**
 * Canonical wallpaper catalogue.
 *
 * Every entry points at a REAL self-hosted file under /public/wallpapers/:
 * - `thumbnail` (320x200 WebP, a few KB) is used in the Settings picker grid.
 * - `day` / `night` (full-res) are applied to the desktop.
 * - `full` is the canonical full-res source for the entry.
 * All paths are absolute so they resolve identically in dev and production builds.
 */

export type WallpaperCategory = "default" | "gaming" | "anime" | "editing";
export type WallpaperMode = "light" | "dark" | "both";

export interface WallpaperItem {
  id: string;
  title: string;
  category: WallpaperCategory;
  /** Small WebP for the picker grid — never load full-res there. */
  thumbnail: string;
  /** Canonical full-res image. */
  full: string;
  /** Full-res image applied in light mode. */
  day: string;
  /** Full-res image applied in dark mode. */
  night: string;
  mode: WallpaperMode;
}

/** Served when a thumbnail fails to load (wired via onError in the picker). */
export const FALLBACK_WALLPAPER = "/wallpapers/fallback.jpg";

export const wallpapersData: WallpaperItem[] = [
  // ---------- Default (stock macOS) ----------
  {
    id: "tahoe",
    title: "Tahoe Beach",
    category: "default",
    thumbnail: "/wallpapers/thumbs/DefaultAerial_Tahoe_Beach.webp",
    full: "/wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    day: "/wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    night: "/wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    mode: "both",
  },
  {
    id: "tahoe-light",
    title: "Tahoe Light",
    category: "default",
    thumbnail: "/wallpapers/thumbs/macOS_Tahoe_LightDefault.webp",
    full: "/wallpapers/macOS_Tahoe_LightDefault.jpg",
    day: "/wallpapers/macOS_Tahoe_LightDefault.jpg",
    night: "/wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    mode: "light",
  },
  {
    id: "tahoe-wave",
    title: "Tahoe Wave",
    category: "default",
    thumbnail: "/wallpapers/thumbs/macOS_Tahoe_Default.webp",
    full: "/wallpapers/macOS_Tahoe_Default.jpg",
    day: "/wallpapers/macOS_Tahoe_Default.jpg",
    night: "/wallpapers/macOS_Tahoe_DefaultDark.jpg",
    mode: "both",
  },
  {
    id: "ventura",
    title: "Ventura",
    category: "default",
    thumbnail: "/wallpapers/thumbs/macOS-ventura-light.webp",
    full: "/wallpapers/full/macOS-ventura-light.jpg",
    day: "/wallpapers/full/macOS-ventura-light.jpg",
    night: "/wallpapers/full/macOS-ventura-dark.jpg",
    mode: "both",
  },
  // ---------- Gaming (Souls / ember tones, original art) ----------
  {
    id: "souls-ember",
    title: "Souls: Lands Between",
    category: "gaming",
    thumbnail: "/wallpapers/thumbs/souls-landscape.webp",
    full: "/wallpapers/souls-landscape.svg",
    day: "/wallpapers/souls-landscape.svg",
    night: "/wallpapers/souls-landscape.svg",
    mode: "dark",
  },
  {
    id: "soul-reaper",
    title: "Soul Reaper: Bankai",
    category: "anime",
    thumbnail: "/wallpapers/thumbs/soul-reaper.webp",
    full: "/wallpapers/soul-reaper.svg",
    day: "/wallpapers/soul-reaper.svg",
    night: "/wallpapers/soul-reaper.svg",
    mode: "dark",
  },
];
