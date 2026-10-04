import { useStore } from "~/stores";
import type { AppearanceMode } from "~/stores/slices/system";

export type ThemeMode = "light" | "dark";

/**
 * App-wide theme API, backed by the single Zustand store (no provider needed).
 *
 * - mode: resolved 'light' | 'dark' (follows the OS while appearance is "auto")
 * - appearance: 'auto' | 'light' | 'dark' override (Control Center / Settings)
 * - accent: current accent hex (e.g. "#0A84FF")
 * - fontScale: global type scale, 1 = 100%
 *
 * Every visual surface reads the same CSS variables (see src/styles/theme.css),
 * so switching mode / accent / scale updates the whole desktop at once.
 */
export function useTheme() {
  const dark = useStore((s) => s.dark);
  const appearance = useStore((s) => s.appearanceMode);
  const setAppearance = useStore((s) => s.setAppearanceMode);
  const accent = useStore((s) => s.accentColor);
  const setAccent = useStore((s) => s.setAccentColor);
  const fontScale = useStore((s) => s.fontScale);
  const setFontScale = useStore((s) => s.setFontScale);

  const setMode = (mode: ThemeMode | "auto"): void => {
    setAppearance(mode as AppearanceMode);
  };

  return {
    mode: (dark ? "dark" : "light") as ThemeMode,
    appearance,
    setMode,
    setAppearance,
    accent,
    setAccent,
    fontScale,
    setFontScale,
  };
}
