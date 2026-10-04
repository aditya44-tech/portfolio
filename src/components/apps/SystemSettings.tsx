import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStore } from "~/stores";
import { useWindowSize } from "~/hooks";
import { CATEGORY_GLYPHS } from "~/components/icons/CategoryGlyphs";
import { FALLBACK_WALLPAPER } from "~/data/wallpapers";
import type { WallpaperCategory } from "~/data/wallpapers";

type SettingsPanel =
  | "general"
  | "accessibility"
  | "appearance"
  | "control-center"
  | "siri"
  | "desktop"
  | "displays"
  | "spotlight"
  | "wallpaper"
  | "notifications"
  | "sound"
  | "focus"
  | "screen-time"
  | "privacy"
  | "touch-id"
  | "users"
  | "internet-accounts"
  | "game-center"
  | "wallet"
  | "keyboard"
  | "mouse"
  | "trackpad"
  | "printers"
  | "about"
  | "weather"
  | "battery"
  | "storage"
  | "dock"
  | "cloud"
  | "network"
  | "bluetooth"
  | "wifi";

interface PanelItem {
  id: SettingsPanel;
  label: string;
  icon: string;
  color: string;
}

const PANEL_ITEMS: PanelItem[] = [
  { id: "wifi", label: "Wi-Fi", icon: "/img/icons/sf-icons/wifi.svg", color: "#007AFF" },
  { id: "bluetooth", label: "Bluetooth", icon: "/img/icons/sf-icons/bluetooth.svg", color: "#007AFF" },
  { id: "network", label: "Network", icon: "/img/icons/sf-icons/network.svg", color: "#007AFF" },
  { id: "notifications", label: "Notifications", icon: "/img/icons/sf-icons/notifications.svg", color: "#FF3B30" },
  { id: "sound", label: "Sound", icon: "/img/icons/sf-icons/sound.svg", color: "#FF2D55" },
  { id: "focus", label: "Focus", icon: "/img/icons/sf-icons/focus.svg", color: "#5856D6" },
  { id: "screen-time", label: "Screen Time", icon: "/img/icons/sf-icons/screen-time.svg", color: "#5856D6" },
  { id: "general", label: "General", icon: "/img/icons/sf-icons/general.svg", color: "#8E8E93" },
  { id: "appearance", label: "Appearance", icon: "/img/icons/sf-icons/appearance.svg", color: "#000000" },
  { id: "accessibility", label: "Accessibility", icon: "/img/icons/sf-icons/accessibility.svg", color: "#007AFF" },
  { id: "control-center", label: "Control Center", icon: "/img/icons/sf-icons/control-center.svg", color: "#8E8E93" },
  { id: "siri", label: "Siri & Spotlight", icon: "/img/icons/sf-icons/siri.svg", color: "#AF52DE" },
  { id: "spotlight", label: "Spotlight", icon: "/img/icons/sf-icons/spotlight.svg", color: "#8E8E93" },
  { id: "privacy", label: "Privacy & Security", icon: "/img/icons/sf-icons/privacy.svg", color: "#007AFF" },
  { id: "desktop", label: "Desktop", icon: "/img/icons/sf-icons/desktop.svg", color: "#6E6E73" },
  { id: "dock", label: "Dock & Menu Bar", icon: "/img/icons/sf-icons/dock.svg", color: "#5AC8FA" },
  { id: "displays", label: "Displays", icon: "/img/icons/sf-icons/displays.svg", color: "#007AFF" },
  { id: "wallpaper", label: "Wallpaper", icon: "/img/icons/sf-icons/wallpaper.svg", color: "#5AC8FA" },
  { id: "battery", label: "Battery", icon: "/img/icons/sf-icons/battery.svg", color: "#34C759" },
  { id: "storage", label: "Storage", icon: "/img/icons/sf-icons/storage.svg", color: "#5856D6" },
  { id: "cloud", label: "Cloud Storage", icon: "/img/icons/sf-icons/cloud.svg", color: "#007AFF" },
  { id: "touch-id", label: "Touch ID & Password", icon: "/img/icons/sf-icons/touch-id.svg", color: "#FF2D55" },
  { id: "users", label: "Users & Groups", icon: "/img/icons/sf-icons/users.svg", color: "#8E8E93" },
  { id: "internet-accounts", label: "Internet Accounts", icon: "/img/icons/sf-icons/internet-accounts.svg", color: "#007AFF" },
  { id: "game-center", label: "Game Center", icon: "/img/icons/sf-icons/game-center.svg", color: "#34C759" },
  { id: "wallet", label: "Wallet & Apple Pay", icon: "/img/icons/sf-icons/wallet.svg", color: "#1c1c1e" },
  { id: "keyboard", label: "Keyboard", icon: "/img/icons/sf-icons/keyboard.svg", color: "#8E8E93" },
  { id: "mouse", label: "Mouse", icon: "/img/icons/sf-icons/mouse.svg", color: "#8E8E93" },
  { id: "trackpad", label: "Trackpad", icon: "/img/icons/sf-icons/trackpad.svg", color: "#8E8E93" },
  { id: "printers", label: "Printers & Scanners", icon: "/img/icons/sf-icons/printer.svg", color: "#8E8E93" },
  { id: "weather", label: "Weather", icon: "/img/icons/sf-icons/sun.max.svg", color: "#007AFF" },
  { id: "about", label: "About", icon: "/img/icons/sf-icons/about.svg", color: "#8E8E93" }
];

const PANEL_GROUPS = [
  ["screen-time"],
  ["general", "accessibility", "privacy"],
  ["touch-id"],
  ["network", "wifi", "bluetooth"],
  ["notifications", "sound", "focus"],
  ["desktop", "dock", "displays", "wallpaper", "battery", "storage", "cloud"],
  ["users", "internet-accounts", "game-center", "wallet"],
  ["keyboard", "mouse", "trackpad", "printers"],
  ["weather", "about"]
];

// ─── Shared sub-components ────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => {
  const dark = useStore((s) => s.dark);
  const accentHex = useStore((s) => s.getAccentHex());
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        background: checked ? accentHex : dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: checked ? `0 0 10px ${accentHex}80` : "inset 0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          position: "absolute",
          top: "2px",
        }}
      />
    </div>
  );
};

