import React, { useState } from "react";
import { animeData, currentlyWatchingAnime, type AnimeItem } from "~/data/anime";

export default function AnimeShelf() {
  const [activeTab, setActiveTab] = useState<"home" | "browse" | "simulcasts" | "news">("home");
  const [hoveredAnime, setHoveredAnime] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#000000] text-white font-sans overflow-y-auto overflow-x-hidden selection:bg-[#f47521] selection:text-white">
      {/* Top Navigation Bar */}
      <div className="bg-[#141519] h-16 flex items-center justify-between px-6 sticky top-0 z-50 border-b border-[#24252a]">
        <div className="flex items-center gap-8 h-full">
          {/* Logo (CR color #F47521) */}
          <div className="flex items-center gap-2 text-[#f47521] font-black text-xl tracking-tight cursor-pointer">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.195c4.31 0 7.805 3.495 7.805 7.805S16.31 19.805 12 19.805 4.195 16.31 4.195 12 7.69 4.195 12 4.195z" />
              <path d="M12 7.747c-2.348 0-4.253 1.905-4.253 4.253 0 2.348 1.905 4.253 4.253 4.253 2.348 0 4.253-1.905 4.253-4.253 0-2.348-1.905-4.253-4.253-4.253zm0 6.643c-1.32 0-2.39-1.07-2.39-2.39s1.07-2.39 2.39-2.39 2.39 1.07 2.39 2.39-1.07 2.39-2.39 2.39z" />
            </svg>
            CRUNCHYROLL
          </div>
          {/* Nav Links */}
          <div className="flex items-center h-full gap-1">
            {["home", "browse", "manga", "games", "news"].map((tab) => (
              <button
                key={tab}
                onClick={() => tab !== "manga" && tab !== "games" && setActiveTab(tab as any)}
                className={`px-4 h-full flex items-center text-sm font-semibold transition-colors capitalize ${
                  activeTab === tab ? "text-white border-b-[3px] border-[#f47521]" : "text-[#a0a0a0] hover:text-[#d0d0d0] hover:bg-white/5"
                }`}
              >
                {tab} <span className="ml-1 text-[10px] opacity-50">▼</span>
              </button>
            ))}
          </div>
        </div>
        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <button className="text-[#a0a0a0] hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
          <button className="text-[#a0a0a0] hover:text-white transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
          </button>
          <div className="flex items-center gap-2 hover:bg-white/5 p-1 rounded cursor-pointer transition">
             <div className="w-8 h-8 rounded-full bg-orange-500 overflow-hidden">
               <img src="https://avatars.githubusercontent.com/u/101980860?v=4" alt="profile" />
             </div>
             <span className="text-[10px] text-gray-500">▼</span>
          </div>
        </div>
      </div>

      {activeTab === "home" && (
        <div className="flex-1 pb-20">
          {/* Hero Carousel Area */}
          <div className="relative w-full h-[450px] md:h-[500px] overflow-hidden bg-[#141519]">
             {animeData[0] && (
                <>
                  <div className="absolute inset-0">
                    <img src={animeData[0].bannerImage} alt="hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent" />
                  </div>
                  <div className="relative z-10 w-full max-w-[1200px] mx-auto h-full flex flex-col justify-center px-8 md:px-16 pt-10">
                    <img src={animeData[0].coverImage} alt="logo" className="w-48 h-auto object-contain mb-4 hidden" />
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight max-w-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
                      {animeData[0].title}
                    </h1>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-1.5 py-0.5 bg-[#f47521] text-black text-[11px] font-bold uppercase rounded-sm">Sub | Dub</span>
                      <span className="text-sm font-semibold text-[#a0a0a0]">Action, Supernatural</span>
                    </div>
                    <p className="text-[#d0d0d0] text-sm max-w-xl leading-relaxed mb-8 line-clamp-3">
                      {animeData[0].whyILoveIt}
                    </p>
                    <div className="flex items-center gap-4">
                       <button className="bg-[#f47521] hover:bg-[#ff8c42] text-black font-bold uppercase tracking-wider px-8 py-3 rounded-sm flex items-center gap-2 transition transform active:scale-95">
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                         Start Watching
                       </button>
                       <button className="bg-transparent border border-white/40 hover:border-white text-white font-bold uppercase tracking-wider px-6 py-3 rounded-sm flex items-center gap-2 transition">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                         Add to Watchlist
                       </button>
                    </div>
                  </div>
                </>
             )}
          </div>

          {/* Continue Watching Row */}
          <div className="px-8 md:px-16 mt-8">
            <h2 className="text-xl font-bold mb-4">Continue Watching</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentlyWatchingAnime.map((anime) => (
                <div key={anime.id} className="group cursor-pointer">
                   <div className="relative aspect-video overflow-hidden bg-[#141519] rounded-sm mb-2 border border-white/5 group-hover:border-white/20 transition">
                      <img src={anime.bannerImage} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt={anime.title} />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                      
                      {/* Play overlay on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-12 h-12 bg-black/60 rounded-full flex items-center justify-center border-2 border-white">
                           <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                         </div>
                      </div>

                      {/* Progress bar */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#24252a]">
                         <div className="h-full bg-[#f47521]" style={{ width: '65%' }}></div>
                      </div>
                   </div>
                   <h3 className="text-sm font-semibold text-[#d0d0d0] group-hover:text-[#f47521] transition truncate">
                     {anime.title}
                   </h3>
                   <div className="text-[11px] text-[#a0a0a0] mt-0.5">{anime.currentProgress}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Just Updated / Favorites Row */}
          <div className="px-8 md:px-16 mt-12 mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Top Recommendations for You</h2>
              <button className="text-sm font-semibold text-[#a0a0a0] hover:text-white uppercase tracking-wider transition">View All</button>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {animeData.map((anime) => (
                <div 
                  key={anime.id} 
                  className="group cursor-pointer relative"
                  onMouseEnter={() => setHoveredAnime(anime.id)}
                  onMouseLeave={() => setHoveredAnime(null)}
                >
                   {/* Portrait Cover */}
                   <div className="relative aspect-[2/3] overflow-hidden bg-[#141519] mb-2">
                     <img src={anime.coverImage} className="w-full h-full object-cover" alt={anime.title} />
                     <div className="absolute top-2 right-2 bg-black/70 px-1.5 py-0.5 rounded-sm text-[10px] font-bold text-white border border-white/20">
                       ⭐ {anime.score}
                     </div>
                   </div>
                   <h3 className="text-[13px] font-medium text-[#d0d0d0] group-hover:text-[#f47521] transition line-clamp-2 leading-tight">
                     {anime.title}
                   </h3>
                   <div className="text-[11px] text-[#a0a0a0] mt-1">{anime.genres[0]}</div>

                   {/* Hover Detail Card (simplified for inline) */}
                   {hoveredAnime === anime.id && (
                     <div className="absolute z-50 left-full top-0 ml-2 w-[300px] bg-[#141519] border border-[#24252a] p-4 shadow-2xl hidden md:block">
                        <h4 className="text-lg font-bold mb-1">{anime.title}</h4>
                        <div className="flex items-center gap-2 mb-3 text-[11px] font-bold">
                           <span className="text-[#32b55b]">{anime.score} Score</span>
                           <span className="text-[#a0a0a0]">{anime.year}</span>
                           <span className="text-[#a0a0a0]">{anime.episodes}</span>
                        </div>
                        <p className="text-xs text-[#d0d0d0] leading-relaxed mb-4 line-clamp-4">
                          {anime.whyILoveIt}
                        </p>
                        <div className="flex items-center gap-2">
                          <button className="flex-1 bg-[#f47521] hover:bg-[#ff8c42] text-black font-bold uppercase py-2 text-xs flex items-center justify-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                            Play
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center border border-white/40 hover:border-white">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                          </button>
                        </div>
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer / Other Tabs */}
      {activeTab !== "home" && (
        <div className="flex-1 flex flex-col items-center justify-center text-[#a0a0a0]">
          <svg className="w-16 h-16 text-[#24252a] mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" />
          </svg>
          <p className="font-semibold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} section is currently empty.</p>
        </div>
      )}
    </div>
  );
}
