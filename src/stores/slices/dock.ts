import type { StateCreator } from "zustand";

export interface DockSlice {
  dockSize: number;
  dockMag: number;
  setDockSize: (v: number) => void;
  setDockMag: (v: number) => void;
  /** Magnification on/off (dockMag stays as the strength slider). */
  dockMagnification: boolean;
  setDockMagnification: (v: boolean) => void;
}

export const createDockSlice: StateCreator<DockSlice> = (set) => ({
  dockSize: 50,
  dockMag: 2,
  setDockSize: (v) => set(() => ({ dockSize: v })),
  setDockMag: (v) => set(() => ({ dockMag: v })),
  dockMagnification: true,
  setDockMagnification: (v) => set(() => ({ dockMagnification: v }))
});
