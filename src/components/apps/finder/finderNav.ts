/**
 * Open the Finder app at a specific location from anywhere
 * (e.g. desktop folder icons). The Finder consumes the pending path
 * on mount and via the "finder:navigate" event — same event-bridge
 * pattern as "desktop:openApp".
 */
export type FinderPathRequest = string[];

let pending: FinderPathRequest | null = null;

export function requestFinderPath(path: FinderPathRequest): void {
  pending = path;
  window.dispatchEvent(new CustomEvent("finder:navigate"));
}

export function consumePendingFinderPath(): FinderPathRequest | null {
  const p = pending;
  pending = null;
  return p;
}
