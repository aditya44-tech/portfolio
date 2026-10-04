import type { StateCreator } from "zustand";

/**
 * Theme slice — the remaining piece of the app-wide theme API.
 * (mode lives in the system slice, accent in the settings slice;
 *  useTheme() in ~/hooks/useTheme composes all three.)
 */
export interface ThemeSlice {
  /** Global type scale, 1 = 100%. Applied to `--font-scale` on <html>. */
  fontScale: number;
  setFontScale: (v: number) => void;
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

const clampScale = (v: number) => Math.min(1.3, Math.max(0.85, v));

const applyFontScale = (v: number) => {
  if (typeof document !== "undefined") {
    document.documentElement.style.setProperty("--font-scale", String(v));
  }
};

const initialFontScale = clampScale(loadSetting<number>("fontScale", 1));
applyFontScale(initialFontScale);

export const createThemeSlice: StateCreator<ThemeSlice> = (set) => ({
  fontScale: initialFontScale,
  setFontScale: (v) =>
    set(() => {
      const next = clampScale(v);
      applyFontScale(next);
      saveSetting("fontScale", next);
      return { fontScale: next };
    }),
});
