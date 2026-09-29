import type { StateCreator } from "zustand";

// Accent color can be a named key or a hex string
export type AccentColorKey =
  | "blue" | "purple" | "pink" | "red"
  | "orange" | "yellow" | "green" | "graphite";

export type AccentColor = AccentColorKey | string; // allow hex

export const ACCENT_HEX: Record<AccentColorKey, string> = {
  blue: "#007AFF",
  purple: "#AF52DE",
  pink: "#FF2D55",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#34C759",
  graphite: "#8E8E93",
};

export type DockPosition = "bottom" | "left" | "right";
export type AppTheme = "default" | "souls" | "soul-reaper";

export interface WallpaperSet {
  id: string;
  name: string;
  day: string;
  night: string;
  thumbnail?: string;
}

export const wallpaperSets: WallpaperSet[] = [
  {
    id: "tahoe",
    name: "macOS Tahoe",
    day: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    night: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    thumbnail: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
  },
  {
    id: "souls-ember",
    name: "Souls: Lands Between",
    day: "wallpapers/souls-landscape.svg",
    night: "wallpapers/souls-landscape.svg",
    thumbnail: "wallpapers/souls-landscape.svg",
  },
  {
    id: "soul-reaper",
    name: "Soul Reaper: Bankai",
    day: "wallpapers/soul-reaper.svg",
    night: "wallpapers/soul-reaper.svg",
    thumbnail: "wallpapers/soul-reaper.svg",
  },
  {
    id: "tahoe-light",
    name: "Tahoe Light",
    day: "wallpapers/macOS_Tahoe_LightDefault.jpg",
    night: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    thumbnail: "wallpapers/macOS_Tahoe_LightDefault.jpg",
  },
  {
    id: "tahoe-beach",
    name: "Tahoe Beach",
    day: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    night: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    thumbnail: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
  },
  {
    id: "ventura",
    name: "macOS Ventura",
    day: "img/ui/macOS-ventura-light.jpg",
    night: "img/ui/macOS-ventura-dark.jpg",
    thumbnail: "img/ui/macOS-ventura-light.jpg",
  },
];

export interface SettingsSlice {
  // Wallpaper
  wallpaperSets: WallpaperSet[];
  activeWallpaperSet: string;
  setActiveWallpaperSet: (id: string) => void;
  /** @deprecated use activeWallpaperSet */
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  getWallpaper: () => WallpaperSet;

  // Theme (Default, Souls, Soul Reaper)
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;

  // Custom Cursor
  customCursor: boolean;
  setCustomCursor: (enabled: boolean) => void;

  // Accent color (hex string or named key)
  accentColor: string;
  setAccentColor: (color: string) => void;
  getAccentHex: () => string;

  // Dock preferences
  dockPosition: DockPosition;
  setDockPosition: (pos: DockPosition) => void;
  dockAutoHide: boolean;
  setDockAutoHide: (v: boolean) => void;

  // Notification
  notificationSound: string;
  setNotificationSound: (sound: string) => void;
}

const loadSetting = <T>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(`macos-settings-${key}`);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const saveSetting = (key: string, value: unknown) => {
  try {
    localStorage.setItem(`macos-settings-${key}`, JSON.stringify(value));
  } catch {
    // localStorage may be unavailable
  }
};

const applyThemeClasses = (t: AppTheme) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.remove("theme-default", "theme-souls", "theme-soul-reaper");
  document.documentElement.classList.add(`theme-${t}`);

  if (t === "souls") {
    document.documentElement.style.setProperty("--accent-primary", "#F59E0B");
    document.documentElement.style.setProperty("--theme-accent", "#F59E0B");
    document.documentElement.style.setProperty("--theme-stone-bg", "#161210");
  } else if (t === "soul-reaper") {
    document.documentElement.style.setProperty("--accent-primary", "#FF5722");
    document.documentElement.style.setProperty("--theme-accent", "#FF5722");
    document.documentElement.style.setProperty("--theme-stone-bg", "#0A0A0C");
  } else {
    document.documentElement.style.setProperty("--accent-primary", "#007AFF");
    document.documentElement.style.setProperty("--theme-accent", "#007AFF");
    document.documentElement.style.setProperty("--theme-stone-bg", "transparent");
  }
};

const applyCursorClass = (enabled: boolean) => {
  if (typeof document === "undefined") return;
  if (enabled) {
    document.documentElement.classList.add("custom-cursor-katana");
  } else {
    document.documentElement.classList.remove("custom-cursor-katana");
  }
};

const initialTheme = loadSetting<AppTheme>("theme", "default");
const initialCursor = loadSetting<boolean>("customCursor", false);
applyThemeClasses(initialTheme);
applyCursorClass(initialCursor);

export const createSettingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  // Wallpaper
  wallpaperSets,
  activeWallpaperSet: loadSetting("activeWallpaperSet", "tahoe"),
  setActiveWallpaperSet: (id) => {
    saveSetting("activeWallpaperSet", id);
    saveSetting("wallpaperId", id);
    set({ activeWallpaperSet: id, wallpaperId: id });
  },
  /** @deprecated */
  wallpaperId: loadSetting("wallpaperId", "tahoe"),
  setWallpaperId: (id) => {
    saveSetting("wallpaperId", id);
    saveSetting("activeWallpaperSet", id);
    set({ wallpaperId: id, activeWallpaperSet: id });
  },
  getWallpaper: () => {
    const id = get().activeWallpaperSet;
    return wallpaperSets.find((w) => w.id === id) ?? wallpaperSets[0];
  },

  // Theme
  theme: initialTheme,
  setTheme: (t) => {
    saveSetting("theme", t);
    applyThemeClasses(t);
    set({ theme: t });
    // Also change default wallpaper if user switches to Souls or Soul Reaper
    if (t === "souls") {
      get().setActiveWallpaperSet("souls-ember");
    } else if (t === "soul-reaper") {
      get().setActiveWallpaperSet("soul-reaper");
    }
  },

  // Custom Cursor
  customCursor: initialCursor,
  setCustomCursor: (enabled) => {
    saveSetting("customCursor", enabled);
    applyCursorClass(enabled);
    set({ customCursor: enabled });
  },

  // Accent color — stored as hex string
  accentColor: loadSetting("accentColor", "#007AFF"),
  setAccentColor: (color) => {
    // If named key, resolve to hex
    const hex = ACCENT_HEX[color as AccentColorKey] ?? color;
    saveSetting("accentColor", hex);
    set({ accentColor: hex });
    // Apply to CSS variable
    document.documentElement.style.setProperty("--accent-primary", hex);
  },
  getAccentHex: () => {
    const color = get().accentColor;
    return ACCENT_HEX[color as AccentColorKey] ?? color;
  },

  // Dock position
  dockPosition: loadSetting("dockPosition", "bottom" as DockPosition),
  setDockPosition: (pos) => {
    saveSetting("dockPosition", pos);
    set({ dockPosition: pos });
  },

  // Dock auto-hide
  dockAutoHide: loadSetting("dockAutoHide", false),
  setDockAutoHide: (v) => {
    saveSetting("dockAutoHide", v);
    set({ dockAutoHide: v });
  },

  // Notification sound
  notificationSound: loadSetting(
    "notificationSound",
    "music/Samantha (Legacy)-2024_08_12-6.wav"
  ),
  setNotificationSound: (sound) => {
    saveSetting("notificationSound", sound);
    set({ notificationSound: sound });
  },
});
