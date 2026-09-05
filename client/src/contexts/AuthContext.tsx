import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, UserRole, DEMO_USERS, PropertyInfo } from "@shared/airpal-data";
import { loadAllProperties, saveProperty } from "../lib/airpal-backend";
import { toast } from "sonner";
import { nanoid } from "nanoid";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  activePropertyId: string;
  setActivePropertyId: (id: string) => void;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (email: string, displayName: string, role: UserRole, propertyName?: string) => Promise<boolean>;
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
    if (typeof window === "undefined") return DEMO_USERS[1]; // default host admin
    try {
      const stored = window.localStorage.getItem(LOCAL_AUTH_KEY);
      if (stored) return JSON.parse(stored) as UserProfile;
    } catch {
      // ignore
    }
    return DEMO_USERS[1]; // default host admin
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

  const login = async (email: string): Promise<boolean> => {
    const trimmed = email.trim().toLowerCase();
    const demo = DEMO_USERS.find((u) => u.email.toLowerCase() === trimmed);
    if (demo) {
      setUser(demo);
      if (demo.propertyIds?.[0]) setActivePropertyId(demo.propertyIds[0]);
      toast.success(`Welcome back, ${demo.displayName}!`, {
        description: `Logged in as ${demo.role.replace("_", " ").toUpperCase()}`,
      });
      return true;
    }

    // Dynamic user if not in demo list
    const newUser: UserProfile = {
      uid: `u-${nanoid(6)}`,
      email: trimmed,
      displayName: trimmed.split("@")[0].toUpperCase(),
      role: trimmed.includes("admin") ? "super_admin" : "host_admin",
      propertyIds: ["harbour-hotel"],
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    toast.success(`Logged in as ${newUser.displayName}`);
    return true;
  };

  const register = async (
    email: string,
    displayName: string,
    targetRole: UserRole = "host_admin",
    propertyName?: string,
  ): Promise<boolean> => {
    let propId = "harbour-hotel";
    if (propertyName && propertyName.trim()) {
      propId = propertyName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const newProp: PropertyInfo = {
        id: propId,
        name: propertyName,
        tagline: "Boutique Hospitality & Luxury Care",
        destination: "Sydney",
        city: "Sydney",
        country: "Australia",
        address: "Prime Central Avenue",
        phone: "+61 2 9000 0000",
        whatsapp: "+61 400 000 000",
        roomsCount: 24,
        status: "active",
        ownerEmail: email,
        monthlyRevenue: 12500,
        plan: "Starter",
        wifi: {
          network: `${propertyName.replace(/\s+/g, "")}_Guest`,
          password: "welcomeguest2026",
          speed: "200 Mbps Fibre",
        },
        checkIn: "2:00 PM",
        checkOut: "10:00 AM",
        breakfast: {
          hours: "7:00 AM – 10:30 AM",
          location: "Main Dining Room",
          type: "Artisan Breakfast Buffet",
          price: "$20",
        },
        facilities: [
          { name: "Guest Lounge", hours: "24 Hours", floor: "Lobby", details: "Coffee, tea, and workstations", icon: "Coffee" },
          { name: "Luggage Storage", hours: "24 Hours", floor: "Front Desk", details: "Complimentary secure holding", icon: "Luggage" },
        ],
      };
      await saveProperty(newProp);
    }

    const newUser: UserProfile = {
      uid: `u-${nanoid(6)}`,
      email: email.trim(),
      displayName: displayName.trim() || "Host Admin",
      role: targetRole,
      propertyIds: [propId],
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);
    setActivePropertyId(propId);
    toast.success("Account & Property Registered!", {
      description: `Welcome to AirPal Business, ${newUser.displayName}`,
    });
    return true;
  };

  const logout = () => {
    setUser(DEMO_USERS[3]); // switch to guest
    toast.info("Logged out", { description: "You are now viewing as Guest" });
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
