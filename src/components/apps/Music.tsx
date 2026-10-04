import { motion } from "framer-motion";
import { useAudioContext } from "~/context/AudioContext";
import music from "~/configs/music";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
}

const PINK = "#FA2D48";

const getTracks = (musicData: typeof music): Track[] => [
  {
    id: "1",
    title: musicData.title,
    artist: musicData.artist,
    album: "Portfolio OST",
    duration: "3:42",
    cover: musicData.cover,
  },
  {
    id: "2",
    title: "Chill Lofi Beat",
    artist: "Lofi Hip Hop",
    album: "Study Session",
    duration: "2:58",
    cover: musicData.cover,
  },
  {
    id: "3",
    title: "Midnight Drive",
    artist: "Synthwave Artist",
    album: "Neon Nights",
    duration: "4:15",
    cover: musicData.cover,
  },
  {
    id: "4",
    title: "Morning Coffee",
    artist: "Acoustic Vibes",
    album: "Peaceful Days",
    duration: "3:21",
    cover: musicData.cover,
  },
];

const NAV_MAIN = [
  { icon: "i-ph:house", label: "Home" },
  { icon: "i-ph:sparkle", label: "New" },
  { icon: "i-ph:radio", label: "Radio" },
  { icon: "i-ph:magnifying-glass", label: "Search" },
];

const NAV_LIBRARY = [
  { icon: "i-ph:clock", label: "Recently Added" },
  { icon: "i-ph:microphone", label: "Artists" },
  { icon: "i-ph:disc", label: "Albums" },
  { icon: "i-ph:music-note", label: "Songs" },
  { icon: "i-ph:heart", label: "Made for You" },
  { icon: "i-ph:television", label: "TV & Movies" },
  { icon: "i-ph:video", label: "Music Videos" },
  { icon: "i-ph:music-notes-simple", label: "Genres" },
  { icon: "i-ph:copy", label: "Compilations" },
  { icon: "i-ph:pen", label: "Composers" },
  { icon: "i-ph:download", label: "Downloaded" },
];

