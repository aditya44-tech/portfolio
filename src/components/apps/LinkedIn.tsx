import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "~/hooks/useWindowSize";
import profile from "~/config/profile";
import linkedinPosts from "~/data/linkedinPosts.json";
import {
  useMacSurfaces,
  macBlur,
  SideBadge,
  SideRow,
  SideSectionLabel,
  MacToolbar,
  SearchField,
  PushButton,
  StatusBar,
} from "./shared/mac";

/* LinkedIn posts JSON shape (src/data/linkedinPosts.json):
   LinkedIn offers no public posts API and must not be scraped, so the feed
   below is loaded from that file. Each entry looks like:
   {
     "id": "unique-string-id",        // React key + post identifier
     "date": "2026-03-10",            // ISO date, displayed as-is
     "text": "Post body…",            // plain text, URLs auto-linkified
     "image": "https://…/pic.jpg",    // optional — string URL or null
     "likes": 42,                     // like count shown on the card
     "comments": 5,                   // comment count shown on the card
     "url": "https://linkedin.com/…",// "View post" link (opens in new tab)
     "placeholder": true              // omit (or set false) for real posts
   }
   To publish real posts: copy each post's text/date/counts from your
   LinkedIn profile into the file and delete the placeholder entries. */

interface LinkedInPost {
  id: string;
  date: string;
  text: string;
  image: string | null;
  likes: number;
  comments: number;
  url: string;
  placeholder?: boolean;
}

type Section = "profile" | "posts";

const SECTIONS: { id: Section; label: string; glyph: string; color: string }[] = [
  { id: "profile", label: "Profile", glyph: "i-ph:user-circle", color: "#8E8E93" },
  { id: "posts", label: "Posts", glyph: "i-ph:article", color: "#0A66C2" },
];

const LINKEDIN_BLUE = "#0A66C2";
const AVATAR_URL = `https://github.com/${profile.github.username}.png`;

