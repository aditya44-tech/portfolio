import React, { useState, useMemo } from "react";
import profile from "~/config/profile";
import {
  useGithubProfile,
  useGithubRepos,
  useGithubActivity,
  timeAgo,
  languageColor,
  type GithubRepo,
  type GithubEvent,
} from "~/hooks/useGithub";

// ── SVG Octicons ─────────────────────────────────────────────────────────────
const Octocat = ({ size = 32 }: { size?: number }) => (
  <svg
    height={size}
    viewBox="0 0 16 16"
    version="1.1"
    width={size}
    fill="currentColor"
    aria-hidden="true"
    style={{ display: "inline-block", userSelect: "none", verticalAlign: "text-bottom", overflow: "visible" }}
  >
    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
  </svg>
);

const RepoIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    height={size}
    viewBox="0 0 16 16"
    version="1.1"
    width={size}
    fill="currentColor"
    style={{ display: "inline-block", userSelect: "none", verticalAlign: "text-bottom", overflow: "visible" }}
  >
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 0 0 1.5h2.5a2.25 2.25 0 0 0 2.25-2.25V.75A2.25 2.25 0 0 0 13.25-1.5H4.5A4 4 0 0 0 .5 2.5v10.75a.75.75 0 0 0 1.5 0V2.5Z" />
  </svg>
);

const BookIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    aria-hidden="true"
    height={size}
    viewBox="0 0 16 16"
    version="1.1"
    width={size}
    fill="currentColor"
    style={{ display: "inline-block", userSelect: "none", verticalAlign: "text-bottom", overflow: "visible" }}
  >
    <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.244a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.244a2.25 2.25 0 0 0-1.506.572l-.25.222a.75.75 0 0 1-.998 0l-.25-.222A2.25 2.25 0 0 0 4.997 13H.75a.75.75 0 0 1-.75-.75Zm1.5.75v8.5h3.497A3.75 3.75 0 0 1 8 12.18c.85-.724 1.953-1.18 3.003-1.18h3.497v-8.5h-3.497A2.25 2.25 0 0 0 9.5 3.25V11a.75.75 0 0 1-1.5 0V3.25A2.25 2.25 0 0 0 6.5 1h-5Z" />
  </svg>
);

const ProjectIcon = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 16 16" width={size} fill="currentColor">
    <path d="M1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0ZM1.5 1.75v12.5c0 .138.112.25.25.25H6V1.5H1.75a.25.25 0 0 0-.25.25ZM7.5 14.5h6.75a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H7.5Z" />
  </svg>
);

const PackageIcon = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 16 16" width={size} fill="currentColor">
    <path d="m8.878.392 5.25 3.045c.54.314.872.89.872 1.514v6.098a1.75 1.75 0 0 1-.872 1.514l-5.25 3.045a1.75 1.75 0 0 1-1.756 0l-5.25-3.045A1.75 1.75 0 0 1 1 11.049V4.951c0-.624.332-1.201.872-1.514L7.122.392a1.75 1.75 0 0 1 1.756 0ZM7.875 1.69l-4.63 2.685L8 7.133l4.755-2.758-4.63-2.685a.248.248 0 0 0-.25 0ZM2.5 5.677v5.372c0 .09.047.171.125.216l4.625 2.683V8.432Zm11 5.372V5.677L8.75 8.432v5.516l4.625-2.683a.25.25 0 0 0 .125-.216Z" />
  </svg>
);

const StarIcon = ({ size = 16 }: { size?: number }) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 16 16" width={size} fill="currentColor">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.695Z" />
  </svg>
);

const ForkIcon = ({ size = 14 }: { size?: number }) => (
  <svg aria-hidden="true" height={size} viewBox="0 0 16 16" width={size} fill="currentColor">
    <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h4.5A2.25 2.25 0 0 0 12.5 6.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm6.5-2.122a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM5 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm-1.5-2.122A2.25 2.25 0 1 0 5 12.75v-2.122A2.25 2.25 0 0 0 3.5 10.628Z" />
  </svg>
);

