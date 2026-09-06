const KEY = "airpal.mode";
const LIVE_STASH_KEY = "airpal.live.user.stash";
const LIVE_PROPERTY_STASH_KEY = "airpal.live.property.stash";

export function isDemoMode() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  if (host === "demo.airpal.me" || host.startsWith("demo.")) return true;
  if (window.sessionStorage.getItem(KEY) === "demo") return true;
  if (window.location.pathname === "/demo" || window.location.pathname.startsWith("/demo/")) return true;
  return false;
}

export function enterDemo() {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, "demo");
}

export function leaveDemo() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(KEY);
}

/** Stash a real (non-demo) live user before entering the Harbour Hotel sample. */
export function stashLiveSession(userJson: string | null, propertyId?: string | null) {
  if (typeof window === "undefined") return;
  if (userJson) {
    window.sessionStorage.setItem(LIVE_STASH_KEY, userJson);
  }
  if (propertyId) {
    window.sessionStorage.setItem(LIVE_PROPERTY_STASH_KEY, propertyId);
  }
}

export function takeStashedLiveSession(): { userJson: string | null; propertyId: string | null } {
  if (typeof window === "undefined") return { userJson: null, propertyId: null };
  const userJson = window.sessionStorage.getItem(LIVE_STASH_KEY);
  const propertyId = window.sessionStorage.getItem(LIVE_PROPERTY_STASH_KEY);
  window.sessionStorage.removeItem(LIVE_STASH_KEY);
  window.sessionStorage.removeItem(LIVE_PROPERTY_STASH_KEY);
  return { userJson, propertyId };
}
