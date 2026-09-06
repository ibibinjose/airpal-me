import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, UserRole, DEMO_USERS, PropertyInfo, ALL_PROPERTIES } from "@shared/airpal-data";
import { loadAllProperties, saveProperty } from "../lib/airpal-backend";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { isDemoMode, leaveDemo, takeStashedLiveSession } from "../lib/app-mode";
import { ensureBootstrapAdmin, isBootstrapAdminEmail } from "../lib/bootstrap-admin";

export interface RegisterOptions {
  kind?: "hotel" | "campus" | "guest";
  city?: string;
  wifiNetwork?: string;
  wifiPassword?: string;
  password?: string;
}

const ACCOUNTS_KEY = "airpal.accounts";

interface StoredAccount {
  email: string;
  password: string;
  user: UserProfile;
}

const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    email: "admin@airpal.me",
    password: "password",
    user: {
      uid: "usr-super-admin",
      email: "admin@airpal.me",
      displayName: "Alexander Thorne (Platform Admin)",
      role: "super_admin",
      propertyIds: ["harbour-hotel", "the-rocks-suites"],
      createdAt: "2026-09-01T00:00:00Z",
    },
  },
  {
    email: "host@airpal.me",
    password: "password",
    user: {
      uid: "usr-host-admin",
      email: "host@airpal.me",
      displayName: "Eleanor Vance (Hotel GM)",
      role: "host_admin",
      propertyIds: ["harbour-hotel"],
      createdAt: "2026-09-01T00:00:00Z",
    },
  },
  {
    email: "staff@airpal.me",
    password: "password",
    user: {
      uid: "usr-staff-frontdesk",
      email: "staff@airpal.me",
      displayName: "Liam Chen (Front Desk Concierge)",
      role: "staff",
      propertyIds: ["harbour-hotel"],
      createdAt: "2026-09-01T00:00:00Z",
    },
  },
];

function readAccounts(): StoredAccount[] {
  if (typeof window === "undefined") return DEFAULT_ACCOUNTS;
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      writeAccounts(DEFAULT_ACCOUNTS);
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw) as StoredAccount[];
    const emails = new Set(parsed.map((a) => a.email));
    const merged = [...parsed];
    DEFAULT_ACCOUNTS.forEach((d) => {
      if (!emails.has(d.email)) merged.push(d);
    });
    return merged;
  } catch {
    return DEFAULT_ACCOUNTS;
  }
}

function writeAccounts(rows: StoredAccount[]) {
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(rows));
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  activePropertyId: string;
  setActivePropertyId: (id: string) => void;
  login: (email: string, password?: string) => Promise<UserProfile | null>;
  register: (email: string, displayName: string, role: UserRole, propertyName?: string, options?: RegisterOptions) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole, propertyId?: string) => void;
  /** Leave Harbour Hotel sample and restore any stashed live Platform Admin / host session. */
  exitDemoToLive: () => void;
  isSuperAdmin: boolean;
  isHostAdmin: boolean;
  isStaff: boolean;
  isGuest: boolean;
  userProperties: PropertyInfo[];
}

