export interface ZanpakutoInfo {
  name: string;
  wielder: string;
  division: string;
  shikai: string;
  releaseCommand: string;
  bankai: string;
  bankaiAbility: string;
  quote: string;
}

export interface AnimeItem {
  id: string;
  title: string;
  japaneseTitle?: string;
  score: number; // e.g. 9.9
  episodes: string;
  status: "Completed" | "Currently Watching" | "Plan to Watch";
  currentProgress?: string; // e.g. "Ep 18 / 26"
  nextAirDate?: string;
  studio: string;
  genres: string[];
  year: number;
  coverImage: string;
  bannerImage: string;
  favoriteCharacter: string;
  favoriteCharacterRole: string;
  favoriteFightOrEpisode: string;
  whyILoveIt: string;
  memorableQuote: string;
  featured?: boolean;
}

export const bleachZanpakutoList: ZanpakutoInfo[] = [
  {
    name: "Zangetsu (斬月)",
    wielder: "Ichigo Kurosaki",
    division: "Substitute Soul Reaper",
    shikai: "Dual Blades (Quincy blade & Hollow blade)",
    releaseCommand: "Always released / Inward spiritual resolve",
    bankai: "Tensa Zangetsu (天鎖斬月)",
    bankaiAbility: "Condenses colossal spiritual pressure into a pitch-black blade for godspeed velocity and devastating Getsuga Jujisho / Gran Rey Cero cross-slashes.",
    quote: "If fate is a millstone, then we are the grist. There is nothing we can do. So wish for strength. If you cannot tear apart the wheel, take the sword and shatter it.",
  },
  {
    name: "Nozarashi (野晒)",
    wielder: "Kenpachi Zaraki",
    division: "Squad 11 Captain",
    shikai: "Giant War Cleaver that slices through space, meteors, and reality itself",
    releaseCommand: "Drink (呑め, Nome)",
    bankai: "Nameless Crimson Ogre Bankai",
    bankaiAbility: "Transforms Kenpachi into a crimson berserker demon of pure unbridled physical calamity capable of biting through Valkyrie shields.",
    quote: "Sanity? What reason would I have for something as useless as that? Out on the battlefield, the only thing that matters is who cuts whom down.",
  },
  {
    name: "Senbonzakura (千本桜)",
    wielder: "Byakuya Kuchiki",
    division: "Squad 6 Captain",
    shikai: "One thousand floating blade petals reflecting light like cherry blossoms",
    releaseCommand: "Scatter (散れ, Chire)",
    bankai: "Senbonzakura Kageyoshi (千本桜景厳) — Shukei Hakuteiken",
    bankaiAbility: "Countless colossal blades erupt from the earth, dissolving into millions of deadly razor petals commanded at the speed of thought, culminating in the Pure White Emperor Wings.",
    quote: "We must not shed tears. That is a surrender of the body to the heart. It is nothing more than proof that we are beings that do not know what to do with our hearts.",
  },
  {
    name: "Ryujin Jakka (流刃若火)",
    wielder: "Genryusai Shigekuni Yamamoto",
    division: "Captain-Commander",
    shikai: "The oldest and supreme fire Zanpakuto turning the heavens into an inferno",
    releaseCommand: "All things in the universe, turn to ashes (万象一切灰燼と為せ)",
    bankai: "Zanka no Tachi (残火の太刀) — East, West, South, North",
    bankaiAbility: "15 million degrees sun armor (Zanka no Tachi Nishi) that incinerates moisture from the entire Soul Society, resurrecting the charred dead (Minami) and cutting matter out of existence (Higashi).",
    quote: "Why have I served as Captain-Commander of the Gotei 13 for a thousand years? Because throughout those thousand years, no Soul Reaper stronger than myself has ever been born.",
  },
  {
    name: "Benihime (紅姫)",
    wielder: "Kisuke Urahara",
    division: "Former Squad 12 Captain / Founder of Research & Development",
    shikai: "Crimson Princess blood ribbons and razor energy blasts",
    releaseCommand: "Awaken (起きろ, Okiro) / Sing (啼け, Nake)",
    bankai: "Kannonbiraki Benihime Aratame (観音開紅姫改メ)",
    bankaiAbility: "Manifests a colossal benevolent mannequin goddess that physically restructures, stitches together, and dissects everything within its spiritual domain.",
    quote: "There is nothing in this world that is truly 'perfect'. That is why humans find perfection so alluring, and why they pursue it with such relentless madness.",
  },
];

