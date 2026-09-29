import React, { useState } from "react";
import { gamesData, allAchievements, type GameItem, type GameAchievement } from "~/data/games";
import { useStore } from "~/stores";

export default function GameLibrary() {
  const [selectedGame, setSelectedGame] = useState<GameItem>(gamesData[0]);
  const [activeTab, setActiveTab] = useState<"library" | "achievements">("library");
  const [soulsAtmosphere, setSoulsAtmosphere] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = gamesData.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full select-none font-sans overflow-hidden ${
      soulsAtmosphere ? "bg-[#0E0C0B] text-[#D8D2C9]" : "bg-[#171A21] text-[#C6D4DF]"
    }`}>
      {/* Top Steam-style Bar */}
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${
        soulsAtmosphere ? "bg-[#151210] border-[#2A221C]" : "bg-[#1B2838] border-[#2A475E]"
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-base">🎮</span>
          <div className="flex items-center gap-1 font-semibold text-xs tracking-wider uppercase">
            <span className={soulsAtmosphere ? "text-amber-400 font-serif" : "text-[#66C0F4]"}>
              Steam • Souls Vault
            </span>
          </div>
          <div className="flex items-center gap-1 ml-4 bg-black/40 p-1 rounded border border-white/10">
            <button
              onClick={() => setActiveTab("library")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === "library"
                  ? soulsAtmosphere ? "bg-amber-600 text-white" : "bg-[#2A475E] text-white"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Library ({gamesData.length})
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === "achievements"
                  ? soulsAtmosphere ? "bg-amber-600 text-white" : "bg-[#2A475E] text-white"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Achievements ({allAchievements.length})
            </button>
          </div>
        </div>

        {/* Souls Theme Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoulsAtmosphere(!soulsAtmosphere)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-all ${
              soulsAtmosphere
                ? "bg-amber-950/60 border-amber-600/50 text-amber-300"
                : "bg-white/5 border-white/10 text-stone-300 hover:bg-white/10"
            }`}
          >
            <span>{soulsAtmosphere ? "🔥 Souls Ember Active" : "✨ Steam Classic"}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      {activeTab === "library" ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar Games List (260px) */}
          <div className={`w-[260px] flex-shrink-0 flex flex-col border-r overflow-y-auto p-2 ${
            soulsAtmosphere ? "bg-[#120F0D] border-[#241C16]" : "bg-[#182330] border-[#223547]"
          }`}>
            <div className="px-2 py-1.5 mb-2">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded bg-black/40 border border-white/10 focus:outline-none focus:border-amber-500 text-white"
              />
            </div>

            <div className="text-[10px] font-semibold uppercase px-2 mb-1 text-stone-500 tracking-wider">
              Favorite Games ({filteredGames.length})
            </div>

            <div className="space-y-1">
              {filteredGames.map((game) => {
                const isSelected = selectedGame.id === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(game)}
                    className={`w-full text-left px-2.5 py-2 rounded flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? soulsAtmosphere
                          ? "bg-amber-950/70 text-amber-200 border border-amber-700/50 shadow-sm"
                          : "bg-[#2A475E] text-white"
                        : "hover:bg-white/5 text-stone-400 hover:text-white"
                    }`}
                  >
                    <img
                      src={game.cover}
                      alt={game.title}
                      className="w-7 h-9 object-cover rounded shadow"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{game.title}</div>
                      <div className="text-[10px] text-stone-500 truncate">
                        {game.playtimeHours} hrs • {game.status}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Main Game Detail Pane */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Hero Banner with Vignette and Floating Embers */}
            <div className="relative h-64 w-full overflow-hidden flex-shrink-0 bg-black">
              <img
                src={selectedGame.banner}
                alt={selectedGame.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0B] via-[#0E0C0B]/60 to-transparent" />
              
              {/* Souls Ember overlay sparks */}
              {soulsAtmosphere && (
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <div className="absolute bottom-6 left-12 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <div className="absolute bottom-16 right-24 w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  <div className="absolute top-10 left-1/3 w-2 h-2 rounded-full bg-amber-300 animate-bounce" />
                </div>
              )}

              {/* Title & Primary Play Info */}
              <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur text-[10px] uppercase font-mono text-amber-300 border border-amber-500/30">
                      {selectedGame.genre}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      {selectedGame.studio} ({selectedGame.releaseYear})
                    </span>
                  </div>
                  <h1 className={`text-2xl md:text-3xl font-bold tracking-tight text-white ${
                    soulsAtmosphere ? "font-serif text-amber-100" : ""
                  }`}>
                    {selectedGame.title}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[11px] text-stone-400">PLAY TIME</div>
                    <div className="text-base font-bold font-mono text-amber-400">
                      {selectedGame.playtimeHours}h on record
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded bg-amber-600/90 text-white font-bold text-xs shadow-lg shadow-amber-900/40">
                    ⭐ {selectedGame.userRating}/10
                  </div>
                </div>
              </div>
            </div>

            {/* Content Details Grid */}
            <div className="p-6 space-y-6">
              {/* Summary */}
              <p className="text-sm text-stone-300 leading-relaxed max-w-3xl">
                {selectedGame.summary}
              </p>

              {/* Boss / Build / Moment Showcase Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    ⚔️ Favorite Boss
                  </div>
                  <div className="text-xs font-medium text-white">{selectedGame.favoriteBoss}</div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    🛡️ Favorite Build
                  </div>
                  <div className="text-xs font-medium text-white">{selectedGame.favoriteBuild}</div>
                </div>

                <div className="p-4 rounded-xl border border-white/10 bg-black/30 backdrop-blur-sm space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    ✨ Unforgettable Moment
                  </div>
                  <div className="text-xs font-medium text-white">{selectedGame.favoriteMoment}</div>
                </div>
              </div>

              {/* Personal Notes */}
              <div className="p-4 rounded-xl border border-amber-900/30 bg-amber-950/15">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  📜 Personal Journal & Combat Impressions
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {selectedGame.personalNotes}
                </p>
              </div>

              {/* Game Specific Achievements */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Unlocked Achievements ({selectedGame.achievements.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedGame.achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`p-3 rounded-lg border flex items-start gap-3 ${
                        ach.isRealLife
                          ? "bg-amber-950/30 border-amber-500/40"
                          : "bg-black/40 border-white/10"
                      }`}
                    >
                      <span className="text-2xl">{ach.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate">{ach.title}</h4>
                          <span className="text-[10px] font-mono text-amber-400">{ach.rarity}</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">{ach.description}</p>
                        <div className="text-[10px] text-stone-500 mt-1 font-mono">
                          Unlocked: {ach.dateUnlocked}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Achievements Tab (Gaming & Real-Life Milestones) */
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div>
              <h2 className={`text-xl font-bold text-white ${soulsAtmosphere ? "font-serif text-amber-200" : ""}`}>
                Hall of Trophies & Milestones
              </h2>
              <p className="text-xs text-stone-400">
                Major victories: vanquishing FromSoftware bosses & shipping production AI and Web3 infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allAchievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-xl border flex items-start gap-3.5 transition-all ${
                    ach.isRealLife
                      ? "bg-gradient-to-r from-amber-950/40 to-black border-amber-500/40 shadow-md"
                      : "bg-black/35 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                    {ach.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white truncate">{ach.title}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-amber-400 font-mono">
                        {ach.rarity}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-amber-300/80 mt-0.5">
                      {ach.game} • {ach.dateUnlocked}
                    </div>
                    <p className="text-xs text-stone-300 mt-1 leading-snug">
                      {ach.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