const Select = ({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[] | { label: string; value: string }[];
}) => {
  const dark = useStore((s) => s.dark);
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        fontSize: "13px",
        fontWeight: 500,
        background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.04)",
        border: dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.1)",
        borderRadius: "8px",
        padding: "6px 28px 6px 12px",
        cursor: "pointer",
        color: dark ? "#fff" : "#1c1c1e",
        outline: "none",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${dark ? 'fff' : '1c1c1e'}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px top 50%",
        backgroundSize: "10px auto",
        transition: "all 0.2s ease",
        fontFamily: "var(--font-global, inherit)",
      }}
    >
      {options.map((opt) => {
        const label = typeof opt === "string" ? opt : opt.label;
        const val = typeof opt === "string" ? opt : opt.value;
        return (
          <option
            key={val}
            value={val}
            style={{
              background: dark ? "#2c2c2e" : "#fff",
              color: dark ? "#fff" : "#1c1c1e",
            }}
          >
            {label}
          </option>
        );
      })}
    </select>
  );
};

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  const dark = useStore((s) => s.dark);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ fontSize: "14px", fontWeight: 500, color: dark ? "#f5f5f7" : "#1c1c1e" }}>{label}</span>
      {children}
    </div>
  );
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => {
  const dark = useStore((s) => s.dark);
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        fontSize: "12px",
        fontWeight: 700,
        color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
        textTransform: "uppercase",
        letterSpacing: "1px",
        padding: "20px 20px 8px",
        fontFamily: "var(--font-global, inherit)",
      }}
    >
      {children}
    </motion.div>
  );
};

