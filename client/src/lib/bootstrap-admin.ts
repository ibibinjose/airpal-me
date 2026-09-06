import { ALL_PROPERTIES, UserProfile } from "@shared/airpal-data";

const ACCOUNTS_KEY = "airpal.accounts";

interface StoredAccount {
  email: string;
  password: string;
  user: UserProfile;
}

function readAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || "[]") as StoredAccount[];
  } catch {
    return [];
  }
}

function writeAccounts(rows: StoredAccount[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(rows));
}

/** Live Platform Admin email from env (empty when unset). Never confuses with DEMO_USERS. */
export function bootstrapAdminEmail(): string {
  return String(import.meta.env.VITE_BOOTSTRAP_ADMIN_EMAIL || "")
    .trim()
    .toLowerCase();
}

export function isBootstrapAdminEmail(email: string): boolean {
  const bootstrap = bootstrapAdminEmail();
  return Boolean(bootstrap && email.trim().toLowerCase() === bootstrap);
}

/**
 * Seeds/updates the real Platform Admin (super_admin) account in localStorage
 * from VITE_BOOTSTRAP_ADMIN_* env vars. Does NOT auto-login in live mode.
 * Password is never hard-coded — only read from Vite env (gitignored .env).
 */
export function ensureBootstrapAdmin(): void {
  if (typeof window === "undefined") return;

  const email = bootstrapAdminEmail();
  const password = String(import.meta.env.VITE_BOOTSTRAP_ADMIN_PASSWORD || "");
  if (!email || !password) return;

  const propertyIds = ALL_PROPERTIES.map((p) => p.id);
  if (!propertyIds.includes("harbour-hotel")) {
    propertyIds.unshift("harbour-hotel");
  }

  const accounts = readAccounts();
  const existingIdx = accounts.findIndex((row) => row.email === email);

  const user: UserProfile = {
    uid: existingIdx >= 0 ? accounts[existingIdx].user.uid : "u-platform-admin",
    email,
    displayName: "Bibin Jose",
    role: "super_admin",
    propertyIds,
    createdAt: existingIdx >= 0 ? accounts[existingIdx].user.createdAt : new Date().toISOString(),
  };

  const next: StoredAccount = { email, password, user };
  if (existingIdx >= 0) {
    accounts[existingIdx] = next;
  } else {
    accounts.push(next);
  }
  writeAccounts(accounts);
}
