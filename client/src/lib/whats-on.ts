import { HOTEL_EVENTS } from "@shared/airpal-data";
import { SEED_COMMUNITIES, type Trip, type TripItem } from "@shared/travel-os";
import { CAMPUS_CLASSES, CAMPUS_EVENTS } from "@shared/campus";

export type WhatsOnKind = "trip" | "stop" | "community" | "hotel" | "campus";

export interface WhatsOnEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  detail: string;
  kind: WhatsOnKind;
  tripId?: string;
  endTime?: string;
  location?: string;
  allDay?: boolean;
  startAt?: string;
  endAt?: string;
}

function ymd(value: string) {
  return value.slice(0, 10);
}

function timeOf(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function collectWhatsOn(trips: Trip[], items: TripItem[]): WhatsOnEvent[] {
  const events: WhatsOnEvent[] = [];

  trips.forEach((trip) => {
    events.push({
      id: `trip-start-${trip.id}`,
      date: trip.startDate,
      time: "All day",
      title: `${trip.title} begins`,
      detail: `${trip.city} · ${trip.party}${trip.companions.length ? ` · ${trip.companions.map((c) => c.name).join(", ")}` : ""}`,
      kind: "trip",
      tripId: trip.id,
      location: trip.city,
      allDay: true,
    });
    if (trip.endDate !== trip.startDate) {
      events.push({
        id: `trip-end-${trip.id}`,
        date: trip.endDate,
        time: "All day",
        title: `${trip.title} wraps`,
        detail: trip.city,
        kind: "trip",
        tripId: trip.id,
        location: trip.city,
        allDay: true,
      });
    }
  });

  items.forEach((item) => {
    events.push({
      id: item.id,
      date: ymd(item.startAt),
      time: timeOf(item.startAt),
      title: item.title,
      detail: item.subtitle || item.location || item.kind,
      kind: "stop",
      tripId: item.tripId,
      location: item.location,
      startAt: item.startAt,
      endAt: item.endAt,
    });
  });

  SEED_COMMUNITIES.forEach((group) => {
    group.events.forEach((event) => {
      events.push({
        id: event.id,
        date: event.date,
        time: event.time || event.when,
        title: event.title,
        detail: `${group.name} · ${event.where}`,
        kind: "community",
        location: event.where,
      });
    });
  });

  HOTEL_EVENTS.forEach((event) => {
    if (!event.date) return;
    events.push({
      id: event.id,
      date: event.date,
      time: event.time,
      title: event.title,
      detail: `${event.detail} · ${event.price}`,
      kind: "hotel",
      location: event.detail,
    });
  });

  CAMPUS_EVENTS.forEach((event) => {
    events.push({
      id: event.id,
      date: event.date,
      time: event.time,
      title: event.title,
      detail: `${event.where} · ${event.detail}`,
      kind: "campus",
      tripId: "trip-harbour-college-2026",
      location: event.where,
    });
  });

  CAMPUS_CLASSES.forEach((row) => {
    if (!row.date) return;
    events.push({
      id: row.id,
      date: row.date,
      time: row.start,
      title: row.title,
      detail: `${row.kind} · ${row.place}`,
      kind: "campus",
      tripId: "trip-harbour-college-2026",
      endTime: row.end,
      location: row.place,
    });
  });

  return events.sort((a, b) => a.time.localeCompare(b.time));
}

export function eventsOnDate(all: WhatsOnEvent[], date: string) {
  return all.filter((event) => event.date === date);
}

export function datesWithEvents(all: WhatsOnEvent[]) {
  return new Set(all.map((event) => event.date));
}

export function tripSpansOnDate(trips: Trip[], date: string) {
  return trips.filter((trip) => trip.startDate <= date && trip.endDate >= date);
}
