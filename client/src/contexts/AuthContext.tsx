import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, UserRole, DEMO_USERS, PropertyInfo } from "@shared/airpal-data";
import { loadAllProperties, saveProperty } from "../lib/airpal-backend";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { isDemoMode } from "../lib/app-mode";

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

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  activePropertyId: string;
  setActivePropertyId: (id: string) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, displayName: string, role: UserRole, propertyName?: string, options?: RegisterOptions) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole, propertyId?: string) => void;
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
    if (typeof window === "undefined") return "harbour-hotel";
    return window.localStorage.getItem(LOCAL_ACTIVE_PROPERTY_KEY) || "harbour-hotel";
  });

  const setActivePropertyId = (id: string) => {
    setActivePropertyIdState(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_ACTIVE_PROPERTY_KEY, id);
    }
  };

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

  const login = async (email: string, password?: string): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();
    const demo = DEMO_USERS.find((u) => u.email.toLowerCase() === trimmed);
    if (demo && isDemoMode()) {
      setUser(demo);
      if (demo.propertyIds?.[0]) setActivePropertyId(demo.propertyIds[0]);
      toast.success(`Welcome back, ${demo.displayName}!`);
      return true;
    }

    const account = readAccounts().find((row) => row.email === trimmed);
    if (!account) {
      toast.error("No account for that email", { description: "Create a property first — it takes a minute." });
      return false;
    }
    if (account.password && account.password !== (password || "")) {
      toast.error("Wrong password");
      return false;
    }
    setUser(account.user);
    if (account.user.propertyIds?.[0]) setActivePropertyId(account.user.propertyIds[0]);
    toast.success(`Welcome back, ${account.user.displayName}`);
    return true;
  };

  const register = async (
    email: string,
    displayName: string,
    targetRole: UserRole = "host_admin",
    propertyName?: string,
    options?: RegisterOptions,
  ): Promise<boolean> => {
    const trimmedEmail = email.trim().toLowerCase();
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

    const newUser: UserProfile = {
      uid: `u-${nanoid(6)}`,
      email: trimmedEmail,
      displayName: displayName.trim() || "Host",
      role: targetRole,
      propertyIds: [propId],
      createdAt: new Date().toISOString(),
    };

    writeAccounts([...readAccounts(), { email: trimmedEmail, password: options?.password || "", user: newUser }]);
    setUser(newUser);
    setActivePropertyId(propId);
    toast.success("Your AirPal is live", { description: "Print the QR. Guests scan it — they don’t sign up." });
    return true;
  };

  const logout = () => {
    setUser(null);
    toast.info("Signed out");
  };

  const switchRole = (newRole: UserRole, targetPropertyId?: string) => {
    const demo = DEMO_USERS.find((u) => u.role === newRole);
    if (demo) {
      setUser(demo);
      if (targetPropertyId) {
        setActivePropertyId(targetPropertyId);
      } else if (demo.propertyIds?.[0]) {
        setActivePropertyId(demo.propertyIds[0]);
      }
      toast.success(`Role switched to ${newRole.replace("_", " ").toUpperCase()}`, {
        description: `Active as ${demo.displayName}`,
      });
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
