export type ReelCategory = "All" | "AMV" | "Motion Graphics" | "Text Animation" | "Color Grading";

export interface ColorGradingComparison {
  beforeImg: string;
  afterImg: string;
  labelBefore?: string;
  labelAfter?: string;
  lutName: string;
  description: string;
}

export interface ReelItem {
  id: string;
  title: string;
  category: "AMV" | "Motion Graphics" | "Text Animation" | "Color Grading";
  videoUrl: string;
  previewUrl?: string;
  thumbnail: string;
  tools: string[]; // e.g. ["After Effects", "Premiere Pro", "DaVinci Resolve", "Blender"]
  duration: string;
  fps: number;
  resolution: string;
  description: string;
  aspectRatio?: string;
  colorGrading?: ColorGradingComparison;
}

export const REEL_TOOLS = [
  { name: "After Effects", color: "#9999FF", bg: "rgba(153, 153, 255, 0.15)", icon: "Ae" },
  { name: "Premiere Pro", color: "#EA77FF", bg: "rgba(234, 119, 255, 0.15)", icon: "Pr" },
  { name: "DaVinci Resolve", color: "#FF5E5E", bg: "rgba(255, 94, 94, 0.15)", icon: "Dv" },
  { name: "Blender", color: "#F5792A", bg: "rgba(245, 121, 42, 0.15)", icon: "Bl" },
  { name: "Cinema 4D", color: "#0066FF", bg: "rgba(0, 102, 255, 0.15)", icon: "C4D" },
] as const;

export const reelsData: ReelItem[] = [
  {
    id: "reel-1",
    title: "BLEACH: Thousand-Year Blood War — Bankai Unleashed",
    category: "AMV",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    tools: ["After Effects", "Premiere Pro", "DaVinci Resolve"],
    duration: "0:48",
    fps: 60,
    resolution: "4K UHD (3840x2160)",
    description: "High-octane synchronization AMV featuring Ichigo & Kenpachi's spiritual pressure release. Velocity time-remapping, custom impact frames, 3D camera shakes, and optical flares matching the beat drops.",
  },
  {
    id: "reel-2",
    title: "Cyberpunk Tech Hud & Kinetic UI Reveal",
    category: "Motion Graphics",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    tools: ["After Effects", "Cinema 4D"],
    duration: "0:32",
    fps: 60,
    resolution: "2560x1440 60fps",
    description: "Futuristic FUI telemetry interface designed for an AI agent control center. Uses shape layers, expression-driven oscilloscope meters, glowing chromatic aberration, and particle dust.",
  },
  {
    id: "reel-3",
    title: "Cinematic Film Emulation — 35mm Kodak 2383 LUT",
    category: "Color Grading",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    tools: ["DaVinci Resolve", "Premiere Pro"],
    duration: "1:15",
    fps: 24,
    resolution: "DCI 4K (4096x2160)",
    description: "Color transformation from flat S-Log3 / LOG to a rich cinematic palette. Split toning with deep teal shadows, warm amber skin tones, halation glow around highlights, and authentic 35mm film grain.",
    colorGrading: {
      beforeImg: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=70", // desaturated / flat log look
      afterImg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80", // rich cinematic look
      labelBefore: "RAW Flat S-Log3",
      labelAfter: "Graded Kodak 2383",
      lutName: "Aditya_Film_Contrast_V3.cube",
      description: "Custom node tree in DaVinci Resolve: Color Space Transform -> Exposure Balance -> Parallel Hue Sat curves -> Film Print Emulation -> Highlight Roll-off.",
    },
  },
  {
    id: "reel-4",
    title: "Dynamic Kinetic Typography — Agentic AI Manifesto",
    category: "Text Animation",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    tools: ["After Effects"],
    duration: "0:25",
    fps: 60,
    resolution: "1080x1920 (9:16 Vertical Reel)",
    description: "Punchy, fast-paced kinetic typography with fluid inertia curves, glitch displacement maps, sound design hits, and zero-bounce ease. Perfect for social media storytelling.",
  },
  {
    id: "reel-5",
    title: "Elden Ring: Lands Between — Moody Dark Fantasy Grade",
    category: "Color Grading",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    tools: ["DaVinci Resolve"],
    duration: "0:52",
    fps: 30,
    resolution: "4K UHD",
    description: "Dark Souls / Elden Ring atmosphere enhancement. Deepened blacks, golden hour rim lights, mystical blue fog separation, and volumetric beam emphasizing divine ruins.",
    colorGrading: {
      beforeImg: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=70",
      afterImg: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      labelBefore: "Rec.709 Neutral",
      labelAfter: "Dark Fantasy Ember Grade",
      lutName: "Souls_Ember_Atmosphere.cube",
      description: "Lowered midtone luminance, pushed warm orange into highlight zones, and crushed near-blacks with a soft rolloff for a gritty grimdark aesthetic.",
    },
  },
  {
    id: "reel-6",
    title: "Jujutsu Kaisen: Shibuya Incident — Ryomen Sukuna Tribute",
    category: "AMV",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    previewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    tools: ["After Effects", "Premiere Pro"],
    duration: "1:02",
    fps: 60,
    resolution: "1440p 60fps",
    description: "Heavy bass synchronization cut showcasing Malevolent Shrine domain expansion. Features 3D tracking, custom typography title cards, blood-red tint transitions, and bass-shaking audio hits.",
  }
];
