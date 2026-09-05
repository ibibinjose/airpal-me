import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import {
  INITIAL_STAFF_TICKETS,
  ALL_PROPERTIES,
  CURRENT_PROPERTY,
  DEFAULT_DEALS,
  IN_ROOM_DINING_MENU,
  LOCAL_PLACES,
  type StaffTicket,
  type PropertyInfo,
  type DealItem,
  type MenuItem,
  type LocalPlace,
} from "@shared/airpal-data";
import { ensureAnonymousSession, getFirebaseDb, isFirebaseConfigured } from "./firebase";

const PROPERTY_ID = "harbour-hotel";
const LOCAL_PROPERTIES_KEY = "airpal.properties";
const LOCAL_TICKETS_KEY = "airpal.tickets";
const LOCAL_EVENTS_KEY = "airpal.events";
const LOCAL_SESSION_KEY = "airpal.session";
const LOCAL_DEALS_PREFIX = "airpal.deals.";
const LOCAL_MENU_PREFIX = "airpal.menu.";
const LOCAL_PLACES_PREFIX = "airpal.places.";

export interface AnalyticsEvent {
  id: string;
  name: string;
  propertyId: string;
  roomNumber?: string;
  language?: string;
  payload?: Record<string, string | number | boolean | null>;
  createdAt: string;
}

export interface ConversationRecord {
  id: string;
  propertyId: string;
  roomNumber: string;
  question: string;
  answer: string;
  escalated: boolean;
  createdAt: string;
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return nanoid();
  const existing = window.localStorage.getItem(LOCAL_SESSION_KEY);
  if (existing) return existing;
  const next = nanoid();
  window.localStorage.setItem(LOCAL_SESSION_KEY, next);
  return next;
}

