import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "~/hooks/useWindowSize";
import {
  useGithubProfile,
  useGithubRepos,
  useGithubActivity,
  timeAgo,
  languageColor,
  type GithubRepo,
} from "~/hooks/useGithub";
import profile from "~/config/profile";
import {
  useMacSurfaces,
  macBlur,
  SideBadge,
  SideRow,
  SideSectionLabel,
  MacToolbar,
  ToolButton,
  SearchField,
  PushButton,
  StatusBar,
} from "./shared/mac";

type Section = "profile" | "repos" | "activity";

const SECTIONS: { id: Section; label: string; glyph: string; color: string }[] = [
  { id: "profile", label: "Profile", glyph: "i-ph:user-circle", color: "#8E8E93" },
  { id: "repos", label: "Repositories", glyph: "i-ph:code", color: "#0A84FF" },
  { id: "activity", label: "Activity", glyph: "i-ph:pulse", color: "#FF9F0A" },
];

/** Sentinel and SwasthyaSetu float to the top of the repo list when present. */
const PINNED_FIRST = ["sentinel", "swasthyasetu"];

function sortRepos(repos: GithubRepo[]): GithubRepo[] {
  const pinned: GithubRepo[] = [];
  const rest: GithubRepo[] = [];
  for (const repo of repos) {
    if (PINNED_FIRST.includes(repo.name.toLowerCase())) pinned.push(repo);
    else rest.push(repo);
  }
  pinned.sort(
    (a, b) => PINNED_FIRST.indexOf(a.name.toLowerCase()) - PINNED_FIRST.indexOf(b.name.toLowerCase())
  );
  return [...pinned, ...rest];
}

function describeEvent(type: string): string {
  switch (type) {
    case "PushEvent":
      return "Pushed commits to";
    case "CreateEvent":
      return "Created";
    case "WatchEvent":
      return "Starred";
    case "ForkEvent":
      return "Forked";
    case "PullRequestEvent":
      return "Opened a pull request in";
    case "IssuesEvent":
      return "Worked on an issue in";
    case "DeleteEvent":
      return "Deleted a branch in";
    default:
      return type.replace(/Event$/, "");
  }
}

function Skeleton({ width, height, radius = 6 }: { width: string; height: number; radius?: number }) {
  const { dark } = useMacSurfaces();
  return (
    <motion.div
      aria-hidden
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width,
        height,
        borderRadius: radius,
        background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
      }}
    />
  );
}

function ErrorFallback({ message }: { message: string }) {
  return (
    <div
      role="alert"
      style={{
        margin: "24px",
        padding: "20px",
        borderRadius: "10px",
        border: "1px solid var(--c-border)",
        background: "var(--c-bg-secondary)",
        textAlign: "center",
        fontSize: "13px",
        color: "var(--c-text-secondary)",
        lineHeight: 1.6,
      }}
    >
      <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--c-text)", marginBottom: "6px" }}>
        Something went wrong
      </div>
      {message}
      <div style={{ marginTop: "12px" }}>
        <a
          href={profile.github.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0A84FF", fontWeight: 600 }}
        >
          View {profile.github.username} on GitHub →
        </a>
      </div>
    </div>
  );
}

