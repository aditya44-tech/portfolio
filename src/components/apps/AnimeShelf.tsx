import React, { useState } from "react";
import { animeData, bleachZanpakutoList, type AnimeItem, type ZanpakutoInfo } from "~/data/anime";
import { useStore } from "~/stores";

export default function AnimeShelf() {
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem>(animeData[0]);
  const [activeView, setActiveView] = useState<"shelf" | "bleach-bankai">("shelf");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filteredAnime = filterStatus === "All"
    ? animeData
    : animeData.filter((a) => a.status === filterStatus);

  return (
    <div className="flex flex-col h-full bg-[#16161A] text-[#EDEAF0] select-none font-sans overflow-hidden">
      {/* Top Bar - Books / Shelf Style */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#282833] bg-[#1C1C24]">
        <div className="flex items-center gap-3">
          <span className="text-base">📖</span>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            Anime Shelf • Gotei Archives
          </span>
          <div className="flex items-center gap-1 ml-4 bg-black/40 p-1 rounded-md border border-white/10">
            <button
              onClick={() => setActiveView("shelf")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeView === "shelf"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Collection ({animeData.length})
            </button>
            <button
              onClick={() => setActiveView("bleach-bankai")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeView === "bleach-bankai"
                  ? "bg-orange-600 text-white shadow-sm"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              ⚡ Bleach: Zanpakuto & Bankai ({bleachZanpakutoList.length})
            </button>
          </div>
        </div>

        {activeView === "shelf" && (
          <div className="flex items-center gap-1 text-xs">
            {["All", "Currently Watching", "Completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors ${
                  filterStatus === status
                    ? "bg-white/20 text-white font-medium"
                    : "text-stone-400 hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeView === "shelf" ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Anime Titles List (260px) */}
          <div className="w-[260px] flex-shrink-0 border-r border-[#282833] bg-[#191921] overflow-y-auto p-2 space-y-1">
            {filteredAnime.map((anime) => {
              const isSelected = selectedAnime.id === anime.id;
              return (
                <button
                  key={anime.id}
                  onClick={() => setSelectedAnime(anime)}
                  className={`w-full text-left p-2.5 rounded-lg flex items-center gap-3 transition-all ${
                    isSelected
                      ? "bg-orange-950/40 border border-orange-500/50 text-white"
                      : "hover:bg-white/5 text-stone-400 hover:text-white border border-transparent"
                  }`}
                >
                  <img
                    src={anime.coverImage}
                    alt={anime.title}
                    className="w-10 h-14 object-cover rounded shadow"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate text-white">
                      {anime.title}
                    </div>
                    <div className="text-[10px] text-orange-400/90 font-mono mt-0.5">
                      ⭐ {anime.score} • {anime.studio}
                    </div>
                    <div className="text-[10px] text-stone-500 truncate mt-0.5">
                      {anime.status} {anime.currentProgress && `(${anime.currentProgress})`}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Main Detail Pane */}
          <div className="flex-1 overflow-y-auto">
            {/* Banner Header */}
            <div className="relative h-56 w-full bg-black overflow-hidden flex-shrink-0">
              <img
                src={selectedAnime.bannerImage}
                alt={selectedAnime.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16161A] via-[#16161A]/50 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-orange-600/90 text-white font-mono text-[10px] font-bold uppercase">
                      {selectedAnime.status}
                    </span>
                    <span className="text-xs text-stone-300 font-mono">
                      {selectedAnime.studio} • {selectedAnime.year}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {selectedAnime.title}
                  </h1>
                  {selectedAnime.japaneseTitle && (
                    <div className="text-xs text-orange-300/80 font-serif">
                      {selectedAnime.japaneseTitle}
                    </div>
                  )}
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-right backdrop-blur">
                  <div className="text-[10px] text-stone-400">RATING</div>
                  <div className="text-base font-bold font-mono text-orange-400">
                    ⭐ {selectedAnime.score}/10
                  </div>
                </div>
              </div>
            </div>

            {/* Anime Review Details */}
            <div className="p-6 space-y-5 max-w-4xl">
              {/* Genres Strip */}
              <div className="flex flex-wrap gap-1.5">
                {selectedAnime.genres.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-stone-300"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {/* Why I Love It */}
              <div className="p-4 rounded-xl border border-white/10 bg-[#1D1D26] space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  💭 Why It Resonates
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedAnime.whyILoveIt}
                </p>
              </div>

              {/* Favorite Character & Fight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-white/10 bg-[#1D1D26] space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                    👑 Favorite Character
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {selectedAnime.favoriteCharacter}
                  </div>
                  <div className="text-xs text-stone-400">
                    {selectedAnime.favoriteCharacterRole}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-[#1D1D26] space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-orange-400">
                    ⚔️ Iconic Fight / Peak Episode
                  </div>
                  <div className="text-xs font-semibold text-white leading-snug">
                    {selectedAnime.favoriteFightOrEpisode}
                  </div>
                </div>
              </div>

              {/* Memorable Quote */}
              <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-950/20 italic text-stone-300 text-xs">
                "{selectedAnime.memorableQuote}"
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Bleach Zanpakuto & Bankai Showcase View */
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/50 via-black to-zinc-950 border border-orange-500/40 shadow-xl">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-orange-600 text-white font-bold uppercase">
                Featured • Gotei 13 Zanpakuto Compendium
              </span>
              <h2 className="text-xl font-bold text-white mt-2">
                BLEACH: Thousand-Year Blood War — The Spirit Swords
              </h2>
              <p className="text-xs text-stone-300 mt-1 leading-relaxed">
                "The blade is me." Explore the Shikai releases, release commands, and devastating Bankai forms of the Soul Reapers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bleachZanpakutoList.map((z) => (
                <div
                  key={z.name}
                  className="p-4 rounded-xl border border-white/10 bg-[#191922] hover:border-orange-500/40 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">{z.name}</h3>
                      <div className="text-xs text-orange-400 font-medium">
                        {z.wielder} • {z.division}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded bg-orange-900/40 text-orange-300 border border-orange-700/40 font-mono">
                      {z.releaseCommand}
                    </span>
                  </div>

                  <div className="text-xs text-stone-400">
                    <strong className="text-stone-300">Shikai:</strong> {z.shikai}
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/50 border border-white/5 text-xs text-stone-300 space-y-1">
                    <div className="font-bold text-orange-400 flex items-center gap-1.5">
                      <span>⚡ BANKAI:</span>
                      <span className="text-white">{z.bankai}</span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-snug">
                      {z.bankaiAbility}
                    </p>
                  </div>

                  <p className="text-[11px] italic text-stone-400 border-l-2 border-orange-500 pl-2">
                    "{z.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
