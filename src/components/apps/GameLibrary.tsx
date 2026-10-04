import React, { useState } from "react";
import { gamesData, type GameItem } from "~/data/games";
import SafeImage from "~/components/SafeImage";

/* ------------------------------------------------------------------
   Steam — faithful Steam-client replica (own code, own layout; Steam
   logo used nominatively as the app mark). Library: collections
   sidebar, hero + blue PLAY + stats, links row, post-game summary
   (achievements), screenshots, activity, friends. Rendered in the
   Mac system font. Icons only — no emojis.
   Palette: chrome #171a21 · main #1b2838 · accent #66c0f4 ·
   play blue #06BFFF→#2D73FF · discount green #a4d007 on #4c6b22.
------------------------------------------------------------------- */

type TopTab = "store" | "library" | "community" | "profile";
type StoreTab = "trending" | "sellers" | "upcoming" | "specials";

const AVATAR = "https://avatars.githubusercontent.com/u/239353027?v=4";
const USER = "Aditya";
const MAC_FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", sans-serif';

const FRIENDS = [
  { name: "Aarav", hrs: 47, color: "#5b8dd9" },
  { name: "Vihaan", hrs: 23, color: "#8e6cc9" },
  { name: "Ishaan", hrs: 112, color: "#4fae6a" },
];

const LAST_PLAYED = ["Today", "Yesterday", "2 days ago", "Last week"];

/* Deterministic demo prices (₹) derived from the game id. */
const PRICES = [499, 799, 999, 1299, 1499, 1999, 2499, 2999];
function priceFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const base = PRICES[h % PRICES.length];
  const disc = [0, 0, 0, 25, 40, 50, 67, 75][h % 8];
  return { base, disc, final: Math.round((base * (100 - disc)) / 100) };
}
const inr = (n: number) => "₹ " + n.toLocaleString("en-IN");

function PriceBlock({ id, big }: { id: string; big?: boolean }) {
  const p = priceFor(id);
  if (!p.disc)
    return <span style={{ fontSize: big ? 15 : 12, color: "#acdbf5" }}>{inr(p.final)}</span>;
  return (
    <div className="flex items-stretch">
      <span
        className="font-bold self-center"
        style={{
          background: "#4c6b22",
          color: "#a4d007",
          fontSize: big ? 20 : 15,
          padding: big ? "6px 8px" : "4px 6px",
        }}
      >
        -{p.disc}%
      </span>
      <span style={{ background: "#344654", padding: big ? "3px 10px 3px 8px" : "2px 8px 2px 6px" }}>
        <span className="line-through block" style={{ fontSize: big ? 12 : 10, color: "#738895" }}>
          {inr(p.base)}
        </span>
        <span className="block" style={{ fontSize: big ? 15 : 12, color: "#acdbf5" }}>
          {inr(p.final)}
        </span>
      </span>
    </div>
  );
}

/* Achievement art: icon-font class when the data gives one, else plain text. */
function AchievementIcon({ icon }: { icon: string }) {
  if (icon.startsWith("i-")) {
    return <span className={`${icon} flex-shrink-0`} style={{ fontSize: 28, color: "#c7d5e0" }} />;
  }
  return <span className="flex-shrink-0" style={{ fontSize: 28 }}>{icon}</span>;
}

function GameRow({ x, active, onPick }: { x: GameItem; active: boolean; onPick: () => void }) {
  return (
    <button
      onClick={onPick}
      className="w-full flex items-center gap-2 pl-5 pr-2 text-left"
      style={{
        paddingTop: 3,
        paddingBottom: 3,
        background: active ? "linear-gradient(90deg,#2a475e,#3d6b8f)" : "transparent",
      }}
    >
      <SafeImage
        src={x.coverImage}
        alt=""
        className="object-cover rounded-[1px] flex-shrink-0"
        style={{ width: 16, height: 16 }}
      />
      <span
        className="truncate hover:text-white"
        style={{ fontSize: 12, color: active ? "#ffffff" : "#8f98a0" }}
      >
        {x.title}
      </span>
    </button>
  );
}