export const animeData: AnimeItem[] = [
  {
    id: "bleach-tybw",
    title: "BLEACH: Thousand-Year Blood War",
    japaneseTitle: "BLEACH 千年血戦篇",
    score: 9.9,
    episodes: "Part 1-3 (In Progress)",
    status: "Currently Watching",
    currentProgress: "Part 3: The Conflict (Weekly)",
    nextAirDate: "Saturday 23:00 JST",
    studio: "Pierrot Films",
    genres: ["Supernatural", "Shonen", "Action", "Dark Fantasy"],
    year: 2022,
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80",
    favoriteCharacter: "Kenpachi Zaraki & Ichigo Kurosaki",
    favoriteCharacterRole: "Squad 11 Captain of the Gotei 13",
    favoriteFightOrEpisode: "Episode 6: 'The Fire' (Yamamoto Bankai) & Ep 10: 'The Battle' (Unohana vs Zaraki)",
    whyILoveIt: "Tite Kubo's high-fashion character aesthetics matched with Pierrot Films' movie-budget cinema compositing and Shiro Sagisu's legendary choir scores. The Quincy conflict delivers peak hype, unhinged Bankai reveals, and deep spiritual lore.",
    memorableQuote: "'If you hold the sword, you cannot embrace the one you love. If you let go of the sword, you cannot protect them.' — Tite Kubo",
    featured: true,
  },
  {
    id: "attack-on-titan",
    title: "Attack on Titan: The Final Season",
    japaneseTitle: "進撃の巨人 The Final Season",
    score: 9.8,
    episodes: "89 Episodes + Specials",
    status: "Completed",
    studio: "Wit Studio / MAPPA",
    genres: ["Dark Fantasy", "Military", "Mystery", "Political Drama"],
    year: 2013,
    coverImage: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80",
    favoriteCharacter: "Levi Ackerman & Erwin Smith",
    favoriteCharacterRole: "Survey Corps Commander & Captain",
    favoriteFightOrEpisode: "Season 3 Episode 54: 'Hero' (Erwin's Suicide Charge & Levi vs Beast Titan)",
    whyILoveIt: "Hajime Isayama's airtight narrative foreshadowing, geopolitical moral ambiguity, and Hiroyuki Sawano's soaring symphonies. A tragedy about freedom and the cycle of violence.",
    memorableQuote: "'My soldiers, rage! My soldiers, scream! My soldiers, fight!' — Erwin Smith",
  },
  {
    id: "jujutsu-kaisen",
    title: "Jujutsu Kaisen: Shibuya Incident",
    japaneseTitle: "呪術廻戦 懐玉・玉折 / 渋谷事変",
    score: 9.7,
    episodes: "47 Episodes",
    status: "Completed",
    studio: "MAPPA",
    genres: ["Supernatural", "Action", "Dark Fantasy"],
    year: 2020,
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&auto=format&fit=crop&q=80",
    favoriteCharacter: "Satoru Gojo & Kento Nanami",
    favoriteCharacterRole: "The Honored One / Special Grade Sorcerer",
    favoriteFightOrEpisode: "Sukuna vs Mahoraga & Yuji vs Choso in the Shibuya subway",
    whyILoveIt: "Raw kinetic sakuga animation from world-class web animators, intricate cursed energy power systems, and visceral consequence. Nanami's character arc is pure poetry.",
    memorableQuote: "'Throughout heaven and earth, I alone am the honored one.' — Satoru Gojo",
  },
  {
    id: "vinland-saga",
    title: "Vinland Saga (Season 1 & 2)",
    japaneseTitle: "ヴィンランド・サガ",
    score: 9.8,
    episodes: "48 Episodes",
    status: "Completed",
    studio: "Wit Studio / MAPPA",
    genres: ["Historical", "Epic", "Philosophical Drama", "Seinen"],
    year: 2019,
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    favoriteCharacter: "Askeladd & Thorfinn Karlsefni",
    favoriteCharacterRole: "Viking Mercenary Commander / The Pacifist",
    favoriteFightOrEpisode: "Season 1 Finale 'End of the Prologue' & Season 2 Ep 22 'Lone Wolf'",
    whyILoveIt: "The transition from a revenge-fueled Viking war epic into one of the most mature, beautiful meditations on pacifism, forgiveness, and healing ever animated.",
    memorableQuote: "'You have no enemies. No one in this world has any enemies. There is no one that you have to hurt.' — Thors Snorresson",
  },
  {
    id: "cowboy-bebop",
    title: "Cowboy Bebop",
    japaneseTitle: "カウボーイビバップ",
    score: 9.6,
    episodes: "26 Episodes + Movie",
    status: "Completed",
    studio: "Sunrise",
    genres: ["Space Western", "Noir", "Cyberpunk", "Jazz"],
    year: 1998,
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&auto=format&fit=crop&q=80",
    favoriteCharacter: "Spike Spiegel",
    favoriteCharacterRole: "Bounty Hunter / Jeet Kune Do Practitioner",
    favoriteFightOrEpisode: "Session #5: 'Ballad of Fallen Angels' (Church Cathedral duel against Vicious)",
    whyILoveIt: "Shinichiro Watanabe's effortless cool, Yoko Kanno and The Seatbelts' timeless jazz score, hand-drawn cel animation that still looks cleaner than modern CGI.",
    memorableQuote: "'Bang.' — Spike Spiegel",
  },
  {
    id: "steins-gate",
    title: "Steins;Gate",
    japaneseTitle: "STEINS;GATE",
    score: 9.7,
    episodes: "24 Episodes + OVA",
    status: "Completed",
    studio: "White Fox",
    genres: ["Sci-Fi", "Psychological Thriller", "Time Travel"],
    year: 2011,
    coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1600&auto=format&fit=crop&q=80",
    favoriteCharacter: "Rintaro Okabe (Hououin Kyouma)",
    favoriteCharacterRole: "Mad Scientist / Future Gadget Laboratory Founder",
    favoriteFightOrEpisode: "Episode 22 & 23: Operation Skuld & 'Deceive the world, deceive yourself'",
    whyILoveIt: "The gold standard of time-travel fiction. Starts as a cozy slice-of-life laboratory mystery and turns into an emotionally devastating race against determinism and the world line.",
    memorableQuote: "'No one knows what the future holds. That's why its potential is infinite, just as this meeting proves. El Psy Kongroo.' — Rintaro Okabe",
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling: Arise from the Shadow",
    japaneseTitle: "俺だけレベルアップな件",
    score: 9.2,
    episodes: "Season 1 & 2",
    status: "Currently Watching",
    currentProgress: "Season 2: Arise from the Shadow (Weekly)",
    studio: "A-1 Pictures",
    genres: ["Action", "Fantasy", "System", "Monsters"],
    year: 2024,
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    favoriteCharacter: "Sung Jinwoo & Igris",
    favoriteCharacterRole: "Shadow Monarch",
    favoriteFightOrEpisode: "Blood-Red Commander Igris boss dungeon encounter",
    whyILoveIt: "Hiroyuki Sawano's electronic-orchestral drops, hyper-clean shadow summoning visuals, and the most satisfying progression curve in modern animation.",
    memorableQuote: "'Arise.' — Sung Jinwoo",
  }
];

export const currentlyWatchingAnime = animeData.filter((a) => a.status === "Currently Watching");