export default function GitHub() {
  const { material, hairline, font } = useMacSurfaces();
  const { winWidth } = useWindowSize();
  const isMobile = winWidth < 768;
  const [section, setSection] = useState<Section>("profile");
  const [query, setQuery] = useState("");

  const profileQuery = useGithubProfile();
  const reposQuery = useGithubRepos();
  const activityQuery = useGithubActivity();
  const activeQuery =
    section === "profile" ? profileQuery : section === "repos" ? reposQuery : activityQuery;

  const repos = useMemo(() => {
    const all = reposQuery.data ? sortRepos(reposQuery.data) : [];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        (r.language ?? "").toLowerCase().includes(q)
    );
  }, [reposQuery.data, query]);

  const events = useMemo(() => {
    const all = activityQuery.data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((e) => e.repo.name.toLowerCase().includes(q));
  }, [activityQuery.data, query]);

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
      {/* Toolbar */}
      <MacToolbar
        left={
          <>
            <ToolButton
              glyph={activeQuery.refreshing ? "i-ph:circle-notch" : "i-ph:arrow-clockwise"}
              label="Refresh"
              onClick={activeQuery.refresh}
              disabled={activeQuery.loading}
            />
            <span style={{ fontSize: "14px", fontWeight: 700, marginLeft: "4px" }}>
              {SECTIONS.find((s) => s.id === section)?.label}
            </span>
          </>
        }
        right={
          section !== "profile" ? (
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder={section === "repos" ? "Search repos" : "Search activity"}
              label={section === "repos" ? "Search repositories" : "Search activity"}
            />
          ) : (
            <a
              href={profile.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              style={{ textDecoration: "none" }}
            >
              <PushButton primary>View on GitHub</PushButton>
            </a>
          )
        }
      />

      {/* Mobile segmented control */}
      {isMobile && (
        <div
          role="tablist"
          aria-label="GitHub sections"
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
            aria-label="GitHub sections"
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
            <SideSectionLabel>GitHub</SideSectionLabel>
            {SECTIONS.map((s) => (
              <SideRow
                key={s.id}
                active={section === s.id}
                onClick={() => switchSection(s.id)}
                badge={<SideBadge glyph={s.glyph} color={s.color} />}
                label={s.label}
                count={s.id === "repos" ? (reposQuery.data?.length ?? 0) : undefined}
              />
            ))}
            <div style={{ flex: 1 }} />
            <SideSectionLabel>Account</SideSectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px" }}>
              <img
                src={`https://github.com/${profile.github.username}.png`}
                alt=""
                width={26}
                height={26}
                draggable={false}
                style={{ borderRadius: "50%" }}
              />
              <span
                style={{
                  fontSize: "12.5px",
                  color: "var(--c-text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {profile.github.username}
              </span>
            </div>
          </nav>
        )}

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
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
                <div style={{ padding: isMobile ? "16px" : "28px", maxWidth: "560px" }}>
                  {profileQuery.loading ? (
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <Skeleton width="88px" height={88} radius={44} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                        <Skeleton width="60%" height={20} />
                        <Skeleton width="40%" height={14} />
                        <Skeleton width="80%" height={14} />
                      </div>
                    </div>
                  ) : profileQuery.error && !profileQuery.data ? (
                    <ErrorFallback message={profileQuery.error} />
                  ) : profileQuery.data ? (
                    <>
                      {profileQuery.error && (
                        <div style={{ fontSize: "12px", color: "var(--c-text-tertiary)", marginBottom: "12px" }}>
                          {profileQuery.error}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
                        <img
                          src={profileQuery.data.avatar_url}
                          alt={`${profileQuery.data.login}'s GitHub avatar`}
                          width={88}
                          height={88}
                          style={{ borderRadius: "50%", border: hairline }}
                          draggable={false}
                        />
                        <div style={{ minWidth: 0 }}>
                          <h2 style={{ margin: 0, fontSize: "24px", fontWeight: 700, letterSpacing: "-0.02em" }}>
                            {profileQuery.data.name ?? profileQuery.data.login}
                          </h2>
                          <div style={{ fontSize: "14px", color: "var(--c-text-secondary)" }}>
                            @{profileQuery.data.login}
                          </div>
                          {profileQuery.data.bio && (
                            <p style={{ margin: "8px 0 0", fontSize: "13px", lineHeight: 1.55 }}>{profileQuery.data.bio}</p>
                          )}
                        </div>
                      </div>
                      {/* Stats as a native grouped table */}
                      <div
                        style={{
                          marginTop: "20px",
                          borderRadius: "10px",
                          border: hairline,
                          background: "var(--c-bg-secondary)",
                          overflow: "hidden",
                        }}
                      >
                        {[
                          { label: "Followers", value: profileQuery.data.followers },
                          { label: "Following", value: profileQuery.data.following },
                          { label: "Public repositories", value: profileQuery.data.public_repos },
                        ].map((stat, i, arr) => (
                          <div
                            key={stat.label}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              padding: "10px 16px",
                              borderBottom: i < arr.length - 1 ? hairline : "none",
                              fontSize: "13px",
                            }}
                          >
                            <span>{stat.label}</span>
                            <span style={{ flex: 1 }} />
                            <span style={{ fontWeight: 600, color: "var(--c-text-secondary)" }}>{stat.value}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "16px" }}>
                        <a
                          href={profileQuery.data.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View on GitHub"
                          style={{ textDecoration: "none" }}
                        >
                          <PushButton primary>View on GitHub</PushButton>
                        </a>
                      </div>
                    </>
                  ) : null}
                </div>
              )}

              {section === "repos" && (
                <div>
                  {reposQuery.loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "16px" }}>
                      {[0, 1, 2].map((i) => (
                        <div key={i}>
                          <Skeleton width="45%" height={16} />
                          <div style={{ height: "8px" }} />
                          <Skeleton width="90%" height={12} />
                        </div>
                      ))}
                    </div>
                  ) : reposQuery.error && !reposQuery.data ? (
                    <ErrorFallback message={reposQuery.error} />
                  ) : (
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {repos.map((repo) => (
                        <li key={repo.id} style={{ borderBottom: hairline }}>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${repo.name} on GitHub`}
                            style={{
                              display: "flex",
                              gap: "12px",
                              alignItems: "center",
                              padding: "11px 16px",
                              textDecoration: "none",
                              color: "inherit",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "var(--c-bg-secondary)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            <span
                              className="i-ph:folder-simple"
                              aria-hidden
                              style={{ width: "22px", height: "22px", color: "#0A84FF", flexShrink: 0 }}
                            />
                            <span style={{ flex: 1, minWidth: 0 }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ fontSize: "13.5px", fontWeight: 600 }}>{repo.name}</span>
                                {PINNED_FIRST.includes(repo.name.toLowerCase()) && (
                                  <span
                                    style={{
                                      fontSize: "10px",
                                      fontWeight: 700,
                                      color: "#0A84FF",
                                      border: "1px solid #0A84FF",
                                      borderRadius: "9px",
                                      padding: "0 7px",
                                      lineHeight: "16px",
                                    }}
                                  >
                                    Pinned
                                  </span>
                                )}
                              </span>
                              {repo.description && (
                                <span
                                  style={{
                                    display: "block",
                                    fontSize: "12px",
                                    color: "var(--c-text-secondary)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    marginTop: "1px",
                                  }}
                                >
                                  {repo.description}
                                </span>
                              )}
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  marginTop: "4px",
                                  fontSize: "11.5px",
                                  color: "var(--c-text-tertiary)",
                                }}
                              >
                                {repo.language && (
                                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                    <span
                                      aria-hidden
                                      style={{
                                        width: "9px",
                                        height: "9px",
                                        borderRadius: "50%",
                                        background: languageColor(repo.language),
                                      }}
                                    />
                                    {repo.language}
                                  </span>
                                )}
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                  <span className="i-ph:star" style={{ width: "12px", height: "12px" }} aria-hidden />
                                  {repo.stargazers_count}
                                </span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                                  <span className="i-ph:git-fork" style={{ width: "12px", height: "12px" }} aria-hidden />
                                  {repo.forks_count}
                                </span>
                                <span>Updated {timeAgo(repo.updated_at)}</span>
                              </span>
                            </span>
                            <span
                              className="i-ph:caret-right"
                              aria-hidden
                              style={{ width: "14px", height: "14px", color: "var(--c-text-tertiary)", flexShrink: 0 }}
                            />
                          </a>
                        </li>
                      ))}
                      {repos.length === 0 && (
                        <li style={{ padding: "32px", textAlign: "center", fontSize: "13px", color: "var(--c-text-secondary)" }}>
                          {query ? `No repositories match “${query}”.` : "No repositories found."}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              )}

              {section === "activity" && (
                <div>
                  {activityQuery.loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "16px" }}>
                      {[0, 1, 2, 3].map((i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <Skeleton width="30px" height={30} radius={15} />
                          <Skeleton width="70%" height={14} />
                        </div>
                      ))}
                    </div>
                  ) : activityQuery.error && !activityQuery.data ? (
                    <ErrorFallback message={activityQuery.error} />
                  ) : events.length > 0 ? (
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                      {events.slice(0, 20).map((event) => (
                        <li key={event.id} style={{ borderBottom: hairline }}>
                          <a
                            href={`https://github.com/${event.repo.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${describeEvent(event.type)} ${event.repo.name}`}
                            style={{
                              display: "flex",
                              gap: "12px",
                              padding: "10px 16px",
                              alignItems: "flex-start",
                              textDecoration: "none",
                              color: "inherit",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "var(--c-bg-secondary)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                          >
                            <span
                              className="i-ph:git-commit"
                              aria-hidden
                              style={{
                                width: "28px",
                                height: "28px",
                                flexShrink: 0,
                                borderRadius: "50%",
                                background: "rgba(10,132,255,0.12)",
                                color: "#0A84FF",
                                display: "inline-flex",
                                padding: "7px",
                              }}
                            />
                            <span style={{ minWidth: 0, flex: 1 }}>
                              <span style={{ fontSize: "13px", lineHeight: 1.5, display: "block" }}>
                                {describeEvent(event.type)}{" "}
                                <span style={{ color: "#0A84FF", fontWeight: 600 }}>{event.repo.name}</span>
                              </span>
                              {event.payload?.commits?.[0] && (
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "var(--c-text-secondary)",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    marginTop: "2px",
                                    display: "block",
                                  }}
                                >
                                  “{event.payload.commits[0].message.split("\n")[0]}”
                                </span>
                              )}
                              <span style={{ fontSize: "11px", color: "var(--c-text-tertiary)", marginTop: "3px", display: "block" }}>
                                {timeAgo(event.created_at)}
                              </span>
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ padding: "32px", textAlign: "center", fontSize: "13px", color: "var(--c-text-secondary)" }}>
                      {query ? `No activity matches “${query}”.` : "No recent public activity."}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Status bar */}
      <StatusBar>
        {section === "profile" &&
          (profileQuery.data ? `@${profileQuery.data.login} · ${profileQuery.data.public_repos} repositories` : "GitHub")}
        {section === "repos" &&
          (reposQuery.data
            ? `${repos.length} of ${reposQuery.data.length} repositories${query ? ` matching “${query}”` : ""}`
            : "Repositories")}
        {section === "activity" &&
          (activityQuery.data ? `${events.length} recent events` : "Activity")}
      </StatusBar>
    </div>
  );
}
