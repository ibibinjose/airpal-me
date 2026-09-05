import QRCode from "qrcode";

export type QrIntent =
  | { kind: "trip"; tripId: string }
  | { kind: "stay"; propertyId: string; room?: string; type?: string }
  | { kind: "campus"; campusId: string; room?: string; type?: string }
  | { kind: "share"; tripId: string }
  | { kind: "url"; href: string }
  | { kind: "unknown"; raw: string };

export function tripQrPayload(tripId: string) {
  if (typeof window === "undefined") return `https://airpal.me/os?trip=${tripId}`;
  return `${window.location.origin}/os?trip=${tripId}`;
}

export function stayQrPayload(propertyId: string, room = "508") {
  if (typeof window === "undefined") return `https://airpal.me/g/${propertyId}?type=room&room=${room}`;
  return `${window.location.origin}/g/${propertyId}?type=room&room=${room}`;
}

export function campusQrPayload(campusId = "harbour-college", room = "R12") {
  if (typeof window === "undefined") return `https://airpal.me/c/${campusId}?type=room&room=${room}`;
  return `${window.location.origin}/c/${campusId}?type=room&room=${room}`;
}

export async function makeQrDataUrl(text: string) {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 280,
    errorCorrectionLevel: "M",
    color: { dark: "#16211c", light: "#fffdf9" },
  });
}

export function parseQrPayload(raw: string): QrIntent {
  const value = raw.trim();
  try {
    const url = new URL(value, typeof window === "undefined" ? "https://airpal.me" : window.location.origin);
    const trip = url.searchParams.get("trip");
    if (url.pathname.startsWith("/os") && trip) return { kind: "trip", tripId: trip };
    const share = url.pathname.match(/^\/trip\/([^/]+)/);
    if (share?.[1]) return { kind: "share", tripId: share[1] };
    const stay = url.pathname.match(/^\/g\/([^/]+)/);
    if (stay?.[1]) {
      return {
        kind: "stay",
        propertyId: stay[1],
        room: url.searchParams.get("room") || undefined,
        type: url.searchParams.get("type") || "room",
      };
    }
    if (url.pathname.startsWith("/stay")) return { kind: "stay", propertyId: "harbour-hotel", room: url.searchParams.get("room") || "508" };
    const campus = url.pathname.match(/^\/c\/([^/]+)/);
    if (campus?.[1]) {
      return {
        kind: "campus",
        campusId: campus[1],
        room: url.searchParams.get("room") || undefined,
        type: url.searchParams.get("type") || "room",
      };
    }
    if (url.pathname.startsWith("/campus")) {
      return { kind: "campus", campusId: "harbour-college", room: url.searchParams.get("room") || "R12" };
    }
  } catch {
    /* fall through */
  }
  const compact = value.match(/^AIRPAL:(TRIP|STAY|CAMPUS):(.+)$/i);
  if (compact?.[1] === "TRIP") return { kind: "trip", tripId: compact[2] };
  if (compact?.[1] === "STAY") {
    const [propertyId, room] = compact[2].split(":");
    return { kind: "stay", propertyId, room };
  }
  if (compact?.[1] === "CAMPUS") {
    const [campusId, room] = compact[2].split(":");
    return { kind: "campus", campusId, room };
  }
  return { kind: "unknown", raw: value };
}
