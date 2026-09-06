import { DealItem, MenuItem, PropertyInfo, StaffTicket } from "@shared/airpal-data";
import { DEMO_PROPERTIES, DEMO_DEALS, DEMO_MENU, DEMO_TICKETS } from "./demo-data";
import { nanoid } from "nanoid";

/**
 * AIRPAL DEMO SANDBOX STORAGE
 * Strictly isolated with the `airpal.demo.*` namespace.
 * Guarantees zero contact with real production Firestore or real accounts.
 */

const DEMO_KEY_PROPERTIES = "airpal.demo.properties";
const DEMO_KEY_DEALS = "airpal.demo.deals";
const DEMO_KEY_MENU = "airpal.demo.menu";
const DEMO_KEY_TICKETS = "airpal.demo.tickets";
const DEMO_KEY_ACTIVE_PROP = "airpal.demo.active_prop";
const DEMO_KEY_PERSONA = "airpal.demo.persona";

function getJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// 1. Properties
export function getSandboxProperties(): PropertyInfo[] {
  return getJson<PropertyInfo[]>(DEMO_KEY_PROPERTIES, DEMO_PROPERTIES);
}

export function saveSandboxProperty(property: PropertyInfo): PropertyInfo {
  const current = getSandboxProperties();
  const existingIdx = current.findIndex((p) => p.id === property.id);
  let updated: PropertyInfo[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = property;
  } else {
    updated = [property, ...current];
  }
  setJson(DEMO_KEY_PROPERTIES, updated);
  return property;
}

// 2. Deals & Upsells
export function getSandboxDeals(propertyId?: string): DealItem[] {
  const all = getJson<DealItem[]>(DEMO_KEY_DEALS, DEMO_DEALS);
  if (!propertyId) return all;
  return all.filter((d) => !d.propertyId || d.propertyId === propertyId);
}

export function saveSandboxDeal(deal: DealItem): DealItem {
  const all = getJson<DealItem[]>(DEMO_KEY_DEALS, DEMO_DEALS);
  const idx = all.findIndex((d) => d.id === deal.id);
  let updated: DealItem[];
  if (idx >= 0) {
    updated = [...all];
    updated[idx] = deal;
  } else {
    updated = [{ ...deal, id: deal.id || `deal-demo-${nanoid(5)}` }, ...all];
  }
  setJson(DEMO_KEY_DEALS, updated);
  return deal;
}

export function deleteSandboxDeal(dealId: string) {
  const all = getJson<DealItem[]>(DEMO_KEY_DEALS, DEMO_DEALS);
  setJson(
    DEMO_KEY_DEALS,
    all.filter((d) => d.id !== dealId)
  );
}

export function toggleSandboxDealActive(dealId: string): boolean {
  const all = getJson<DealItem[]>(DEMO_KEY_DEALS, DEMO_DEALS);
  const found = all.find((d) => d.id === dealId);
  if (!found) return false;
  found.active = !found.active;
  setJson(DEMO_KEY_DEALS, [...all]);
  return found.active;
}

// 3. Dining Menu
export function getSandboxMenu(propertyId?: string): MenuItem[] {
  const all = getJson<MenuItem[]>(DEMO_KEY_MENU, DEMO_MENU);
  if (!propertyId) return all;
  return all.filter((m) => !m.propertyId || m.propertyId === propertyId);
}

export function saveSandboxMenuItem(item: MenuItem): MenuItem {
  const all = getJson<MenuItem[]>(DEMO_KEY_MENU, DEMO_MENU);
  const idx = all.findIndex((m) => m.id === item.id);
  let updated: MenuItem[];
  if (idx >= 0) {
    updated = [...all];
    updated[idx] = item;
  } else {
    updated = [{ ...item, id: item.id || `menu-demo-${nanoid(5)}` }, ...all];
  }
  setJson(DEMO_KEY_MENU, updated);
  return item;
}

export function deleteSandboxMenuItem(itemId: string) {
  const all = getJson<MenuItem[]>(DEMO_KEY_MENU, DEMO_MENU);
  setJson(
    DEMO_KEY_MENU,
    all.filter((m) => m.id !== itemId)
  );
}

// 4. Staff Tickets
export function getSandboxTickets(propertyId?: string): StaffTicket[] {
  const all = getJson<StaffTicket[]>(DEMO_KEY_TICKETS, DEMO_TICKETS);
  if (!propertyId) return all;
  return all.filter((t) => !t.propertyId || t.propertyId === propertyId);
}

export function updateSandboxTicketStatus(ticketId: string, status: "pending" | "in_progress" | "resolved") {
  const all = getJson<StaffTicket[]>(DEMO_KEY_TICKETS, DEMO_TICKETS);
  const item = all.find((t) => t.id === ticketId);
  if (item) {
    item.status = status;
    setJson(DEMO_KEY_TICKETS, [...all]);
  }
}

export function addSandboxTicket(ticket: Omit<StaffTicket, "id" | "createdAt">): StaffTicket {
  const all = getJson<StaffTicket[]>(DEMO_KEY_TICKETS, DEMO_TICKETS);
  const full: StaffTicket = {
    ...ticket,
    id: `t-demo-${nanoid(5)}`,
    createdAt: new Date().toISOString(),
  };
  setJson(DEMO_KEY_TICKETS, [full, ...all]);
  return full;
}

// 5. Active Demo Property
export function getSandboxActivePropertyId(): string {
  if (typeof window === "undefined") return "demo-grand-harbour";
  return window.localStorage.getItem(DEMO_KEY_ACTIVE_PROP) || "demo-grand-harbour";
}

export function setSandboxActivePropertyId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_KEY_ACTIVE_PROP, id);
}

// 6. Active Demo Persona
export function getSandboxPersona(): string {
  if (typeof window === "undefined") return "host_admin";
  return window.localStorage.getItem(DEMO_KEY_PERSONA) || "host_admin";
}

export function setSandboxPersona(role: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_KEY_PERSONA, role);
}

// 7. Reset entire sandbox back to pristine demo defaults
export function resetEntireSandbox() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(DEMO_KEY_PROPERTIES);
  window.localStorage.removeItem(DEMO_KEY_DEALS);
  window.localStorage.removeItem(DEMO_KEY_MENU);
  window.localStorage.removeItem(DEMO_KEY_TICKETS);
  window.localStorage.removeItem(DEMO_KEY_ACTIVE_PROP);
  window.localStorage.removeItem(DEMO_KEY_PERSONA);
}
