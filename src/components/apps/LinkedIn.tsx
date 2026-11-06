import React, { useState } from "react";
import profile from "~/config/profile";

// ── SVG Icons for LinkedIn ────────────────────────────────────────────────────
const LinkedInLogo = ({ size = 34 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="4" fill="#0A66C2" />
    <path
      d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.5 8.5h3v11h-3v-11ZM8.5 8.5h2.88v1.5h.04c.4-.76 1.38-1.56 2.85-1.56 3.05 0 3.61 2.01 3.61 4.62v6.44h-3v-5.71c0-1.36-.03-3.11-1.9-3.11-1.9 0-2.19 1.48-2.19 3.01v5.81h-3v-11Z"
      fill="#FFFFFF"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="rgba(0,0,0,0.6)">
    <path d="m14.7 13.3-3.8-3.8a5.5 5.5 0 1 0-1.4 1.4l3.8 3.8a1 1 0 0 0 1.4-1.4ZM2 6.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z" />
  </svg>
);

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23 9v2h-2v10a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V11H1V9l11-7 11 7Z" />
  </svg>
);

const NetworkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 16v6H9v-6H8a3 3 0 0 1-3-3V7a3 3 0 0 1 6 0v6a3 3 0 0 1-3 3h4a3 3 0 0 1-3-3V7a3 3 0 0 1 6 0v6a3 3 0 0 1-3 3h-1Z" />
  </svg>
);

const JobsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 6V5a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3v1H2v4a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6h-5ZM9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H9V5Zm13 9a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v7a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-7Z" />
  </svg>
);

const MessagingIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 4H8a7 7 0 0 0 0 14h4v4l5-4h-1a7 7 0 0 0 0-14Z" />
  </svg>
);

const BellIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 19H2v-2l2-3V9a8 8 0 1 1 16 0v5l2 3v2Zm-13 2h6a3 3 0 0 1-6 0Z" />
  </svg>
);

const GridIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="3" width="4" height="4" rx="1" />
    <rect x="10" y="3" width="4" height="4" rx="1" />
    <rect x="17" y="3" width="4" height="4" rx="1" />
    <rect x="3" y="10" width="4" height="4" rx="1" />
    <rect x="10" y="10" width="4" height="4" rx="1" />
    <rect x="17" y="10" width="4" height="4" rx="1" />
    <rect x="3" y="17" width="4" height="4" rx="1" />
    <rect x="10" y="17" width="4" height="4" rx="1" />
    <rect x="17" y="17" width="4" height="4" rx="1" />
  </svg>
);

const ShieldCheck = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <path
      d="M8 1.5 2.5 3.5v4.25c0 3.75 3.5 6.25 5.5 6.75 2-.5 5.5-3 5.5-6.75V3.5L8 1.5Z"
      fill="#0A66C2"
    />
    <path
      d="m6.5 8.2 3-3 .7.7-3.7 3.7-2-2 .7-.7 1.3 1.3Z"
      fill="#FFFFFF"
    />
  </svg>
);

const PencilIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <path d="m14.1 3.9-2-2a1.4 1.4 0 0 0-2 0l-8.6 8.6a1.4 1.4 0 0 0-.4.7l-1 4.1a.5.5 0 0 0 .6.6l4.1-1c.3 0 .5-.2.7-.4l8.6-8.6a1.4 1.4 0 0 0 0-2Zm-3.1-1 2 2-1 1-2-2 1-1ZM2.1 13.9l.6-2.5 1.9 1.9-2.5.6Z" />
  </svg>
);

const PlusIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 2a.75.75 0 0 1 .75.75v4.5h4.5a.75.75 0 0 1 0 1.5h-4.5v4.5a.75.75 0 0 1-1.5 0v-4.5h-4.5a.75.75 0 0 1 0-1.5h4.5v-4.5A.75.75 0 0 1 8 2Z" />
  </svg>
);

const LikeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#0A66C2">
    <circle cx="8" cy="8" r="8" fill="#0A66C2" />
    <path
      d="M5 8.5v3.5h1.5V8.5H5Zm6.3-.7c.3 0 .5.3.4.6l-.6 2.5a.6.6 0 0 1-.6.5H7.5V7.8l.9-1.9c.2-.4.7-.6 1.1-.3.2.2.3.5.2.7l-.3 1.1h1.9Z"
      fill="#FFFFFF"
    />
  </svg>
);

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#D9383A">
    <circle cx="8" cy="8" r="8" fill="#D9383A" />
    <path
      d="M8 11.5s-4-2.5-4-5a2 2 0 0 1 3.5-1.3L8 5.7l.5-.5A2 2 0 0 1 12 6.5c0 2.5-4 5-4 5Z"
      fill="#FFFFFF"
    />
  </svg>
);

export default function LinkedIn() {
  const [activeFilter, setActiveFilter] = useState<"posts" | "comments" | "videos" | "images">("posts");
  const linkedInUrl = profile.linkedin.url || "https://www.linkedin.com/in/aditya-salunkhe-7128b4385/";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: "#f4f2ee",
        color: "rgba(0,0,0,0.9)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* ── Top LinkedIn Navigation Bar ────────────────────────────────────────── */}
      <header
        style={{
          height: 52,
          background: "#ffffff",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Left: Logo + Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            style={{ display: "flex", alignItems: "center" }}
          >
            <LinkedInLogo size={34} />
          </a>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#edf3f8",
              borderRadius: 4,
              padding: "0 12px",
              height: 34,
              width: 240,
            }}
          >
            <SearchIcon />
            <input
              type="text"
              placeholder="Search"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 14,
                color: "rgba(0,0,0,0.9)",
                width: "100%",
              }}
            />
          </div>
        </div>

        {/* Right: Nav items */}
        <nav style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              color: "#0A66C2",
              position: "relative",
            }}
          >
            <HomeIcon />
            {/* Red notification dot */}
            <span
              style={{
                position: "absolute",
                top: 2,
                right: 6,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#c0392b",
                border: "1.5px solid #fff",
              }}
            />
            <span style={{ fontSize: 11, fontWeight: 500, marginTop: 1 }}>Home</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              color: "rgba(0,0,0,0.6)",
            }}
          >
            <NetworkIcon />
            <span style={{ fontSize: 11, marginTop: 1 }}>Network</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              color: "rgba(0,0,0,0.6)",
            }}
          >
            <JobsIcon />
            <span style={{ fontSize: 11, marginTop: 1 }}>Jobs</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              color: "rgba(0,0,0,0.6)",
            }}
          >
            <MessagingIcon />
            <span style={{ fontSize: 11, marginTop: 1 }}>Messaging</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              color: "rgba(0,0,0,0.6)",
            }}
          >
            <BellIcon />
            <span style={{ fontSize: 11, marginTop: 1 }}>Notifications</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
              color: "rgba(0,0,0,0.6)",
              borderLeft: "1px solid rgba(0,0,0,0.08)",
              paddingLeft: 16,
            }}
          >
            <GridIcon />
            <span style={{ fontSize: 11, marginTop: 1 }}>More ▾</span>
          </div>
        </nav>
      </header>

      {/* ── Main Container (LinkedIn Profile Stream) ─────────────────────────── */}
      <main
        style={{
          maxWidth: 852,
          width: "100%",
          margin: "18px auto 48px",
          padding: "0 16px",
          boxSizing: "border-box",
        }}
      >
        {/* ── Profile Top Card ───────────────────────────────────────────────── */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e0dfdc",
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
          }}
        >
          {/* Cover Banner */}
          <div style={{ position: "relative", width: "100%", height: 198, background: "#e8eff7" }}>
            <img
              src="/img/linkedin/banner.jpg"
              alt="Aditya Salunkhe LinkedIn Banner"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            {/* Edit Banner Pencil Button */}
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "#ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#0A66C2",
                cursor: "pointer",
              }}
            >
              <PencilIcon size={14} />
            </div>
          </div>

          {/* Profile Card Content Area */}
          <div style={{ padding: "0 24px 24px", position: "relative" }}>
            {/* Avatar Row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: -84,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  width: 144,
                  height: 144,
                  borderRadius: "50%",
                  border: "4px solid #ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  background: "#ffffff",
                  position: "relative",
                }}
              >
                <img
                  src="/img/linkedin/avatar.jpg"
                  alt="Aditya Salunkhe"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>

              {/* Edit Profile Pencil Icon */}
              <div
                style={{
                  color: "rgba(0,0,0,0.6)",
                  cursor: "pointer",
                  padding: 8,
                  borderRadius: "50%",
                  display: "flex",
                }}
              >
                <PencilIcon size={18} />
              </div>
            </div>

            {/* Two-column layout: Info on left, Company/College shortcuts on right */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
              {/* Left Column: Name, Headline, Location */}
              <div style={{ flex: 1, minWidth: 280 }}>
                {/* Name, Badge, Pronouns */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h1
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      color: "rgba(0,0,0,0.9)",
                      margin: 0,
                      lineHeight: 1.25,
                    }}
                  >
                    Aditya Salunkhe
                  </h1>
                  <ShieldCheck />
                  <span style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", fontWeight: 400 }}>
                    He/Him
                  </span>
                </div>

                {/* Headline */}
                <p
                  style={{
                    fontSize: 15,
                    color: "rgba(0,0,0,0.9)",
                    lineHeight: 1.4,
                    margin: "6px 0 0",
                    fontWeight: 400,
                    maxWidth: 540,
                  }}
                >
                  CSE&apos;29 @RCPIT | Technical Team Member @Akatsuki Coding Club | Learning Full-Stack Development | Motion Graphics Editor
                </p>

                {/* Location & Contact info */}
                <div style={{ marginTop: 6, fontSize: 14, color: "rgba(0,0,0,0.6)" }}>
                  <span>Shirpur, Maharashtra, India</span>
                  {" · "}
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0A66C2", fontWeight: 600, textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    Contact info
                  </a>
                </div>

                {/* Connections count */}
                <div style={{ marginTop: 6 }}>
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#0A66C2", fontWeight: 600, fontSize: 14, textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >
                    142 connections
                  </a>
                </div>
              </div>

              {/* Right Column: Akatsuki Coding Club + RCPIT icons & titles */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 220 }}>
                {/* Akatsuki item */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src="/img/linkedin/akatsuki-logo.png"
                    alt="Akatsuki Coding Club"
                    width={32}
                    height={32}
                    style={{ objectFit: "contain", borderRadius: 4 }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.9)" }}>
                    Akatsuki Coding Club
                  </span>
                </div>

                {/* College item */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src="/img/linkedin/rcpit-logo.png"
                    alt="R. C. Patel Institute of Technology, Shirpur"
                    width={32}
                    height={32}
                    style={{ objectFit: "contain", borderRadius: 4 }}
                  />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.9)", lineHeight: 1.25 }}>
                    R. C. Patel Institute of<br />Technology, Shirpur
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                style={{
                  background: "#0A66C2",
                  color: "#ffffff",
                  padding: "6px 16px",
                  borderRadius: 24,
                  fontWeight: 600,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#004182")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#0A66C2")}
              >
                Open to
              </button>

              <button
                type="button"
                style={{
                  background: "transparent",
                  color: "#0A66C2",
                  padding: "6px 16px",
                  borderRadius: 24,
                  fontWeight: 600,
                  fontSize: 15,
                  border: "1px solid #0A66C2",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(10,102,194,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Add section
              </button>

              <button
                type="button"
                style={{
                  background: "transparent",
                  color: "#0A66C2",
                  padding: "6px 16px",
                  borderRadius: 24,
                  fontWeight: 600,
                  fontSize: 15,
                  border: "1px solid #0A66C2",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(10,102,194,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Enhance profile
              </button>

              <button
                type="button"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "1px solid rgba(0,0,0,0.6)",
                  background: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "rgba(0,0,0,0.6)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                ···
              </button>

              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft: "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#0A66C2",
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: "none",
                  padding: "6px 14px",
                  borderRadius: 24,
                  background: "rgba(10,102,194,0.06)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(10,102,194,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(10,102,194,0.06)")}
              >
                <span>View on LinkedIn</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Activity Section Card ──────────────────────────────────────────── */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e0dfdc",
            borderRadius: 10,
            padding: "20px 24px",
            marginTop: 12,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "rgba(0,0,0,0.9)", margin: 0 }}>
                Activity
              </h2>
              <a
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 13, color: "#0A66C2", fontWeight: 600, textDecoration: "none" }}
              >
                148 followers
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button
                type="button"
                style={{
                  background: "transparent",
                  color: "#0A66C2",
                  border: "1px solid #0A66C2",
                  borderRadius: 20,
                  padding: "4px 14px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Create a post
              </button>
              <span style={{ color: "rgba(0,0,0,0.6)", cursor: "pointer", display: "flex" }}>
                <PencilIcon size={16} />
              </span>
            </div>
          </div>

          {/* Filter Pills */}
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {(["posts", "comments", "videos", "images"] as const).map((tab) => {
              const active = activeFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  style={{
                    background: active ? "#01754f" : "transparent",
                    color: active ? "#ffffff" : "rgba(0,0,0,0.6)",
                    border: active ? "none" : "1px solid rgba(0,0,0,0.3)",
                    borderRadius: 20,
                    padding: "4px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Posts Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 16,
              marginTop: 16,
            }}
          >
            {/* Post 1: Smart India Hackathon Certificate */}
            <div
              style={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* Author row */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <img
                    src="/img/linkedin/avatar.jpg"
                    alt="Aditya Salunkhe"
                    width={36}
                    height={36}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <span>Aditya Salunkhe</span>
                      <ShieldCheck />
                      <span style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", fontWeight: 400 }}>· You</span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(0,0,0,0.6)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      CSE&apos;29 @RCPIT | Technical Team Member ...
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(0,0,0,0.6)" }}>1w</div>
                  </div>
                </div>

                {/* Post Text */}
                <p style={{ margin: "0 0 10px", fontSize: 12.5, lineHeight: 1.45, color: "rgba(0,0,0,0.9)" }}>
                  🚀 Proud to be leading team Singularity as we clear Round 2 of the Internal Smart India Hackathon 2026! IN... <span style={{ color: "rgba(0,0,0,0.6)", cursor: "pointer" }}>more</span>
                </p>

                {/* Certificate Image Attachment */}
                <div style={{ borderRadius: 6, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", marginBottom: 8 }}>
                  <img
                    src="/img/linkedin/sih-certificate.jpg"
                    alt="Smart India Hackathon Certificate"
                    style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>

              {/* Engagement counts */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "rgba(0,0,0,0.6)", paddingBottom: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <LikeIcon />
                    <HeartIcon />
                    <span>21</span>
                  </span>
                  <span>2 comments</span>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    paddingTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "rgba(0,0,0,0.6)",
                  }}
                >
                  <span>📊 571 impressions</span>
                  <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0A66C2", textDecoration: "none", fontWeight: 600 }}>
                    View analytics
                  </a>
                </div>
              </div>
            </div>

            {/* Post 2: Nodevember Motion Graphics Video */}
            <div
              style={{
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: 8,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                {/* Author row */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <img
                    src="/img/linkedin/avatar.jpg"
                    alt="Aditya Salunkhe"
                    width={36}
                    height={36}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                      <span>Aditya Salunkhe</span>
                      <ShieldCheck />
                      <span style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", fontWeight: 400 }}>· You</span>
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(0,0,0,0.6)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      CSE&apos;29 @RCPIT | Technical Team Member ...
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(0,0,0,0.6)" }}>2w</div>
                  </div>
                </div>

                {/* Post Text */}
                <p style={{ margin: "0 0 10px", fontSize: 12.5, lineHeight: 1.45, color: "rgba(0,0,0,0.9)" }}>
                  I made this motion graphics video for <span style={{ color: "#0A66C2", fontWeight: 600 }}>Akatsuki Coding Club</span> to announce Nodevember 4.0. Instead of a regular poster, I wanted the... <span style={{ color: "rgba(0,0,0,0.6)", cursor: "pointer" }}>more</span>
                </p>

                {/* Video Preview Attachment */}
                <div style={{ borderRadius: 6, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", marginBottom: 8 }}>
                  <img
                    src="/img/linkedin/nodevember-preview.jpg"
                    alt="Nodevember 4.0 Video Preview"
                    style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>

              {/* Engagement counts */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "rgba(0,0,0,0.6)", paddingBottom: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <LikeIcon />
                    <span>15</span>
                  </span>
                  <span>1 comment</span>
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                    paddingTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "rgba(0,0,0,0.6)",
                  }}
                >
                  <span>📊 372 impressions</span>
                  <a href={linkedInUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#0A66C2", textDecoration: "none", fontWeight: 600 }}>
                    View analytics
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer show all */}
          <div style={{ textAlign: "center", marginTop: 16, borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 12 }}>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(0,0,0,0.7)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0A66C2")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(0,0,0,0.7)")}
            >
              <span>Show all</span>
              <span>→</span>
            </a>
          </div>
        </section>

        {/* ── Experience Section Card ────────────────────────────────────────── */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e0dfdc",
            borderRadius: 10,
            padding: "20px 24px",
            marginTop: 12,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "rgba(0,0,0,0.9)", margin: 0 }}>
              Experience
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 14, color: "rgba(0,0,0,0.6)" }}>
              <span style={{ cursor: "pointer", display: "flex" }}>
                <PlusIcon size={20} />
              </span>
              <span style={{ cursor: "pointer", display: "flex" }}>
                <PencilIcon size={18} />
              </span>
            </div>
          </div>

          {/* Experience Item */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <img
              src="/img/linkedin/akatsuki-logo.png"
              alt="Akatsuki Coding Club"
              width={48}
              height={48}
              style={{ objectFit: "contain", borderRadius: 4, flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "rgba(0,0,0,0.9)", margin: 0 }}>
                  Technical Team Member
                </h3>
                <span
                  style={{
                    background: "#eef6f0",
                    color: "#057642",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 4,
                    padding: "2px 8px",
                  }}
                >
                  Present
                </span>
              </div>

              <div style={{ fontSize: 14, color: "rgba(0,0,0,0.9)", marginTop: 2 }}>
                Akatsuki Coding Club · Full-time
              </div>
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", marginTop: 2 }}>
                Sep 2026 - Present · 3 mos
              </div>
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", marginTop: 2 }}>
                Shirpur, Maharashtra, India
              </div>

              <p style={{ margin: "10px 0 0", fontSize: 14, color: "rgba(0,0,0,0.9)", lineHeight: 1.5 }}>
                Contributing to the technical activities and initiatives of Akatsuki Coding Club. Participating in coding sessions, technical events, collaborative projects, and peer-learning activities while working with fellow members... <span style={{ color: "rgba(0,0,0,0.6)", cursor: "pointer" }}>more</span>
              </p>
            </div>
          </div>
        </section>

        {/* ── Education Section Card ─────────────────────────────────────────── */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e0dfdc",
            borderRadius: 10,
            padding: "20px 24px",
            marginTop: 12,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "rgba(0,0,0,0.9)", margin: 0 }}>
              Education
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 14, color: "rgba(0,0,0,0.6)" }}>
              <span style={{ cursor: "pointer", display: "flex" }}>
                <PlusIcon size={20} />
              </span>
              <span style={{ cursor: "pointer", display: "flex" }}>
                <PencilIcon size={18} />
              </span>
            </div>
          </div>

          {/* Education Item */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <img
              src="/img/linkedin/rcpit-logo.png"
              alt="R. C. Patel Institute of Technology, Shirpur"
              width={48}
              height={48}
              style={{ objectFit: "contain", borderRadius: 4, flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "rgba(0,0,0,0.9)", margin: 0 }}>
                R. C. Patel Institute of Technology, Shirpur
              </h3>
              <div style={{ fontSize: 14, color: "rgba(0,0,0,0.9)", marginTop: 2 }}>
                Bachelor of Technology, Computer Engineering
              </div>
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.6)", marginTop: 2 }}>
                Sep 2025 – Jun 2029
              </div>
              <div style={{ fontSize: 13, color: "rgba(0,0,0,0.9)", marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <span>💎</span>
                <span>Java and C (Programming Language)</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