/** Render plain post text with URLs turned into safe external links. */
function linkify(text: string): React.ReactNode[] {
  const urlRe = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRe);
  return parts.map((part, i) =>
    urlRe.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: LINKEDIN_BLUE, textDecoration: "none", fontWeight: 600 }}
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function LinkedIn() {
  const { material, hairline, font } = useMacSurfaces();
  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;
  const [section, setSection] = useState<Section>("profile");
  const [query, setQuery] = useState("");

  const allPosts = linkedinPosts as LinkedInPost[];
  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPosts;
    return allPosts.filter((p) => p.text.toLowerCase().includes(q));
  }, [allPosts, query]);

  const switchSection = (s: Section) => {
    setSection(s);
    setQuery("");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--c-bg)",
        color: "var(--c-text)",
        fontFamily: font,
        borderRadius: "0 0 12px 12px",
        overflow: "hidden",
      }}
    >
      {/* Toolbar — Open LinkedIn is reachable from every view */}
      <MacToolbar
        left={
          <>
            <span
              aria-hidden
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "7px",
                background: LINKEDIN_BLUE,
                color: "#fff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.08)",
              }}
            >
              in
            </span>
            <span style={{ fontSize: "14px", fontWeight: 700, marginLeft: "4px" }}>LinkedIn</span>
          </>
        }
        right={
          <>
            {section === "posts" && (
              <SearchField
                value={query}
                onChange={setQuery}
                placeholder="Search posts"
                label="Search posts"
                width={isMobile ? 130 : 180}
              />
            )}
            <a
              href={profile.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LinkedIn profile in a new tab"
              style={{ textDecoration: "none" }}
            >
              <PushButton primary>
                <span className="i-ph:linkedin-logo" style={{ width: "14px", height: "14px" }} aria-hidden />
                Open LinkedIn
              </PushButton>
            </a>
          </>
        }
      />

      {/* Mobile segmented control */}
      {isMobile && (
        <div
          role="tablist"
          aria-label="LinkedIn sections"
          style={{
            display: "flex",
            gap: "2px",
            margin: "8px 12px 0",
            padding: "2px",
            borderRadius: "9px",
            background: "var(--c-bg-tertiary)",
          }}
        >
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={section === s.id}
              onClick={() => switchSection(s.id)}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                background: section === s.id ? "var(--c-bg)" : "transparent",
                boxShadow: section === s.id ? "0 1px 4px rgba(0,0,0,0.14)" : "none",
                color: "var(--c-text)",
                fontSize: "12.5px",
                fontWeight: section === s.id ? 600 : 400,
                fontFamily: font,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        {!isMobile && (
          <nav
            aria-label="LinkedIn sections"
            style={{
              width: "200px",
              flexShrink: 0,
              background: material,
              ...macBlur,
              borderRight: hairline,
              display: "flex",
              flexDirection: "column",
              padding: "6px 10px 12px",
            }}
          >
            <SideSectionLabel>LinkedIn</SideSectionLabel>
            {SECTIONS.map((s) => (
              <SideRow
                key={s.id}
                active={section === s.id}
                onClick={() => switchSection(s.id)}
                badge={<SideBadge glyph={s.glyph} color={s.color} />}
                label={s.label}
                count={s.id === "posts" ? allPosts.length : undefined}
              />
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ padding: "0 2px" }}>
              <a
                href={profile.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on LinkedIn"
                style={{ textDecoration: "none", display: "block" }}
              >
                <PushButton primary {...{ style: { width: "100%" } }}>
                  View on LinkedIn
                </PushButton>
              </a>
            </div>
          </nav>
        )}

        {/* Content — grouped inset style, like System Settings */}
        <div style={{ flex: 1, overflowY: "auto", minWidth: 0, background: "var(--c-bg-secondary)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              role="tabpanel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {section === "profile" && (
                <div style={{ padding: isMobile ? "12px" : "20px", maxWidth: "620px", margin: "0 auto" }}>
                  <div
                    style={{
                      border: hairline,
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "var(--c-bg)",
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        height: "110px",
                        background: `linear-gradient(120deg, ${LINKEDIN_BLUE} 0%, #004182 60%, #001a33 100%)`,
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.25) 0%, transparent 45%)",
                        }}
                      />
                    </div>
                    <div style={{ padding: "0 20px 20px" }}>
                      <img
                        src={AVATAR_URL}
                        alt={`${profile.linkedin.name}'s avatar`}
                        width={84}
                        height={84}
                        draggable={false}
                        style={{
                          borderRadius: "50%",
                          border: "3px solid var(--c-bg)",
                          marginTop: "-42px",
                          position: "relative",
                          background: "var(--c-bg-secondary)",
                        }}
                      />
                      <h2 style={{ margin: "10px 0 0", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                        {profile.linkedin.name}
                      </h2>
                      <p style={{ margin: "4px 0 0", fontSize: "13.5px", lineHeight: 1.5 }}>{profile.linkedin.headline}</p>
                      <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "var(--c-text-secondary)" }}>
                        {profile.linkedin.location}
                      </p>
                      <div style={{ marginTop: "14px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <a
                          href={profile.linkedin.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View on LinkedIn"
                          style={{ textDecoration: "none" }}
                        >
                          <PushButton primary>View on LinkedIn</PushButton>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {section === "posts" && (
                <div
                  style={{
                    padding: isMobile ? "12px" : "20px",
                    maxWidth: "600px",
                    margin: "0 auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {posts.map((post) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        border: hairline,
                        borderRadius: "10px",
                        background: "var(--c-bg)",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ padding: "12px 16px 8px", display: "flex", gap: "10px", alignItems: "center" }}>
                        <img
                          src={AVATAR_URL}
                          alt=""
                          width={38}
                          height={38}
                          draggable={false}
                          style={{ borderRadius: "50%" }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "13px", fontWeight: 600 }}>{profile.linkedin.name}</div>
                          <div style={{ fontSize: "11.5px", color: "var(--c-text-secondary)" }}>
                            {formatDate(post.date)}
                            {post.placeholder ? " · Placeholder" : ""}
                          </div>
                        </div>
                      </div>
                      <p style={{ margin: 0, padding: "0 16px 12px", fontSize: "13px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {linkify(post.text)}
                      </p>
                      {post.image && (
                        <img
                          src={post.image}
                          alt="Post attachment"
                          loading="lazy"
                          draggable={false}
                          style={{ width: "100%", display: "block", borderTop: hairline, borderBottom: hairline }}
                        />
                      )}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "9px 16px",
                          fontSize: "12px",
                          color: "var(--c-text-secondary)",
                          borderTop: post.image ? "none" : hairline,
                        }}
                      >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <span className="i-ph:thumbs-up" style={{ width: "14px", height: "14px" }} aria-hidden />
                          {post.likes}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <span className="i-ph:chat-circle" style={{ width: "14px", height: "14px" }} aria-hidden />
                          {post.comments} comments
                        </span>
                        <span style={{ flex: 1 }} />
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View post from ${formatDate(post.date)} on LinkedIn`}
                          style={{ color: LINKEDIN_BLUE, fontWeight: 600, textDecoration: "none" }}
                        >
                          View post →
                        </a>
                      </div>
                    </motion.article>
                  ))}
                  {posts.length === 0 && (
                    <div style={{ padding: "32px", textAlign: "center", fontSize: "13px", color: "var(--c-text-secondary)" }}>
                      {query ? `No posts match “${query}”.` : "No posts yet."}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <StatusBar>
        {section === "profile" ? profile.linkedin.name : `${posts.length} of ${allPosts.length} posts`}
      </StatusBar>
    </div>
  );
}
