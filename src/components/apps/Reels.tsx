import React, { useState, useRef, useEffect } from "react";
import { reelsData, REEL_TOOLS, type ReelItem, type ReelCategory } from "~/data/reels";
import { useStore } from "~/stores";
import SafeImage from "~/components/SafeImage";

export default function Reels() {
  const [activeReel, setActiveReel] = useState<ReelItem>(reelsData[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoomLevel, setZoomLevel] = useState("Fit up to 100%");
  
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);

  const formatTimeAE = (seconds: number, fps: number) => {
    if (isNaN(seconds)) return "00:00:00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * fps);
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}:${frames.toString().padStart(2, "0")}`;
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (mainVideoRef.current) {
      mainVideoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc] font-sans text-xs select-none">
      {/* Top Menu Bar */}
      <div className="h-7 bg-[#2d2d2d] border-b border-[#111111] flex items-center px-2 shadow-sm text-[11px]">
        <div className="flex items-center gap-1.5 mr-4 text-purple-400 font-bold bg-[#1e1e1e] px-1 rounded-sm border border-[#111111]">
          Ae
        </div>
        {["File", "Edit", "Composition", "Layer", "Effect", "Animation", "View", "Window", "Help"].map((item) => (
          <div key={item} className="px-2.5 py-1 hover:bg-[#3d3d3d] rounded-sm cursor-default">
            {item}
          </div>
        ))}
        <div className="flex-1" />
        <div className="flex items-center bg-[#1e1e1e] border border-[#111111] rounded-sm px-2 py-0.5">
          <span className="text-[10px] text-gray-500 mr-2">Search Help</span>
          <span className="i-ph:magnifying-glass" style={{ fontSize: 10, color: "#6b7280" }} />
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden p-1 gap-1">
        
        {/* Top Section: Project & Comp View */}
        <div className="flex-1 flex gap-1 min-h-0">
          
          {/* Left Panel: Project & Effect Controls */}
          <div className="w-[300px] flex flex-col gap-1 flex-shrink-0">
            {/* Project Panel */}
            <div className="flex-1 bg-[#252525] border border-[#111111] flex flex-col">
              <div className="h-6 bg-[#2d2d2d] flex items-center px-2 gap-2 text-[11px]">
                <div className="text-white bg-[#1e1e1e] px-2 py-0.5 border border-[#111111] border-b-0 rounded-t-sm">Project =</div>
                <div className="text-gray-400">Effect Controls</div>
              </div>
              
              <div className="p-2 border-b border-[#111111] flex gap-2">
                 <div className="w-16 h-12 bg-black border border-white/20">
                   <SafeImage src={activeReel.thumbnail} className="w-full h-full object-cover" alt="thumb" ratio="4 / 3" />
                 </div>
                 <div className="flex-1 text-[10px]">
                   <div className="font-bold text-white mb-0.5">{activeReel.title}</div>
                   <div>1920 x 1080 (1.00)</div>
                   <div>{formatTimeAE(duration || 48, activeReel.fps)}, {activeReel.fps}.00 fps</div>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                 {/* Project items list */}
                 <div className="flex text-[10px] font-bold bg-[#1e1e1e] border-b border-[#333] px-2 py-1">
                   <div className="w-4"></div>
                   <div className="flex-1 border-r border-[#333] px-1">Name</div>
                   <div className="w-12 px-1">Type</div>
                 </div>
                 <div className="py-1">
                   {reelsData.map(reel => (
                     <div 
                       key={reel.id} 
                       onClick={() => { setActiveReel(reel); setIsPlaying(false); }}
                       className={`flex items-center px-2 py-0.5 text-[11px] cursor-pointer ${activeReel.id === reel.id ? 'bg-[#375a7f] text-white' : 'hover:bg-[#333]'}`}
                     >
                       <div className="w-4 flex justify-center text-[10px]"><span className="i-ph:film-strip" /></div>
                       <div className="flex-1 truncate px-1">{reel.title}</div>
                       <div className="w-12 px-1 text-gray-500">Comp</div>
                     </div>
                   ))}
                 </div>
              </div>
              <div className="h-6 bg-[#2d2d2d] flex items-center px-2 gap-2 text-[14px]">
                 <span className="i-ph:trash" /> <span className="i-ph:folder" /> <span className="i-ph:file" />
              </div>
            </div>
          </div>

          {/* Center Panel: Composition Viewer */}
          <div className="flex-1 bg-[#252525] border border-[#111111] flex flex-col relative min-w-0">
             <div className="h-6 bg-[#2d2d2d] flex items-center px-2 gap-2 text-[11px]">
                <div className="text-white bg-[#1e1e1e] px-2 py-0.5 border border-[#111111] border-b-0 rounded-t-sm">Composition: {activeReel.title} =</div>
             </div>
             
             {/* Viewport */}
             <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center p-4 overflow-hidden relative">
                {/* Checkerboard background for transparency simulation */}
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} />
                
                <div className="relative border border-[#444] shadow-2xl max-w-full max-h-full aspect-video z-10 flex items-center justify-center bg-black">
                   <video
                     ref={mainVideoRef}
                     src={activeReel.videoUrl}
                     poster={activeReel.thumbnail}
                     onTimeUpdate={handleTimeUpdate}
                     onLoadedMetadata={handleLoadedMetadata}
                     onEnded={() => setIsPlaying(false)}
                     className="w-full h-full object-contain"
                   />
                   
                   {/* Transform Handles overlay */}
                   <div className="absolute inset-0 border border-[#2d8ceb] pointer-events-none flex items-center justify-center">
                     <div className="w-2 h-2 border border-[#2d8ceb] bg-white absolute top-[-4px] left-[-4px]" />
                     <div className="w-2 h-2 border border-[#2d8ceb] bg-white absolute top-[-4px] right-[-4px]" />
                     <div className="w-2 h-2 border border-[#2d8ceb] bg-white absolute bottom-[-4px] left-[-4px]" />
                     <div className="w-2 h-2 border border-[#2d8ceb] bg-white absolute bottom-[-4px] right-[-4px]" />
                     
                     <div className="w-4 h-4 border border-[#2d8ceb] rounded-full absolute" />
                   </div>
                </div>
             </div>

             {/* Bottom toolbar of viewport */}
             <div className="h-8 bg-[#2d2d2d] flex items-center px-2 text-[10px] gap-3">
               <div className="flex items-center gap-1">
                 <span className="text-[#2d8ceb] font-mono">{zoomLevel}</span> 
                 <span className="text-[8px]">▼</span>
               </div>
               <div className="font-mono text-[#2d8ceb]">{formatTimeAE(currentTime, activeReel.fps)}</div>
               <div className="text-gray-400">Full</div>
               <div className="text-gray-400">1 View</div>
               <div className="flex-1" />
               <div className="text-gray-400">Active Camera</div>
             </div>
          </div>

          {/* Right Panel: Info, Audio, Preview, Effects */}
          <div className="w-[260px] flex flex-col gap-1 flex-shrink-0">
             <div className="flex-1 bg-[#252525] border border-[#111111] flex flex-col">
               <div className="h-6 bg-[#2d2d2d] flex items-center px-2 gap-2 text-[11px]">
                  <div className="text-gray-400">Info</div>
                  <div className="text-white bg-[#1e1e1e] px-2 py-0.5 border border-[#111111] border-b-0 rounded-t-sm">Preview =</div>
               </div>
               <div className="p-3 flex flex-col gap-2">
                 <div className="flex items-center justify-center gap-4 text-xl">
                   <button className="hover:text-white text-gray-400 flex"><span className="i-ph:skip-back-fill" /></button>
                   <button className="hover:text-white text-gray-400 flex"><span className="i-ph:rewind-fill" /></button>
                   <button onClick={togglePlay} className="hover:text-white text-[#2d8ceb] text-2xl w-8 text-center">{isPlaying ? <span className="i-ph:pause-fill" /> : <span className="i-ph:play-fill" />}</button>
                   <button className="hover:text-white text-gray-400 flex"><span className="i-ph:fast-forward-fill" /></button>
                   <button className="hover:text-white text-gray-400 flex"><span className="i-ph:skip-forward-fill" /></button>
                 </div>
                 <div className="flex justify-between items-center px-4 mt-2">
                   <div className="flex flex-col items-center">
                     <span className="text-gray-500 text-[9px]">Shortcut</span>
                     <span>Spacebar</span>
                   </div>
                   <div className="flex flex-col items-center">
                     <span className="text-gray-500 text-[9px]">Framerate</span>
                     <span>{activeReel.fps}</span>
                   </div>
                 </div>
               </div>
             </div>

             <div className="flex-1 bg-[#252525] border border-[#111111] flex flex-col">
               <div className="h-6 bg-[#2d2d2d] flex items-center px-2 gap-2 text-[11px]">
                  <div className="text-white bg-[#1e1e1e] px-2 py-0.5 border border-[#111111] border-b-0 rounded-t-sm">Effects & Presets =</div>
               </div>
               <div className="p-2">
                 <input type="text" className="w-full bg-[#1e1e1e] border border-[#111111] px-2 py-1 text-[11px] outline-none focus:border-[#2d8ceb]" placeholder="Contains:" />
                 <div className="mt-2 space-y-1 text-gray-400 pl-2">
                   <div>▶ *Animation Presets</div>
                   <div>▶ 3D Channel</div>
                   <div>▶ Audio</div>
                   <div>▶ Blur & Sharpen</div>
                   <div>▶ Color Correction</div>
                   <div>▶ Distort</div>
                   <div>▶ Generate</div>
                   <div>▶ Keying</div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Bottom Section: Timeline Area */}
        <div className="h-[220px] flex border border-[#111111] bg-[#252525] flex-shrink-0">
          
          {/* Layer Headers */}
          <div className="w-[350px] flex flex-col border-r border-[#111111] bg-[#252525]">
             <div className="h-6 bg-[#2d2d2d] flex items-center px-2 gap-2 text-[11px] border-b border-[#111111]">
                <div className="text-white bg-[#1e1e1e] px-2 py-0.5 border border-[#111111] border-b-0 rounded-t-sm">Render Queue</div>
                <div className="text-white bg-[#1e1e1e] px-2 py-0.5 border border-[#111111] border-b-0 rounded-t-sm">{activeReel.title} =</div>
             </div>
             
             {/* Layer Columns Header */}
             <div className="flex h-5 border-b border-[#111111] bg-[#1e1e1e] text-[9px] font-bold items-center shadow-sm">
                <div className="w-6 border-r border-[#333] text-center">#</div>
                <div className="w-6 border-r border-[#333] text-center"><span className="i-ph:eye" /></div>
                <div className="w-6 border-r border-[#333] text-center"><span className="i-ph:lock" /></div>
                <div className="flex-1 border-r border-[#333] px-2">Layer Name</div>
                <div className="w-16 border-r border-[#333] text-center">Mode</div>
                <div className="w-12 text-center">TrkMat</div>
             </div>

             {/* Layers */}
             <div className="flex-1 overflow-y-auto">
               <div className="flex h-5 border-b border-[#111111] items-center text-[10px] bg-[#2d2d2d]">
                  <div className="w-6 border-r border-[#333] text-center">1</div>
                  <div className="w-6 border-r border-[#333] text-center text-[#2d8ceb]"><span className="i-ph:eye" /></div>
                  <div className="w-6 border-r border-[#333] text-center"></div>
                  <div className="flex-1 border-r border-[#333] px-2 flex items-center gap-1">
                    <span className="text-[8px]">▶</span>
                    <span className="w-2 h-2 bg-[#b395d8] rounded-sm"></span>
                    <span className="text-white">{activeReel.title}.mp4</span>
                  </div>
                  <div className="w-16 border-r border-[#333] text-center text-gray-300">Normal</div>
                  <div className="w-12 text-center text-gray-500">None</div>
               </div>
               
               {activeReel.category === "Color Grading" && (
                 <div className="flex h-5 border-b border-[#111111] items-center text-[10px]">
                    <div className="w-6 border-r border-[#333] text-center">2</div>
                    <div className="w-6 border-r border-[#333] text-center text-[#2d8ceb]"><span className="i-ph:eye" /></div>
                    <div className="w-6 border-r border-[#333] text-center"></div>
                    <div className="flex-1 border-r border-[#333] px-2 flex items-center gap-1">
                      <span className="text-[8px]">▶</span>
                      <span className="w-2 h-2 bg-[#d895b3] rounded-sm"></span>
                      <span className="text-white">Lumetri Color Adjustment</span>
                    </div>
                    <div className="w-16 border-r border-[#333] text-center text-gray-300">Normal</div>
                    <div className="w-12 text-center text-gray-500">None</div>
                 </div>
               )}
               
               <div className="flex h-5 border-b border-[#111111] items-center text-[10px]">
                  <div className="w-6 border-r border-[#333] text-center">3</div>
                  <div className="w-6 border-r border-[#333] text-center text-[#2d8ceb]"><span className="i-ph:eye" /></div>
                  <div className="w-6 border-r border-[#333] text-center"></div>
                  <div className="flex-1 border-r border-[#333] px-2 flex items-center gap-1">
                    <span className="text-[8px]">▶</span>
                    <span className="w-2 h-2 bg-[#95d8b3] rounded-sm"></span>
                    <span className="text-white">Audio Sync Stems.wav</span>
                  </div>
                  <div className="w-16 border-r border-[#333] text-center text-gray-300">Normal</div>
                  <div className="w-12 text-center text-gray-500">None</div>
               </div>
             </div>
          </div>

          {/* Timeline Tracks */}
          <div className="flex-1 flex flex-col bg-[#1e1e1e] relative">
             <div className="h-6 bg-[#2d2d2d] flex items-center justify-between px-2 gap-2 text-[11px] border-b border-[#111111]">
                <div className="flex items-center gap-4 text-[#2d8ceb] font-mono">
                  <span>{formatTimeAE(currentTime, activeReel.fps)}</span>
                  <span className="text-gray-500 text-[9px]">( {activeReel.fps} fps )</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max={duration || 100} 
                  step="0.01" 
                  value={currentTime} 
                  onChange={handleSeek} 
                  className="flex-1 max-w-sm h-1.5 bg-[#444] rounded-full appearance-none accent-[#2d8ceb] cursor-ew-resize"
                />
             </div>
             
             {/* Time Ruler */}
             <div className="flex h-5 border-b border-[#111111] items-end text-[9px] font-mono text-gray-400 relative">
                <div className="absolute top-0 bottom-0 left-0 right-0 overflow-hidden pointer-events-none" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 49px, #333 49px, #333 50px)' }}></div>
                <div className="flex justify-between w-full px-2 z-10">
                   <span>0s</span><span>5s</span><span>10s</span><span>15s</span><span>20s</span><span>25s</span><span>30s</span>
                </div>
             </div>

             {/* Layer Bars */}
             <div className="flex-1 relative overflow-y-auto pt-[2px]">
               {/* Playhead line */}
               <div 
                 className="absolute top-0 bottom-0 w-px bg-[#ff0000] z-20 pointer-events-none" 
                 style={{ left: `${Math.min(100, Math.max(0, (currentTime / (duration || 48)) * 100))}%` }}
               >
                 <div className="w-2.5 h-2.5 bg-[#ff0000] -translate-x-1/2 -mt-[5px]" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}></div>
               </div>

               {/* Track 1 */}
               <div className="h-5 flex items-center mb-0.5 relative">
                 <div className="absolute top-0 bottom-0 left-0 bg-[#b395d8]/40 border border-[#b395d8]/60 rounded-sm ml-2" style={{ width: '90%' }}>
                   <div className="px-1 text-[8px] text-white/80 truncate h-full flex items-center">[{activeReel.title}.mp4]</div>
                 </div>
               </div>

               {/* Track 2 */}
               {activeReel.category === "Color Grading" && (
                 <div className="h-5 flex items-center mb-0.5 relative">
                   <div className="absolute top-0 bottom-0 left-0 bg-[#d895b3]/40 border border-[#d895b3]/60 rounded-sm ml-2" style={{ width: '100%' }}>
                      <div className="absolute left-[20%] w-1.5 h-1.5 bg-[#2d8ceb] rotate-45 top-1.5" />
                      <div className="absolute left-[50%] w-1.5 h-1.5 bg-[#2d8ceb] rotate-45 top-1.5" />
                   </div>
                 </div>
               )}
               
               {/* Track 3 */}
               <div className="h-5 flex items-center relative">
                 <div className="absolute top-0 bottom-0 left-0 bg-[#95d8b3]/40 border border-[#95d8b3]/60 rounded-sm ml-2 flex items-center" style={{ width: '90%' }}>
                   <div className="px-1 text-[8px] text-white/80 truncate h-full flex items-center flex-1">[Audio Sync Stems.wav]</div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