const LOCAL_AUTH_KEY = "airpal.auth.user";
const LOCAL_ACTIVE_PROPERTY_KEY = "airpal.active.property";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === "undefined") return isDemoMode() ? DEMO_USERS[1] : null;
    try {
      const stored = window.localStorage.getItem(LOCAL_AUTH_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProfile;
        if (!isDemoMode() && DEMO_USERS.some((row) => row.uid === parsed.uid)) return null;
        return parsed;
      }
    } catch {
      // ignore
    }
    return isDemoMode() ? DEMO_USERS[1] : null;
  });

  const [activePropertyId, setActivePropertyIdState] = useState<string>(() => {
    if (typeof window === "undefined") return isDemoMode() ? "harbour-hotel" : "";
    const stored = window.localStorage.getItem(LOCAL_ACTIVE_PROPERTY_KEY);
    if (stored) return stored;
    return isDemoMode() ? "harbour-hotel" : "";
  });

  const setActivePropertyId = (id: string) => {
    setActivePropertyIdState(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_ACTIVE_PROPERTY_KEY, id);
    }
  };

  useEffect(() => {
    // Seed bootstrap admin into localStorage accounts when env vars are set.
    // Does not auto-login in live mode.
    ensureBootstrapAdmin();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        window.localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(LOCAL_AUTH_KEY);
      }
    }
  }, [user]);

  const role: UserRole = user?.role || "guest";

  const isSuperAdmin = role === "super_admin";
  const isHostAdmin = role === "host_admin" || role === "super_admin";
  const isStaff = role === "staff" || role === "host_admin" || role === "super_admin";
  const isGuest = role === "guest";

  const allProps = loadAllProperties();
  const userProperties = isSuperAdmin
    ? allProps
    : allProps.filter((p) => user?.propertyIds?.includes(p.id) || p.id === activePropertyId);

  const login = async (email: string, password?: string): Promise<UserProfile | null> => {
    // Ensure bootstrap account exists before live sign-in attempts.
    ensureBootstrapAdmin();

    const trimmed = email.trim().toLowerCase();
    const demo = DEMO_USERS.find((u) => u.email.toLowerCase() === trimmed);
    if (demo && isDemoMode()) {
      setUser(demo);
      if (demo.propertyIds?.[0]) setActivePropertyId(demo.propertyIds[0]);
      toast.success(`Welcome back, ${demo.displayName}!`);
      return demo;
    }

    const account = readAccounts().find((row) => row.email === trimmed);
    if (!account) {
      toast.error("No account for that email", { description: "Create a property first — it takes a minute." });
      return null;
    }
    if (account.password && account.password !== (password || "")) {
      toast.error("Wrong password");
      return null;
    }
    setUser(account.user);
    if (account.user.propertyIds?.[0]) setActivePropertyId(account.user.propertyIds[0]);
    toast.success(`Welcome back, ${account.user.displayName}`);
    return account.user;
  };

  const register = async (
    email: string,
    displayName: string,
    targetRole: UserRole = "host_admin",
    propertyName?: string,
    options?: RegisterOptions,
  ): Promise<boolean> => {
    ensureBootstrapAdmin();
    const trimmedEmail = email.trim().toLowerCase();
    // Platform Admin email from env always remains super_admin (not a demo identity).
    const resolvedRole: UserRole = isBootstrapAdminEmail(trimmedEmail) ? "super_admin" : targetRole;
    if (readAccounts().some((row) => row.email === trimmedEmail)) {
      toast.error("That email is already registered", { description: "Sign in instead." });
      return false;
    }

    let propId = nanoid(8);
    if (propertyName && propertyName.trim()) {
      propId = propertyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || propId;
      const city = options?.city?.trim() || "Your city";
      const newProp: PropertyInfo = {
        id: propId,
        name: propertyName.trim(),
        kind: options?.kind === "campus" ? "campus" : "hotel",
        tagline: options?.kind === "campus" ? "Residential college companion" : "Your guest companion",
        destination: city,
        city,
        country: "Australia",
        address: city,
        phone: "",
        whatsapp: "",
        roomsCount: 12,
        status: "trial",
        ownerEmail: trimmedEmail,
        monthlyRevenue: 0,
        plan: "Starter",
        wifi: {
          network: options?.wifiNetwork?.trim() || `${propertyName.replace(/\s+/g, "")}_Guest`,
          password: options?.wifiPassword?.trim() || "changeme",
          speed: "Wi-Fi",
        },
        checkIn: "2:00 PM",
        checkOut: "10:00 AM",
        breakfast: {
          hours: options?.kind === "campus" ? "7:00–9:30 · 12:00–14:00 · 17:30–19:30" : "7:00 AM – 10:30 AM",
          location: options?.kind === "campus" ? "Dining hall" : "Main dining",
          type: options?.kind === "campus" ? "Hall meals" : "Breakfast",
          price: options?.kind === "campus" ? "Included" : "Ask host",
        },
        facilities: [
          { name: "Help desk", hours: "24 Hours", floor: "Lobby", details: "Tap Staff in the companion", icon: "BellRing" },
        ],
      };
      await saveProperty(newProp);
    }

    const propertyIds =
      resolvedRole === "super_admin"
        ? Array.from(new Set([...ALL_PROPERTIES.map((p) => p.id), propId, "harbour-hotel"]))
        : [propId];

    const newUser: UserProfile = {
      uid: `u-${nanoid(6)}`,
      email: trimmedEmail,
      displayName: isBootstrapAdminEmail(trimmedEmail) ? "Bibin Jose" : displayName.trim() || "Host",
      role: resolvedRole,
      propertyIds,
      createdAt: new Date().toISOString(),
    };

    writeAccounts([...readAccounts(), { email: trimmedEmail, password: options?.password || "", user: newUser }]);
    setUser(newUser);
    setActivePropertyId(propId);
    if (resolvedRole === "super_admin") {
      toast.success("Platform Admin ready", { description: "You can open /admin and explore the Harbour Hotel demo anytime." });
    } else {
      toast.success("Your AirPal is live", { description: "Print the QR. Guests scan it — they don’t sign up." });
    }
    return true;
  };

  const logout = () => {
    setUser(null);
    toast.info("Signed out");
  };

  const switchRole = (newRole: UserRole, targetPropertyId?: string) => {
    // Demo personas only — never use this to invent a live Platform Admin session.
    const demo = DEMO_USERS.find((u) => u.role === newRole);
    if (demo) {
      setUser(demo);
      if (targetPropertyId) {
        setActivePropertyId(targetPropertyId);
      } else if (demo.propertyIds?.[0]) {
        setActivePropertyId(demo.propertyIds[0]);
      }
      toast.success(`Sample role: ${newRole.replace("_", " ").toUpperCase()}`, {
        description: `Harbour Hotel demo as ${demo.displayName}`,
      });
    }
  };

  const exitDemoToLive = () => {
    leaveDemo();
    const { userJson, propertyId } = takeStashedLiveSession();
    if (userJson) {
      try {
        const restored = JSON.parse(userJson) as UserProfile;
        if (!DEMO_USERS.some((row) => row.uid === restored.uid)) {
          setUser(restored);
          if (propertyId) setActivePropertyId(propertyId);
          toast.info("Back to your live account", { description: restored.displayName });
          return;
        }
      } catch {
        // fall through
      }
    }
    // No live stash — clear demo persona from live mode.
    if (user && DEMO_USERS.some((row) => row.uid === user.uid)) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        activePropertyId,
        setActivePropertyId,
        login,
        register,
        logout,
        switchRole,
        exitDemoToLive,
        isSuperAdmin,
        isHostAdmin,
        isStaff,
        isGuest,
        userProperties,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
