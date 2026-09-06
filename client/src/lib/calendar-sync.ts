import { getNativePlatform } from "./platform";
import type { WhatsOnEvent } from "./whats-on";

export const CALENDAR_TZ = "Australia/Sydney";

export type CalendarTarget = "apple" | "google" | "outlook" | "ics";

export interface CalendarEvent {
  uid: string;
  title: string;
  detail: string;
  location?: string;
  start: Date;
  end: Date;
  allDay: boolean;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseClock(time: string): { h: number; m: number } | null {
  const value = time.trim();
  if (!value || /^all day$/i.test(value)) return null;
  const ampm = value.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)\b/i);
  if (ampm) {
    let h = Number(ampm[1]);
    const m = Number(ampm[2] || 0);
    const mer = ampm[3].toUpperCase();
    if (mer === "PM" && h < 12) h += 12;
    if (mer === "AM" && h === 12) h = 0;
    return { h, m };
  }
  const hm = value.match(/^(\d{1,2}):(\d{2})/);
  if (hm) return { h: Number(hm[1]), m: Number(hm[2]) };
  return null;
}

function atLocal(date: string, h: number, m: number) {
  return new Date(`${date}T${pad(h)}:${pad(m)}:00+10:00`);
}

export function whatsOnToCalendarEvents(events: WhatsOnEvent[]): CalendarEvent[] {
  const seen = new Set<string>();
  const out: CalendarEvent[] = [];

  events.forEach((event) => {
    const key = `${event.date}|${event.title.trim().toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);

    const base = {
      uid: `${event.id}@airpal.me`,
      title: event.title,
      detail: event.detail,
      location: event.location,
    };

    if (event.startAt) {
      const start = new Date(event.startAt);
      if (Number.isNaN(start.getTime())) return;
      const parsedEnd = event.endAt ? new Date(event.endAt) : new Date(start.getTime() + 60 * 60 * 1000);
      out.push({
        ...base,
        start,
        end: Number.isNaN(parsedEnd.getTime()) ? new Date(start.getTime() + 60 * 60 * 1000) : parsedEnd,
        allDay: false,
      });
      return;
    }

    const allDay = Boolean(event.allDay || /^all day$/i.test(event.time));
    if (allDay) {
      const start = new Date(`${event.date}T00:00:00+10:00`);
      out.push({ ...base, start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000), allDay: true });
      return;
    }

    const clock = parseClock(event.time);
    if (!clock) return;
    const start = atLocal(event.date, clock.h, clock.m);
    const endClock = event.endTime ? parseClock(event.endTime) : null;
    const end = endClock ? atLocal(event.date, endClock.h, endClock.m) : new Date(start.getTime() + 60 * 60 * 1000);
    out.push({ ...base, start, end: end <= start ? new Date(start.getTime() + 60 * 60 * 1000) : end, allDay: false });
  });

  return out;
}

function tzYmd(d: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CALENDAR_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "00";
  return `${get("year")}${get("month")}${get("day")}`;
}

function addOneDayYmd(ymd: string) {
  const y = Number(ymd.slice(0, 4));
  const m = Number(ymd.slice(4, 6));
  const day = Number(ymd.slice(6, 8));
  const next = new Date(Date.UTC(y, m - 1, day + 1));
  return `${next.getUTCFullYear()}${pad(next.getUTCMonth() + 1)}${pad(next.getUTCDate())}`;
}

function icsDate(d: Date, allDay: boolean) {
  if (allDay) return tzYmd(d);
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function icsText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function fold(line: string) {
  const parts: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    parts.push(rest.slice(0, 74));
    rest = ` ${rest.slice(74)}`;
  }
  parts.push(rest);
  return parts.join("\r\n");
}

export function buildIcs(events: CalendarEvent[], calendarName = "AirPal") {
  const stamp = icsDate(new Date(), false);
  const vevents = events
    .map((event) => {
      const start = event.allDay ? `DTSTART;VALUE=DATE:${tzYmd(event.start)}` : `DTSTART:${icsDate(event.start, false)}`;
      const end = event.allDay ? `DTEND;VALUE=DATE:${addOneDayYmd(tzYmd(event.start))}` : `DTEND:${icsDate(event.end, false)}`;
      return [
        "BEGIN:VEVENT",
        `UID:${event.uid}`,
        `DTSTAMP:${stamp}`,
        start,
        end,
        `SUMMARY:${icsText(event.title)}`,
        event.detail ? `DESCRIPTION:${icsText(event.detail)}` : "",
        event.location ? `LOCATION:${icsText(event.location)}` : "",
        "URL:https://airpal.me/os",
        "END:VEVENT",
      ]
        .filter(Boolean)
        .map(fold)
        .join("\r\n");
    })
    .join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AirPal.me//Travel OS//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsText(calendarName)}`,
    `X-WR-TIMEZONE:${CALENDAR_TZ}`,
    vevents,
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcs(filename: string, ics: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1500);
}

export async function shareIcs(filename: string, ics: string) {
  const file = new File([ics], filename.endsWith(".ics") ? filename : `${filename}.ics`, { type: "text/calendar" });
  const payload = { files: [file], title: "AirPal calendar", text: "Add these AirPal events to your calendar." };
  let canFiles = false;
  try {
    canFiles = typeof navigator.share === "function" && Boolean(navigator.canShare?.(payload));
  } catch {
    canFiles = false;
  }
  if (canFiles) {
    try {
      await navigator.share(payload);
      return true;
    } catch (error) {
      if ((error as DOMException).name === "AbortError") return false;
    }
  }
  downloadIcs(filename, ics);
  return true;
}

function googleStamp(d: Date, allDay: boolean) {
  if (allDay) return tzYmd(d);
  return icsDate(d, false);
}

export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.detail,
    location: event.location || "",
    ctz: CALENDAR_TZ,
    dates: `${googleStamp(event.start, event.allDay)}/${googleStamp(event.end, event.allDay)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    body: event.detail,
    location: event.location || "",
    startdt: event.start.toISOString(),
    enddt: event.end.toISOString(),
    allday: event.allDay ? "true" : "false",
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function outlookOfficeUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    body: event.detail,
    location: event.location || "",
    startdt: event.start.toISOString(),
    enddt: event.end.toISOString(),
    allday: event.allDay ? "true" : "false",
  });
  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export async function syncCalendar(target: CalendarTarget, events: CalendarEvent[], filename = "airpal.ics") {
  if (!events.length) return { ok: false, message: "Nothing to add." };
  const ics = buildIcs(events);
  const first = events[0];

  if (target === "ics") {
    downloadIcs(filename, ics);
    return { ok: true, message: "Calendar file saved. Open it in Apple, Google, or Outlook." };
  }

  if (target === "apple") {
    const shared = await shareIcs(filename, ics);
    return {
      ok: true,
      message: shared
        ? "Choose Calendar to add these events to iPhone, iPad, or Mac."
        : "Open the .ics file and tap Add All.",
    };
  }

  if (target === "google") {
    if (events.length === 1) {
      window.open(googleCalendarUrl(first), "_blank", "noopener");
      return { ok: true, message: "Google Calendar opened. Save the event to Gmail or Android." };
    }
    downloadIcs(filename, ics);
    window.open("https://calendar.google.com/calendar/u/0/r/settings/export", "_blank", "noopener");
    return { ok: true, message: "File saved. In Google Calendar choose Settings → Import, then pick the AirPal .ics." };
  }

  if (target === "outlook") {
    if (events.length === 1) {
      window.open(outlookCalendarUrl(first), "_blank", "noopener");
      return { ok: true, message: "Outlook opened. Save to Outlook.com or Microsoft 365." };
    }
    downloadIcs(filename, ics);
    window.open("https://outlook.live.com/calendar/", "_blank", "noopener");
    return { ok: true, message: "File saved. In Outlook choose Add calendar → Upload from file." };
  }

  return { ok: false, message: "Unknown calendar." };
}

export function preferredCalendarTarget(): CalendarTarget {
  const platform = getNativePlatform();
  if (platform === "ios") return "apple";
  if (platform === "android") return "google";
  return "ics";
}
