import React, { useState } from "react";
import { animeData, currentlyWatchingAnime, type AnimeItem } from "~/data/anime";
import SafeImage from "~/components/SafeImage";

/* ------------------------------------------------------------------
   Crunchyroll — streaming-shelf UI built from scratch (own code, own
   layout; Crunchyroll eye logo used nominatively as the app mark).
   Dark + CR orange (#f47521): hero feature, continue-watching rail,
   poster grid, filterable My Lists, detail view.
   Type inherits the global Apple system stack — never overridden here.
------------------------------------------------------------------- */

type HomeTab = "home" | "lists";
type Filter = "all" | "watching" | "completed" | "favorites";
const isFavorite = (a: AnimeItem) => a.score >= 9.7;
const ORANGE = "#f47521";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "watching", label: "Watching" },
  { id: "completed", label: "Completed" },
  { id: "favorites", label: "Favorites" },
];

export default function AnimeShelf() {
  const [tab, setTab] = useState<HomeTab>("home");
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const featured = animeData.find((a) => a.featured) ?? animeData[0];

  const counts: Record<Filter, number> = {
    all: animeData.length,
    watching: animeData.filter((a) => a.status === "Currently Watching").length,
    completed: animeData.filter((a) => a.status === "Completed").length,
    favorites: animeData.filter(isFavorite).length,
  };

  const list = animeData.filter((a) => {
    if (filter === "watching" && a.status !== "Currently Watching") return false;
    if (filter === "completed" && a.status !== "Completed") return false;
    if (filter === "favorites" && !isFavorite(a)) return false;
    const q = query.trim().toLowerCase();
    if (
      q &&
      !(
        a.title.toLowerCase().includes(q) ||
        a.genres.some((g) => g.toLowerCase().includes(q)) ||
        a.studio.toLowerCase().includes(q)
      )
    )
      return false;
    return true;
  });

  const open = animeData.find((a) => a.id === openId);

  return (
    <div
      className="flex flex-col h-full overflow-hidden select-none"
      style={{ background: "#000", color: "#e8e8e8" }}
    >
      {/* Crunchyroll chrome */}
      <div
        className="flex items-center gap-6 px-5 flex-shrink-0"
        style={{ height: 56, background: "#000", borderBottom: "1px solid #232428" }}
      >
        <button
          onClick={() => {
            setOpenId(null);
            setTab("home");
          }}
          className="flex items-center gap-2"
        >
          <img
            src="img/icons/crunchyroll-icon.svg"
            alt="Crunchyroll"
            className="w-8 h-8"
            draggable={false}
          />
          <span className="font-black tracking-tight" style={{ fontSize: 19, color: ORANGE }}>
            crunchyroll
          </span>
        </button>
        <div className="flex items-center h-full gap-1">
          {(
            [
              { id: "home", label: "Home" },
              { id: "lists", label: "My Lists" },
            ] as { id: HomeTab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setOpenId(null);
                setTab(t.id);
              }}
              className="px-3 h-full transition-colors"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: tab === t.id && !open ? "#fff" : "#a0a0a0",
                borderBottom:
                  tab === t.id && !open ? `3px solid ${ORANGE}` : "3px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="ml-auto text-[11px] font-semibold" style={{ color: "#8a8a8e" }}>
          ★ {((animeData.reduce((s, a) => s + a.score, 0) / animeData.length) || 0).toFixed(1)}{" "}
          avg · {animeData.length} series
        </div>
      </div>

      {open ? (
        <DetailView anime={open} onBack={() => setOpenId(null)} onSelect={setOpenId} />
      ) : tab === "home" ? (
        <div className="flex-1 overflow-y-auto">
          {/* Hero feature */}
          <div className="relative w-full overflow-hidden" style={{ height: 380 }}>
            <SafeImage
              src={featured.bannerImage}
              alt=""
              ratio="21 / 9"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.92) 20%, rgba(0,0,0,0.45) 55%, transparent 85%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, #000 2%, transparent 40%)",
              }}
            />
            <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
              <span
                className="px-1.5 py-0.5 font-bold uppercase rounded-sm"
                style={{ background: ORANGE, color: "#000", fontSize: 11 }}
              >
                Sub | Dub
              </span>
              <h1
                className="font-black text-white leading-tight mt-2"
                style={{ fontSize: 34, textShadow: "2px 2px 8px rgba(0,0,0,0.8)" }}
              >
                {featured.title}
              </h1>
              <div className="mt-1.5" style={{ fontSize: 13, color: "#a0a0a0" }}>
                ★ {featured.score.toFixed(1)} · {featured.genres.slice(0, 3).join(", ")} ·{" "}
                {featured.studio}
              </div>
              <p
                className="mt-2 line-clamp-2 leading-relaxed"
                style={{ fontSize: 13, color: "#d0d0d0" }}
              >
                {featured.whyILoveIt}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setOpenId(featured.id)}
                  className="font-bold uppercase tracking-wider transition active:scale-95"
                  style={{
                    background: ORANGE,
                    color: "#000",
                    fontSize: 13,
                    padding: "10px 26px",
                  }}
                >
                  ▶ Start Watching
                </button>
                <button
                  onClick={() => {
                    setFilter("favorites");
                    setTab("lists");
                  }}
                  className="font-bold uppercase tracking-wider transition hover:border-white"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.4)",
                    color: "#fff",
                    fontSize: 13,
                    padding: "9px 22px",
                  }}
                >
                  + My List
                </button>
              </div>
            </div>
          </div>

          {/* Continue watching */}
          <div className="px-8 mt-7">
            <h2 className="font-bold text-white" style={{ fontSize: 17 }}>
              Continue Watching
            </h2>
            <div
              className="grid gap-4 mt-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}
            >
              {currentlyWatchingAnime.map((a) => (
                <button key={a.id} onClick={() => setOpenId(a.id)} className="group text-left">
                  <div
                    className="relative overflow-hidden rounded-sm transition group-hover:ring-2"
                    style={{ aspectRatio: "16 / 9", background: "#141519" }}
                  >
                    <SafeImage
                      src={a.bannerImage}
                      alt={a.title}
                      ratio="16 / 9"
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: 48,
                          height: 48,
                          background: "rgba(0,0,0,0.6)",
                          border: "2px solid #fff",
                          fontSize: 18,
                          color: "#fff",
                        }}
                      >
                        ▶
                      </div>
                    </div>
                    <div
                      className="absolute bottom-0 left-0 right-0"
                      style={{ height: 4, background: "#24252a" }}
                    >
                      <div className="h-full" style={{ width: "60%", background: ORANGE }} />
                    </div>
                  </div>
                  <div
                    className="mt-1.5 truncate transition-colors group-hover:text-white"
                    style={{ fontSize: 13, fontWeight: 600, color: "#d0d0d0" }}
                  >
                    {a.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#a0a0a0" }}>{a.currentProgress}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Popular grid */}
          <div className="px-8 mt-8 pb-10">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-white" style={{ fontSize: 17 }}>
                Popular On This Shelf
              </h2>
              <button
                onClick={() => setTab("lists")}
                className="font-semibold uppercase tracking-wider transition hover:text-white"
                style={{ fontSize: 12, color: "#a0a0a0" }}
              >
                View All
              </button>
            </div>
            <div
              className="grid gap-x-4 gap-y-6 mt-3"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
            >
              {animeData.map((a) => (
                <PosterCard key={a.id} anime={a} onOpen={() => setOpenId(a.id)} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* My Lists filter bar */}
          <div
            className="flex items-center gap-2 px-8 flex-shrink-0 flex-wrap"
            style={{ paddingTop: 14, paddingBottom: 14 }}
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="rounded-full transition-colors"
                style={{
                  fontSize: 12,
                  padding: "6px 14px",
                  background: filter === f.id ? ORANGE : "transparent",
                  color: filter === f.id ? "#000" : "#a0a0a0",
                  border: `1px solid ${filter === f.id ? ORANGE : "#3a3b41"}`,
                  fontWeight: filter === f.id ? 700 : 400,
                }}
              >
                {f.label} <span style={{ opacity: 0.7 }}>{counts[f.id]}</span>
              </button>
            ))}
            <div
              className="ml-auto flex items-center rounded-md px-2.5"
              style={{ border: "1px solid #3a3b41", background: "#141519" }}
            >
              <span className="text-xs mr-1.5" style={{ color: "#8a8a8e" }}>
                <span className="i-ph:magnifying-glass" />
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title or genre"
                className="bg-transparent border-none text-white focus:outline-none"
                style={{ fontSize: 12, height: 30, width: 170 }}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-8 pb-10">
            {list.length === 0 && (
              <div className="py-16 text-center text-sm" style={{ color: "#6e6e73" }}>
                Nothing on this shelf yet.
              </div>
            )}
            <div
              className="grid gap-x-4 gap-y-6"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))" }}
            >
              {list.map((a) => (
                <PosterCard key={a.id} anime={a} onOpen={() => setOpenId(a.id)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PosterCard({ anime: a, onOpen }: { anime: AnimeItem; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="group text-left transition-all duration-200 hover:-translate-y-1">
      <div
        className="relative overflow-hidden rounded-md transition-all duration-200 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] group-hover:ring-1"
        style={{ aspectRatio: "2 / 3", background: "#141519" }}
      >
        <SafeImage
          src={a.coverImage}
          alt={a.title}
          ratio="2 / 3"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute flex items-center gap-1 rounded px-1.5 py-0.5"
          style={{
            top: 8,
            left: 8,
            background: "rgba(0,0,0,0.72)",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          <span style={{ color: "#f5c518" }}>★</span>
          <span className="text-white">{a.score.toFixed(1)}</span>
        </div>
        {a.status === "Currently Watching" && (
          <div
            className="absolute rounded px-1.5 py-0.5 font-bold"
            style={{ top: 8, right: 8, background: ORANGE, color: "#000", fontSize: 10 }}
          >
            NEW EP
          </div>
        )}
        <div
          className="absolute inset-x-0 bottom-0 p-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.92) 60%, transparent)",
            paddingTop: 28,
          }}
        >
          <p className="line-clamp-4 leading-snug" style={{ fontSize: 11, color: "#d7d7db" }}>
            {a.whyILoveIt}
          </p>
        </div>
      </div>
      <div
        className="mt-1.5 leading-tight line-clamp-2 transition-colors"
        style={{ fontSize: 13, fontWeight: 600, color: "#d0d0d0" }}
      >
        {a.title}
      </div>
      <div className="mt-0.5" style={{ fontSize: 11, color: "#8a8a8e" }}>
        {a.genres[0]} · {a.year}
      </div>
    </button>
  );
}

function DetailView({
  anime: a,
  onBack,
  onSelect,
}: {
  anime: AnimeItem;
  onBack: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
        <SafeImage src={a.bannerImage} alt="" ratio="21 / 9" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, #000 2%, transparent 60%)" }}
        />
        <button
          onClick={onBack}
          className="absolute rounded-full transition hover:bg-white/20"
          style={{
            top: 12,
            left: 16,
            background: "rgba(0,0,0,0.55)",
            color: "#fff",
            fontSize: 13,
            padding: "6px 14px",
          }}
        >
          ← Back
        </button>
        <div
          className="absolute flex items-center gap-1.5 rounded px-2 py-1"
          style={{ bottom: 12, right: 16, background: "rgba(0,0,0,0.72)", fontSize: 13, fontWeight: 700 }}
        >
          <span style={{ color: "#f5c518", fontSize: 15 }}>★</span>
          <span className="text-white">{a.score.toFixed(1)}</span>
        </div>
      </div>

      <div className="px-6 pb-8 -mt-10 relative flex gap-5">
        <SafeImage
          src={a.coverImage}
          alt={a.title}
          ratio="2 / 3"
          className="rounded-md object-cover flex-shrink-0"
          style={{ width: 150, boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}
        />
        <div className="min-w-0 pt-10">
          <h1 className="font-bold text-white leading-tight" style={{ fontSize: 22 }}>
            {a.title}
          </h1>
          {a.japaneseTitle && (
            <div style={{ fontSize: 12, color: "#8a8a8e" }}>{a.japaneseTitle}</div>
          )}
          <div className="mt-1.5" style={{ fontSize: 12, color: "#a0a0a0" }}>
            {a.studio} · {a.episodes} · {a.year} · {a.status}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {a.genres.map((g) => (
              <span
                key={g}
                className="rounded-full px-2.5 py-1"
                style={{ background: "#1e1e22", color: "#c9c9ce", fontSize: 11 }}
              >
                {g}
              </span>
            ))}
          </div>
          <button
            className="mt-3 font-bold uppercase tracking-wider transition active:scale-95"
            style={{ background: ORANGE, color: "#000", fontSize: 12, padding: "9px 24px" }}
          >
            ▶ Start Watching S1 E1
          </button>
        </div>
      </div>

      <div className="px-6 pb-4 grid grid-cols-2 gap-4">
        <div className="rounded-md p-4" style={{ background: "#141519" }}>
          <h3 className="font-bold tracking-widest" style={{ fontSize: 11, color: ORANGE }}>
            WHY I LOVE IT
          </h3>
          <p className="mt-1.5 leading-relaxed" style={{ fontSize: 13 }}>
            {a.whyILoveIt}
          </p>
          <p className="mt-2 italic leading-relaxed" style={{ fontSize: 12, color: "#a0a0a0" }}>
            {a.memorableQuote}
          </p>
        </div>
        <div className="rounded-md p-4" style={{ background: "#141519" }}>
          <h3 className="font-bold tracking-widest" style={{ fontSize: 11, color: ORANGE }}>
            FAVORITES
          </h3>
          <div className="mt-1.5" style={{ fontSize: 13 }}>
            <span style={{ color: "#8a8a8e" }}>Character — </span>
            {a.favoriteCharacter}
          </div>
          <div className="mt-1" style={{ fontSize: 12, color: "#a0a0a0" }}>
            {a.favoriteCharacterRole}
          </div>
          <div className="mt-2.5" style={{ fontSize: 13 }}>
            <span style={{ color: "#8a8a8e" }}>Fight / Episode — </span>
            {a.favoriteFightOrEpisode}
          </div>
          {a.currentProgress && (
            <div
              className="mt-2.5 rounded px-2 py-1.5"
              style={{ background: "#1e1e22", fontSize: 12 }}
            >
              <span style={{ color: ORANGE, fontWeight: 700 }}>● </span>
              {a.currentProgress}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-8">
        <h3 className="font-bold tracking-widest mb-2" style={{ fontSize: 11, color: "#8a8a8e" }}>
          MORE LIKE THIS
        </h3>
        <div className="flex gap-2">
          {animeData
            .filter((x) => x.id !== a.id)
            .slice(0, 6)
            .map((x) => (
              <button
                key={x.id}
                onClick={() => onSelect(x.id)}
                className="rounded overflow-hidden transition hover:opacity-80"
                style={{ width: 64, aspectRatio: "2 / 3", background: "#141519" }}
              >
                <SafeImage
                  src={x.coverImage}
                  alt={x.title}
                  ratio="2 / 3"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