const Card = ({ children }: { children: React.ReactNode }) => {
  const dark = useStore((s) => s.dark);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
      style={{
        background: dark ? "linear-gradient(145deg, rgba(45,45,45,0.6), rgba(30,30,30,0.6))" : "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(250,250,250,0.9))",
        border: dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
        borderRadius: "16px",
        margin: "0 20px 16px",
        overflow: "hidden",
        boxShadow: dark ? "0 4px 15px rgba(0,0,0,0.2)" : "0 4px 15px rgba(0,0,0,0.05)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {children}
    </motion.div>
  );
};

// ─── Panel Components ─────────────────────────────────────────────────────────
const GeneralPanel = () => {
  const [lang, setLang] = useState("English");
  const dark = useStore((s) => s.dark);
  return (
    <div>
      <SectionTitle>Language & Region</SectionTitle>
      <Card>
        <Row label="Language">
          <Select
            value={lang}
            onChange={setLang}
            options={["English", "Hindi", "Spanish"]}
          />
        </Row>
        <Row label="Region">
          <span style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>India</span>
        </Row>
      </Card>
      <SectionTitle>Sharing</SectionTitle>
      <Card>
        <Row label="Computer Name">
          <span style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Aditya's MacBook Pro</span>
        </Row>
      </Card>
    </div>
  );
};

const AppearancePanel = () => {
  const dark = useStore((s) => s.dark);
  const {
    accentColor, setAccentColor,
    appearanceMode, setAppearanceMode,
    iconStyle, setIconStyle,
    tintWindows, setTintWindows,
    getWallpaper,
    dockMagnification, setDockMagnification,
    dockAutoHide, setDockAutoHide,
    darkMenubar, setDarkMenubar,
    showBatteryPercentage, setShowBatteryPercentage,
  } = useStore((s) => ({
    accentColor: s.accentColor,
    setAccentColor: s.setAccentColor,
    appearanceMode: s.appearanceMode,
    setAppearanceMode: s.setAppearanceMode,
    iconStyle: s.iconStyle,
    setIconStyle: s.setIconStyle,
    tintWindows: s.tintWindows,
    setTintWindows: s.setTintWindows,
    getWallpaper: s.getWallpaper,
    dockMagnification: s.dockMagnification,
    setDockMagnification: s.setDockMagnification,
    dockAutoHide: s.dockAutoHide,
    setDockAutoHide: s.setDockAutoHide,
    darkMenubar: s.darkMenubar,
    setDarkMenubar: s.setDarkMenubar,
    showBatteryPercentage: s.showBatteryPercentage,
    setShowBatteryPercentage: s.setShowBatteryPercentage,
  }));

  const wallpaper = getWallpaper();
  const colors = [
    { label: "Blue", value: "#0A84FF" },
    { label: "Purple", value: "#AF52DE" },
    { label: "Pink", value: "#FF375F" },
    { label: "Red", value: "#FF453A" },
    { label: "Orange", value: "#FF9F0A" },
    { label: "Yellow", value: "#FFD60A" },
    { label: "Green", value: "#32D74B" },
    { label: "Graphite", value: "#98989D" },
  ];

  const appearanceOptions: { label: string; value: "auto" | "light" | "dark"; preview: string }[] = [
    { label: "Auto", value: "auto", preview: "linear-gradient(135deg,#f5f5f7 0% 50%,#1c1c1e 50% 100%)" },
    { label: "Light", value: "light", preview: "linear-gradient(135deg,#f5f5f7,#e5e5ea)" },
    { label: "Dark", value: "dark", preview: "linear-gradient(135deg,#2c2c2e,#1c1c1e)" },
  ];

  const iconStyles: { label: string; value: "default" | "dark" | "clear" | "tinted"; preview: string }[] = [
    { label: "Default", value: "default", preview: "linear-gradient(135deg,#4a90ff,#0a63d8)" },
    { label: "Dark", value: "dark", preview: "linear-gradient(135deg,#3a3a3c,#1c1c1e)" },
    { label: "Clear", value: "clear", preview: "linear-gradient(135deg,rgba(255,255,255,0.5),rgba(200,200,210,0.35))" },
    { label: "Tinted", value: "tinted", preview: `linear-gradient(135deg,${accentColor},${accentColor}99)` },
  ];

  return (
    <div>
      <SectionTitle>Appearance</SectionTitle>
      <Card>
        <div style={{ padding: "12px 16px", display: "flex", gap: "12px" }}>
          {appearanceOptions.map((opt) => {
            const active = appearanceMode === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setAppearanceMode(opt.value)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "46px",
                    borderRadius: "8px",
                    backgroundImage: `url(${wallpaper.day})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    overflow: "hidden",
                    border: active ? `2px solid ${accentColor}` : dark ? "2px solid rgba(255,255,255,0.12)" : "2px solid rgba(0,0,0,0.1)",
                    boxShadow: "inset 0 0 0 100px transparent",
                  }}
                >
                  <div style={{ position: "absolute", inset: 0, background: opt.preview, opacity: 0.55 }} />
                  {/* miniature desktop preview: menubar + dock silhouette */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "9px", background: opt.value === "light" ? "rgba(255,255,255,0.7)" : opt.value === "dark" ? "rgba(0,0,0,0.55)" : "linear-gradient(90deg,rgba(255,255,255,0.7) 50%,rgba(0,0,0,0.55) 50%)" }} />
                  <div style={{ position: "absolute", bottom: "4px", left: "50%", transform: "translateX(-50%)", width: "44%", height: "7px", borderRadius: "4px", background: opt.value === "light" ? "rgba(0,0,0,0.28)" : opt.value === "dark" ? "rgba(255,255,255,0.4)" : "linear-gradient(90deg,rgba(0,0,0,0.28) 50%,rgba(255,255,255,0.4) 50%)" }} />
                </div>
                <span style={{ fontSize: "12px", fontWeight: active ? 600 : 400, color: dark ? "#f5f5f7" : "#1c1c1e" }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </Card>


      <SectionTitle>Theme</SectionTitle>
      <Card>
        <Row label="Color">
          <div style={{ display: "flex", gap: "7px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            {/* Multicolor swatch */}
            <button
              title="Multicolor"
              onClick={() => setAccentColor("#0A84FF")}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "conic-gradient(#FF3B30,#FF9500,#FFCC00,#34C759,#007AFF,#AF52DE,#FF2D55,#FF3B30)",
                border: "2px solid transparent",
                cursor: "pointer",
                padding: 0,
              }}
            />
            {colors.map((c) => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => setAccentColor(c.value)}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: c.value,
                  border:
                    accentColor === c.value
                      ? dark
                        ? "2px solid rgba(255,255,255,0.75)"
                        : "2px solid rgba(0,0,0,0.5)"
                      : "2px solid transparent",
                  cursor: "pointer",
                  outline: accentColor === c.value ? `1.5px solid ${c.value}` : "none",
                  outlineOffset: "1.5px",
                  padding: 0,
                  transition: "outline 0.15s ease",
                }}
              />
            ))}
          </div>
        </Row>
        <Row label="Text highlight color">
          <Select value="Automatic" onChange={() => {}} options={["Automatic", "Blue", "Purple", "Pink", "Red", "Orange", "Green"]} />
        </Row>
      </Card>

      <SectionTitle>Icon &amp; Widget Style</SectionTitle>
      <Card>
        <div style={{ padding: "12px 16px", display: "flex", gap: "10px" }}>
          {iconStyles.map((opt) => {
            const active = iconStyle === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setIconStyle(opt.value)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    background: opt.preview,
                    border: active ? `2px solid ${accentColor}` : dark ? "2px solid rgba(255,255,255,0.12)" : "2px solid rgba(0,0,0,0.1)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                  }}
                />
                <span style={{ fontSize: "11px", fontWeight: active ? 600 : 400, color: dark ? "#f5f5f7" : "#1c1c1e" }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
        <Row label="Folder color">
          <Select value="Automatic" onChange={() => {}} options={["Automatic", "Blue", "Graphite", "Green", "Orange"]} />
        </Row>
      </Card>

      <SectionTitle>Windows</SectionTitle>
      <Card>
        <Row label="Sidebar icon size">
          <Select value="Medium" onChange={() => {}} options={["Small", "Medium", "Large"]} />
        </Row>
        <Row label="Tint window background with wallpaper color">
          <Toggle checked={tintWindows} onChange={setTintWindows} />
        </Row>
      </Card>

      <SectionTitle>Dock &amp; Menubar</SectionTitle>
      <Card>
        <Row label="Magnification">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "52px", height: "26px", borderRadius: "8px", background: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: "3px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)" }} />
              <div style={{ width: dockMagnification ? "14px" : "8px", height: dockMagnification ? "14px" : "8px", borderRadius: "3px", background: accentColor, transition: "all 0.2s ease" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.35)" }} />
            </div>
            <Toggle checked={dockMagnification} onChange={setDockMagnification} />
          </div>
        </Row>
        <Row label="Automatically hide and show the Dock">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "52px", height: "26px", borderRadius: "8px", background: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: "6px", right: "6px", height: "6px", borderRadius: "3px", background: accentColor, bottom: dockAutoHide ? "-7px" : "4px", transition: "bottom 0.25s ease" }} />
            </div>
            <Toggle checked={dockAutoHide} onChange={setDockAutoHide} />
          </div>
        </Row>
        <Row label="Dark menubar always">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "52px", height: "26px", borderRadius: "8px", overflow: "hidden", border: dark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.1)" }}>
              <div style={{ height: "9px", background: darkMenubar ? "rgba(0,0,0,0.6)" : dark ? "rgba(30,30,32,0.6)" : "rgba(255,255,255,0.7)", transition: "background 0.2s ease" }} />
              <div style={{ height: "17px", background: dark ? "#1c1c1e" : "#f5f5f7" }} />
            </div>
            <Toggle checked={darkMenubar} onChange={setDarkMenubar} />
          </div>
        </Row>
        <Row label="Show battery percentage">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ minWidth: "52px", height: "26px", borderRadius: "8px", background: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", padding: "0 6px", fontSize: "10px", fontWeight: 600, color: dark ? "#f5f5f7" : "#1c1c1e" }}>
              {showBatteryPercentage && <span>82%</span>}
              <span style={{ width: "16px", height: "8px", borderRadius: "2px", border: "1px solid " + (dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"), position: "relative", display: "inline-block" }}>
                <span style={{ position: "absolute", top: "1px", left: "1px", bottom: "1px", width: "70%", borderRadius: "1px", background: "#32D74B" }} />
              </span>
            </div>
            <Toggle checked={showBatteryPercentage} onChange={setShowBatteryPercentage} />
          </div>
        </Row>
      </Card>
    </div>
  );
};

const WALLPAPER_TABS: { id: WallpaperCategory; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "gaming", label: "Gaming" },
  { id: "anime", label: "Anime" },
  { id: "editing", label: "Editing" },
];

const WallpaperPanel = () => {
  const { wallpaperSets, activeWallpaperSet, setActiveWallpaperSet, accentColor } = useStore((s) => ({
    wallpaperSets: s.wallpaperSets,
    activeWallpaperSet: s.activeWallpaperSet,
    setActiveWallpaperSet: s.setActiveWallpaperSet,
    accentColor: s.accentColor,
  }));
  const dark = useStore((s) => s.dark);
  const activeSet = wallpaperSets.find((w) => w.id === activeWallpaperSet) ?? wallpaperSets[0];
  const [tab, setTab] = useState<WallpaperCategory>(activeSet.category);
  const visible = wallpaperSets.filter((w) => w.category === tab);
  const nonEmptyTabs = WALLPAPER_TABS.filter((t) => wallpaperSets.some((w) => w.category === t.id));

  return (
    <div>
      <SectionTitle>Wallpaper</SectionTitle>
      <div style={{ display: "flex", gap: "6px", padding: "0 16px 12px" }}>
        {nonEmptyTabs.map((t) => {
          const Glyph = CATEGORY_GLYPHS[t.id];
          const selected = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "7px 4px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: selected ? 600 : 400,
                color: selected ? "#fff" : dark ? "#f5f5f7" : "#1c1c1e",
                background: selected ? accentColor : dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)",
                transition: "background 0.15s ease",
              }}
            >
              <Glyph size={15} />
              {t.label}
            </button>
          );
        })}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          padding: "0 16px",
        }}
      >
        {visible.map((set) => {
          const active = set.id === activeWallpaperSet;
          const Glyph = CATEGORY_GLYPHS[set.category];
          return (
            <motion.button
              key={set.id}
              onClick={() => setActiveWallpaperSet(set.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: "none",
                border: active ? `2.5px solid ${accentColor}` : "2.5px solid transparent",
                borderRadius: "12px",
                padding: "0",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
                transition: "border-color 0.2s ease",
              }}
            >
              <img
                src={set.thumbnail || (dark ? set.night : set.day)}
                alt={set.name}
                onError={(e) => {
                  const el = e.currentTarget;
                  if (!el.src.endsWith("fallback.jpg")) el.src = FALLBACK_WALLPAPER;
                }}
                style={{ width: "100%", height: "90px", objectFit: "cover", display: "block", borderRadius: "10px" }}
              />
              {set.category !== "default" && (
                <div
                  title={set.category}
                  style={{
                    position: "absolute",
                    bottom: "28px",
                    left: "6px",
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                  }}
                >
                  <Glyph size={12} />
                </div>
              )}
              {active && (
                <div
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: accentColor,
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    color: "#fff",
                  }}
                >
                  ✓
                </div>
              )}
              <div
                style={{
                  padding: "4px 8px",
                  fontSize: "11px",
                  color: active ? accentColor : dark ? "#f5f5f7" : "#1c1c1e",
                  fontWeight: active ? 600 : 400,
                  textAlign: "left",
                }}
              >
                {set.name}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

const DockPanel = () => {
  const {
    dockSize,
    dockMag,
    setDockSize,
    setDockMag,
    dockPosition,
    setDockPosition,
    dockAutoHide,
    setDockAutoHide,
  } = useStore((s) => ({
    dockSize: s.dockSize,
    dockMag: s.dockMag,
    setDockSize: s.setDockSize,
    setDockMag: s.setDockMag,
    dockPosition: s.dockPosition,
    setDockPosition: s.setDockPosition,
    dockAutoHide: s.dockAutoHide,
    setDockAutoHide: s.setDockAutoHide,
  }));

  const SliderRow = ({
    label,
    value,
    min,
    max,
    onChange,
    displayVal,
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (v: number) => void;
    displayVal?: string;
  }) => {
    const dark = useStore((s) => s.dark);
    return (
      <Row label={label}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ width: "120px", accentColor: "var(--accent-blue)" }}
          />
          <span style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", minWidth: "30px", textAlign: "right" }}>
            {displayVal ?? value}
          </span>
        </div>
      </Row>
    );
  };

  return (
    <div>
      <SectionTitle>Size & Magnification</SectionTitle>
      <Card>
        <SliderRow label="Size" value={dockSize} min={32} max={80} onChange={setDockSize} displayVal={`${dockSize}px`} />
        <SliderRow label="Magnification" value={dockMag} min={1} max={2.5} onChange={(v) => setDockMag(parseFloat(v.toFixed(1)))} displayVal={`${dockMag}×`} />
      </Card>

      <SectionTitle>Position & Behavior</SectionTitle>
      <Card>
        <Row label="Position on Screen">
          <Select
            value={dockPosition}
            onChange={(pos) => setDockPosition(pos as any)}
            options={[
              { label: "Bottom", value: "bottom" },
              { label: "Left", value: "left" },
              { label: "Right", value: "right" },
            ]}
          />
        </Row>
        <Row label="Automatically hide and show the Dock">
          <Toggle checked={dockAutoHide} onChange={setDockAutoHide} />
        </Row>
      </Card>
    </div>
  );
};

const NotificationsPanel = () => {
  const [showPreviews, setShowPreviews] = useState("When Unlocked");
  const [allowNotifications, setAllowNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState({
    Safari: true,
    FaceTime: true,
    Mail: false,
    Messages: true,
    Calendar: true,
    Music: false,
  });

  return (
    <div>
      <SectionTitle>Focus & Previews</SectionTitle>
      <Card>
        <Row label="Show Previews">
          <Select
            value={showPreviews}
            onChange={setShowPreviews}
            options={["Always", "When Unlocked", "Never"]}
          />
        </Row>
        <Row label="Allow Notifications">
          <Toggle checked={allowNotifications} onChange={setAllowNotifications} />
        </Row>
      </Card>

      <SectionTitle>App Notifications</SectionTitle>
      <Card>
        {Object.entries(appNotifications).map(([app, enabled]) => (
          <Row key={app} label={app}>
            <Toggle
              checked={enabled}
              onChange={(val) =>
                setAppNotifications((prev) => ({ ...prev, [app]: val }))
              }
            />
          </Row>
        ))}
      </Card>
    </div>
  );
};

const SoundPanel = () => {
  const { volume, setVolume } = useStore((s) => ({
    volume: s.volume,
    setVolume: s.setVolume,
  }));
  const { notificationSound, setNotificationSound } = useStore((s) => ({
    notificationSound: s.notificationSound,
    setNotificationSound: s.setNotificationSound,
  }));
  const [outputDevice, setOutputDevice] = useState("MacBook Pro Speakers");
  const [inputDevice, setInputDevice] = useState("MacBook Pro Microphone");
  const [playFeedback, setPlayFeedback] = useState(true);

  const alertSounds = [
    { label: "Samantha (Legacy)", value: "music/Samantha (Legacy)-2024_08_12-6.wav" },
    { label: "Default Intro", value: "music/into.wav" },
    { label: "iPhone Notification", value: "music/i_phone_notification.mp3" },
    { label: "Error Alert", value: "music/error.wav" },
    { label: "Siri Sound", value: "music/siri.mp3" },
    { label: "Aditya Intro", value: "music/adityaintro.wav" },
  ];

  const handleSoundChange = (val: string) => {
    setNotificationSound(val);
    const audio = new Audio(val);
    audio.volume = volume / 100;
    audio.play().catch(() => {});
  };

  const dark = useStore((s) => s.dark);

  return (
    <div>
      <SectionTitle>Sound Effects</SectionTitle>
      <Card>
        <Row label="Alert Sound">
          <Select
            value={notificationSound}
            onChange={handleSoundChange}
            options={alertSounds}
          />
        </Row>
        <Row label="Play sound on startup">
          <Toggle checked={playFeedback} onChange={setPlayFeedback} />
        </Row>
      </Card>

      <SectionTitle>Volume</SectionTitle>
      <Card>
        <Row label="Output Volume">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "flex-end" }}>
            <img src="/img/icons/sf-icons/audio.svg" alt="audio" style={{ width: "16px", height: "16px", filter: dark ? "invert(1)" : "none", opacity: 0.5 }} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ width: "120px", accentColor: "var(--accent-blue)" }}
            />
            <img src="/img/icons/sf-icons/sound.svg" alt="sound" style={{ width: "16px", height: "16px", filter: dark ? "invert(1)" : "none", opacity: 0.5 }} />
            <span style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", minWidth: "30px", textAlign: "right" }}>
              {volume}%
            </span>
          </div>
        </Row>
      </Card>

      <SectionTitle>Input & Output</SectionTitle>
      <Card>
        <Row label="Output Device">
          <Select
            value={outputDevice}
            onChange={setOutputDevice}
            options={[
              "MacBook Pro Speakers",
              "External Display Audio",
              "AirPods Pro"
            ]}
          />
        </Row>
        <Row label="Input Device">
          <Select
            value={inputDevice}
            onChange={setInputDevice}
            options={[
              "MacBook Pro Microphone",
              "External USB Microphone"
            ]}
          />
        </Row>
      </Card>
    </div>
  );
};

const DisplaysPanel = () => {
  const { brightness, setBrightness } = useStore((s) => ({
    brightness: s.brightness,
    setBrightness: s.setBrightness,
  }));
  const [resolution, setResolution] = useState("Default (2880 x 1800)");
  const [refreshRate, setRefreshRate] = useState("120Hz");
  const [trueTone, setTrueTone] = useState(true);

  const getWallpaper = useStore((s) => s.getWallpaper);
  const dark = useStore((s) => s.dark);
  const wallpaper = getWallpaper();
  const bgUrl = dark ? wallpaper.night : wallpaper.day;

  return (
    <div>
      {/* Mini Display Simulator */}
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 16px 16px" }}>
        <div
          style={{
            width: "180px",
            height: "112px",
            border: "6px solid #2c2c2e",
            borderRadius: "10px",
            position: "relative",
            background: `url(${bgUrl}) center/cover no-repeat`,
            filter: `brightness(${30 + (brightness * 0.7)}%)`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "8px",
            transition: "filter 0.1s ease",
          }}
        >
          {/* Dock preview */}
          <div
            style={{
              width: "80px",
              height: "8px",
              background: "rgba(255,255,255,0.4)",
              backdropFilter: "blur(4px)",
              borderRadius: "3px",
            }}
          />
          {/* Monitor stand */}
          <div
            style={{
              position: "absolute",
              bottom: "-16px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "24px",
              height: "10px",
              background: "#48484a",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "48px",
              height: "4px",
              background: "#3a3a3c",
              borderRadius: "2px 2px 0 0",
            }}
          />
        </div>
      </div>

      <SectionTitle>Brightness</SectionTitle>
      <Card>
        <Row label="Brightness">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "flex-end" }}>
            <img src="/img/icons/sf-icons/display-brightness.svg" alt="dim" style={{ width: "16px", height: "16px", filter: dark ? "invert(1)" : "none", opacity: 0.5 }} />
            <input
              type="range"
              min="10"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              style={{ width: "120px", accentColor: "var(--accent-blue)" }}
            />
            <img src="/img/icons/sf-icons/sun.svg" alt="sun" style={{ width: "16px", height: "16px", filter: dark ? "invert(1)" : "none", opacity: 0.5 }} />
            <span style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", minWidth: "30px", textAlign: "right" }}>
              {brightness}%
            </span>
          </div>
        </Row>
        <Row label="True Tone">
          <Toggle checked={trueTone} onChange={setTrueTone} />
        </Row>
      </Card>

      <SectionTitle>Resolution & Refresh Rate</SectionTitle>
      <Card>
        <Row label="Resolution">
          <Select
            value={resolution}
            onChange={setResolution}
            options={[
              "Default (2880 x 1800)",
              "Scaled (1920 x 1200)",
              "Scaled (2560 x 1600)",
              "More Space (3024 x 1964)",
            ]}
          />
        </Row>
        <Row label="Refresh Rate">
          <Select
            value={refreshRate}
            onChange={setRefreshRate}
            options={["60Hz", "120Hz (ProMotion)"]}
          />
        </Row>
      </Card>
    </div>
  );
};

const BatteryPanel = () => {
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [optimizedCharging, setOptimizedCharging] = useState(true);
  const batteryLevels = [98, 96, 94, 92, 90, 85, 80, 78, 75, 70, 68, 64, 60, 55, 92, 94];
  const dark = useStore((s) => s.dark);

  return (
    <div>
      {/* Battery Status Display */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 12px" }}>
        <div style={{ position: "relative", width: "80px", height: "40px", border: `3.5px solid ${dark ? "#fff" : "#1c1c1e"}`, borderRadius: "8px", display: "flex", alignItems: "center", padding: "2px" }}>
          <div
            style={{
              height: "100%",
              width: "94%",
              background: lowPowerMode ? "#FFCC00" : "#34C759",
              borderRadius: "4px",
              transition: "background-color 0.2s ease, width 0.3s ease",
            }}
          />
          {/* Battery nub */}
          <div
            style={{
              position: "absolute",
              right: "-8px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "5px",
              height: "12px",
              background: dark ? "#fff" : "#1c1c1e",
              borderRadius: "0 2px 2px 0",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "0",
              right: "0",
              textAlign: "center",
              fontSize: "12px",
              fontWeight: 700,
              color: dark ? "#000" : "#fff",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            94%
          </div>
        </div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: dark ? "#fff" : "#1c1c1e", marginTop: "12px" }}>
          Power Source: Battery
        </div>
        <div style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginTop: "2px" }}>
          Battery Health: 100% (Maximum Capacity)
        </div>
      </div>

      <SectionTitle>Battery Settings</SectionTitle>
      <Card>
        <Row label="Low Power Mode">
          <Toggle checked={lowPowerMode} onChange={setLowPowerMode} />
        </Row>
        <Row label="Optimized Battery Charging">
          <Toggle checked={optimizedCharging} onChange={setOptimizedCharging} />
        </Row>
      </Card>

      <SectionTitle>Battery level (Last 24 Hours)</SectionTitle>
      <Card>
        <div style={{ padding: "16px 16px 8px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              height: "80px",
              borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              paddingBottom: "4px",
            }}
          >
            {batteryLevels.map((level, i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: `${level * 0.7}px`,
                  background: lowPowerMode ? "#FFCC00" : level < 20 ? "#FF3B30" : "#34C759",
                  borderRadius: "2px",
                  transition: "background-color 0.2s ease, height 0.3s ease",
                }}
                title={`${level}%`}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
            <span style={{ fontSize: "9px", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>24h ago</span>
            <span style={{ fontSize: "9px", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>12h ago</span>
            <span style={{ fontSize: "9px", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>Now</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

const StoragePanel = () => {
  const dark = useStore((s) => s.dark);
  const totalSize = 512;
  const storageCategories = [
    { name: "System Data", size: 64, color: "#8E8E93" },
    { name: "Apps", size: 42, color: "#FF3B30" },
    { name: "Documents", size: 120, color: "#34C759" },
    { name: "Developer", size: 85, color: "#FF9500" },
    { name: "Free Space", size: 201, color: "rgba(0,0,0,0.08)" },
  ];

  return (
    <div>
      <div style={{ padding: "16px 16px 4px" }}>
        <div style={{ fontSize: "14px", fontWeight: 600, color: dark ? "#fff" : "#1c1c1e" }}>
          Macintosh HD
        </div>
        <div style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginTop: "2px" }}>
          311 GB used of 512 GB
        </div>
      </div>

      {/* Storage stacked bar */}
      <div
        style={{
          display: "flex",
          height: "20px",
          borderRadius: "10px",
          overflow: "hidden",
          margin: "12px 16px 20px",
          border: dark ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid rgba(0,0,0,0.08)",
          background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
        }}
      >
        {storageCategories.map((cat) => {
          const pct = (cat.size / totalSize) * 100;
          return (
            <div
              key={cat.name}
              style={{
                width: `${pct}%`,
                background: cat.name === "Free Space" && dark ? "rgba(255,255,255,0.12)" : cat.color,
                height: "100%",
                transition: "width 0.3s ease",
              }}
              title={`${cat.name}: ${cat.size} GB`}
            />
          );
        })}
      </div>

      <SectionTitle>Storage Categories</SectionTitle>
      <Card>
        {storageCategories.map((cat) => (
          <Row key={cat.name} label={cat.name}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: cat.name === "Free Space" && dark ? "#444" : cat.color,
                }}
              />
              <span style={{ fontSize: "12px", fontWeight: 500, color: dark ? "#fff" : "#1c1c1e" }}>
                {cat.size} GB
              </span>
            </div>
          </Row>
        ))}
      </Card>
    </div>
  );
};

const CloudPanel = () => {
  const dark = useStore((s) => s.dark);
  return (
    <div>
      <SectionTitle>Cloud Integrations</SectionTitle>
      <Card>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>
                <img src="/img/icons/sf-icons/cloud.svg" alt="Google Drive" style={{ width: "24px", height: "24px", filter: dark ? "invert(1)" : "none" }} />
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px", color: dark ? "#fff" : "#1c1c1e" }}>Google Drive</div>
                <div style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Not connected</div>
              </div>
            </div>
            <button style={{ background: "#007AFF", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", cursor: "pointer" }}>
              Connect
            </button>
          </div>
          <div style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", borderRadius: "8px", padding: "10px", fontSize: "11px", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)", textAlign: "center" }}>
            <span className="i-ph:lightning" style={{ fontSize: 11 }} /> Will be fully integrated in a future update
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>
                <img src="/img/icons/sf-icons/cloud.svg" alt="Dropbox" style={{ width: "24px", height: "24px", filter: dark ? "invert(1)" : "none" }} />
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px", color: dark ? "#fff" : "#1c1c1e" }}>Dropbox</div>
                <div style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Not connected</div>
              </div>
            </div>
            <button style={{ background: dark ? "rgba(255,255,255,0.08)" : "#f0f0f0", color: dark ? "rgba(255,255,255,0.3)" : "#888", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", cursor: "not-allowed" }}>
              Coming Soon
            </button>
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "24px" }}>
                <img src="/img/icons/sf-icons/cloud.svg" alt="OneDrive" style={{ width: "24px", height: "24px", filter: dark ? "invert(1)" : "none" }} />
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13px", color: dark ? "#fff" : "#1c1c1e" }}>OneDrive</div>
                <div style={{ fontSize: "11px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Not connected</div>
              </div>
            </div>
            <button style={{ background: dark ? "rgba(255,255,255,0.08)" : "#f0f0f0", color: dark ? "rgba(255,255,255,0.3)" : "#888", border: "none", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", cursor: "not-allowed" }}>
              Coming Soon
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const PrivacyPanel = () => {
  const [locationServices, setLocationServices] = useState(true);
  const [developerMode, setDeveloperMode] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);

  const permissions = [
    { name: "Camera", icon: "i-ph:camera", apps: ["FaceTime", "Safari"] },
    { name: "Microphone", icon: "i-ph:microphone", apps: ["FaceTime", "Safari", "Music"] },
    { name: "Location Services", icon: "i-ph:map-pin", apps: ["Safari", "Maps"] },
    { name: "Screen Recording", icon: "i-ph:record", apps: ["Terminal"] },
    { name: "Full Disk Access", icon: "/img/icons/sf-icons/folder.svg", apps: ["Terminal"] },
  ];

  const dark = useStore((s) => s.dark);

  return (
    <div>
      <SectionTitle>Security Settings</SectionTitle>
      <Card>
        <Row label="Location Services">
          <Toggle checked={locationServices} onChange={setLocationServices} />
        </Row>
        <Row label="Developer Mode">
          <Toggle checked={developerMode} onChange={setDeveloperMode} />
        </Row>
      </Card>

      <SectionTitle>App Permissions</SectionTitle>
      <Card>
        {permissions.map((p) => (
          <div key={p.name}>
            <div
              onClick={() => setSelectedPermission(selectedPermission === p.name ? null : p.name)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                cursor: "pointer",
                borderBottom: dark ? "0.5px solid rgba(255,255,255,0.1)" : "0.5px solid rgba(0,0,0,0.06)",
                background: selectedPermission === p.name ? (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)") : "transparent",
                transition: "background 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {p.icon.startsWith("i-ph:") ? <span className={p.icon} style={{ width: "18px", height: "18px" }} /> : <img src={p.icon} alt={p.name} style={{ width: "18px", height: "18px", filter: dark ? "invert(1)" : "none" }} />}
                <span style={{ fontSize: "13px", color: dark ? "#f5f5f7" : "#1c1c1e" }}>{p.name}</span>
              </div>
              <span style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                {p.apps.length} {p.apps.length === 1 ? "app" : "apps"} {selectedPermission === p.name ? "▲" : "▼"}
              </span>
            </div>
            {selectedPermission === p.name && (
              <div style={{ background: dark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.03)", padding: "4px 16px" }}>
                {p.apps.map((app) => (
                  <div key={app} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: dark ? "0.5px solid rgba(255,255,255,0.05)" : "0.5px solid rgba(0,0,0,0.04)" }}>
                    <span style={{ fontSize: "12px", color: dark ? "#f5f5f7" : "#1c1c1e", paddingLeft: "24px" }}>{app}</span>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
};

const AboutPanel = () => {
  const dark = useStore((s) => s.dark);
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 16px 16px", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, marginTop: "8px" }}>
          <span className="i-fa6-brands:apple" style={{ width: "72px", height: "72px" }} />
        </div>
        <div style={{ fontSize: "22px", fontWeight: 700, color: dark ? "#fff" : "#1c1c1e", marginTop: "8px" }}>macOS Tahoe</div>
        <div style={{ fontSize: "13px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Version 26.0 (Portfolio Edition)</div>
      </div>
      <Card>
        {[
          ["Chip", "Apple M4 Pro (simulated)"],
          ["Memory", "16 GB"],
          ["Storage", "Powered by Cloud"],
          ["macOS", "Tahoe 26.0"],
          ["Developer", "Aditya Salunkhe"],
          ["GitHub", "@aditya44-tech"],
        ].map(([key, val]) => (
          <Row key={key} label={key}>
            <span style={{ fontSize: "12px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{val}</span>
          </Row>
        ))}
      </Card>
    </div>
  );
};

const GenericPanel = ({ id }: { id: SettingsPanel }) => {
  const dark = useStore((s) => s.dark);
  return (
    <div style={{ padding: "24px", textAlign: "center", color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "14px",
            background: PANEL_ITEMS.find((p) => p.id === id)?.color || "#8E8E93",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#fff",
              WebkitMask: `url(${PANEL_ITEMS.find((p) => p.id === id)?.icon}) center/contain no-repeat`,
              mask: `url(${PANEL_ITEMS.find((p) => p.id === id)?.icon}) center/contain no-repeat`,
            }}
          />
        </div>
      </div>
      <div style={{ fontSize: "14px", fontWeight: 600, color: dark ? "#fff" : "#1c1c1e", marginBottom: "4px" }}>
        {PANEL_ITEMS.find((p) => p.id === id)?.label}
      </div>
      <div style={{ fontSize: "12px" }}>Settings coming soon</div>
    </div>
  );
};

// ─── Main System Settings ─────────────────────────────────────────────────────
export default function SystemSettings() {
  const [activePanel, setActivePanel] = useState<SettingsPanel>("appearance");
  const [search, setSearch] = useState("");
  const dark = useStore((s) => s.dark);
  const size = useWindowSize();
  const isMobile = size.winWidth < 768;
  const [mobileView, setMobileView] = useState<"list" | "panel">("list");

  const filtered = search.trim()
    ? PANEL_ITEMS.filter((p) =>
        p.label.toLowerCase().includes(search.toLowerCase())
      )
    : PANEL_ITEMS;

  const renderPanel = () => {
    switch (activePanel) {
      case "general": return <GeneralPanel />;
      case "appearance": return <AppearancePanel />;
      case "wallpaper": return <WallpaperPanel />;
      case "dock": return <DockPanel />;
      case "notifications": return <NotificationsPanel />;
      case "sound": return <SoundPanel />;
      case "displays": return <DisplaysPanel />;
      case "battery": return <BatteryPanel />;
      case "storage": return <StoragePanel />;
      case "cloud": return <CloudPanel />;
      case "privacy": return <PrivacyPanel />;
      case "about": return <AboutPanel />;
      default: return <GenericPanel id={activePanel} />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        flexDirection: isMobile ? "column" : "row",
        background: dark ? "rgba(20,20,22,0.85)" : "rgba(240,240,245,0.85)",
        color: dark ? "#f5f5f7" : "#1c1c1e",
        borderRadius: isMobile ? "0" : "0 0 16px 16px",
        overflow: "hidden",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        fontFamily: "var(--font-global, inherit)",
      }}
    >
      {/* ── Sidebar / List View ── */}
      {(!isMobile || mobileView === "list") && (
        <div
          style={{
            width: isMobile ? "100%" : "260px",
            flexShrink: 0,
            borderRight: isMobile ? "none" : (dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.06)"),
            background: isMobile ? (dark ? "#000" : "#f2f2f7") : (dark ? "rgba(30,30,32,0.6)" : "rgba(255,255,255,0.5)"),
            backdropFilter: isMobile ? "none" : "blur(30px)",
            WebkitBackdropFilter: isMobile ? "none" : "blur(30px)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            boxShadow: dark ? "inset -1px 0 0 rgba(0,0,0,0.3)" : "none",
          }}
        >
          {isMobile && (
            <div style={{ fontSize: "32px", fontWeight: 700, padding: "20px 16px 10px", color: dark ? "#fff" : "#000" }}>
              Settings
            </div>
          )}
          {/* Search */}
          <div style={{ padding: isMobile ? "0 16px 16px" : "10px 12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: isMobile ? (dark ? "#1c1c1e" : "#e3e3e8") : (dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"),
              borderRadius: isMobile ? "10px" : "8px",
              padding: isMobile ? "8px 12px" : "5px 10px",
            }}
          >
            <img src="/img/icons/sf-icons/search.svg" alt="search" style={{ width: "12px", height: "12px", filter: dark ? "invert(1)" : "none", opacity: 0.5 }} />
            <input
              placeholder="Search settings"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                fontSize: "12px",
                width: "100%",
                color: dark ? "#fff" : "#1c1c1e",
              }}
            />
          </div>
        </div>

        {/* Items */}
        <div style={{ flex: 1, paddingBottom: isMobile ? "20px" : "0" }}>
          {isMobile && !search.trim() && (
            <div
              style={{
                background: dark ? "#1c1c1e" : "#fff",
                borderRadius: "10px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                margin: "0 16px 20px",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "#d1d1d6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  overflow: "hidden"
                }}
              >
                <img src="/img/ui/avatar.jpg" alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: 400, color: dark ? "#fff" : "#000", letterSpacing: "-0.5px" }}>Aditya Salunkhe</div>
                <div style={{ fontSize: "13px", color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", marginTop: "2px" }}>Apple ID, iCloud, Media & App Store</div>
              </div>
            </div>
          )}

          {isMobile ? (
            search.trim() ? (
              <div style={{ margin: "0 16px", background: dark ? "#1c1c1e" : "#fff", borderRadius: "10px", overflow: "hidden" }}>
                {filtered.map((item, idx) => {
                  return (
                    <motion.button
                      key={item.id}
                      whileTap={{ backgroundColor: dark ? "#2c2c2e" : "#e5e5ea" }}
                      onClick={() => {
                        setActivePanel(item.id);
                        setMobileView("panel");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        padding: "0 0 0 16px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        position: "relative",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: item.color, borderRadius: "6px", marginRight: "14px" }}>
                        <div style={{ width: "18px", height: "18px", backgroundColor: "#fff", WebkitMask: `url(${item.icon}) center/contain no-repeat`, mask: `url(${item.icon}) center/contain no-repeat` }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "12px 16px 12px 0", borderBottom: idx !== filtered.length - 1 ? (dark ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid rgba(0,0,0,0.1)") : "none" }}>
                        <span style={{ fontSize: "16px", color: dark ? "#fff" : "#000" }}>{item.label}</span>
                        <img src="/img/icons/sf-icons/caret-right.svg" alt="chevron" style={{ width: "12px", height: "12px", opacity: 0.3, filter: dark ? "invert(1)" : "none", transform: "rotate(180deg)" }} />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              PANEL_GROUPS.map((group, gIdx) => {
                const groupItems = group.map(id => PANEL_ITEMS.find(p => p.id === id)).filter(Boolean) as PanelItem[];
                if (groupItems.length === 0) return null;
                return (
                  <div key={gIdx} style={{ margin: "0 16px 20px", background: dark ? "#1c1c1e" : "#fff", borderRadius: "10px", overflow: "hidden" }}>
                    {groupItems.map((item, idx) => {
                      return (
                        <motion.button
                          key={item.id}
                          whileTap={{ backgroundColor: dark ? "#2c2c2e" : "#e5e5ea" }}
                          onClick={() => {
                            setActivePanel(item.id);
                            setMobileView("panel");
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            padding: "0 0 0 16px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            position: "relative",
                            textAlign: "left",
                          }}
                        >
                          <div style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: item.color, borderRadius: "6px", marginRight: "14px" }}>
                            <div style={{ width: "18px", height: "18px", backgroundColor: "#fff", WebkitMask: `url(${item.icon}) center/contain no-repeat`, mask: `url(${item.icon}) center/contain no-repeat` }} />
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "12px 16px 12px 0", borderBottom: idx !== groupItems.length - 1 ? (dark ? "0.5px solid rgba(255,255,255,0.15)" : "0.5px solid rgba(0,0,0,0.1)") : "none" }}>
                            <span style={{ fontSize: "16px", color: dark ? "#fff" : "#000" }}>{item.label}</span>
                            <img src="/img/icons/sf-icons/caret-right.svg" alt="chevron" style={{ width: "12px", height: "12px", opacity: 0.3, filter: dark ? "invert(1)" : "none", transform: "rotate(180deg)" }} />
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                );
              })
            )
          ) : (
            filtered.map((item) => {
              const active = activePanel === item.id;
              return (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActivePanel(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "7px 12px",
                    background: active
                      ? dark ? "rgba(0,122,255,0.2)" : "rgba(0,122,255,0.12)"
                      : "transparent",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "8px",
                    margin: "1px 6px",
                    width: "calc(100% - 12px)",
                    transition: "background 0.15s ease",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background =
                        dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="settings-sidebar-indicator"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "18%",
                        bottom: "18%",
                        width: "2.5px",
                        borderRadius: "2px",
                        background: "#007AFF",
                      }}
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      background: item.color,
                      borderRadius: "6px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      border: dark ? "0.5px solid rgba(255,255,255,0.2)" : "0.5px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: "#fff",
                        WebkitMask: `url(${item.icon}) center/contain no-repeat`,
                        mask: `url(${item.icon}) center/contain no-repeat`,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "13px",
                      color: active ? "#007AFF" : dark ? "#f5f5f7" : "#1c1c1e",
                      fontWeight: active ? 600 : 400,
                      textAlign: "left",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </span>
                </motion.button>
              );
            })
          )}
        </div>
      </div>
      )}

      {/* ── Content ── */}
      {(!isMobile || mobileView === "panel") && (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", background: isMobile ? (dark ? "#000" : "#f2f2f7") : "transparent" }}>
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center", padding: "12px 16px", borderBottom: dark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" }}>
              <button
                onClick={() => setMobileView("list")}
                style={{
                  background: "none", border: "none", color: "var(--accent-primary, #007AFF)", fontSize: "16px", display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", padding: 0
                }}
              >
                <img src="/img/icons/sf-icons/caret-right.svg" alt="back" style={{ width: "12px", height: "12px", transform: "rotate(180deg)", filter: "invert(40%) sepia(100%) saturate(3000%) hue-rotate(200deg) brightness(100%) contrast(100%)" }} />
                Settings
              </button>
            </div>
          )}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ paddingBottom: "24px" }}
              >
                {/* Panel title */}
                {!isMobile && (
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: dark ? "#fff" : "#1c1c1e",
                      padding: "24px 20px 8px",
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {PANEL_ITEMS.find((p) => p.id === activePanel)?.label}
                  </div>
                )}
                {isMobile && (
                   <div style={{ fontSize: "28px", fontWeight: 700, padding: "20px 20px 8px", color: dark ? "#fff" : "#000", letterSpacing: "-0.5px" }}>
                     {PANEL_ITEMS.find((p) => p.id === activePanel)?.label}
                   </div>
                )}
                {renderPanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
