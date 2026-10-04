import type { StateCreator } from "zustand";
import { wallpapersData } from "~/data/wallpapers";
import type { WallpaperCategory, WallpaperMode } from "~/data/wallpapers";

// Accent color can be a named key or a hex string
export type AccentColorKey =
  | "blue" | "purple" | "pink" | "red"
  | "orange" | "yellow" | "green" | "graphite";

export type AccentColor = AccentColorKey | string; // allow hex

export const ACCENT_HEX: Record<AccentColorKey, string> = {
  blue: "#0A84FF",
  purple: "#AF52DE",
  pink: "#FF375F",
  red: "#FF453A",
  orange: "#FF9F0A",
  yellow: "#FFD60A",
  green: "#32D74B",
  graphite: "#98989D",
};

export type DockPosition = "bottom" | "left" | "right";
export type AppTheme = "default" | "souls" | "soul-reaper";

export interface WallpaperSet {
  id: string;
  name: string;
  day: string;
  night: string;
  thumbnail?: string;
  category: WallpaperCategory;
  mode: WallpaperMode;
}

export const wallpaperSets: WallpaperSet[] = wallpapersData.map((w) => ({
  id: w.id,
  name: w.title,
  day: w.day,
  night: w.night,
  thumbnail: w.thumbnail,
  category: w.category,
  mode: w.mode,
}));

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
  darkMenubar: boolean;
  setDarkMenubar: (v: boolean) => void;
  showBatteryPercentage: boolean;
  setShowBatteryPercentage: (v: boolean) => void;

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
    document.documentElement.style.setProperty("--accent-primary", "#0A84FF");
    document.documentElement.style.setProperty("--theme-accent", "#0A84FF");
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

// Portfolio themes were removed from Appearance: everyone runs Default.
const initialTheme: AppTheme = "default";
saveSetting("theme", "default");
const initialCursor = false;
saveSetting("customCursor", false);
applyThemeClasses(initialTheme);
applyCursorClass(initialCursor);
// Re-apply the stored accent (theme bootstrap would otherwise reset it).
if (typeof document !== "undefined") {
  document.documentElement.style.setProperty("--accent-primary", loadSetting("accentColor", "#0A84FF"));
}

const storedWallpaperId = loadSetting("activeWallpaperSet", "tahoe");
const initialWallpaperId = wallpaperSets.some((w) => w.id === storedWallpaperId)
  ? storedWallpaperId
  : "tahoe";

export const createSettingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  // Wallpaper
  wallpaperSets,
  activeWallpaperSet: initialWallpaperId,
  setActiveWallpaperSet: (id) => {
    saveSetting("activeWallpaperSet", id);
    saveSetting("wallpaperId", id);
    set({ activeWallpaperSet: id, wallpaperId: id });
  },
  /** @deprecated */
  wallpaperId: initialWallpaperId,
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
    // Each theme card applies its signature wallpaper so the atmosphere
    // always matches (Default restores Tahoe).
    if (t === "default") {
      get().setActiveWallpaperSet("tahoe");
    } else if (t === "souls") {
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
  accentColor: loadSetting("accentColor", "#0A84FF"),
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

  // Dark menubar always (classic blurred dark bar instead of transparent)
  darkMenubar: loadSetting("darkMenubar", false),
  setDarkMenubar: (v) => {
    saveSetting("darkMenubar", v);
    set({ darkMenubar: v });
  },

  // Show battery percentage next to the menubar battery icon
  showBatteryPercentage: loadSetting("showBatteryPercentage", true),
  setShowBatteryPercentage: (v) => {
    saveSetting("showBatteryPercentage", v);
    set({ showBatteryPercentage: v });
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
