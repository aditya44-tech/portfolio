import React from "react";
import { useStore } from "~/stores";

const SPOTIFY_URL = "https://open.spotify.com/embed/playlist/3HZvV6TpUavxQUA3IvyFa5?utm_source=generator&theme=0";

export default function Spotify() {
  const dark = useStore((state) => state.dark);
  const bgColor = dark ? "#000000" : "#ffffff";
  const sidebarColor = dark ? "#121212" : "#f6f6f6";
  const textColor = dark ? "#ffffff" : "#000000";
  const secondaryTextColor = dark ? "#a7a7a7" : "#555555";
  const hoverColor = dark ? "#1a1a1a" : "#eaeaea";
  const dividerColor = dark ? "#282828" : "#e0e0e0";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif",
        backgroundColor: bgColor,
        color: textColor,
        overflow: "hidden",
      }}
    >
      {/* Main Content Area (Sidebar + Playlist) */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left Sidebar */}
        <div
          style={{
            width: "240px",
            backgroundColor: sidebarColor,
            display: "flex",
            flexDirection: "column",
            padding: "20px 10px",
            gap: "20px",
            borderRight: `1px solid ${dividerColor}`,
          }}
        >
          {/* Nav Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {["Home", "Search", "Your Library"].map((item, i) => (
              <div
                key={item}
                style={{
                  padding: "10px 16px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  cursor: "pointer",
                  color: i === 0 ? textColor : secondaryTextColor,
                  transition: "color 0.2s, background-color 0.2s",
                }}
                onMouseOver={(e) => {
                  (e.currentTarget.style.color = textColor);
                }}
                onMouseOut={(e) => {
                  if (i !== 0) e.currentTarget.style.color = secondaryTextColor;
                }}
              >
                {i === 0 && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33a2 2 0 0 1 1 1.732V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
                  </svg>
                )}
                {i === 1 && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10.533 1.279c-5.18 0-9.407 4.14-9.407 9.279s4.226 9.279 9.407 9.279c2.234 0 4.29-.77 5.907-2.058l4.353 4.353a1 1 0 1 0 1.414-1.414l-4.344-4.344a9.157 9.157 0 0 0 2.077-5.816c0-5.14-4.226-9.28-9.407-9.28zm-7.407 9.279c0-4.006 3.302-7.28 7.407-7.28s7.407 3.274 7.407 7.28-3.302 7.279-7.407 7.279-7.407-3.273-7.407-7.279z" />
                  </svg>
                )}
                {i === 2 && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.5 2.134a1 1 0 0 1 1 0l6 3.464a1 1 0 0 1 .5.866V21a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V3a1 1 0 0 1 .5-.866zM16 4.732V20h4V7.041l-4-2.309zM3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zm6 0a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1z" />
                  </svg>
                )}
                {item}
              </div>
            ))}
          </div>

          <div style={{ height: "1px", backgroundColor: dividerColor, margin: "0 16px" }} />

          {/* Library Playlists */}
          <div style={{ flex: 1, overflowY: "auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {["Coding Focus", "Cyberpunk Vibes", "Lo-Fi Beats", "Liked Songs"].map((playlist) => (
              <div
                key={playlist}
                style={{
                  fontSize: "14px",
                  color: secondaryTextColor,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = textColor)}
                onMouseOut={(e) => (e.currentTarget.style.color = secondaryTextColor)}
              >
                {playlist}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
          {/* Top Bar Navigation */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              background: dark
                ? "linear-gradient(rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)"
                : "linear-gradient(rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)",
              zIndex: 10,
              pointerEvents: "none",
            }}
          >
            <div style={{ display: "flex", gap: "10px", pointerEvents: "auto" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: dark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "not-allowed",
                  color: secondaryTextColor,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11.03.47a.75.75 0 0 1 0 1.06L4.56 8l6.47 6.47a.75.75 0 1 1-1.06 1.06L2.44 8 9.97.47a.75.75 0 0 1 1.06 0z" />
                </svg>
              </div>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: dark ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "not-allowed",
                  color: secondaryTextColor,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.97.47a.75.75 0 0 0 0 1.06L11.44 8l-6.47 6.47a.75.75 0 1 0 1.06 1.06L13.56 8 6.03.47a.75.75 0 0 0-1.06 0z" />
                </svg>
              </div>
            </div>
            
            <div style={{ pointerEvents: "auto" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "#535353",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  border: "4px solid #282828"
                }}
              >
                A
              </div>
            </div>
          </div>

          {/* Iframe */}
          <iframe
            src={SPOTIFY_URL}
            title="Spotify"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              backgroundColor: "transparent",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      {/* Bottom Player Bar */}
      <div
        style={{
          height: "90px",
          backgroundColor: sidebarColor,
          borderTop: `1px solid ${dividerColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        {/* Now Playing Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", width: "30%" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "4px",
              backgroundColor: "#282828",
              backgroundImage: "url('https://i.pinimg.com/originals/7b/1b/7c/7b1b7c58ecede1d73e5e8c28aff4f241.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>Neon Genesis</div>
            <div style={{ fontSize: "12px", color: secondaryTextColor }}>Synthwave Mix</div>
          </div>
        </div>

        {/* Playback Controls */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "40%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", color: textColor }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ opacity: 0.7 }}>
              <path d="M13 2.5L5 7.119V3H3v10h2V8.881l8 4.619z" />
            </svg>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: textColor,
                color: bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 2h3v12H3zm7 0h3v12h-3z" />
              </svg>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ opacity: 0.7 }}>
              <path d="M11 3v4.119L3 2.5v11l8-4.619V13h2V3z" />
            </svg>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", maxWidth: "400px" }}>
            <span style={{ fontSize: "11px", color: secondaryTextColor }}>2:14</span>
            <div style={{ flex: 1, height: "4px", borderRadius: "2px", backgroundColor: dividerColor, overflow: "hidden" }}>
              <div style={{ width: "45%", height: "100%", backgroundColor: textColor, borderRadius: "2px" }} />
            </div>
            <span style={{ fontSize: "11px", color: secondaryTextColor }}>4:32</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", width: "30%" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: secondaryTextColor }}>
            <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z" />
          </svg>
          <div style={{ width: "80px", height: "4px", borderRadius: "2px", backgroundColor: dividerColor }}>
            <div style={{ width: "70%", height: "100%", backgroundColor: secondaryTextColor, borderRadius: "2px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}