export async function trackAirPalEvent(
  name: string,
  payload: AnalyticsEvent["payload"] = {},
  context: { propertyId?: string; roomNumber?: string; language?: string } = {},
) {
  const event: AnalyticsEvent = {
    id: nanoid(),
    name,
    propertyId: context.propertyId || PROPERTY_ID,
    roomNumber: context.roomNumber,
    language: context.language,
    payload,
    createdAt: new Date().toISOString(),
  };

  const local = readLocal<AnalyticsEvent[]>(LOCAL_EVENTS_KEY, []);
  writeLocal(LOCAL_EVENTS_KEY, [event, ...local].slice(0, 200));

  const db = getFirebaseDb();
  if (!db) return;
  try {
    await ensureAnonymousSession();
    await addDoc(collection(db, "properties", event.propertyId, "events"), {
      ...event,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("AirPal analytics sync skipped", error);
  }
}

export function loadLocalTickets(): StaffTicket[] {
  const stored = readLocal<StaffTicket[]>(LOCAL_TICKETS_KEY, []);
  if (stored.length === 0) return INITIAL_STAFF_TICKETS;
  const byId = new Map(INITIAL_STAFF_TICKETS.map((ticket) => [ticket.id, ticket]));
  stored.forEach((ticket) => byId.set(ticket.id, ticket));
  return Array.from(byId.values()).sort((a, b) => Number(a.status === "resolved") - Number(b.status === "resolved"));
}

export function persistLocalTickets(tickets: StaffTicket[]) {
  writeLocal(LOCAL_TICKETS_KEY, tickets);
}

export async function syncTicketToBackend(ticket: StaffTicket, propertyId = PROPERTY_ID) {
  persistLocalTickets([ticket, ...loadLocalTickets().filter((item) => item.id !== ticket.id)]);
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await ensureAnonymousSession();
    await setDoc(doc(db, "properties", propertyId, "tickets", ticket.id), {
      ...ticket,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("AirPal ticket sync skipped", error);
  }
}

export function subscribeToTickets(
  onTickets: (tickets: StaffTicket[]) => void,
  propertyId = PROPERTY_ID,
): () => void {
  const db = getFirebaseDb();
  if (!db) {
    onTickets(loadLocalTickets());
    return () => undefined;
  }

  const ticketsQuery = query(collection(db, "properties", propertyId, "tickets"));

  return onSnapshot(
    ticketsQuery,
    (snapshot) => {
      if (snapshot.empty) {
        onTickets(loadLocalTickets());
        return;
      }
      const tickets = snapshot.docs.map((item) => item.data() as StaffTicket);
      persistLocalTickets(tickets);
      onTickets(tickets);
    },
    () => onTickets(loadLocalTickets()),
  );
}

export async function updateRemoteTicket(
  ticketId: string,
  status: StaffTicket["status"],
  propertyId = PROPERTY_ID,
) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await updateDoc(doc(db, "properties", propertyId, "tickets", ticketId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("AirPal ticket update skipped", error);
  }
}

export async function saveConversation(record: Omit<ConversationRecord, "id" | "createdAt">) {
  const conversation: ConversationRecord = {
    ...record,
    id: nanoid(),
    createdAt: new Date().toISOString(),
  };
  const db = getFirebaseDb();
  if (!db) return conversation;
  try {
    await ensureAnonymousSession();
    await addDoc(collection(db, "properties", record.propertyId, "conversations"), {
      ...conversation,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("AirPal conversation sync skipped", error);
  }
  return conversation;
}

export async function recordTransaction(payload: {
  propertyId: string;
  roomNumber: string;
  product: string;
  amount: number;
  kind: "upsell" | "experience" | "dining";
}) {
  const db = getFirebaseDb();
  if (!db) return;
  try {
    await ensureAnonymousSession();
    await addDoc(collection(db, "properties", payload.propertyId, "transactions"), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("AirPal transaction sync skipped", error);
  }
}

// ---------------- Multi-Tenant Properties CRUD ---------------- //

export function loadAllProperties(): PropertyInfo[] {
  const stored = readLocal<PropertyInfo[]>(LOCAL_PROPERTIES_KEY, []);
  if (stored.length === 0) return ALL_PROPERTIES;
  const map = new Map<string, PropertyInfo>();
  ALL_PROPERTIES.forEach((p) => map.set(p.id, p));
  stored.forEach((p) => map.set(p.id, p));
  return Array.from(map.values());
}

export function loadProperty(propertyId: string): PropertyInfo {
  const all = loadAllProperties();
  const found = all.find((p) => p.id === propertyId);
  return found || CURRENT_PROPERTY;
}

export async function saveProperty(property: PropertyInfo): Promise<PropertyInfo> {
  const all = loadAllProperties();
  const updated = [property, ...all.filter((p) => p.id !== property.id)];
  writeLocal(LOCAL_PROPERTIES_KEY, updated);

  const db = getFirebaseDb();
  if (db) {
    try {
      await ensureAnonymousSession();
      await setDoc(doc(db, "properties", property.id), {
        ...property,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Property sync to Firestore skipped", err);
    }
  }
  return property;
}

// ---------------- Deals & Upsells CRUD ---------------- //

export function loadPropertyDeals(propertyId: string): DealItem[] {
  const key = `${LOCAL_DEALS_PREFIX}${propertyId}`;
  const stored = readLocal<DealItem[]>(key, []);
  if (stored.length > 0) return stored;
  return DEFAULT_DEALS.map((d) => ({ ...d, propertyId }));
}

export async function savePropertyDeal(propertyId: string, deal: DealItem): Promise<DealItem> {
  const deals = loadPropertyDeals(propertyId);
  const exists = deals.some((d) => d.id === deal.id);
  const updated = exists ? deals.map((d) => (d.id === deal.id ? deal : d)) : [deal, ...deals];
  writeLocal(`${LOCAL_DEALS_PREFIX}${propertyId}`, updated);

  const db = getFirebaseDb();
  if (db) {
    try {
      await ensureAnonymousSession();
      await setDoc(doc(db, "properties", propertyId, "deals", deal.id), {
        ...deal,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Deal sync skipped", err);
    }
  }
  return deal;
}

export async function deletePropertyDeal(propertyId: string, dealId: string): Promise<void> {
  const deals = loadPropertyDeals(propertyId);
  const updated = deals.filter((d) => d.id !== dealId);
  writeLocal(`${LOCAL_DEALS_PREFIX}${propertyId}`, updated);
}

// ---------------- In-Room Dining Menu CRUD ---------------- //

export function loadPropertyMenu(propertyId: string): MenuItem[] {
  const key = `${LOCAL_MENU_PREFIX}${propertyId}`;
  const stored = readLocal<MenuItem[]>(key, []);
  if (stored.length > 0) return stored;
  return IN_ROOM_DINING_MENU.map((item) => ({ ...item, propertyId }));
}

export async function savePropertyMenuItem(propertyId: string, item: MenuItem): Promise<MenuItem> {
  const menu = loadPropertyMenu(propertyId);
  const exists = menu.some((m) => m.id === item.id);
  const updated = exists ? menu.map((m) => (m.id === item.id ? item : m)) : [item, ...menu];
  writeLocal(`${LOCAL_MENU_PREFIX}${propertyId}`, updated);

  const db = getFirebaseDb();
  if (db) {
    try {
      await ensureAnonymousSession();
      await setDoc(doc(db, "properties", propertyId, "menu", item.id), {
        ...item,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Menu item sync skipped", err);
    }
  }
  return item;
}

export async function deletePropertyMenuItem(propertyId: string, itemId: string): Promise<void> {
  const menu = loadPropertyMenu(propertyId);
  const updated = menu.filter((m) => m.id !== itemId);
  writeLocal(`${LOCAL_MENU_PREFIX}${propertyId}`, updated);
}

// ---------------- Local Places CRUD ---------------- //

export function loadPropertyPlaces(propertyId: string): LocalPlace[] {
  const key = `${LOCAL_PLACES_PREFIX}${propertyId}`;
  const stored = readLocal<LocalPlace[]>(key, []);
  if (stored.length > 0) return stored;
  return LOCAL_PLACES.map((p) => ({ ...p, propertyId }));
}

export async function savePropertyPlace(propertyId: string, place: LocalPlace): Promise<LocalPlace> {
  const places = loadPropertyPlaces(propertyId);
  const exists = places.some((p) => p.id === place.id);
  const updated = exists ? places.map((p) => (p.id === place.id ? place : p)) : [place, ...places];
  writeLocal(`${LOCAL_PLACES_PREFIX}${propertyId}`, updated);
  return place;
}

export async function deletePropertyPlace(propertyId: string, placeId: string): Promise<void> {
  const places = loadPropertyPlaces(propertyId);
  const updated = places.filter((p) => p.id !== placeId);
  writeLocal(`${LOCAL_PLACES_PREFIX}${propertyId}`, updated);
}

export { isFirebaseConfigured, PROPERTY_ID };
