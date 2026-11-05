import { useEffect, useState } from "react";
import profile from "~/config/profile";

/* Live GitHub REST API data with in-memory + sessionStorage caching (10 min TTL). */

export interface GithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
}

export interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  payload?: {
    commits?: { message: string }[];
    action?: string;
  };
  created_at: string;
}

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  rateLimited: boolean;
  refresh: () => void;
}

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const memoryCache = new Map<string, { data: unknown; fetchedAt: number }>();

function readSessionCache<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as { data: T; fetchedAt: number };
    if (Date.now() - entry.fetchedAt > CACHE_TTL) {
      sessionStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function writeSessionCache<T>(key: string, data: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ data, fetchedAt: Date.now() }));
  } catch {
    // sessionStorage may be unavailable — in-memory cache still applies.
  }
}

async function fetchCached<T>(key: string, url: string): Promise<T> {
  const mem = memoryCache.get(key) as { data: T; fetchedAt: number } | undefined;
  if (mem && Date.now() - mem.fetchedAt < CACHE_TTL) return mem.data;

  const stored = readSessionCache<T>(key);
  if (stored) {
    memoryCache.set(key, { data: stored, fetchedAt: Date.now() });
    return stored;
  }

  const res = await fetch(url);
  if (res.status === 403 || res.status === 429) {
    const err = new Error("rate-limited") as Error & { rateLimited: boolean };
    err.rateLimited = true;
    throw err;
  }
  if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
  const data = (await res.json()) as T;
  memoryCache.set(key, { data, fetchedAt: Date.now() });
  writeSessionCache(key, data);
  return data;
}

function bustCache(key: string): void {
  memoryCache.delete(key);
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}

function useGithubQuery<T>(cacheKey: string, url: string): QueryState<T> {
  const [nonce, setNonce] = useState(0);
  const [state, setState] = useState<Omit<QueryState<T>, "refresh">>({
    data: null,
    loading: true,
    refreshing: false,
    error: null,
    rateLimited: false,
  });

  useEffect(() => {
    let cancelled = false;
    const hadData = nonce > 0;
    if (hadData) setState((s) => ({ ...s, refreshing: true }));
    fetchCached<T>(cacheKey, url)
      .then((data) => {
        if (!cancelled)
          setState({ data, loading: false, refreshing: false, error: null, rateLimited: false });
      })
      .catch((e: Error & { rateLimited?: boolean }) => {
        if (cancelled) return;
        if (e.rateLimited) {
          setState({
            data: readSessionCache<T>(cacheKey),
            loading: false,
            refreshing: false,
            error: "GitHub API rate limit reached. Showing the latest cached data — try again in a few minutes.",
            rateLimited: true,
          });
        } else {
          setState({
            data: readSessionCache<T>(cacheKey),
            loading: false,
            refreshing: false,
            error: "Couldn't reach GitHub right now. Check your connection and try again.",
            rateLimited: false,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [cacheKey, url, nonce]);

  return {
    ...state,
    refresh: () => {
      bustCache(cacheKey);
      setNonce((n) => n + 1);
    },
  };
}

export function useGithubProfile(): QueryState<GithubProfile> {
  const username = profile.github.username;
  return useGithubQuery<GithubProfile>(
    `github-profile-${username}`,
    `https://api.github.com/users/${username}`
  );
}

export function useGithubRepos(): QueryState<GithubRepo[]> {
  const username = profile.github.username;
  return useGithubQuery<GithubRepo[]>(
    `github-repos-${username}`,
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`
  );
}

export function useGithubActivity(): QueryState<GithubEvent[]> {
  const username = profile.github.username;
  return useGithubQuery<GithubEvent[]>(
    `github-events-${username}`,
    `https://api.github.com/users/${username}/events/public?per_page=30`
  );
}

/** "2h ago" style relative timestamp. */
export function timeAgo(iso: string): string {
  const seconds = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return days === 1 ? "yesterday" : `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178C6",
  JavaScript: "#F1E05A",
  Python: "#3572A5",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
  Dart: "#00B4AB",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Ruby: "#701516",
  PHP: "#4F5D95",
};

export function languageColor(language: string | null): string {
  if (!language) return "#8E8E93";
  return LANGUAGE_COLORS[language] ?? "#8E8E93";
}
