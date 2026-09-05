export type NativePlatform = "web" | "ios" | "android";

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || Boolean(nav.standalone);
}

export function getNativePlatform(): NativePlatform {
  if (typeof window === "undefined") return "web";
  const capacitor = (window as Window & { Capacitor?: { getPlatform?: () => string } }).Capacitor;
  const platform = capacitor?.getPlatform?.();
  if (platform === "ios") return "ios";
  if (platform === "android") return "android";

  const ua = window.navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "web";
}

export function isNativeShell(): boolean {
  if (typeof window === "undefined") return false;
  const capacitor = (window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(capacitor?.isNativePlatform?.()) || isStandaloneDisplay();
}

export function detectBrowserLanguage(supported: string[]): string {
  if (typeof navigator === "undefined") return "en";
  const candidates = [navigator.language, ...(navigator.languages || [])]
    .filter(Boolean)
    .map((code) => code.toLowerCase());

  for (const candidate of candidates) {
    const exact = supported.find((lang) => lang.toLowerCase() === candidate);
    if (exact) return exact;
    const short = candidate.split("-")[0];
    const match = supported.find((lang) => lang.toLowerCase() === short);
    if (match) return match;
  }
  return "en";
}
