import { create } from "zustand";
import { createDockSlice, type DockSlice } from "./slices/dock";
import { createSystemSlice, type SystemSlice } from "./slices/system";
import { createUserSlice, type UserSlice } from "./slices/user";
import { createSettingsSlice, type SettingsSlice } from "./slices/settings";
import { createNotificationsSlice, type NotificationsSlice } from "./slices/notifications";
import { createWindowSlice, type WindowSlice } from "./slices/window";
import { createThemeSlice, type ThemeSlice } from "./slices/theme";

export const useStore = create<DockSlice & SystemSlice & UserSlice & SettingsSlice & NotificationsSlice & WindowSlice & ThemeSlice>(
  (...a) => ({
    ...createDockSlice(...a),
    ...createSystemSlice(...a),
    ...createUserSlice(...a),
    ...createSettingsSlice(...a),
    ...createNotificationsSlice(...a),
    ...createWindowSlice(...a),
    ...createThemeSlice(...a),
  })
);

