import { nanoid } from "nanoid";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { ItineraryStop } from "@shared/airpal-data";
import { ensureAnonymousSession, getFirebaseDb } from "./firebase";

export interface SharedTrip {
  id: string;
  hostName: string;
  propertyName: string;
  destination: string;
  duration: string;
  interests: string[];
  budget: string;
  weather: "sunny" | "rainy";
  companions: string[];
  stops: ItineraryStop[];
  createdAt: string;
}

const LOCAL_TRIPS_KEY = "airpal.trips";

function readTrips(): Record<string, SharedTrip> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_TRIPS_KEY) || "{}") as Record<string, SharedTrip>;
  } catch {
    return {};
  }
}

function writeTrips(trips: Record<string, SharedTrip>) {
  window.localStorage.setItem(LOCAL_TRIPS_KEY, JSON.stringify(trips));
}

export function tripShareUrl(id: string) {
  if (typeof window === "undefined") return `/trip/${id}`;
  return `${window.location.origin}/trip/${id}`;
}

export function durationLabel(duration: string) {
  if (duration === "2h") return "2 hours";
  if (duration === "half-day") return "half a day";
  if (duration === "1-day") return "a full day";
  return "2+ days";
}

export function formatTripMessage(trip: SharedTrip, url: string) {
  const withWho = trip.companions.length
    ? `Traveling with ${[trip.hostName, ...trip.companions].filter(Boolean).join(", ")}.`
    : `${trip.hostName} is sharing this plan with you.`;

  const stops = trip.stops
    .map((stop, index) => `${index + 1}. ${stop.time} · ${stop.title} (${stop.cost} · ${stop.duration})`)
    .join("\n");

  return [
    `AirPal itinerary · ${trip.destination}`,
    `From ${trip.propertyName} · ${durationLabel(trip.duration)} · ${trip.budget}`,
    withWho,
    "",
    stops,
    "",
    "Open the live plan (maps, weather updates, and stop details):",
    url,
  ].join("\n");
}

export async function saveSharedTrip(trip: Omit<SharedTrip, "id" | "createdAt"> & { id?: string }): Promise<SharedTrip> {
  const record: SharedTrip = {
    ...trip,
    id: trip.id || nanoid(8),
    createdAt: new Date().toISOString(),
  };

  const trips = readTrips();
  trips[record.id] = record;
  writeTrips(trips);

  const db = getFirebaseDb();
  if (db) {
    try {
      await ensureAnonymousSession();
      await setDoc(doc(db, "trips", record.id), record);
    } catch (error) {
      console.warn("Trip sync skipped", error);
    }
  }

  return record;
}

export async function loadSharedTrip(id: string): Promise<SharedTrip | null> {
  const local = readTrips()[id];
  if (local) return local;

  const db = getFirebaseDb();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "trips", id));
    if (!snap.exists()) return null;
    const trip = snap.data() as SharedTrip;
    const trips = readTrips();
    trips[id] = trip;
    writeTrips(trips);
    return trip;
  } catch {
    return null;
  }
}

export async function shareTripNative(trip: SharedTrip) {
  const url = tripShareUrl(trip.id);
  const text = formatTripMessage(trip, url);
  if (navigator.share) {
    await navigator.share({
      title: `AirPal · ${trip.destination} itinerary`,
      text,
      url,
    });
    return "shared" as const;
  }
  await navigator.clipboard.writeText(`${text}`);
  return "copied" as const;
}
