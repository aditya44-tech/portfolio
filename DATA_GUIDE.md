# Portfolio Data Extension Guide

All customizable content for Gaming, Anime, and Video Editing is centralized in `src/data/`. Follow the schemas below to add new entries.

---

## 1. Video Editing Reels (`src/data/reels.ts`)

Add a new object to `reelsData`:

```ts
{
  id: "reel-custom",
  title: "Your Project Title",
  category: "AMV" | "Motion Graphics" | "Text Animation" | "Color Grading",
  videoUrl: "https://.../video.mp4",        // Cloudinary, CDN, or local /img/...
  previewUrl: "https://.../preview.mp4",    // Optional short loop for hover preview
  thumbnail: "https://.../thumbnail.jpg",   // WebP/JPG thumbnail
  tools: ["After Effects", "Premiere Pro", "DaVinci Resolve", "Blender"],
  duration: "0:45",
  fps: 60,
  resolution: "4K UHD (3840x2160)",
  description: "Explanation of editing techniques, keyframing, and compositing.",
  // Optional for Color Grading category:
  colorGrading: {
    beforeImg: "https://.../log_before.jpg",
    afterImg: "https://.../graded_after.jpg",
    labelBefore: "RAW Flat S-Log3",
    labelAfter: "Graded Kodak 2383",
    lutName: "Cinematic_Contrast.cube",
    description: "Node tree workflow in DaVinci Resolve."
  }
}
```

---

## 2. Game Library (`src/data/games.ts`)

Add a new game to `gamesData`:

```ts
{
  id: "game-id",
  title: "Game Title",
  studio: "Developer Studio",
  publisher: "Publisher",
  releaseYear: 2024,
  genre: "Action RPG / Soulsborne",
  playtimeHours: 120,
  userRating: 9.8,                         // Out of 10
  status: "Completed" | "Mastered (100%)" | "Currently Playing" | "All Bosses",
  banner: "https://.../banner_16x9.jpg",
  cover: "https://.../cover_portrait.jpg",
  summary: "Brief synopsis and design highlights.",
  favoriteBoss: "Boss Name",
  favoriteBuild: "Weapon / Stats / Spell combination",
  favoriteMoment: "Standout combat or story memory",
  personalNotes: "Reflections on game feel, soundtrack, and mechanics.",
  tags: ["Souls-like", "Challenging", "Atmospheric"],
  achievements: [
    {
      id: "ach-custom",
      title: "Achievement Title",
      game: "Game Title",
      description: "How it was unlocked",
      dateUnlocked: "Month Year",
      icon: "🏆",
      rarity: "1.2% Ultra Rare",
      isRealLife: false                     // Set to true for engineering/hackathon wins!
    }
  ],
  screenshots: ["https://.../shot1.jpg"]
}
```

---

## 3. Anime Shelf (`src/data/anime.ts`)

Add a new anime entry to `animeData`:

```ts
{
  id: "anime-id",
  title: "Anime Title",
  japaneseTitle: "Japanese Kanji Title",
  score: 9.8,                              // Out of 10
  episodes: "24 Episodes",
  status: "Completed" | "Currently Watching" | "Plan to Watch",
  currentProgress: "Ep 12 / 24",           // Displayed in Notification Center widget
  studio: "Studio Name",
  genres: ["Action", "Dark Fantasy", "Supernatural"],
  year: 2024,
  coverImage: "https://.../portrait.jpg",
  bannerImage: "https://.../landscape.jpg",
  favoriteCharacter: "Character Name",
  favoriteCharacterRole: "Role or title",
  favoriteFightOrEpisode: "Episode number or fight name",
  whyILoveIt: "Why this anime is special to you.",
  memorableQuote: "Iconic quote from character or author.",
  featured: false
}
```

To add a new Bleach Zanpakuto entry, append to `bleachZanpakutoList`:

```ts
{
  name: "Zanpakuto Name (Kanji)",
  wielder: "Soul Reaper Name",
  division: "Squad Number",
  shikai: "Shikai form description",
  releaseCommand: "Release command (e.g. Roar, Scatter, Pierce)",
  bankai: "Bankai Name (Kanji)",
  bankaiAbility: "Detailed Bankai mechanics and visual presentation",
  quote: "Memorable character quote"
}
```
