import React, { useState } from "react";
import { gamesData, allAchievements, type GameItem } from "~/data/games";

export default function GameLibrary() {
  const [selectedGame, setSelectedGame] = useState<GameItem>(gamesData[0]);
  const [activeTab, setActiveTab] = useState<"store" | "library" | "community" | "profile">("library");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGames = gamesData.filter((g) =>
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full select-none font-sans overflow-hidden bg-[#1b2838] text-[#c7d5e0]">
      {/* Top Steam Nav Bar */}
      <div className="bg-[#171a21] h-[72px] flex items-center px-4 flex-shrink-0 justify-between">
        <div className="flex items-center gap-6 h-full">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-wider text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 0C5.372 0 0 5.373 0 12c0 4.966 3.023 9.219 7.336 10.99l2.766-4.004c-.035-.19-.057-.384-.057-.584 0-1.895 1.54-3.435 3.437-3.435 1.096 0 2.072.518 2.71 1.328l4.332-1.874V14.39c0-3.155-2.558-5.714-5.714-5.714-3.155 0-5.714 2.56-5.714 5.715 0 .28.026.554.072.822L6.113 19.34C2.52 17.844 0 14.214 0 12 0 5.373 5.373 0 12 0c6.628 0 12 5.373 12 12 0 6.628-5.372 12-12 12-1.226 0-2.408-.184-3.53-.52l3.036-4.396c.162.012.325.02.492.02 1.897 0 3.438-1.54 3.438-3.435 0-.203-.024-.4-.06-.593l4.316-1.866v-.025C19.7 7.747 16.326 4.37 12 4.37c-4.327 0-7.7 3.377-7.7 7.703 0 .445.04.88.113 1.303l-3.328 4.815c-1.026-1.573-1.62-3.473-1.62-5.52 0-5.523 4.478-10 10-10s10 4.477 10 10-4.478 10-10 10c-.392 0-.776-.027-1.155-.072zM15.438 15.65c-.868 0-1.572-.705-1.572-1.573 0-.868.704-1.57 1.572-1.57s1.57.702 1.57 1.57c0 .868-.702 1.573-1.57 1.573zm-6.246 3.104l-1.954-2.83c-.705.215-1.196.864-1.196 1.642 0 .947.768 1.716 1.716 1.716.593 0 1.11-.3 1.434-.528z" />
            </svg>
            STEAM
          </div>
          <div className="flex h-full text-[15px] font-medium tracking-wide">
            {["store", "library", "community", "profile"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 h-full uppercase hover:text-white transition-colors ${
                  activeTab === tab ? "text-white border-b-2 border-[#1a9fff]" : "text-[#b8b6b4]"
                }`}
              >
                {tab === "profile" ? "Aditya" : tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="bg-[#5c7e10] text-white px-3 py-1.5 rounded-sm hover:bg-[#799905] cursor-pointer shadow-sm">
            Install Steam
          </div>
          <div className="flex items-center gap-2 text-[#b8b6b4] hover:text-white cursor-pointer">
            <div className="w-5 h-5 bg-[#3d4450] rounded-sm flex items-center justify-center">
              ✉
            </div>
          </div>
          <div className="flex items-center gap-2 hover:text-white cursor-pointer">
            <span className="text-[#b8b6b4]">aditya44</span>
            <div className="w-7 h-7 rounded-sm bg-blue-500 overflow-hidden">
              <img src="https://avatars.githubusercontent.com/u/101980860?v=4" alt="avatar" />
            </div>
            <span className="text-[10px] text-gray-500">▼</span>
          </div>
        </div>
      </div>

      {/* Library View */}
      {activeTab === "library" && (
        <div className="flex-1 flex overflow-hidden bg-[#1e1e24]">
          {/* Left Sidebar (Game List) */}
          <div className="w-[280px] bg-[#1e1e24] flex-shrink-0 flex flex-col border-r border-[#2a2a33]">
            {/* Search and Filters */}
            <div className="p-3 bg-[#1e1e24] sticky top-0 z-10">
              <div className="flex bg-[#282d33] border border-[#30363e] rounded-sm items-center px-2 py-1 focus-within:border-[#1a9fff] transition-colors">
                <span className="text-gray-400 text-xs mr-2">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or tag"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none text-xs text-white focus:outline-none w-full"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto pb-4">
              <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1 mb-1 bg-[#1e1e24] sticky top-0 shadow-[0_4px_4px_rgba(0,0,0,0.1)]">
                Favorites ({filteredGames.length})
              </div>
              <div className="flex flex-col">
                {filteredGames.map((game) => {
                  const isSelected = selectedGame.id === game.id;
                  return (
                    <button
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className={`text-left flex items-center px-4 py-1.5 group transition-colors ${
                        isSelected ? "bg-[#3d4450]" : "hover:bg-[#2a2a33]"
                      }`}
                    >
                      <div className={`w-4 h-4 mr-3 flex-shrink-0 flex items-center justify-center opacity-80 ${
                        isSelected ? "opacity-100" : "group-hover:opacity-100"
                      }`}>
                        <img src={game.cover} alt="icon" className="w-full h-full object-cover" />
                      </div>
                      <span className={`text-[13px] truncate ${
                        isSelected ? "text-white font-semibold" : "text-[#8f98a0]"
                      }`}>
                        {game.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area (Game Details) */}
          <div className="flex-1 flex flex-col overflow-y-auto bg-[#171a21] relative">
            
            {/* Background Blur Image */}
            <div className="absolute inset-0 pointer-events-none z-0">
               <img src={selectedGame.banner} className="w-full h-full object-cover opacity-20 blur-sm" alt="bg" />
               <div className="absolute inset-0 bg-gradient-to-b from-[#1b2838]/80 via-[#171a21]/95 to-[#171a21]" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              {/* Hero Banner Area */}
              <div className="w-full h-[320px] flex-shrink-0 relative">
                <img src={selectedGame.banner} alt={selectedGame.title} className="w-full h-full object-cover" style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }} />
                
                {/* Title Overlay */}
                <div className="absolute bottom-6 left-8 drop-shadow-lg">
                  <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                    {selectedGame.title.split(":")[0]}
                  </h1>
                  {selectedGame.title.includes(":") && (
                    <h2 className="text-2xl font-bold text-[#c7d5e0] mt-1" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8)' }}>
                      {selectedGame.title.split(":")[1]}
                    </h2>
                  )}
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-8 -mt-6 relative z-20 flex gap-4">
                <button className="bg-gradient-to-r from-[#47bfff] to-[#1a44c2] hover:from-[#47bfff] hover:to-[#2153e9] text-white px-10 py-3 rounded-[3px] text-lg font-bold flex flex-col items-center justify-center shadow-lg transform transition active:scale-95">
                  PLAY
                </button>
                <div className="flex flex-1 bg-black/40 backdrop-blur-md rounded-[3px] border border-white/5 px-6 py-2 items-center justify-between">
                  <div className="flex gap-12">
                    <div>
                      <div className="text-[11px] text-[#8f98a0] font-semibold tracking-wider">PLAY TIME</div>
                      <div className="text-xl text-white font-light">{selectedGame.playtimeHours} hours</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#8f98a0] font-semibold tracking-wider">LAST PLAYED</div>
                      <div className="text-xl text-white font-light">Today</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-[#8f98a0] font-semibold tracking-wider">ACHIEVEMENTS</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-32 h-2 bg-[#2a2a33] rounded-full overflow-hidden">
                          <div className="h-full bg-[#1a9fff]" style={{ width: '100%' }}></div>
                        </div>
                        <div className="text-sm text-white font-light">{selectedGame.achievements.length}/{selectedGame.achievements.length}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="bg-[#2a2a33] hover:bg-[#3d4450] text-[#c7d5e0] px-3 py-1.5 rounded-[3px] text-sm flex items-center transition">
                      ⚙️ Manage
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="p-8 grid grid-cols-3 gap-6">
                
                {/* Left Column - Main Content */}
                <div className="col-span-2 space-y-6">
                  {/* Recent News / Activity */}
                  <div className="bg-black/30 border border-white/5 rounded p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[13px] font-bold text-white uppercase tracking-wider">Activity Feed</h3>
                      <button className="text-[11px] text-[#1a9fff] hover:text-white uppercase tracking-wider">View All</button>
                    </div>
                    
                    <div className="flex gap-4 items-start pb-4 border-b border-white/5">
                      <div className="w-8 h-8 rounded-full bg-blue-500 overflow-hidden flex-shrink-0">
                         <img src="https://avatars.githubusercontent.com/u/101980860?v=4" alt="avatar" />
                      </div>
                      <div>
                        <div className="text-[13px] text-white">
                          <span className="font-bold">Aditya</span> unlocked an achievement
                        </div>
                        <div className="mt-2 bg-[#2a2a33] border border-white/10 rounded p-3 flex items-center gap-4 hover:bg-[#30363e] transition cursor-pointer">
                           <div className="w-12 h-12 bg-black/50 rounded flex items-center justify-center text-2xl">
                             {selectedGame.achievements[0]?.icon}
                           </div>
                           <div>
                             <div className="text-sm font-bold text-white">{selectedGame.achievements[0]?.title}</div>
                             <div className="text-[12px] text-[#8f98a0]">{selectedGame.achievements[0]?.description}</div>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-[13px] text-[#8f98a0] leading-relaxed">
                      {selectedGame.personalNotes}
                    </div>
                  </div>

                  {/* Screenshots */}
                  <div>
                    <h3 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">Screenshots</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedGame.screenshots?.map((shot, idx) => (
                        <div key={idx} className="aspect-video rounded overflow-hidden cursor-pointer hover:opacity-80 transition bg-black">
                          <img src={shot} alt="screenshot" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column - Sidebar info */}
                <div className="space-y-6">
                  {/* Achievements */}
                  <div className="bg-black/30 border border-white/5 rounded p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-[13px] font-bold text-white uppercase tracking-wider">Achievements</h3>
                    </div>
                    <div className="space-y-2">
                      {selectedGame.achievements.map((ach) => (
                        <div key={ach.id} className="flex items-center gap-3 bg-[#2a2a33]/50 p-2 rounded border border-white/5 group hover:bg-[#3d4450] transition">
                           <div className="w-10 h-10 bg-black/60 rounded flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                             {ach.icon}
                           </div>
                           <div className="flex-1 min-w-0">
                             <div className="text-[13px] font-medium text-white truncate">{ach.title}</div>
                             <div className="text-[11px] text-[#8f98a0] truncate">{ach.rarity}</div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="bg-black/30 border border-white/5 rounded p-4">
                     <h3 className="text-[13px] font-bold text-white uppercase tracking-wider mb-3">Game Details</h3>
                     <div className="text-[13px] space-y-2">
                       <div className="flex justify-between">
                         <span className="text-[#8f98a0]">Developer</span>
                         <span className="text-[#1a9fff]">{selectedGame.studio}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-[#8f98a0]">Publisher</span>
                         <span className="text-[#1a9fff]">{selectedGame.publisher}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-[#8f98a0]">Release Date</span>
                         <span className="text-white">{selectedGame.releaseYear}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-[#8f98a0]">Features</span>
                         <span className="text-[#1a9fff]">Single-player</span>
                       </div>
                     </div>
                  </div>

                  {/* Build/Highlights */}
                  <div className="bg-black/30 border border-white/5 rounded p-4 space-y-3">
                     <div>
                       <div className="text-[11px] font-bold text-[#8f98a0] uppercase tracking-wider mb-1">Favorite Boss</div>
                       <div className="text-[13px] text-white">{selectedGame.favoriteBoss}</div>
                     </div>
                     <div>
                       <div className="text-[11px] font-bold text-[#8f98a0] uppercase tracking-wider mb-1">Favorite Build</div>
                       <div className="text-[13px] text-white">{selectedGame.favoriteBuild}</div>
                     </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Other Tabs Placeholder */}
      {activeTab !== "library" && (
        <div className="flex-1 flex items-center justify-center bg-[#1e1e24] text-[#8f98a0]">
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view coming soon...
        </div>
      )}
    </div>
  );
}

