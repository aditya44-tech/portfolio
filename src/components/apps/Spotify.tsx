import React, { useState } from "react";
import { useStore } from "~/stores";
import { useAudioContext, type PlayerTrack } from "~/context/AudioContext";
import SafeImage from "~/components/SafeImage";
import { spotifyPlaylists, type SpotifyTrack } from "~/data/spotify";

/* ------------------------------------------------------------------
   Spotify — the REAL tracklists from your playlists (Metro Goonin',
   Gorillaz, Daft Punk, Yeat) with real 30-second preview playback
   where available. Tracks without a preview open on YouTube instead
   (every row has a YT link). Plays through the shared OS player, so
   the bottom playbar and the Dynamic Island stay in sync.
   Type inherits the global Apple system stack.
------------------------------------------------------------------- */

const AVATAR = "https://avatars.githubusercontent.com/u/239353027?v=4";

const NAV_ITEMS = [
  {
    id: "home",
    label: "Home",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
      </svg>
    ),
  },
  {
    id: "search",
    label: "Search",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.279z" />
      </svg>
    ),
  },
  {
    id: "library",
    label: "Your Library",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z" />
      </svg>
    ),
  },
];

const fmt = (s: number) => {
  const t = Math.max(0, Math.floor(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

const toPlayer = (t: SpotifyTrack): PlayerTrack => ({
  title: t.title,
  artist: t.artist,
  cover: t.art,
  src: t.preview,
});

export default function Spotify() {
  const dark = useStore((state) => state.dark);
  const { audioState, controls } = useAudioContext();
  const [activeNav, setActiveNav] = useState("home");
  const [playlistId, setPlaylistId] = useState(spotifyPlaylists[0].id);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [vol, setVol] = useState(80);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const playlist = spotifyPlaylists.find((p) => p.id === playlistId) ?? spotifyPlaylists[0];
  const playable = playlist.tracks.filter((t) => t.preview);
  const queue = playable.map(toPlayer);
  const idx = spotifyPlaylists.findIndex((p) => p.id === playlist.id);
  const cycle = (dir: 1 | -1) =>
    setPlaylistId(spotifyPlaylists[(idx + dir + spotifyPlaylists.length) % spotifyPlaylists.length].id);

  const isCurrent = (t: SpotifyTrack) => !!t.preview && audioState.track.src === t.preview;
  const playlistPlaying = audioState.playing && playlist.tracks.some(isCurrent);

  const playTrack = (t: SpotifyTrack) => {
    if (!t.preview) {
      window.open(t.yt, "_blank", "noopener");
      return;
    }
    setHasPlayed(true);
    controls.playTrack(toPlayer(t), queue);
  };

  const toggleLiked = (id: number) =>
    setLiked((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const bgColor = dark ? "#000000" : "#ffffff";
  const sidebarColor = dark ? "#121212" : "#f6f6f6";
  const mainColor = dark ? "#121212" : "#ffffff";
  const textColor = dark ? "#ffffff" : "#000000";
  const secondaryTextColor = dark ? "#a7a7a7" : "#555555";
  const dividerColor = dark ? "#282828" : "#e0e0e0";
  const hoverBg = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const GREEN = "#1DB954";
  const YT_RED = "#ff4e45";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: bgColor,
        color: textColor,
        overflow: "hidden",
      }}
    >
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {/* Sidebar */}
        <div
          style={{
            width: 248,
            flexShrink: 0,
            backgroundColor: sidebarColor,
            display: "flex",
            flexDirection: "column",
            padding: "20px 10px 12px",
            gap: 16,
            borderRight: `1px solid ${dividerColor}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
            <img src="img/icons/spotify-logo.svg" alt="Spotify" style={{ width: 32, height: 32 }} />
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em" }}>Spotify</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {NAV_ITEMS.map((item) => {
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                    color: active ? textColor : secondaryTextColor,
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = textColor)}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = active ? textColor : secondaryTextColor)
                  }
                >
                  <span style={{ display: "inline-flex", color: active ? GREEN : "inherit" }}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </div>

          <div style={{ height: 1, backgroundColor: dividerColor, margin: "0 12px" }} />

          <div style={{ flex: 1, overflowY: "auto", padding: "0 6px", display: "flex", flexDirection: "column", gap: 2 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: secondaryTextColor,
                marginBottom: 6,
                padding: "0 6px",
              }}
            >
              PLAYLISTS
            </div>
            {spotifyPlaylists.map((p) => {
              const active = p.id === playlist.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlaylistId(p.id)}
                  style={{
                    background: active ? hoverBg : "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 6,
                    borderRadius: 8,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = active ? hoverBg : "none")}
                >
                  <SafeImage
                    src={p.cover}
                    alt=""
                    style={{ width: 44, height: 44, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
                  />
                  <span style={{ minWidth: 0 }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: 13,
                        fontWeight: active ? 700 : 400,
                        color: active ? GREEN : textColor,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {p.name}
                    </span>
                    <span style={{ display: "block", fontSize: 12, color: secondaryTextColor }}>
                      Playlist · {p.tracks.length} songs
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ fontSize: 11, color: secondaryTextColor, padding: "0 12px" }}>
            Cookies · Privacy · Preview
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: mainColor }}>
          <div
            style={{
              height: 60,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { a: "‹", fn: () => cycle(-1) },
                { a: "›", fn: () => cycle(1) },
              ].map((b) => (
                <button
                  key={b.a}
                  onClick={b.fn}
                  title="Switch playlist"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: dark ? "#0a0a0a" : "#e2e2e2",
                    border: `1px solid ${dividerColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: secondaryTextColor,
                    fontSize: 20,
                    lineHeight: 1,
                    paddingBottom: 3,
                  }}
                >
                  {b.a}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Aditya</span>
              <SafeImage
                src={AVATAR}
                alt="profile"
                style={{ width: 30, height: 30, borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "4px 28px 24px" }}>
            {/* Playlist header */}
            <div style={{ display: "flex", gap: 22, alignItems: "flex-end" }}>
              <SafeImage
                src={playlist.cover}
                alt={playlist.name}
                style={{ width: 184, height: 184, borderRadius: 8, objectFit: "cover", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", flexShrink: 0 }}
              />
              <div style={{ minWidth: 0, paddingBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Playlist</div>
                <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "6px 0" }}>
                  {playlist.name}
                </h1>
                <p style={{ fontSize: 13, color: secondaryTextColor, lineHeight: 1.5, margin: 0 }}>
                  {playlist.blurb}
                </p>
                <div style={{ fontSize: 13, marginTop: 8 }}>
                  <span style={{ fontWeight: 700 }}>Spotify</span>
                  <span style={{ color: secondaryTextColor }}> · {playlist.tracks.length} songs · </span>
                  <a
                    href={playlist.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: GREEN, fontWeight: 600, textDecoration: "none" }}
                  >
                    Open in Spotify ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 18, margin: "20px 0 8px" }}>
              <button
                onClick={() => {
                  const first = playable[0];
                  if (playlistPlaying) controls.pause();
                  else if (playlist.tracks.some(isCurrent)) controls.play();
                  else if (first) playTrack(first);
                }}
                title={playlistPlaying ? "Pause" : "Play"}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: GREEN,
                  color: "#000",
                  fontSize: 22,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: playlistPlaying ? 0 : 3,
                }}
              >
                {playlistPlaying ? "❚❚" : "▶"}
              </button>
              <button
                onClick={() => playable[0] && toggleLiked(playable[0].id)}
                title="Like"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, color: secondaryTextColor }}
              >
                ♡
              </button>
              <span style={{ fontSize: 22, color: secondaryTextColor, letterSpacing: 2 }}>•••</span>
            </div>

            {/* Track table */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 12px",
                borderBottom: `1px solid ${dividerColor}`,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: secondaryTextColor,
              }}
            >
              <span style={{ width: 28 }}>#</span>
              <span style={{ flex: 3 }}>TITLE</span>
              <span style={{ flex: 2 }}>ARTIST</span>
              <span style={{ width: 118, textAlign: "right" }}><span className="i-ph:clock" style={{ fontSize: 13 }} /></span>
            </div>
            {playlist.tracks.map((t, i) => {
              const current = isCurrent(t);
              const rowPlaying = current && audioState.playing;
              return (
                <button
                  key={t.id}
                  onClick={() => playTrack(t)}
                  title={t.preview ? "Play preview" : "No preview — opens on YouTube"}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "7px 12px",
                    border: "none",
                    borderRadius: 6,
                    background: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: textColor,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                  <span style={{ width: 28, fontSize: 13, color: current ? GREEN : secondaryTextColor, fontWeight: current ? 700 : 400 }}>
                    {rowPlaying ? <span className="animate-pulse">●</span> : i + 1}
                  </span>
                  <span style={{ flex: 3, display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <SafeImage
                      src={t.art}
                      alt=""
                      style={{ width: 42, height: 42, borderRadius: 4, objectFit: "cover", flexShrink: 0 }}
                    />
                    <span
                      style={{
                        fontSize: 14,
                        color: current ? GREEN : textColor,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {t.title}
                    </span>
                  </span>
                  <span
                    style={{
                      flex: 2,
                      fontSize: 13,
                      color: secondaryTextColor,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {t.artist}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 10, width: 118, justifyContent: "flex-end" }}>
                    <a
                      href={t.yt}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      title="Play on YouTube"
                      style={{ fontSize: 11, fontWeight: 800, color: YT_RED, textDecoration: "none", letterSpacing: "0.04em" }}
                    >
                      YT ▶
                    </a>
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLiked(t.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") toggleLiked(t.id);
                      }}
                      style={{ fontSize: 15, color: liked.has(t.id) ? GREEN : secondaryTextColor, cursor: "pointer" }}
                    >
                      {liked.has(t.id) ? "♥" : "♡"}
                    </span>
                    <span style={{ fontSize: 13, color: secondaryTextColor, minWidth: 36, textAlign: "right" }}>
                      {t.preview ? fmt(t.seconds) : "YT"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Playbar — appears once a song is played */}
      {hasPlayed && (
        <div
          style={{
            height: 78,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 16px",
            borderTop: `1px solid ${dividerColor}`,
            backgroundColor: sidebarColor,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, width: 240, minWidth: 0 }}>
            <SafeImage
              src={audioState.track.cover}
              alt=""
              style={{ width: 54, height: 54, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {audioState.track.title}
              </div>
              <div style={{ fontSize: 12, color: secondaryTextColor, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {audioState.track.artist}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <button title="Shuffle" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: secondaryTextColor }}>⇄</button>
              <button
                onClick={() => controls.prev()}
                title="Previous"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 17, color: textColor }}
              >
                <span className="i-ph:skip-back-fill" />
              </button>
              <button
                onClick={() => controls.toggle()}
                title={audioState.playing ? "Pause" : "Play"}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: "#fff",
                  color: "#000",
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: audioState.playing ? 0 : 2,
                }}
              >
                {audioState.playing ? "❚❚" : "▶"}
              </button>
              <button
                onClick={() => controls.next()}
                title="Next"
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 17, color: textColor }}
              >
                <span className="i-ph:skip-forward-fill" />
              </button>
              <button title="Repeat" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: secondaryTextColor }}>↻</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 480 }}>
              <span style={{ fontSize: 11, color: secondaryTextColor, minWidth: 34, textAlign: "right" }}>
                {fmt(audioState.currentTime)}
              </span>
              <div
                onClick={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  controls.seek((e.clientX - r.left) / r.width);
                }}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: dividerColor,
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                <div style={{ width: `${Math.min(100, audioState.progress * 100)}%`, height: "100%", backgroundColor: GREEN }} />
              </div>
              <span style={{ fontSize: 11, color: secondaryTextColor, minWidth: 34 }}>
                {fmt(audioState.duration)}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, width: 170, justifyContent: "flex-end" }}>
            <span style={{ fontSize: 15, color: secondaryTextColor }}><span className="i-ph:speaker-high" style={{ fontSize: 16 }} /></span>
            <input
              type="range"
              min={0}
              max={100}
              value={vol}
              onChange={(e) => {
                const v = Number(e.target.value);
                setVol(v);
                controls.volume(v / 100);
              }}
              style={{ width: 96, accentColor: GREEN, cursor: "pointer" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
