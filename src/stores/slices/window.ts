import type { StateCreator } from "zustand";

export interface WindowSlice {
  openApps: Record<string, boolean>;
  minimizedApps: Record<string, boolean>;
  maximizedApps: Record<string, boolean>;
  activeAppId: string;
  openApp: (id: string) => void;
  closeApp: (id: string) => void;
  minimizeApp: (id: string) => void;
  maximizeApp: (id: string) => void;
  toggleWindow: (id: string) => void;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
}

export const createWindowSlice: StateCreator<WindowSlice> = (set, get) => ({
  openApps: {
    bear: true, // initial open default
  },
  minimizedApps: {},
  maximizedApps: {},
  activeAppId: "bear",

  openApp: (id: string) => {
    set((state) => ({
      openApps: { ...state.openApps, [id]: true },
      minimizedApps: { ...state.minimizedApps, [id]: false },
      activeAppId: id,
    }));
    // Dispatch cross-window event so Desktop and other components react instantly
    window.dispatchEvent(new CustomEvent("desktop:openApp", { detail: { id } }));
  },

  closeApp: (id: string) => {
    set((state) => {
      const nextOpen = { ...state.openApps };
      delete nextOpen[id];
      return {
        openApps: nextOpen,
        activeAppId: state.activeAppId === id ? "Finder" : state.activeAppId,
      };
    });
    window.dispatchEvent(new CustomEvent("desktop:closeApp", { detail: { id } }));
  },

  minimizeApp: (id: string) => {
    set((state) => ({
      minimizedApps: { ...state.minimizedApps, [id]: !state.minimizedApps[id] },
    }));
  },

  maximizeApp: (id: string) => {
    set((state) => ({
      maximizedApps: { ...state.maximizedApps, [id]: !state.maximizedApps[id] },
    }));
  },

  toggleWindow: (id: string) => {
    const isOpen = !!get().openApps[id];
    if (isOpen) {
      get().closeApp(id);
    } else {
      get().openApp(id);
    }
  },

  openWindow: (id: string) => get().openApp(id),
  closeWindow: (id: string) => get().closeApp(id),
});