export default function MusicApp() {
  const TRACKS = useMemo(() => getTracks(music), []);
  const { audioState, controls } = useAudioContext();
  const [activeTrack, setActiveTrack] = useState(() => TRACKS[0]);
  const [view, setView] = useState("Recently Added");
  const [loved, setLoved] = useState<string[]>(["1", "2"]);
  const [lovedOnly, setLovedOnly] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const playTrack = (track: Track) => {
    setActiveTrack(track);
    if (!audioState.playing) controls.toggle(true);
  };

  const step = (dir: 1 | -1) => {
    if (shuffle) {
      const pool = TRACKS.filter((t) => t.id !== activeTrack.id);
      playTrack(pool[Math.floor(Math.random() * pool.length)]);
      return;
    }
    const i = TRACKS.findIndex((t) => t.id === activeTrack.id);
    playTrack(TRACKS[(i + dir + TRACKS.length) % TRACKS.length]);
  };

  const toggleLoved = (id: string) => {
    setLoved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const visibleTracks = lovedOnly ? TRACKS.filter((t) => loved.includes(t.id)) : TRACKS;
  const showHeader = view !== "Songs";

  const sidebarBtn = (icon: string, label: string) => {
    const selected = view === label;
    return (
      <button
        key={label}
        onClick={() => setView(label)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "7px 12px",
          width: "100%",
          background: selected ? "var(--c-bg-tertiary)" : "transparent",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          textAlign: "left",
          transition: "background 0.15s ease",
        }}
      >
        <span className={icon} style={{ width: "16px", height: "16px", flexShrink: 0, color: PINK }} />
        <span style={{ fontSize: "13px", fontWeight: selected ? 600 : 400, color: "var(--c-text)" }}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        background: "var(--c-bg)",
        color: "var(--c-text)",
        borderRadius: "0 0 14px 14px",
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar ── */}
      <div
        style={{
          width: "200px",
          flexShrink: 0,
          background: "var(--c-bg-secondary)",
          borderRight: "1px solid var(--c-border)",
          display: "flex",
          flexDirection: "column",
          padding: "12px 10px",
          gap: "2px",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px 12px" }}>
          <span className="i-ph:squares-four" style={{ width: "18px", height: "18px", color: "var(--c-text-tertiary)" }} />
          <button
            onClick={() => setLovedOnly((v) => !v)}
            title={lovedOnly ? "Show all songs" : "Show loved songs only"}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 500, color: PINK, padding: 0 }}
          >
            {lovedOnly ? "Done" : "Edit"}
          </button>
        </div>

        {NAV_MAIN.map((n) => sidebarBtn(n.icon, n.label))}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 12px 6px" }}>
          <span style={{ fontSize: "13px", color: "var(--c-text-secondary)" }}>Library</span>
          <span className="i-ph:caret-down" style={{ width: "14px", height: "14px", color: PINK }} />
        </div>

        {NAV_LIBRARY.map((n) => sidebarBtn(n.icon, n.label))}
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: "96px" }}>
          {showHeader ? (
            <div style={{ display: "flex", gap: "24px", padding: "28px 32px 8px", alignItems: "flex-start" }}>
              <img
                src={TRACKS[0].cover}
                alt=""
                style={{ width: "180px", height: "180px", borderRadius: "10px", objectFit: "cover", flexShrink: 0, boxShadow: "0 8px 24px rgba(0,0,0,0.18)" }}
              />
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1, paddingTop: "4px" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.4px", lineHeight: 1.15 }}>{view}</div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: PINK, marginTop: "2px" }}>
                  {view === "Recently Added" ? "Playlist" : "Library"}
                </div>
                <div style={{ fontSize: "12px", color: "var(--c-text-tertiary)", marginTop: "2px" }}>
                  {visibleTracks.length} Songs · 2026 · Lossless
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "18px" }}>
                  <button
                    onClick={() => playTrack(shuffle ? TRACKS[Math.floor(Math.random() * TRACKS.length)] : TRACKS[0])}
                    style={{
                      flex: 1, maxWidth: "220px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      padding: "9px 0", borderRadius: "999px", border: "none", cursor: "pointer",
                      background: "var(--c-bg-tertiary)", fontSize: "14px", fontWeight: 600, color: "var(--c-text)",
                    }}
                  >
                    <span className="i-ph:play-fill" style={{ width: "14px", height: "14px", color: PINK }} />
                    Play
                  </button>
                  <button
                    onClick={() => {
                      setShuffle(true);
                      playTrack(TRACKS[Math.floor(Math.random() * TRACKS.length)]);
                    }}
                    style={{
                      flex: 1, maxWidth: "220px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      padding: "9px 0", borderRadius: "999px", border: "none", cursor: "pointer",
                      background: "var(--c-bg-tertiary)", fontSize: "14px", fontWeight: 600, color: "var(--c-text)",
                    }}
                  >
                    <span className="i-ph:shuffle" style={{ width: "15px", height: "15px", color: PINK }} />
                    Shuffle
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.5px", padding: "24px 32px 8px" }}>
              Songs
            </div>
          )}

          {/* ── Track table ── */}
          <div style={{ padding: "12px 32px 0" }}>
            {visibleTracks.map((track, i) => {
              const isActive = activeTrack.id === track.id;
              const isLoved = loved.includes(track.id);
              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => playTrack(track)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "9px 8px",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--c-border)",
                    borderRadius: "8px",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--c-bg-tertiary)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <button
                    title={isLoved ? "Unlove" : "Love"}
                    onClick={(e) => { e.stopPropagation(); toggleLoved(track.id); }}
                    style={{
                      width: "24px", background: "none", border: "none", cursor: "pointer", padding: 0,
                      fontSize: isLoved ? "13px" : "12px", color: isLoved ? PINK : "var(--c-text-tertiary)",
                      flexShrink: 0, textAlign: "center",
                    }}
                  >
                    {isLoved ? "★" : i + 1}
                  </button>
                  <div style={{ flex: 1, minWidth: 0, fontSize: "13px", fontWeight: isActive ? 600 : 400, color: isActive ? PINK : "var(--c-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {track.title}
                  </div>
                  {isActive && audioState.playing && (
                    <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", flexShrink: 0 }}>
                      {[0, 1, 2].map((b) => (
                        <motion.div
                          key={b}
                          animate={{ height: [4, 12, 6, 10, 4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15 }}
                          style={{ width: 3, borderRadius: 2, background: PINK }}
                        />
                      ))}
                    </div>
                  )}
                  <span style={{ fontSize: "12px", color: "var(--c-text-tertiary)", flexShrink: 0, minWidth: "34px", textAlign: "right" }}>
                    {track.duration}
                  </span>
                  <button
                    title={isLoved ? "Unlove" : "Love"}
                    onClick={(e) => { e.stopPropagation(); toggleLoved(track.id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", display: "flex", color: "var(--c-text-tertiary)" }}
                  >
                    <span className="i-ph:dots-three" style={{ width: "18px", height: "18px" }} />
                  </button>
                </motion.div>
              );
            })}
            {visibleTracks.length === 0 && (
              <div style={{ padding: "32px 8px", fontSize: "13px", color: "var(--c-text-tertiary)", textAlign: "center" }}>
                No loved songs yet — tap a track number to love it.
              </div>
            )}
          </div>
        </div>

        {/* ── Floating mini player ── */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(560px, calc(100% - 48px))",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "var(--c-bg)",
            border: "1px solid var(--c-border)",
            borderRadius: "12px",
            boxShadow: "0 8px 28px rgba(0,0,0,0.16)",
            padding: "8px 16px",
          }}
        >
          <img src={activeTrack.cover} alt="" style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeTrack.title}
            </div>
            <div style={{ fontSize: "11px", color: "var(--c-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeTrack.artist}
            </div>
          </div>
          <button onClick={() => setShuffle((v) => !v)} title="Shuffle" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", color: shuffle ? PINK : "var(--c-text)" }}>
            <span className="i-ph:shuffle" style={{ width: "16px", height: "16px" }} />
          </button>
          <button onClick={() => step(-1)} title="Previous" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", color: "var(--c-text)" }}>
            <span className="i-ph:skip-back-fill" style={{ width: "18px", height: "18px" }} />
          </button>
          <button onClick={() => controls.toggle(!audioState.playing)} title="Play/Pause" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", color: "var(--c-text)" }}>
            <span className={audioState.playing ? "i-ph:pause-fill" : "i-ph:play-fill"} style={{ width: "20px", height: "20px" }} />
          </button>
          <button onClick={() => step(1)} title="Next" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", color: "var(--c-text)" }}>
            <span className="i-ph:skip-forward-fill" style={{ width: "18px", height: "18px" }} />
          </button>
          <button onClick={() => playTrack(activeTrack)} title="Repeat" style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", color: "var(--c-text)" }}>
            <span className="i-ph:repeat" style={{ width: "16px", height: "16px" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
