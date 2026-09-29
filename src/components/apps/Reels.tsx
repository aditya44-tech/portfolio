import React, { useState, useRef, useEffect } from "react";
import { reelsData, REEL_TOOLS, type ReelItem, type ReelCategory } from "~/data/reels";
import { useStore } from "~/stores";

export default function Reels() {
  const dark = useStore((s) => s.dark);
  const [selectedCategory, setSelectedCategory] = useState<ReelCategory>("All");
  const [activeReel, setActiveReel] = useState<ReelItem>(reelsData[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [sliderPos, setSliderPos] = useState(50); // for before/after comparison
  const [hoveredReelId, setHoveredReelId] = useState<string | null>(null);

  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewVideoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const filteredReels = selectedCategory === "All"
    ? reelsData
    : reelsData.filter((r) => r.category === selectedCategory);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!mainVideoRef.current) return;
    if (mainVideoRef.current.paused) {
      mainVideoRef.current.play();
      setIsPlaying(true);
    } else {
      mainVideoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (mainVideoRef.current) {
      mainVideoRef.current.volume = val;
      mainVideoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!mainVideoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    mainVideoRef.current.muted = nextMuted;
  };

  const handleSelectReel = (reel: ReelItem) => {
    setActiveReel(reel);
    setIsPlaying(false);
    setCurrentTime(0);
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime = 0;
      mainVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleHoverReel = (id: string, isHovering: boolean) => {
    setHoveredReelId(isHovering ? id : null);
    const v = previewVideoRefs.current[id];
    if (!v) return;
    if (isHovering) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  // Sync playback time
  const handleTimeUpdate = () => {
    if (mainVideoRef.current) {
      setCurrentTime(mainVideoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (mainVideoRef.current) {
      setDuration(mainVideoRef.current.duration);
    }
  };

  const changeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (mainVideoRef.current) {
      mainVideoRef.current.playbackRate = rate;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#121215] text-[#ECECF1] select-none font-sans overflow-hidden">
      {/* Top Application Bar - Final Cut Pro Style */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#23232A] bg-[#18181D]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E91E63] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A0A0B0]">
              Final Cut Pro • Reels Showcase
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-[#272732] text-[#8E8EA0] font-mono">
            v10.8 (ProRes 422 HQ)
          </span>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-1 bg-[#101014] p-1 rounded-lg border border-[#252530]">
          {(["All", "AMV", "Motion Graphics", "Text Animation", "Color Grading"] as ReelCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-[#E91E63] text-white shadow-sm"
                  : "text-[#8E8EA0] hover:text-white hover:bg-[#1E1E26]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#8E8EA0]">
          <span>Project:</span>
          <span className="text-white font-medium">Aditya_Reels_2026</span>
        </div>
      </div>

      {/* Main Workspace (Left: Clips Browser, Right: Viewport Monitor & Details) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Clips Browser (Width: ~340px) */}
        <div className="w-[340px] flex-shrink-0 flex flex-col border-r border-[#23232A] bg-[#15151A]">
          <div className="p-3 border-b border-[#23232A] flex items-center justify-between bg-[#191920]">
            <span className="text-xs font-semibold text-[#B0B0C0] uppercase tracking-wider">
              Project Media ({filteredReels.length} Clips)
            </span>
            <span className="text-[11px] text-[#6E6E80]">Hover for Live Preview</span>
          </div>

          {/* Reel Clips Grid */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {filteredReels.map((reel) => {
              const isSelected = activeReel.id === reel.id;
              const isHovered = hoveredReelId === reel.id;
              return (
                <div
                  key={reel.id}
                  onClick={() => handleSelectReel(reel)}
                  onMouseEnter={() => handleHoverReel(reel.id, true)}
                  onMouseLeave={() => handleHoverReel(reel.id, false)}
                  className={`group relative rounded-lg border p-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#E91E63] bg-[#221828] shadow-md shadow-pink-950/20"
                      : "border-[#272733] bg-[#1A1A22] hover:border-[#3E3E50] hover:bg-[#20202A]"
                  }`}
                >
                  {/* Thumbnail / Hover Video Preview */}
                  <div className="relative aspect-video rounded-md overflow-hidden bg-black mb-2 border border-white/5">
                    {/* Hover muted video */}
                    <video
                      ref={(el) => {
                        previewVideoRefs.current[reel.id] = el;
                      }}
                      src={reel.previewUrl || reel.videoUrl}
                      muted
                      loop
                      playsInline
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                        isHovered ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                    />

                    {/* Poster image */}
                    <img
                      src={reel.thumbnail}
                      alt={reel.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Duration badge */}
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-white/90 z-20">
                      {reel.duration}
                    </div>

                    {/* Category pill */}
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-semibold tracking-wide uppercase text-pink-400 z-20">
                      {reel.category}
                    </div>

                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-[#E91E63] rounded-md pointer-events-none z-30" />
                    )}
                  </div>

                  {/* Title and info */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-white line-clamp-1 group-hover:text-pink-300 transition-colors">
                      {reel.title}
                    </h4>

                    {/* Software Tools Badges */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {reel.tools.map((toolName) => {
                        const tool = REEL_TOOLS.find((t) => t.name === toolName);
                        return (
                          <span
                            key={toolName}
                            style={{
                              color: tool?.color || "#A0A0B0",
                              backgroundColor: tool?.bg || "rgba(255,255,255,0.08)",
                            }}
                            className="text-[10px] px-1.5 py-0.5 rounded font-mono font-medium"
                          >
                            {tool?.icon || toolName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Main Player & Color Grade Inspector (Flex-1) */}
        <div className="flex-1 flex flex-col bg-[#0F0F12] overflow-y-auto">
          {/* Main Video Screen Area */}
          <div className="relative bg-black flex items-center justify-center p-4 border-b border-[#23232A]">
            <div className="relative w-full max-w-4xl aspect-video rounded-lg overflow-hidden bg-[#0A0A0D] shadow-2xl border border-white/10 group">
              <video
                ref={mainVideoRef}
                src={activeReel.videoUrl}
                poster={activeReel.thumbnail}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
                playsInline
                className="w-full h-full object-contain cursor-pointer"
              />

              {/* Central Play Overlay Button when paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] cursor-pointer group-hover:bg-black/30 transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-[#E91E63]/90 hover:bg-[#E91E63] text-white flex items-center justify-center shadow-xl shadow-pink-500/30 transform group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transport Controls Bar */}
          <div className="px-5 py-2.5 bg-[#17171C] border-b border-[#23232A] flex flex-wrap items-center justify-between gap-3">
            {/* Left Play Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-[#272733] hover:bg-[#E91E63] text-white flex items-center justify-center transition-colors"
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </button>

              {/* Timecode display */}
              <div className="font-mono text-xs text-[#A0A0B2] bg-[#101014] px-2.5 py-1 rounded border border-[#252530]">
                <span className="text-white font-semibold">{formatTime(currentTime)}</span>
                <span className="text-[#606070] mx-1">/</span>
                <span>{formatTime(duration || 48)}</span>
              </div>
            </div>

            {/* Middle Scrubber Bar */}
            <div className="flex-1 min-w-[200px] flex items-center gap-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.05"
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-[#E91E63] cursor-pointer h-1.5 bg-[#2A2A38] rounded-lg"
              />
            </div>

            {/* Right: Volume & Speed & Resolution */}
            <div className="flex items-center gap-3">
              {/* Volume */}
              <div className="flex items-center gap-1.5">
                <button onClick={toggleMute} className="text-[#8E8EA0] hover:text-white text-xs">
                  {isMuted || volume === 0 ? "🔇" : "🔊"}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 accent-[#E91E63] h-1 bg-[#2A2A38] rounded cursor-pointer"
                />
              </div>

              {/* Speed Buttons */}
              <div className="flex items-center gap-1 bg-[#101014] p-0.5 rounded border border-[#252530]">
                {[0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => changeSpeed(s)}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                      playbackRate === s ? "bg-[#E91E63] text-white" : "text-[#7E7E90] hover:text-white"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Reel Details & Color Grading Comparison Panel */}
          <div className="p-5 space-y-5 flex-1">
            {/* Title & Metadata Strip */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-[#23232A]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#E91E63]/20 text-[#FF4081] border border-[#E91E63]/30 uppercase">
                    {activeReel.category}
                  </span>
                  <span className="text-xs text-[#808092] font-mono">{activeReel.resolution}</span>
                  <span className="text-xs text-[#808092] font-mono">• {activeReel.fps} FPS</span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">{activeReel.title}</h2>
              </div>

              {/* Software Tool Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#7E7E90] font-medium mr-1">Tools:</span>
                {activeReel.tools.map((toolName) => {
                  const tool = REEL_TOOLS.find((t) => t.name === toolName);
                  return (
                    <div
                      key={toolName}
                      style={{
                        borderColor: tool?.color ? `${tool.color}40` : "#333",
                        backgroundColor: tool?.bg || "rgba(255,255,255,0.06)",
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs"
                    >
                      <span style={{ color: tool?.color || "#fff" }} className="font-bold font-mono">
                        {tool?.icon || "App"}
                      </span>
                      <span className="text-white/90 text-xs font-medium">{toolName}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#17171E] rounded-xl p-4 border border-[#272733] text-sm text-[#B0B0C4] leading-relaxed">
              <span className="text-xs font-semibold text-white uppercase tracking-wider block mb-1">
                Editing Notes & Techniques:
              </span>
              {activeReel.description}
            </div>

            {/* Before / After Color Grading Comparison Slider (If available) */}
            {activeReel.colorGrading && (
              <div className="bg-[#17171E] rounded-xl p-5 border border-[#272733] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">🎨 Color Grading: Before & After</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#FF5E5E]/20 text-[#FF8A80] border border-[#FF5E5E]/30">
                      LUT: {activeReel.colorGrading.lutName}
                    </span>
                  </div>
                  <span className="text-xs text-[#8E8EA0]">Drag slider or hover to compare</span>
                </div>

                {/* Interactive Split View Slider */}
                <div
                  className="relative aspect-[16/9] w-full rounded-lg overflow-hidden cursor-ew-resize select-none border border-white/10"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                    setSliderPos((x / rect.width) * 100);
                  }}
                  onTouchMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const touch = e.touches[0];
                    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
                    setSliderPos((x / rect.width) * 100);
                  }}
                >
                  {/* After Image (Graded) - Full width background */}
                  <img
                    src={activeReel.colorGrading.afterImg}
                    alt="Graded Footage"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/75 text-[11px] font-mono font-semibold text-emerald-400 z-10 backdrop-blur-sm">
                    {activeReel.colorGrading.labelAfter || "Graded Look"}
                  </div>

                  {/* Before Image (Flat S-Log) - Clipped by slider percentage */}
                  <div
                    className="absolute inset-y-0 left-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={activeReel.colorGrading.beforeImg}
                      alt="RAW Footage"
                      className="absolute inset-0 w-full h-full object-cover max-w-none"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/75 text-[11px] font-mono font-semibold text-amber-400 z-10 backdrop-blur-sm">
                      {activeReel.colorGrading.labelBefore || "RAW S-Log3"}
                    </div>
                  </div>

                  {/* Divider Line & Handle */}
                  <div
                    className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-20 pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-lg text-xs font-bold">
                      ↔
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#9090A4]">
                  {activeReel.colorGrading.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fake Final Cut Pro Timeline Strip at the Bottom */}
      <div className="h-32 border-t border-[#23232A] bg-[#141419] flex flex-col flex-shrink-0">
        {/* Timeline Header Ruler */}
        <div className="h-6 bg-[#1A1A22] border-b border-[#272733] px-4 flex items-center justify-between text-[10px] font-mono text-[#7A7A8E]">
          <div className="flex items-center gap-6">
            <span>00:00:00:00</span>
            <span>00:00:10:00</span>
            <span>00:00:20:00</span>
            <span>00:00:30:00</span>
            <span>00:00:40:00</span>
            <span>00:00:50:00</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Project Playhead: {formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Tracks Area (Video V1, Audio A1, Waveform) */}
        <div className="flex-1 relative p-2 overflow-hidden flex flex-col justify-center space-y-1.5">
          {/* Moving Playhead Vertical Bar */}
          <div
            className="absolute inset-y-0 w-0.5 bg-[#E91E63] z-20 pointer-events-none transition-all duration-75"
            style={{
              left: `${Math.min(100, Math.max(0, (currentTime / (duration || 48)) * 100))}%`,
            }}
          >
            <div className="w-3 h-3 bg-[#E91E63] -translate-x-1/2 rotate-45 rounded-sm" />
          </div>

          {/* Video Track V1 */}
          <div className="flex items-center gap-2">
            <span className="w-6 text-[10px] font-mono text-[#7A7A8E] text-right">V1</span>
            <div className="flex-1 h-7 bg-[#231E2A] rounded border border-[#E91E63]/40 flex items-center px-3 relative overflow-hidden">
              <span className="text-xs font-mono text-pink-300 truncate z-10">
                🎬 {activeReel.title} [{activeReel.fps}fps - ProRes HQ]
              </span>
              <div
                className="absolute inset-y-0 left-0 bg-[#E91E63]/25"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentTime / (duration || 48)) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Audio Track A1 & Waveform Simulation */}
          <div className="flex items-center gap-2">
            <span className="w-6 text-[10px] font-mono text-[#7A7A8E] text-right">A1</span>
            <div className="flex-1 h-7 bg-[#142322] rounded border border-emerald-500/30 flex items-center px-3 relative overflow-hidden">
              <span className="text-xs font-mono text-emerald-300 truncate z-10">
                🔊 Audio Sync Beat Stems [48kHz / 24-bit]
              </span>
              {/* Simulated Audio Waveform Bars */}
              <div className="absolute inset-0 flex items-center justify-around opacity-40 px-2 pointer-events-none">
                {[4, 12, 18, 8, 22, 14, 26, 6, 20, 16, 28, 10, 18, 24, 12, 16, 22, 10, 14, 26, 18, 8, 20, 14, 18, 22].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-emerald-400 rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
