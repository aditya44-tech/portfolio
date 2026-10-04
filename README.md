# macos portfolio

**Repo:** [aditya44-tech/portfolio](https://github.com/aditya44-tech/portfolio)

## Features

### Desktop OS shell

- **Windowing system** — drag, resize, minimize, maximize, fullscreen, with traffic-light controls and launch-from-dock animations
- **Menu bar** — transparent Tahoe bar with Apple menu, Control Center, Wi-Fi, battery, Spotlight and clock
- **Dock** — icon magnification, bounce on launch, open indicators, separators, auto-hide, repositionable
- **Spotlight & Launchpad** — fuzzy app search and a full app grid
- **Notification Center, Dynamic Island, widgets** — calendar and weather on the desktop
- **Boot & login screens** — full start-to-desktop flow with brightness/volume persistence

### Apps (20+)

| App | Highlights |
|---|---|
| **Steam (Game Library)** | Game showcase with screenshots, post-game summaries and **real Steam achievement data + icons** |
| **Spotify** | 100-track library, playlists, 30s previews, live embeds |
| **Crunchyroll (Anime Shelf)** | Anime tracking shelf |
| **After Effects (Reels)** | Editing / motion-graphics showcase with transport controls |
| **System Settings** | Appearance (mode, accents, themes), categorized wallpapers, dock & menubar prefs — all functional and persisted |
| **Terminal** | Custom commands, themed prompt |
| **VS Code** | Code viewer with this repo's README |
| **Bear** | Profile notes + full project write-ups |
| **Safari, Finder, Mail, Messages, Maps, YouTube** | Faithful recreations with working navigation and content |

### Themes & personalization

- Three atmospheres — **Default Tahoe**, **Souls (Ember)**, **Soul Reaper** — each with signature wallpaper, accent and optional katana cursor
- **Wallpaper picker** — Default / Gaming / Anime categories, real thumbnails, day-night pairs, 250 ms cross-fade on switch
- **8 macOS accent colors** — live-update buttons, selections and traffic-light hover glow across every window
- Everything persists to `localStorage` — wallpaper, theme, accent, dock prefs, brightness, volume

&nbsp;

## Tech Stack

[React](https://reactjs.org/) · [Zustand](https://zustand-demo.pmnd.rs/) · [UnoCSS](https://uno.antfu.me/) · [TypeScript](https://www.typescriptlang.org/) · [Vite](https://vitejs.dev/) · [Framer Motion](https://motion.dev/)

&nbsp;

## Usage

```bash
npm install
npm run dev      # dev server with hot reloading → http://localhost:3000
npm run build    # production build → dist/
```

&nbsp;

## Project Structure

```
public/
  wallpapers/        # full-res (full/) + picker thumbnails (thumbs/)
  markdown/projects/ # Bear project write-ups
  music/             # notification sounds, intro
src/
  components/apps/   # one component per desktop app
  components/dock/   # dock + magnification
  components/menus/  # menubar, battery, wifi, control center
  configs/           # apps, bear notes, launchpad, websites
  data/              # games, anime, reels, spotify, wallpapers
  stores/            # zustand slices (settings, dock, windows, ...)
```

&nbsp;

## Credits

- [macOS Tahoe 26](https://www.apple.com/newsroom/2025/06/macos-tahoe-26-makes-the-mac-more-capable-productive-and-intelligent-than-ever/)
- [iOS 26](https://support.apple.com/en-us/123075)
- Game achievements data & icons: [Steam Community](https://steamcommunity.com/)
- Original SVG wallpapers & icons by Aditya Salunkhe
