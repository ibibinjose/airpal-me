import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  CURRENT_PROPERTY,
  LOCAL_PLACES,
  BOOKABLE_EXPERIENCES,
  HOTEL_UPSELLS,
  TRANSLATIONS,
  PropertyInfo,
  LocalPlace,
  BookableExperience,
  UpsellItem,
  StaffTicket,
  MenuItem,
} from "../../../shared/airpal-data";
import { toast } from "sonner";
import { detectBrowserLanguage } from "../lib/platform";
import {
  loadLocalTickets,
  persistLocalTickets,
  recordTransaction,
  subscribeToTickets,
  syncTicketToBackend,
  trackAirPalEvent,
  updateRemoteTicket,
} from "../lib/airpal-backend";

export type DeviceMode = "iphone" | "android" | "tablet" | "responsive";
export type QrType = "room" | "property" | "dining" | "experience" | "emergency";
export type WeatherType = "sunny" | "rainy";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface AirPalContextType {
  property: PropertyInfo;
  roomNumber: string;
  setRoomNumber: (room: string) => void;
  guestName: string;
  setGuestName: (name: string) => void;
  qrType: QrType;
  setQrType: (type: QrType) => void;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  familyMode: boolean;
  setFamilyMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  seniorMode: boolean;
  setSeniorMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  weather: WeatherType;
  setWeather: (weather: WeatherType) => void;
  staffTickets: StaffTicket[];
  addStaffTicket: (category: StaffTicket["category"], details: string, urgency?: "normal" | "urgent") => StaffTicket;
  updateTicketStatus: (ticketId: string, status: StaffTicket["status"]) => void;
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  activeUpsells: string[];
  purchaseUpsell: (upsellId: string) => void;
  savedPlaces: string[];
  toggleSavePlace: (placeId: string) => void;
  places: LocalPlace[];
  experiences: BookableExperience[];
  upsells: UpsellItem[];
  trackEvent: (name: string, payload?: Record<string, string | number | boolean | null>) => void;
}

const AirPalContext = createContext<AirPalContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);

export const AirPalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [property] = useState<PropertyInfo>(CURRENT_PROPERTY);
  const [roomNumber, setRoomNumber] = useState<string>("508");
  const [guestName, setGuestName] = useState<string>("Bibin");
  const [qrType, setQrType] = useState<QrType>("room");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("iphone");
  const [language, setLanguage] = useState<string>(() => detectBrowserLanguage(SUPPORTED_LANGUAGES));
  const [familyMode, setFamilyMode] = useState<boolean>(false);
  const [seniorMode, setSeniorMode] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherType>("sunny");
  const [staffTickets, setStaffTickets] = useState<StaffTicket[]>(() => loadLocalTickets());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeUpsells, setActiveUpsells] = useState<string[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<string[]>(["p1", "p4"]);

  const t = (key: string): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const trackEvent = useCallback((name: string, payload: Record<string, string | number | boolean | null> = {}) => {
    void trackAirPalEvent(name, payload, {
      propertyId: property.id,
      roomNumber,
      language,
    });
  }, [property.id, roomNumber, language]);

  useEffect(() => {
    const unsubscribe = subscribeToTickets((tickets) => {
      if (tickets.length) setStaffTickets(tickets);
    }, property.id);
    trackEvent("session_start", { qrType });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property.id]);

  useEffect(() => {
    persistLocalTickets(staffTickets);
  }, [staffTickets]);

  const addStaffTicket = (category: StaffTicket["category"], details: string, urgency: "normal" | "urgent" = "normal"): StaffTicket => {
    const newTicket: StaffTicket = {
      id: `t-${Date.now().toString().slice(-4)}`,
      roomNumber,
      guestName,
      category,
      details,
      status: "pending",
      createdAt: "Just now",
      urgency,
    };
    setStaffTickets((prev) => [newTicket, ...prev]);
    void syncTicketToBackend(newTicket, property.id);
    trackEvent("staff_request", { category, urgency });
    toast.success("Staff Notification Sent", {
      description: `Front Desk received your ${category.replace("_", " ")} request for Room ${roomNumber}.`,
    });
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: StaffTicket["status"]) => {
    setStaffTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket))
    );
    void updateRemoteTicket(ticketId, status, property.id);
    toast.info("Ticket Updated", {
      description: `Request status changed to ${status.replace("_", " ")}.`,
    });
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to order`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((ci) =>
          ci.item.id === itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
        );
      }
      return prev.filter((ci) => ci.item.id !== itemId);
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );

  const purchaseUpsell = (upsellId: string) => {
    if (activeUpsells.includes(upsellId)) return;
    setActiveUpsells((prev) => [...prev, upsellId]);
    const up = HOTEL_UPSELLS.find((item) => item.id === upsellId);
    if (up) {
      void recordTransaction({
        propertyId: property.id,
        roomNumber,
        product: up.title,
        amount: up.price,
        kind: "upsell",
      });
      trackEvent("upsell_purchase", { upsellId, amount: up.price });
    }
    toast.success("Added to Room Folio", {
      description: `${up?.title} has been billed to Room ${roomNumber}. Confirmation sent.`,
    });
  };

  const toggleSavePlace = (placeId: string) => {
    setSavedPlaces((prev) =>
      prev.includes(placeId)
        ? prev.filter((id) => id !== placeId)
        : [...prev, placeId]
    );
    trackEvent("place_saved", { placeId });
  };

  return (
    <AirPalContext.Provider
      value={{
        property,
        roomNumber,
        setRoomNumber,
        guestName,
        setGuestName,
        qrType,
        setQrType,
        deviceMode,
        setDeviceMode,
        language,
        setLanguage,
        t,
        familyMode,
        setFamilyMode,
        seniorMode,
        setSeniorMode,
        weather,
        setWeather,
        staffTickets,
        addStaffTicket,
        updateTicketStatus,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        activeUpsells,
        purchaseUpsell,
        savedPlaces,
        toggleSavePlace,
        places: LOCAL_PLACES,
        experiences: BOOKABLE_EXPERIENCES,
        upsells: HOTEL_UPSELLS,
        trackEvent,
      }}
    >
      {children}
    </AirPalContext.Provider>
  );
};

export const useAirPal = () => {
  const context = useContext(AirPalContext);
  if (!context) {
    throw new Error("useAirPal must be used within an AirPalProvider");
  }
  return context;
};
