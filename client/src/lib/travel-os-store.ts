import { nanoid } from "nanoid";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ensureAnonymousSession, getFirebaseDb } from "./firebase";
import {
  DEFAULT_DNA,
  SEED_COMMUNITIES,
  SEED_ITEMS,
  SEED_KNOWLEDGE,
  SEED_MEMORIES,
  SEED_TRIPS,
  SEED_VOICES,
  SEED_WALLET,
  type MemoryItem,
  type TravelDna,
  type TravelDocument,
  type Trip,
  type TripItem,
  type WalletPass,
} from "@shared/travel-os";

const KEY = {
  trips: "airpal.os.trips",
  items: "airpal.os.items",
  dna: "airpal.os.dna",
  wallet: "airpal.os.wallet",
  docs: "airpal.os.docs",
  memories: "airpal.os.memories",
  active: "airpal.os.activeTrip",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

async function syncDoc(path: string, id: string, data: unknown) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await ensureAnonymousSession();
    await setDoc(doc(db, path, id), data as Record<string, unknown>, { merge: true });
  } catch (error) {
    console.warn("Travel OS sync skipped", path, error);
  }
}

function mergeById<T extends { id: string }>(seed: T[], stored: T[]): T[] {
  const map = new Map<string, T>();
  stored.forEach((row) => map.set(row.id, row));
  seed.forEach((row) => {
    const existing = map.get(row.id);
    map.set(row.id, existing ? { ...row, ...existing } : row);
  });
  return Array.from(map.values());
}

export function loadOsBundle() {
  const trips = mergeById(
    SEED_TRIPS,
    read<Trip[]>(KEY.trips, []).map((trip) => ({
      ...trip,
      party: trip.party || "solo",
      companions: trip.companions || [],
      tags: trip.tags || [],
    })),
  );
  const items = mergeById(SEED_ITEMS, read<TripItem[]>(KEY.items, []));
  const dna = read<TravelDna>(KEY.dna, DEFAULT_DNA);
  const wallet = read<WalletPass[]>(KEY.wallet, SEED_WALLET);
  const documents = read<TravelDocument[]>(KEY.docs, []);
  const memories = read<MemoryItem[]>(KEY.memories, SEED_MEMORIES);
  const activeTripId = read<string>(KEY.active, "trip-sydney-2026");
  return { trips, items, dna, wallet, documents, memories, activeTripId };
}

export function persistOsBundle(bundle: ReturnType<typeof loadOsBundle>) {
  write(KEY.trips, bundle.trips);
  write(KEY.items, bundle.items);
  write(KEY.dna, bundle.dna);
  write(KEY.wallet, bundle.wallet);
  write(KEY.docs, bundle.documents);
  write(KEY.memories, bundle.memories);
  write(KEY.active, bundle.activeTripId);
  const primary = bundle.trips.find((t) => t.id === bundle.activeTripId) || bundle.trips[0];
  if (primary) void syncDoc("trips", primary.id, { ...primary, itemCount: bundle.items.filter((i) => i.tripId === primary.id).length });
}

export function newId(prefix: string) {
  return `${prefix}-${nanoid(6)}`;
}

export { SEED_KNOWLEDGE, SEED_COMMUNITIES, SEED_VOICES };

export async function hydrateTripFromCloud(tripId: string) {
  const db = getFirebaseDb();
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "trips", tripId));
    return snap.exists() ? (snap.data() as Trip) : null;
  } catch {
    return null;
  }
}