export default function GameLibrary() {
  const [tab, setTab] = useState<TopTab>("library");
  const [storeTab, setStoreTab] = useState<StoreTab>("trending");
  const [feat, setFeat] = useState(0);
  const [shot, setShot] = useState<number | null>(null);
  const [selected, setSelected] = useState<GameItem>(gamesData[0]);
  const [query, setQuery] = useState("");
  const [storeQuery, setStoreQuery] = useState("");

  const fg = gamesData[feat % gamesData.length];
  const specials = gamesData.filter((x) => priceFor(x.id).disc > 0);
  const offerGames = (specials.length >= 3 ? specials : gamesData).slice(0, 3);

  const storeLists: Record<StoreTab, GameItem[]> = {
    trending: gamesData.slice(0, 5),
    sellers: [...gamesData].reverse().slice(0, 5),
    upcoming: [...gamesData].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 5),
    specials: (specials.length ? specials : gamesData).slice(0, 5),
  };

  /* Library collections */
  const favPool = gamesData.filter((x) => x.userRating >= 9);
  const favorites = favPool.length >= 2 ? favPool : gamesData.slice(0, 3);
  const genres = Array.from(new Set(gamesData.map((x) => x.genre)));
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = { favorites: true };
    genres.forEach((gn, i) => {
      o[gn] = i === 0;
    });
    return o;
  });
  const toggle = (k: string) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const matches = (x: GameItem) =>
    (x.title + " " + x.genre + " " + x.tags.join(" ")).toLowerCase().includes(query.toLowerCase());

  const storeHits =
    storeQuery.trim() === ""
      ? null
      : gamesData.filter((x) =>
          (x.title + " " + x.genre + " " + x.tags.join(" "))
            .toLowerCase()
            .includes(storeQuery.toLowerCase())
        );

  const unlocked = selected.achievements.length;
  const totalAch = unlocked + 4;
  const achPct = Math.round((unlocked / totalAch) * 100);
  const lastPlayed = LAST_PLAYED[selected.playtimeHours % 4];

  return (
    <div
      className="flex flex-col h-full overflow-hidden select-none"
      style={{ background: "#1b2838", color: "#c7d5e0", fontFamily: MAC_FONT }}
    >
      {/* Client chrome */}
      <div className="flex-shrink-0" style={{ background: "#171a21" }}>
        <div
          className="flex items-center gap-3 px-3"
          style={{ height: 24, fontSize: 11, color: "#8f98a0" }}
        >
          <img
            src="img/icons/steam-logo.svg"
            alt="Steam"
            draggable={false}
            className="flex-shrink-0"
            style={{ width: 20, height: 20 }}
          />
          <span className="font-semibold" style={{ color: "#b8b6b4" }}>Steam</span>
          <span>View</span>
          <span>Friends</span>
          <span>Games</span>
          <span>Help</span>
        </div>
        <div className="flex items-center px-3 gap-3" style={{ height: 46 }}>
          <div className="flex items-center gap-1 text-xl" style={{ color: "#3d4450" }}>
            <button className="px-1 hover:text-white">‹</button>
            <button className="px-1 hover:text-white">›</button>
          </div>
          <div className="flex items-stretch font-bold h-full" style={{ fontSize: 14, letterSpacing: "0.03em" }}>
            {(["store", "library", "community", "profile"] as TopTab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="uppercase transition-colors hover:text-white"
                style={{
                  color: tab === t ? "#ffffff" : "#b8b6b4",
                  borderBottom: tab === t ? "2px solid #66c0f4" : "2px solid transparent",
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
              >
                {t === "profile" ? USER : t}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-3 text-xs">
            <span style={{ color: "#b8b6b4" }}>{USER} ▾</span>
            <SafeImage src={AVATAR} alt="profile" className="object-cover" style={{ width: 28, height: 28 }} />
            <span className="flex items-center gap-2.5 ml-1" style={{ color: "#67707b", fontSize: 14 }}>
              <button className="hover:text-white">–</button>
              <button className="hover:text-white">▢</button>
              <button className="hover:text-white">✕</button>
            </span>
          </div>
        </div>
      </div>

      {/* ============================== STORE ============================== */}
      {tab === "store" && (
        <div className="flex-1 overflow-y-auto" style={{ background: "linear-gradient(180deg,#1b2838 0%,#1b2838 300px,#16202d 100%)" }}>
          <div className="mx-auto px-4 pb-10" style={{ maxWidth: 948 }}>
            {/* Store nav */}
            <div
              className="flex items-center gap-5 mt-4 px-4"
              style={{
                height: 42,
                background: "linear-gradient(90deg,#3d4450,#23465f 60%,#2a475e)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {["Your Store", "New & Noteworthy", "Categories", "Points Shop", "News", "Labs"].map(
                (l, i) => (
                  <button
                    key={l}
                    className="hover:text-white whitespace-nowrap"
                    style={{ color: i === 0 ? "#fff" : "#dcdedf" }}
                  >
                    {l}
                  </button>
                )
              )}
              <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                <input
                  value={storeQuery}
                  onChange={(e) => setStoreQuery(e.target.value)}
                  placeholder="search"
                  className="border-none focus:outline-none text-white px-2"
                  style={{ background: "#316282", border: "1px solid #0e1c2b", fontSize: 12, height: 27, width: 150, borderRadius: 3 }}
                />
                <span className="i-ph:magnifying-glass" style={{ fontSize: 15, color: "#c7d5e0" }} />
              </div>
            </div>

            {storeHits !== null ? (
              <div className="mt-4">
                <div className="font-bold text-white tracking-widest" style={{ fontSize: 12 }}>
                  {storeHits.length} RESULT{storeHits.length === 1 ? "" : "S"} FOR “{storeQuery.toUpperCase()}”
                </div>
                <div className="mt-2 flex flex-col gap-1">
                  {storeHits.map((x) => (
                    <button
                      key={x.id}
                      onClick={() => { setSelected(x); setTab("library"); }}
                      className="flex items-center gap-3 p-2 text-left hover:bg-[#2a475e]"
                      style={{ background: "rgba(0,0,0,0.2)" }}
                    >
                      <SafeImage src={x.heroImage} alt="" ratio="184 / 69" className="object-cover flex-shrink-0" style={{ width: 184, height: 69 }} />
                      <span className="flex-1 min-w-0">
                        <span className="block text-white truncate" style={{ fontSize: 14 }}>{x.title}</span>
                        <span className="block truncate" style={{ fontSize: 11, color: "#8f98a0" }}>
                          {x.genre} · {x.tags.slice(0, 3).join(", ")}
                        </span>
                      </span>
                      <PriceBlock id={x.id} />
                    </button>
                  ))}
                  {storeHits.length === 0 && (
                    <div className="py-8 text-center text-xs" style={{ color: "#5a6a7a" }}>
                      No games match that search.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* Featured */}
                <div className="mt-5 font-bold text-white tracking-widest" style={{ fontSize: 12 }}>
                  FEATURED & RECOMMENDED
                </div>
                <div className="relative mt-2 shadow-2xl" style={{ background: "#0f1922" }}>
                  <div className="flex">
                    <div className="flex-1 min-w-0">
                      <SafeImage
                        key={fg.id + (shot ?? "h")}
                        src={shot !== null && fg.screenshots.length ? fg.screenshots[shot % fg.screenshots.length] : fg.heroImage}
                        alt={fg.title}
                        ratio="616 / 353"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-shrink-0 p-3 flex flex-col" style={{ width: 252 }}>
                      <div className="text-white leading-tight" style={{ fontSize: 19 }}>{fg.title}</div>
                      <div className="grid grid-cols-2 gap-1.5 mt-2">
                        {fg.screenshots.slice(0, 4).map((s, i) => (
                          <div
                            key={i}
                            onMouseEnter={() => setShot(i)}
                            onMouseLeave={() => setShot(null)}
                            className="cursor-pointer"
                          >
                            <SafeImage
                              src={s}
                              alt=""
                              ratio="16 / 9"
                              className="w-full object-cover"
                              style={{ height: 62, opacity: shot === i ? 1 : 0.65 }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-auto pt-2" style={{ fontSize: 12, color: "#acdbf5" }}>
                        Now Available
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <span style={{ fontSize: 11, color: "#8f98a0" }}>Win · Mac · Linux</span>
                        <PriceBlock id={fg.id} />
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => { setFeat((f) => (f + gamesData.length - 1) % gamesData.length); setShot(null); }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-white"
                    style={{ background: "rgba(0,0,0,0.45)", fontSize: 26, padding: "14px 8px" }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => { setFeat((f) => (f + 1) % gamesData.length); setShot(null); }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white"
                    style={{ background: "rgba(0,0,0,0.45)", fontSize: 26, padding: "14px 8px" }}
                  >
                    ›
                  </button>
                </div>
                <div className="flex justify-center gap-1.5 mt-2">
                  {gamesData.map((x, i) => (
                    <button
                      key={x.id}
                      onClick={() => { setFeat(i); setShot(null); }}
                      className="rounded-sm"
                      style={{
                        width: 18,
                        height: 5,
                        background: i === feat % gamesData.length ? "#7cb8e4" : "#3d5a73",
                      }}
                    />
                  ))}
                </div>

                {/* Special offers */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="font-bold text-white tracking-widest" style={{ fontSize: 12 }}>
                    SPECIAL OFFERS
                  </div>
                  <button
                    className="rounded-sm"
                    style={{ border: "1px solid #4d6b83", color: "#c7d5e0", fontSize: 11, padding: "3px 12px", background: "rgba(0,0,0,0.2)" }}
                  >
                    Browse More
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2.5 mt-2">
                  {offerGames.map((x) => (
                    <button
                      key={x.id}
                      onClick={() => { setSelected(x); setTab("library"); }}
                      className="text-left shadow-lg"
                      style={{ background: "#0f1922" }}
                    >
                      <SafeImage src={x.heroImage} alt={x.title} ratio="16 / 8" className="w-full object-cover" style={{ height: 118 }} />
                      <div className="p-2.5">
                        <div className="text-white truncate" style={{ fontSize: 13 }}>MIDWEEK DEAL</div>
                        <div className="truncate" style={{ fontSize: 11, color: "#8f98a0" }}>{x.title}</div>
                        <div className="mt-2"><PriceBlock id={x.id} /></div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Tabbed list */}
                <div className="mt-6 flex gap-1" style={{ fontSize: 13 }}>
                  {(
                    [
                      ["trending", "New & Trending"],
                      ["sellers", "Top Sellers"],
                      ["upcoming", "Popular Upcoming"],
                      ["specials", "Specials"],
                    ] as [StoreTab, string][]
                  ).map(([v, label]) => (
                    <button
                      key={v}
                      onClick={() => setStoreTab(v)}
                      className="px-3 py-1.5 rounded-t-sm"
                      style={{
                        background: storeTab === v ? "#2a475e" : "transparent",
                        color: storeTab === v ? "#ffffff" : "#4f94bc",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col" style={{ background: "rgba(0,0,0,0.2)" }}>
                  {storeLists[storeTab].map((x) => {
                    const p = priceFor(x.id);
                    return (
                      <button
                        key={x.id}
                        onClick={() => { setSelected(x); setTab("library"); }}
                        className="flex items-center gap-3 p-2 text-left hover:bg-[#2a475e]"
                      >
                        <SafeImage src={x.heroImage} alt="" ratio="184 / 69" className="object-cover flex-shrink-0" style={{ width: 184, height: 69 }} />
                        <span className="flex-1 min-w-0">
                          <span className="block text-white truncate" style={{ fontSize: 14 }}>{x.title}</span>
                          <span className="flex items-center gap-1" style={{ fontSize: 11, color: "#8f98a0" }}>
                            <span className="i-ph:star-fill" style={{ fontSize: 10, color: "#66c0f4" }} />
                            {x.tags.slice(0, 3).join(" · ")}
                          </span>
                        </span>
                        {p.disc > 0 ? (
                          <PriceBlock id={x.id} />
                        ) : (
                          <span style={{ fontSize: 12, color: "#acdbf5" }}>{inr(p.final)}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============================= LIBRARY ============================= */}
      {tab === "library" && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex flex-1 min-h-0">
            {/* Collections sidebar */}
            <aside className="flex-shrink-0 flex flex-col" style={{ width: 216, background: "#171a21" }}>
              <div className="flex items-center justify-between px-3" style={{ height: 40 }}>
                <span className="flex items-center gap-2 font-semibold" style={{ fontSize: 12, color: "#8f98a0", letterSpacing: "0.04em" }}>
                  <span className="i-ph:house" style={{ fontSize: 14 }} /> LIBRARY HOME
                </span>
                <span className="i-ph:squares-four" style={{ color: "#5a6a7a", fontSize: 14 }} />
              </div>
              <div className="flex items-center justify-between px-3 pb-1.5">
                <span className="font-bold" style={{ fontSize: 10, color: "#5a6a7a", letterSpacing: "0.08em" }}>
                  ▾ FILTERED LIST
                </span>
                <span className="flex gap-2 items-center" style={{ color: "#5a6a7a", fontSize: 13 }}>
                  <span className="i-ph:funnel" />
                  <span className="i-ph:gear" />
                </span>
              </div>
              <div className="px-2.5 pb-2">
                <div className="flex items-center rounded-sm px-2" style={{ background: "#0e141b", border: "1px solid #000" }}>
                  <span className="i-ph:magnifying-glass mr-1.5" style={{ color: "#5a6a7a", fontSize: 12 }} />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="bg-transparent border-none w-full text-white focus:outline-none"
                    style={{ fontSize: 12, height: 28 }}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto pb-2">
                {/* Favorites */}
                <button
                  onClick={() => toggle("favorites")}
                  className="w-full flex items-center gap-1 px-3 py-1 font-bold text-left"
                  style={{ fontSize: 10, color: "#5a6a7a", letterSpacing: "0.06em" }}
                >
                  {open.favorites ? "▾" : "▸"} FAVORITES ({favorites.filter(matches).length})
                </button>
                {open.favorites &&
                  favorites.filter(matches).map((x) => (
                    <GameRow key={x.id} x={x} active={selected.id === x.id} onPick={() => setSelected(x)} />
                  ))}
                {/* Genre collections */}
                {genres.map((gn) => {
                  const list = gamesData.filter((x) => x.genre === gn && matches(x));
                  if (list.length === 0) return null;
                  return (
                    <div key={gn}>
                      <button
                        onClick={() => toggle(gn)}
                        className="w-full flex items-center gap-1 px-3 py-1 font-bold text-left uppercase"
                        style={{ fontSize: 10, color: "#5a6a7a", letterSpacing: "0.06em" }}
                      >
                        {open[gn] ? "▾" : "▸"} {gn} ({list.length})
                      </button>
                      {open[gn] &&
                        list.map((x) => (
                          <GameRow key={x.id} x={x} active={selected.id === x.id} onPick={() => setSelected(x)} />
                        ))}
                    </div>
                  );
                })}
              </div>
              <button
                className="text-left px-3 font-semibold"
                style={{ height: 34, fontSize: 11, color: "#66c0f4", borderTop: "1px solid #000" }}
              >
                + ADD A GAME
              </button>
            </aside>

            {/* Detail pane */}
            <main className="flex-1 overflow-y-auto min-w-0" style={{ background: "linear-gradient(180deg,#232e3d 0%,#1b2838 320px)" }}>
              <div className="relative w-full overflow-hidden" style={{ height: 246 }}>
                <SafeImage
                  key={selected.id}
                  src={selected.heroImage}
                  alt=""
                  ratio="21 / 9"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(27,40,56,0.9) 2%, rgba(27,40,56,0.25) 45%, rgba(27,40,56,0))" }}
                />
                <h1
                  className="absolute font-bold text-white leading-none"
                  style={{ left: 24, bottom: 18, fontSize: 42, textShadow: "0 3px 16px rgba(0,0,0,0.85)", maxWidth: "72%" }}
                >
                  {selected.title}
                </h1>
                <div className="absolute flex gap-2 items-center" style={{ right: 16, bottom: 12, fontSize: 15, color: "rgba(255,255,255,0.75)" }}>
                  <span className="i-ph:game-controller" />
                  <span className="i-ph:keyboard" />
                </div>
              </div>

              {/* PLAY + stats */}
              <div className="flex items-center gap-7 px-6" style={{ height: 62 }}>
                <button
                  className="font-bold rounded-sm transition active:scale-95 text-white"
                  style={{
                    background: "linear-gradient(90deg,#06BFFF,#2D73FF)",
                    fontSize: 15,
                    padding: "8px 42px",
                    letterSpacing: "0.05em",
                  }}
                >
                  ▶ PLAY
                </button>
                {[
                  ["LAST PLAYED", lastPlayed],
                  ["PLAY TIME", `${selected.playtimeHours} hours`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="font-semibold" style={{ fontSize: 10, color: "#5a6a7a", letterSpacing: "0.08em" }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 12, color: "#c7d5e0" }}>{value}</div>
                  </div>
                ))}
                <div>
                  <div className="font-semibold" style={{ fontSize: 10, color: "#5a6a7a", letterSpacing: "0.08em" }}>
                    ACHIEVEMENTS
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: 12, color: "#c7d5e0" }}>
                    {unlocked}/{totalAch}
                    <span className="inline-block rounded-full" style={{ width: 90, height: 5, background: "#0e141b" }}>
                      <span className="block rounded-full" style={{ width: `${achPct}%`, height: "100%", background: "#66c0f4" }} />
                    </span>
                  </div>
                </div>
                <div className="ml-auto flex gap-3.5 items-center" style={{ fontSize: 15, color: "#5a6a7a" }}>
                  <button className="hover:text-white flex"><span className="i-ph:gear" /></button>
                  <button className="hover:text-white flex"><span className="i-ph:info" /></button>
                  <button className="hover:text-white flex"><span className="i-ph:star" /></button>
                </div>
              </div>

              {/* Links row */}
              <div
                className="flex items-center gap-5 px-6 mx-0"
                style={{ height: 34, background: "rgba(255,255,255,0.04)", fontSize: 12, color: "#5c8fb5" }}
              >
                {["Store Page", "Community Hub", "Find Groups", "Discussions", "Guides", "Workshop", "Support"].map((l) => (
                  <button key={l} className="hover:text-white whitespace-nowrap">{l}</button>
                ))}
              </div>

              {/* Screenshots */}
              <div className="px-6 mt-4">
                <div className="font-semibold" style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: "0.08em" }}>
                  SCREENSHOTS
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {selected.screenshots.map((s, i) => (
                    <div key={i} className="rounded-sm overflow-hidden" style={{ background: "#000" }}>
                      <SafeImage src={s} alt="" ratio="16 / 9" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Post-game summary — achievements only */}
              <div className="flex items-center justify-between px-6 mt-4">
                <div className="font-semibold" style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: "0.08em" }}>
                  POST-GAME SUMMARY
                </div>
                <div className="flex gap-2 text-base" style={{ color: "#5a6a7a" }}>
                  <button className="hover:text-white">‹</button>
                  <button className="hover:text-white">›</button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 px-6 mt-1.5">
                {selected.achievements.slice(0, 4).map((a, i) => (
                  <div key={i} className="rounded-[2px] p-2.5" style={{ background: "rgba(0,0,0,0.35)" }}>
                    <div className="text-right" style={{ fontSize: 11, color: "#5a6a7a" }}>
                      {i < 2 ? "Today" : "Yesterday"}
                    </div>
                    <div className="flex gap-2 mt-1">
                      {a.steamIcon ? (
                        <SafeImage
                          src={a.steamIcon}
                          alt=""
                          className="rounded-[2px] flex-shrink-0 object-cover"
                          style={{ width: 30, height: 30 }}
                        />
                      ) : (
                        <AchievementIcon icon={a.icon} />
                      )}
                      <div className="min-w-0">
                        <div className="text-white leading-tight" style={{ fontSize: 12 }}>{a.title}</div>
                        <div className="leading-tight mt-0.5" style={{ fontSize: 11, color: "#8f98a0" }}>{a.description}</div>
                        <div className="leading-tight mt-0.5" style={{ fontSize: 11, color: "#5a6a7a" }}>{a.rarity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity + friends */}
              <div className="grid grid-cols-3 gap-4 px-6 mt-4 pb-8">
                <div className="col-span-2">
                  <div className="font-semibold" style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: "0.08em" }}>
                    ACTIVITY
                  </div>
                  <div className="rounded-sm mt-1.5 px-3 italic" style={{ background: "rgba(0,0,0,0.35)", fontSize: 12, color: "#5a6a7a", height: 38, lineHeight: "38px" }}>
                    Say something about this game to your friends...
                  </div>
                  <div className="mt-3" style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: "0.06em" }}>
                    RECENT
                  </div>
                  <div className="mt-1.5 rounded-sm p-3" style={{ background: "rgba(0,0,0,0.22)", fontSize: 12 }}>
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full text-white text-center font-bold"
                        style={{ width: 22, height: 22, lineHeight: "22px", fontSize: 11, background: FRIENDS[0].color }}
                      >
                        {FRIENDS[0].name[0]}
                      </span>
                      <span style={{ color: "#8f98a0" }}>
                        <span style={{ color: "#c7d5e0" }}>{FRIENDS[0].name}</span> posted a status update · {lastPlayed}
                      </span>
                    </div>
                    <p className="mt-2 leading-relaxed" style={{ color: "#acb2b8" }}>{selected.favoriteMoment}</p>
                    <div className="mt-2 flex items-center gap-4" style={{ color: "#5a6a7a", fontSize: 11 }}>
                      <span className="italic">Add a reply...</span>
                      <span className="ml-auto flex items-center gap-3">
                        <span className="flex items-center gap-1"><span className="i-ph:chat-circle" style={{ fontSize: 13 }} /> 0</span>
                        <span className="flex items-center gap-1"><span className="i-ph:thumbs-up" style={{ fontSize: 13 }} /> 0</span>
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 rounded-sm p-3" style={{ background: "rgba(0,0,0,0.22)", fontSize: 12 }}>
                    <div className="flex items-center gap-2">
                      <SafeImage src={AVATAR} alt="" className="object-cover rounded-full" style={{ width: 22, height: 22 }} />
                      <span style={{ color: "#8f98a0" }}>
                        <span style={{ color: "#c7d5e0" }}>{USER}</span> posted a status update · 1h ago
                      </span>
                    </div>
                    <p className="mt-2 leading-relaxed italic" style={{ color: "#acb2b8" }}>“{selected.personalNotes}”</p>
                    <div className="mt-2 flex items-center gap-4" style={{ color: "#5a6a7a", fontSize: 11 }}>
                      <span className="italic">Add a reply...</span>
                      <span className="ml-auto flex items-center gap-3">
                        <span className="flex items-center gap-1"><span className="i-ph:chat-circle" style={{ fontSize: 13 }} /> 0</span>
                        <span className="flex items-center gap-1"><span className="i-ph:thumbs-up" style={{ fontSize: 13 }} /> 0</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-sm p-3" style={{ background: "rgba(0,0,0,0.35)" }}>
                    <div className="font-semibold" style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: "0.08em" }}>
                      FRIENDS WHO PLAY
                    </div>
                    <div className="mt-1.5" style={{ fontSize: 12, color: "#8f98a0" }}>
                      {FRIENDS.length} friends have played recently
                    </div>
                    {FRIENDS.map((f) => (
                      <div key={f.name} className="flex items-center gap-2 mt-2">
                        <span
                          className="rounded-full text-white text-center font-bold flex-shrink-0"
                          style={{ width: 26, height: 26, lineHeight: "26px", fontSize: 12, background: f.color }}
                        >
                          {f.name[0]}
                        </span>
                        <div className="min-w-0 leading-tight">
                          <div style={{ fontSize: 12, color: "#c7d5e0" }}>{f.name}</div>
                          <div style={{ fontSize: 11, color: "#5a6a7a" }}>{f.hrs} hrs on record</div>
                        </div>
                      </div>
                    ))}
                    <button className="mt-2.5 hover:text-white" style={{ fontSize: 11, color: "#5c8fb5" }}>
                      View all friends who play
                    </button>
                  </div>
                  <div className="rounded-sm p-3" style={{ background: "rgba(0,0,0,0.35)" }}>
                    <div className="font-semibold" style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: "0.08em" }}>
                      ACHIEVEMENTS
                    </div>
                    <div className="mt-1.5" style={{ fontSize: 12, color: "#8f98a0" }}>
                      You've unlocked {unlocked}/{totalAch} ({achPct}%)
                    </div>
                    <div className="mt-2 rounded-full" style={{ height: 6, background: "#0e141b" }}>
                      <div className="rounded-full" style={{ width: `${achPct}%`, height: "100%", background: "#66c0f4" }} />
                    </div>
                    <div className="mt-2 flex items-center gap-1" style={{ fontSize: 11, color: "#5a6a7a" }}>
                      {selected.studio} · {selected.releaseYear} ·
                      <span className="i-ph:star-fill" style={{ fontSize: 10, color: "#66c0f4" }} />
                      {selected.userRating.toFixed(1)} / 10
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
          {/* Status bar */}
          <div
            className="flex-shrink-0 flex items-center justify-between px-3 font-semibold"
            style={{ height: 30, background: "#171a21", fontSize: 10, color: "#5a6a7a", letterSpacing: "0.08em" }}
          >
            <span />
            <span>DOWNLOADS · <span style={{ color: "#8f98a0" }}>Manage</span></span>
            <span className="flex items-center gap-1">FRIENDS & CHAT <span style={{ fontSize: 13 }}>+</span></span>
          </div>
        </div>
      )}

      {/* ====================== COMMUNITY / PROFILE ====================== */}
      {(tab === "community" || tab === "profile") && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="font-bold text-white tracking-widest" style={{ fontSize: 13 }}>
            {tab === "profile" ? USER.toUpperCase() : "COMMUNITY"}
          </div>
          <div className="text-xs" style={{ color: "#8f98a0" }}>
            Sign in on the real client to browse {tab === "profile" ? "this profile" : "discussions"} —
            this demo covers the Store & Library.
          </div>
        </div>
      )}
    </div>
  );
}
