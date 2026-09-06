const KEY = "airpal.mode";

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
