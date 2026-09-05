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
  type StaffTicket,
} from "@shared/airpal-data";
import { ensureAnonymousSession, getFirebaseDb, isFirebaseConfigured } from "./firebase";

const PROPERTY_ID = "harbour-hotel";
const LOCAL_TICKETS_KEY = "airpal.tickets";
const LOCAL_EVENTS_KEY = "airpal.events";
const LOCAL_SESSION_KEY = "airpal.session";

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

export { isFirebaseConfigured, PROPERTY_ID };