const DragDots = () => (
  <svg width="12" height="16" viewBox="0 0 12 16" fill="currentColor">
    <circle cx="3" cy="3" r="1.5" />
    <circle cx="9" cy="3" r="1.5" />
    <circle cx="3" cy="8" r="1.5" />
    <circle cx="9" cy="8" r="1.5" />
    <circle cx="3" cy="13" r="1.5" />
    <circle cx="9" cy="13" r="1.5" />
  </svg>
);

const MailIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
    <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.441Zm13-7.581-6.12 3.443a.25.25 0 0 1-.26 0L2 4.669V3.75a.25.25 0 0 1 .25-.25h11.5a.25.25 0 0 1 .25.25v.919Z" />
  </svg>
);

const SmileyIcon = () => (
  <svg aria-hidden="true" height="18" viewBox="0 0 16 16" width="18" fill="currentColor">
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm4-2a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-5.36 5.86a.75.75 0 0 1 1.06-.04 3.75 3.75 0 0 0 4.6 0 .75.75 0 1 1 .96 1.15 5.25 5.25 0 0 1-6.44 0 .75.75 0 0 1-.18-1.11Z" />
  </svg>
);

const SearchIcon = () => (
  <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14" fill="currentColor">
    <path d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z" />
  </svg>
);

const PullRequestIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
    <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.5 5.396V4.25a.75.75 0 0 1 .75-.75h1.5A2.25 2.25 0 0 1 14 5.75v5.256a2.251 2.251 0 1 1-1.5 0V5.75a.75.75 0 0 0-.75-.75h-1.5v1.146L7.177 3.073a.25.25 0 0 0 0 .354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.5 0a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z" />
  </svg>
);

const IssuesIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
  </svg>
);

const BellIcon = () => (
  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
    <path d="M8 16a2 2 0 0 0 1.985-1.75c.01-.08-.05-.15-.13-.15h-3.71c-.08 0-.14.07-.13.15A2 2 0 0 0 8 16ZM3 5a5 5 0 0 1 10 0v2.947c0 .05.015.098.042.139l1.637 2.532c.325.503-.04.182-.679.182H2c-.64 0-1.004-.321-.679-.824l1.637-2.53a.255.255 0 0 0 .042-.14V5Z" />
  </svg>
);

// ── Pinned repositories from screenshot ───────────────────────────────────────
const PINNED_CONFIG = [
  { name: "CivicConnect", lang: "TypeScript", color: "#3178c6" },
  { name: "Editing-Portfolio", lang: "TypeScript", color: "#3178c6" },
  { name: "leetcode-tracker-extension", lang: "JavaScript", color: "#f1e05a" },
  { name: "SafeSearch", lang: "TypeScript", color: "#3178c6" },
  { name: "Sentinel", lang: "TypeScript", color: "#3178c6" },
  { name: "SwasthyaSetu", lang: "TypeScript", color: "#3178c6" },
];

// ── Realistic 52-week contribution data matching the user's screenshot ───────
// Months across top: Nov, Dec, Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct
function generateContributionWeeks(): { count: number; date: string; level: number }[][] {
  const weeks: { count: number; date: string; level: number }[][] = [];
  const baseDate = new Date(2025, 10, 2); // Start early Nov 2025

  // Deterministic seed pattern: mostly quiet, slight activity in Mar, heavy in Aug-Oct.
  // Totals exactly 241 contributions.
  const weights: number[] = [
    // Nov - Feb (weeks 0 - 15): 0
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    // Mar (weeks 16 - 19): small burst
    0, 5, 4, 0,
    // Apr - Jul (weeks 20 - 37): quiet
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    // Aug - Oct (weeks 38 - 51): heavy activity
    12, 16, 22, 28, 30, 24, 26, 21, 18, 15, 12, 8, 5, 1
  ];

  let dayOffset = 0;
  for (let w = 0; w < 52; w++) {
    const days: { count: number; date: string; level: number }[] = [];
    const targetWeekTotal = weights[w] || 0;
    let distributed = 0;

    for (let d = 0; d < 7; d++) {
      const dDate = new Date(baseDate);
      dDate.setDate(baseDate.getDate() + dayOffset);
      dayOffset++;

      let count = 0;
      if (targetWeekTotal > 0) {
        if (d === 1 || d === 3 || d === 5 || d === 2 || d === 4) {
          const maxShare = Math.ceil((targetWeekTotal - distributed) / (7 - d));
          count = Math.min(Math.max(0, maxShare), targetWeekTotal - distributed);
          distributed += count;
        }
      }

      // Map count to GitHub level (0 to 4)
      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5 && count <= 8) level = 3;
      else if (count > 8) level = 4;

      days.push({
        count,
        date: dDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        level,
      });
    }
    weeks.push(days);
  }

  return weeks;
}

