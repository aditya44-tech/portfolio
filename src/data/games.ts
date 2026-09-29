export interface GameAchievement {
  id: string;
  title: string;
  game: string;
  description: string;
  dateUnlocked: string;
  icon: string; // emoji or icon name
  rarity: string; // e.g. "0.4% Ultra Rare"
  isRealLife?: boolean;
}

export interface GameItem {
  id: string;
  title: string;
  studio: string;
  publisher: string;
  releaseYear: number;
  genre: string;
  playtimeHours: number;
  userRating: number; // out of 10
  status: "Completed" | "Mastered (100%)" | "Currently Playing" | "All Bosses";
  banner: string;
  cover: string;
  summary: string;
  favoriteBoss: string;
  favoriteBuild: string;
  favoriteMoment: string;
  personalNotes: string;
  tags: string[];
  achievements: GameAchievement[];
  screenshots: string[];
}

export const gamesData: GameItem[] = [
  {
    id: "elden-ring",
    title: "Elden Ring: Shadow of the Erdtree",
    studio: "FromSoftware",
    publisher: "Bandai Namco",
    releaseYear: 2022,
    genre: "Action RPG / Soulsborne",
    playtimeHours: 265,
    userRating: 10,
    status: "Mastered (100%)",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    summary: "The pinnacle of open-world design and dark fantasy environmental storytelling. A masterclass in player freedom, atmosphere, and punishing boss fights.",
    favoriteBoss: "Malenia, Blade of Miquella & Starscourge Radahn",
    favoriteBuild: "Dexterity / Arcane with Bloodhound's Step Nagakiba & Occult Uchigatana",
    favoriteMoment: "Riding Torrent down into the Siofra River well for the very first time and seeing an entire starry cosmos beneath the earth.",
    personalNotes: "Beaten multiple NG+ cycles. Defeated Malenia solo without summons using pure roll discipline. The Shadow of the Erdtree expansion doubled down on the majestic art direction.",
    tags: ["Souls-like", "Masterpiece", "Dark Fantasy", "Open World", "Difficult"],
    achievements: [
      {
        id: "ach-1",
        title: "Elden Lord Unalloyed",
        game: "Elden Ring",
        description: "Achieved the Age of Stars ending and felled all 165 bosses in the Lands Between.",
        dateUnlocked: "March 2022",
        icon: "👑",
        rarity: "8.2% Rare",
      },
      {
        id: "ach-2",
        title: "Blade of the Haligtree Vanquished",
        game: "Elden Ring",
        description: "Defeated Malenia, Blade of Miquella solo with zero spirit ashes.",
        dateUnlocked: "April 2022",
        icon: "🌸",
        rarity: "3.1% Ultra Rare",
      },
      {
        id: "ach-real-1",
        title: "Polygon Open DeFi Hackathon — 2nd Prize Winner",
        game: "Real World Odyssey",
        description: "Engineered a high-performance decentralized finance protocol on Polygon network. Evaluated by core Web3 architects.",
        dateUnlocked: "Dec 2022",
        icon: "🏆",
        rarity: "Top 1% Global",
        isRealLife: true,
      },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "sekiro",
    title: "Sekiro: Shadows Die Twice",
    studio: "FromSoftware",
    publisher: "Activision",
    releaseYear: 2019,
    genre: "Action Adventure / Combat Perfection",
    playtimeHours: 110,
    userRating: 9.9,
    status: "Mastered (100%)",
    banner: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    summary: "The single best melee rhythm and parry combat system ever put into code. Unforgiving, cinematic, and profoundly satisfying when mastered.",
    favoriteBoss: "Sword Saint Isshin & Owl (Father) at Hirata Estate",
    favoriteBuild: "Kusabimaru Deflect + Mikiri Counter + Loaded Umbrella + Mortal Draw",
    favoriteMoment: "The sword clashing rhythm against Genichiro atop Ashina Castle when the posture bar finally shatters with a cinematic deathblow.",
    personalNotes: "'Hesitation is defeat.' This game trains muscle memory like no other. Completed the Mortal Journey gauntlet of strength without dying.",
    tags: ["Shinobi", "Parry Rhythm", "Sengoku Japan", "Challenging", "GotY 2019"],
    achievements: [
      {
        id: "ach-3",
        title: "Hesitation is Defeat",
        game: "Sekiro",
        description: "Defeated Sword Saint Isshin in all three phases with flawless deflection cadence.",
        dateUnlocked: "Nov 2021",
        icon: "⚔️",
        rarity: "4.7% Ultra Rare",
      },
      {
        id: "ach-real-2",
        title: "MetaKeep Founding Engineer — 1M+ Wallet TXNs",
        game: "Real World Odyssey",
        description: "Pioneered hardware-backed Web3 wallet security and scalable cloud-native infrastructure for production developers.",
        dateUnlocked: "2023",
        icon: "🛡️",
        rarity: "Founding Tier",
        isRealLife: true,
      },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "dark-souls-3",
    title: "Dark Souls III: The Ringed City",
    studio: "FromSoftware",
    publisher: "Bandai Namco",
    releaseYear: 2016,
    genre: "Action RPG",
    playtimeHours: 190,
    userRating: 9.8,
    status: "Completed",
    banner: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80",
    summary: "The grand poetic finale to the Dark Souls trilogy. Bleak ash-filled landscapes, melancholic orchestral scores, and legendary endgame encounters.",
    favoriteBoss: "Slave Knight Gael & Sister Friede (Phase 3 Blackflame)",
    favoriteBuild: "Quality 40/40 Refined Claymore & Grass Crest Shield",
    favoriteMoment: "Fighting Slave Knight Gael at the very end of time across a desert of ash while lightning strikes the ruins of civilization.",
    personalNotes: "Gael remains one of the greatest boss designs in videogame history. Perfectly tuned camera tracking and soundtrack crescendos.",
    tags: ["Grimdark", "Souls", "Atmospheric", "Great Soundtrack"],
    achievements: [
      {
        id: "ach-4",
        title: "The End of Fire",
        game: "Dark Souls III",
        description: "Witnessed the final embers fade peacefully with the Fire Keeper into quiet night.",
        dateUnlocked: "Jan 2020",
        icon: "🔥",
        rarity: "11.5% Rare",
      },
      {
        id: "ach-real-3",
        title: "Master's in Data Science & PG Diploma",
        game: "Real World Odyssey",
        description: "Completed advanced degrees specializing in scalable data engineering, ML architectures, and statistical inference.",
        dateUnlocked: "2024",
        icon: "🎓",
        rarity: "High Honors",
        isRealLife: true,
      },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "bloodborne",
    title: "Bloodborne: The Old Hunters",
    studio: "FromSoftware",
    publisher: "Sony Interactive Entertainment",
    releaseYear: 2015,
    genre: "Gothic Cosmic Horror / Action RPG",
    playtimeHours: 140,
    userRating: 9.9,
    status: "Completed",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    summary: "Victorian Gothic architecture descending into Lovecraftian eldritch madness. Fast, aggressive rally mechanics and trick weapons.",
    favoriteBoss: "Lady Maria of the Astral Clocktower & Ludwig the Holy Blade",
    favoriteBuild: "Skill / Bloodtinge with Threaded Cane & Evelyn Pistol",
    favoriteMoment: "Ludwig regaining his humanity upon looking at the Holy Moonlight Sword in mid-fight as the waltz explodes in the orchestra.",
    personalNotes: "'A corpse... should be left well alone.' Unrivaled atmosphere, creature design, and audio reverberation.",
    tags: ["Cosmic Horror", "Gothic", "Fast Combat", "Lovecraft"],
    achievements: [
      {
        id: "ach-5",
        title: "Childhood's Beginning",
        game: "Bloodborne",
        description: "Consumed three Third Umbilical Cords and transcended the Hunt into an Infant Great One.",
        dateUnlocked: "Feb 2021",
        icon: "🌕",
        rarity: "6.8% Rare",
      },
      {
        id: "ach-real-4",
        title: "Autonomous Agentic RAG Platform",
        game: "Real World Odyssey",
        description: "Architected multi-agent LLM systems with tool calling, Bedrock integration, and sub-second knowledge retrieval.",
        dateUnlocked: "2025",
        icon: "⚡",
        rarity: "Production Tier",
        isRealLife: true,
      },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077: Phantom Liberty",
    studio: "CD PROJEKT RED",
    publisher: "CD PROJEKT",
    releaseYear: 2023,
    genre: "Sci-Fi Cyberpunk RPG",
    playtimeHours: 125,
    userRating: 9.6,
    status: "Completed",
    banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
    summary: "Night City is the most densely realized futuristic urban metropolis ever rendered in real-time ray-traced glory. Phantom Liberty's spy-thriller storyline is top tier.",
    favoriteBoss: "Chimera Tank & Kurt Hansen",
    favoriteBuild: "Militech 'Falcon' Sandevistan + Byakko Katana Shinobi + Dash Deflect",
    favoriteMoment: "The blackwall AI sequence deep beneath Dogtown with Songbird and the pulse-pounding train escape.",
    personalNotes: "With Update 2.0 and Path Tracing, Night City feels living and breathing. The emotional writing for Solomon Reed and Songbird hits hard.",
    tags: ["Cyberpunk", "Ray Tracing", "Open World", "Story Rich", "Sci-Fi"],
    achievements: [
      {
        id: "ach-6",
        title: "The Star / King of Wands",
        game: "Cyberpunk 2077",
        description: "Sent Songbird beyond the stars to the Moon and tasted freedom in the Badlands with the Aldecaldos.",
        dateUnlocked: "Oct 2023",
        icon: "🚀",
        rarity: "9.1% Rare",
      },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80",
    ],
  },
  {
    id: "black-myth-wukong",
    title: "Black Myth: Wukong",
    studio: "Game Science",
    publisher: "Game Science",
    releaseYear: 2024,
    genre: "Action RPG / Mythological",
    playtimeHours: 85,
    userRating: 9.4,
    status: "Completed",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80",
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80",
    summary: "Journey to the West reimagined with jaw-dropping Unreal Engine 5 Nanite visuals, kinetic staff combat forms, and rich Chinese mythological folklore.",
    favoriteBoss: "Erlang Shen (Sacred Divinity) & The Great Sage's Broken Shell",
    favoriteBuild: "Smash Stance Staff Mastery + Cloud Step Invisibility + Immobilize Spells",
    favoriteMoment: "The four Heavenly Kings colossal clash and the transcendent Erlang Shen duel in the clouds.",
    personalNotes: "The sheer density of unique boss encounter mechanics in Chapters 3 through 6 is staggering. Truly an incredible debut.",
    tags: ["Mythology", "UE5", "Action RPG", "Fluid Combat"],
    achievements: [
      {
        id: "ach-7",
        title: "Destined One Ascended",
        game: "Black Myth: Wukong",
        description: "Reclaimed all six Relics of Sun Wukong and conquered Erlang the Sacred Divinity.",
        dateUnlocked: "Sept 2024",
        icon: "🐒",
        rarity: "5.4% Rare",
      },
    ],
    screenshots: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    ],
  }
];

export const allAchievements: GameAchievement[] = gamesData.flatMap((g) => g.achievements);