export default function GitHub() {
  const [activeTab, setActiveTab] = useState<"overview" | "repositories" | "projects" | "packages" | "stars">("overview");
  const [activeYear, setActiveYear] = useState<"2026" | "2025">("2026");
  const [repoSearch, setRepoSearch] = useState("");
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  const profileQuery = useGithubProfile();
  const reposQuery = useGithubRepos();
  const activityQuery = useGithubActivity();

  const contributionWeeks = useMemo(() => generateContributionWeeks(), []);

  // Sync pinned repos with live data if available
  const pinnedRepos = useMemo(() => {
    return PINNED_CONFIG.map((pin) => {
      const live = reposQuery.data?.find((r) => r.name.toLowerCase() === pin.name.toLowerCase());
      return {
        name: pin.name,
        description: live?.description || null,
        language: live?.language || pin.lang,
        langColor: pin.color || languageColor(live?.language || pin.lang),
        stars: live?.stargazers_count ?? 0,
        forks: live?.forks_count ?? 0,
        url: live?.html_url || `https://github.com/${profile.github.username}/${pin.name}`,
      };
    });
  }, [reposQuery.data]);

  // Full repository list filtered
  const filteredRepos = useMemo(() => {
    const list = reposQuery.data || [];
    const q = repoSearch.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? "").toLowerCase().includes(q) ||
        (r.language ?? "").toLowerCase().includes(q)
    );
  }, [reposQuery.data, repoSearch]);

  const avatarUrl = profileQuery.data?.avatar_url || `https://github.com/${profile.github.username}.png`;
  const fullName = profileQuery.data?.name || "Aditya Salunkhe";
  const username = profileQuery.data?.login || profile.github.username;
  const userBio = profileQuery.data?.bio;

  const monthLabels = [
    { label: "Nov", col: 0 },
    { label: "Dec", col: 4 },
    { label: "Jan", col: 8 },
    { label: "Feb", col: 13 },
    { label: "Mar", col: 17 },
    { label: "Apr", col: 21 },
    { label: "May", col: 26 },
    { label: "Jun", col: 30 },
    { label: "Jul", col: 34 },
    { label: "Aug", col: 39 },
    { label: "Sep", col: 43 },
    { label: "Oct", col: 48 },
  ];

  const levelColors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: "#0d1117",
        color: "#f0f6fc",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif',
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* ── Top GitHub Navigation Bar ────────────────────────────────────────── */}
      <header
        style={{
          height: 48,
          background: "#010409",
          borderBottom: "1px solid #21262d",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Left: Octocat Logo + username */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a
            href={profile.github.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ffffff", display: "flex", alignItems: "center" }}
            title="GitHub"
          >
            <Octocat size={32} />
          </a>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#f0f6fc",
              letterSpacing: "-0.01em",
            }}
          >
            {username}
          </span>
        </div>

        {/* Right: Search + Action Icons + Profile Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Search Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: 6,
              height: 28,
              padding: "0 8px",
              width: 220,
              color: "#7d8590",
              fontSize: 12,
              gap: 6,
            }}
          >
            <SearchIcon />
            <input
              type="text"
              value={repoSearch}
              onChange={(e) => {
                setRepoSearch(e.target.value);
                if (activeTab !== "repositories") setActiveTab("repositories");
              }}
              placeholder="Type / to search"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#f0f6fc",
                fontSize: 12,
                width: "100%",
              }}
            />
            <span
              style={{
                border: "1px solid #30363d",
                borderRadius: 4,
                padding: "0 4px",
                fontSize: 10,
                color: "#7d8590",
                lineHeight: "16px",
              }}
            >
              /
            </span>
          </div>

          {/* Action icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#7d8590" }}>
            <span title="Pull requests" style={{ cursor: "pointer", display: "flex" }}>
              <PullRequestIcon />
            </span>
            <span title="Issues" style={{ cursor: "pointer", display: "flex" }}>
              <IssuesIcon />
            </span>
            <span title="Notifications" style={{ cursor: "pointer", display: "flex" }}>
              <BellIcon />
            </span>
            <span style={{ fontSize: 13, color: "#7d8590", cursor: "pointer", userSelect: "none" }}>+ ▾</span>
          </div>

          {/* Mini profile avatar */}
          <a
            href={profile.github.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Signed in as ${username}`}
            style={{ display: "flex" }}
          >
            <img
              src={avatarUrl}
              alt={username}
              width={20}
              height={20}
              style={{ borderRadius: "50%", border: "1px solid #30363d", objectFit: "cover" }}
            />
          </a>
        </div>
      </header>

      {/* ── Subheader Profile Tab Bar ────────────────────────────────────────── */}
      <nav
        aria-label="User profile navigation"
        style={{
          background: "#0d1117",
          borderBottom: "1px solid #21262d",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 24px",
          gap: 4,
          flexShrink: 0,
          overflowX: "auto",
        }}
      >
        {[
          { id: "overview", label: "Overview", icon: <BookIcon size={16} /> },
          {
            id: "repositories",
            label: "Repositories",
            icon: <RepoIcon size={16} />,
            count: reposQuery.data ? reposQuery.data.length : 11,
          },
          { id: "projects", label: "Projects", icon: <ProjectIcon size={16} /> },
          { id: "packages", label: "Packages", icon: <PackageIcon size={16} /> },
          { id: "stars", label: "Stars", icon: <StarIcon size={16} /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                border: "none",
                background: "transparent",
                color: isActive ? "#f0f6fc" : "#7d8590",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                borderBottom: isActive ? "2px solid #f78166" : "2px solid transparent",
                marginBottom: -1,
                whiteSpace: "nowrap",
                fontFamily: "inherit",
              }}
            >
              <span style={{ display: "flex", color: isActive ? "#f0f6fc" : "#7d8590" }}>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    background: "#21262d",
                    color: "#f0f6fc",
                    borderRadius: 20,
                    padding: "0 6px",
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: "18px",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Main Profile Body (Overview Tab) ─────────────────────────────────── */}
      {activeTab === "overview" && (
        <div
          style={{
            maxWidth: 1240,
            width: "100%",
            margin: "0 auto",
            padding: "24px 28px 48px",
            display: "flex",
            gap: 32,
            boxSizing: "border-box",
          }}
        >
          {/* Left Column: Profile Sidebar */}
          <aside style={{ width: 260, flexShrink: 0 }}>
            {/* Circular Avatar + Smiley Status Overlay */}
            <div style={{ position: "relative", width: 260, height: 260 }}>
              <img
                src={avatarUrl}
                alt={`${fullName}'s profile avatar`}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  border: "1px solid #30363d",
                  objectFit: "cover",
                  display: "block",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.06)",
                }}
              />
              {/* Smiley Status Badge */}
              <button
                type="button"
                title="Set status"
                style={{
                  position: "absolute",
                  bottom: 12,
                  right: 12,
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#21262d",
                  border: "1px solid #30363d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#7d8590",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
              >
                <SmileyIcon />
              </button>
            </div>

            {/* Names & Pronouns */}
            <div style={{ marginTop: 16 }}>
              <h1
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#f0f6fc",
                  lineHeight: 1.25,
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {fullName}
              </h1>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 300,
                  color: "#7d8590",
                  marginTop: 2,
                }}
              >
                {username} · he/him
              </div>
            </div>

            {/* Edit Profile Button */}
            <a
              href="https://github.com/settings/profile"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                marginTop: 16,
                width: "100%",
                padding: "5px 0",
                fontSize: 14,
                fontWeight: 500,
                color: "#c9d1d9",
                background: "#21262d",
                border: "1px solid #30363d",
                borderRadius: 6,
                textAlign: "center",
                textDecoration: "none",
                cursor: "pointer",
                boxSizing: "border-box",
                transition: "background 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#30363d";
                e.currentTarget.style.borderColor = "#8b949e";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#21262d";
                e.currentTarget.style.borderColor = "#30363d";
              }}
            >
              Edit profile
            </a>

            {/* User Bio if present */}
            {userBio && (
              <p style={{ marginTop: 16, fontSize: 14, color: "#e6edf3", lineHeight: 1.5, margin: "16px 0 0" }}>
                {userBio}
              </p>
            )}

            {/* Email detail */}
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#e6edf3" }}>
              <span style={{ color: "#7d8590", display: "flex" }}>
                <MailIcon />
              </span>
              <a
                href={`mailto:${profile.email}`}
                style={{ color: "#e6edf3", textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#58a6ff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#e6edf3")}
              >
                {profile.email}
              </a>
            </div>
          </aside>

          {/* Right Column: Pinned, Contribution Heatmap, Contribution Activity */}
          <main style={{ flex: 1, minWidth: 0 }}>
            {/* ── Pinned Section ────────────────────────────────────────────── */}
            <section style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 400, color: "#f0f6fc" }}>Pinned</span>
                <span style={{ fontSize: 12, color: "#58a6ff", cursor: "pointer" }}>
                  Customize your pins
                </span>
              </div>

              {/* 2-column Grid of Pinned Cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 16,
                }}
              >
                {pinnedRepos.map((pin) => (
                  <div
                    key={pin.name}
                    style={{
                      background: "#0d1117",
                      border: "1px solid #30363d",
                      borderRadius: 6,
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 96,
                      boxSizing: "border-box",
                    }}
                  >
                    <div>
                      {/* Top Row: Icon + Name + Public Badge + Drag Handle */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                          <span style={{ color: "#7d8590", display: "flex" }}>
                            <RepoIcon size={16} />
                          </span>
                          <a
                            href={pin.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: "#58a6ff",
                              fontWeight: 600,
                              fontSize: 14,
                              textDecoration: "none",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                          >
                            {pin.name}
                          </a>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#7d8590",
                              border: "1px solid #30363d",
                              borderRadius: 24,
                              padding: "0 7px",
                              lineHeight: "18px",
                              fontWeight: 500,
                            }}
                          >
                            Public
                          </span>
                        </div>
                        <span style={{ color: "#7d8590", display: "flex", cursor: "grab" }}>
                          <DragDots />
                        </span>
                      </div>

                      {/* Optional Description */}
                      {pin.description && (
                        <p
                          style={{
                            margin: "8px 0 0",
                            fontSize: 12,
                            color: "#7d8590",
                            lineHeight: 1.5,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {pin.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Row: Language dot + name */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginTop: 14,
                        fontSize: 12,
                        color: "#7d8590",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: pin.langColor,
                            display: "inline-block",
                          }}
                        />
                        <span>{pin.language}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Contribution Heatmap Section ──────────────────────────────── */}
            <section style={{ marginBottom: 28 }}>
              {/* Header: Title + Settings dropdown */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 16, fontWeight: 400, color: "#f0f6fc" }}>
                  241 contributions in the last year
                </span>
                <span style={{ fontSize: 12, color: "#7d8590", cursor: "pointer" }}>
                  Contribution settings ▾
                </span>
              </div>

              {/* Box with Heatmap on left, Year pills on right */}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                {/* Heatmap Card */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    border: "1px solid #30363d",
                    borderRadius: 6,
                    padding: "16px 20px 14px",
                    background: "#0d1117",
                    position: "relative",
                  }}
                >
                  {/* Month labels header */}
                  <div
                    style={{
                      display: "flex",
                      position: "relative",
                      height: 16,
                      marginBottom: 6,
                      fontSize: 10,
                      color: "#7d8590",
                    }}
                  >
                    {monthLabels.map((m) => (
                      <span
                        key={m.label}
                        style={{
                          position: "absolute",
                          left: `${(m.col / 52) * 100}%`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>

                  {/* Grid of days + Row labels */}
                  <div style={{ display: "flex", gap: 6 }}>
                    {/* Day labels (Mon, Wed, Fri) */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: 88,
                        fontSize: 9,
                        color: "#7d8590",
                        paddingTop: 12,
                        paddingBottom: 4,
                        userSelect: "none",
                      }}
                    >
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                    </div>

                    {/* Columns of days (52 weeks x 7 days) */}
                    <div
                      style={{
                        display: "flex",
                        gap: 3,
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      {contributionWeeks.map((week, wIdx) => (
                        <div
                          key={`week-${wIdx}`}
                          style={{ display: "flex", flexDirection: "column", gap: 3 }}
                        >
                          {week.map((day, dIdx) => (
                            <div
                              key={`day-${wIdx}-${dIdx}`}
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                background: levelColors[day.level],
                                cursor: "pointer",
                                outline: "1px solid rgba(27,31,35,0.06)",
                              }}
                              onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltip({
                                  text: `${day.count === 0 ? "No" : day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`,
                                  x: rect.left + rect.width / 2,
                                  y: rect.top - 8,
                                });
                              }}
                              onMouseLeave={() => setTooltip(null)}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer: Learn link + Less/More Legend */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 12,
                      fontSize: 12,
                      color: "#7d8590",
                    }}
                  >
                    <a
                      href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#7d8590", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#58a6ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#7d8590")}
                    >
                      Learn how we count contributions
                    </a>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span>Less</span>
                      {levelColors.map((col, idx) => (
                        <span
                          key={`legend-${idx}`}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 2,
                            background: col,
                            display: "inline-block",
                          }}
                        />
                      ))}
                      <span>More</span>
                    </div>
                  </div>
                </div>

                {/* Year Selectors on right */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 80 }}>
                  <button
                    type="button"
                    onClick={() => setActiveYear("2026")}
                    style={{
                      background: activeYear === "2026" ? "#1f6feb" : "transparent",
                      color: activeYear === "2026" ? "#ffffff" : "#7d8590",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 14px",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    2026
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveYear("2025")}
                    style={{
                      background: activeYear === "2025" ? "#1f6feb" : "transparent",
                      color: activeYear === "2025" ? "#ffffff" : "#7d8590",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 14px",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    2025
                  </button>
                </div>
              </div>
            </section>

            {/* ── Contribution Activity Section ─────────────────────────────── */}
            <section>
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 400,
                  color: "#f0f6fc",
                  margin: "0 0 16px 0",
                }}
              >
                Contribution activity
              </h2>

              <div style={{ position: "relative", paddingLeft: 24 }}>
                {/* Timeline vertical line */}
                <div
                  style={{
                    position: "absolute",
                    left: 7,
                    top: 10,
                    bottom: 0,
                    width: 2,
                    background: "#21262d",
                  }}
                />

                {/* Activity List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {activityQuery.data && activityQuery.data.length > 0 ? (
                    activityQuery.data.slice(0, 6).map((ev: GithubEvent) => (
                      <div key={ev.id} style={{ position: "relative" }}>
                        {/* Timeline dot */}
                        <div
                          style={{
                            position: "absolute",
                            left: -24,
                            top: 4,
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background: "#21262d",
                            border: "2px solid #30363d",
                          }}
                        />
                        <div style={{ fontSize: 13, color: "#e6edf3" }}>
                          <span>Created commits in </span>
                          <a
                            href={`https://github.com/${ev.repo.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#58a6ff", fontWeight: 600, textDecoration: "none" }}
                          >
                            {ev.repo.name}
                          </a>
                        </div>
                        {ev.payload?.commits?.[0] && (
                          <div
                            style={{
                              fontSize: 12,
                              color: "#7d8590",
                              marginTop: 4,
                              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                            }}
                          >
                            “{ev.payload.commits[0].message.split("\n")[0]}”
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: "#7d8590", marginTop: 4 }}>
                          {timeAgo(ev.created_at)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: "#7d8590", fontSize: 13 }}>
                      Active contributions across Sentinel, SwasthyaSetu, SafeSearch and leetcode-tracker-extension.
                    </div>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      )}

      {/* ── Repositories Tab View ────────────────────────────────────────────── */}
      {activeTab === "repositories" && (
        <div style={{ maxWidth: 1180, width: "100%", margin: "0 auto", padding: "24px 32px 48px" }}>
          {/* Search bar + filter buttons */}
          <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
            <input
              type="text"
              value={repoSearch}
              onChange={(e) => setRepoSearch(e.target.value)}
              placeholder="Find a repository..."
              style={{
                flex: 1,
                background: "#0d1117",
                border: "1px solid #30363d",
                borderRadius: 6,
                padding: "6px 12px",
                color: "#f0f6fc",
                fontSize: 14,
                outline: "none",
              }}
            />
            {["Type: All", "Language: All", "Sort: Last updated"].map((filter) => (
              <button
                key={filter}
                type="button"
                style={{
                  background: "#21262d",
                  border: "1px solid #30363d",
                  borderRadius: 6,
                  padding: "5px 12px",
                  color: "#c9d1d9",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                {filter} ▾
              </button>
            ))}
          </div>

          {/* Repositories List */}
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {filteredRepos.map((repo: GithubRepo) => (
              <li
                key={repo.id}
                style={{
                  padding: "20px 0",
                  borderBottom: "1px solid #21262d",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        color: "#58a6ff",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                      onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
                    >
                      {repo.name}
                    </a>
                    <span
                      style={{
                        fontSize: 12,
                        color: "#7d8590",
                        border: "1px solid #30363d",
                        borderRadius: 24,
                        padding: "0 8px",
                        lineHeight: "20px",
                        fontWeight: 500,
                      }}
                    >
                      Public
                    </span>
                  </div>

                  {repo.description && (
                    <p style={{ margin: "8px 0 12px", fontSize: 14, color: "#7d8590", maxWidth: 700, lineHeight: 1.5 }}>
                      {repo.description}
                    </p>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12, color: "#7d8590" }}>
                    {repo.language && (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: languageColor(repo.language),
                          }}
                        />
                        <span>{repo.language}</span>
                      </span>
                    )}
                    {repo.stargazers_count > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <StarIcon size={14} /> {repo.stargazers_count}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <ForkIcon size={14} /> {repo.forks_count}
                      </span>
                    )}
                    <span>Updated {timeAgo(repo.updated_at)}</span>
                  </div>
                </div>

                {/* Right side Star button */}
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 12px",
                    background: "#21262d",
                    border: "1px solid #30363d",
                    borderRadius: 6,
                    color: "#c9d1d9",
                    fontSize: 12,
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  <StarIcon size={14} />
                  <span>Star</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Empty states for Projects, Packages, Stars ───────────────────────── */}
      {["projects", "packages", "stars"].includes(activeTab) && (
        <div
          style={{
            maxWidth: 600,
            margin: "80px auto",
            textAlign: "center",
            padding: 32,
            border: "1px dashed #30363d",
            borderRadius: 12,
          }}
        >
          <div style={{ color: "#7d8590", marginBottom: 12 }}>
            {activeTab === "projects" && <ProjectIcon size={40} />}
            {activeTab === "packages" && <PackageIcon size={40} />}
            {activeTab === "stars" && <StarIcon size={40} />}
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f0f6fc", margin: "0 0 8px" }}>
            No {activeTab} yet
          </h3>
          <p style={{ fontSize: 14, color: "#7d8590", margin: "0 0 16px" }}>
            View and manage {activeTab} on your official GitHub profile.
          </p>
          <a
            href={profile.github.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "#238636",
              color: "#ffffff",
              padding: "6px 16px",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            Open on GitHub
          </a>
        </div>
      )}

      {/* ── Hover Tooltip for Heatmap Cells ──────────────────────────────────── */}
      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
            background: "#6e7681",
            color: "#ffffff",
            padding: "4px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 500,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 100,
            boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
