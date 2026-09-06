import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import {
  CURRENT_PROPERTY,
  LOCAL_PLACES,
  BOOKABLE_EXPERIENCES,
  HOTEL_UPSELLS,
  DEFAULT_DEALS,
  IN_ROOM_DINING_MENU,
  TRANSLATIONS,
  PropertyInfo,
  LocalPlace,
  BookableExperience,
  UpsellItem,
  DealItem,
  StaffTicket,
  MenuItem,
} from "../../../shared/airpal-data";
import { toast } from "sonner";
import { detectBrowserLanguage } from "../lib/platform";
import { isDemoMode } from "../lib/app-mode";
import {
  loadLocalTickets,
  persistLocalTickets,
  recordTransaction,
  subscribeToTickets,
  syncTicketToBackend,
  trackAirPalEvent,
  updateRemoteTicket,
  loadProperty,
  saveProperty,
  loadPropertyDeals,
  savePropertyDeal,
  deletePropertyDeal,
  loadPropertyMenu,
  savePropertyMenuItem,
  deletePropertyMenuItem,
  loadPropertyPlaces,
  savePropertyPlace,
  deletePropertyPlace,
} from "../lib/airpal-backend";
import { soundFx } from "../lib/sound";

export type DeviceMode = "iphone" | "android" | "tablet" | "responsive";
export type QrType = "room" | "property" | "dining" | "experience" | "emergency";
export type WeatherType = "sunny" | "rainy";

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface GuestNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "order" | "service" | "info" | "wifi";
  read: boolean;
}

interface AirPalContextType {
  propertyId: string;
  setPropertyId: (id: string) => void;
  property: PropertyInfo;
  updateProperty: (prop: PropertyInfo) => Promise<void>;
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
  addPlace: (place: LocalPlace) => Promise<void>;
  removePlace: (placeId: string) => Promise<void>;
  experiences: BookableExperience[];
  deals: DealItem[];
  addDeal: (deal: DealItem) => Promise<void>;
  updateDeal: (deal: DealItem) => Promise<void>;
  removeDeal: (dealId: string) => Promise<void>;
  menuItems: MenuItem[];
  addMenuItem: (item: MenuItem) => Promise<void>;
  updateMenuItem: (item: MenuItem) => Promise<void>;
  removeMenuItem: (itemId: string) => Promise<void>;
  upsells: UpsellItem[];
  notifications: GuestNotification[];
  unreadNotificationCount: number;
  addNotification: (notif: Omit<GuestNotification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  trackEvent: (name: string, payload?: Record<string, string | number | boolean | null>) => void;
}

const AirPalContext = createContext<AirPalContextType | undefined>(undefined);

const SUPPORTED_LANGUAGES = Object.keys(TRANSLATIONS);

export const AirPalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [propertyId, setPropertyIdState] = useState<string>("harbour-hotel");
  const [property, setProperty] = useState<PropertyInfo>(() => loadProperty("harbour-hotel"));
  const [roomNumber, setRoomNumber] = useState<string>("508");
  const [guestName, setGuestName] = useState<string>(() => (isDemoMode() ? "Bibin" : "Guest"));
  const [qrType, setQrType] = useState<QrType>("room");
  const [deviceMode, setDeviceMode] = useState<DeviceMode>(() => (isDemoMode() ? "iphone" : "responsive"));
  const [language, setLanguage] = useState<string>(() => detectBrowserLanguage(SUPPORTED_LANGUAGES));
  const [familyMode, setFamilyMode] = useState<boolean>(false);
  const [seniorMode, setSeniorMode] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherType>("sunny");
  const [staffTickets, setStaffTickets] = useState<StaffTicket[]>(() => loadLocalTickets());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeUpsells, setActiveUpsells] = useState<string[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<string[]>(["p1", "p4"]);

  // Notifications State for In-Room Companion
  const [notifications, setNotifications] = useState<GuestNotification[]>([
    {
      id: "notif-welcome",
      title: "Welcome to " + property.name,
      message: "High-speed Wi-Fi is active. Tap to view your room compendium and dining menu.",
      timestamp: "Just now",
      type: "info",
      read: false,
    },
    {
      id: "notif-wifi",
      title: "Fibre Wi-Fi Connected",
      message: `SSID: ${property.wifi?.network || "HarbourHotel_Guest"} · Pass: ${property.wifi?.password || "welcomeguest2026"}`,
      timestamp: "Just now",
      type: "wifi",
      read: false,
    },
  ]);

  const addNotification = useCallback((notif: Omit<GuestNotification, "id" | "timestamp" | "read">) => {
    const newN: GuestNotification = {
      ...notif,
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: "Just now",
      read: false,
    };
    setNotifications((prev) => [newN, ...prev]);
  }, []);

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  // Dynamic Data collections
  const [deals, setDeals] = useState<DealItem[]>(() => loadPropertyDeals(propertyId));
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => loadPropertyMenu(propertyId));
  const [places, setPlaces] = useState<LocalPlace[]>(() => loadPropertyPlaces(propertyId));

  const setPropertyId = useCallback((id: string) => {
    setPropertyIdState(id);
    const p = loadProperty(id);
    setProperty(p);
    setDeals(loadPropertyDeals(id));
    setMenuItems(loadPropertyMenu(id));
    setPlaces(loadPropertyPlaces(id));
  }, []);

  const updateProperty = async (updated: PropertyInfo) => {
    soundFx.playSuccessTick();
    setProperty(updated);
    await saveProperty(updated);
    toast.success("Property Compendium Updated", {
      description: "Changes are live for all guests immediately.",
    });
  };

  const addDeal = async (deal: DealItem) => {
    soundFx.playSuccessTick();
    await savePropertyDeal(property.id, deal);
    setDeals(loadPropertyDeals(property.id));
    toast.success("New Deal Published", {
      description: `${deal.title} is now visible to guests.`,
    });
  };

  const updateDeal = async (deal: DealItem) => {
    soundFx.playSuccessTick();
    await savePropertyDeal(property.id, deal);
    setDeals(loadPropertyDeals(property.id));
    toast.info("Deal Updated");
  };

  const removeDeal = async (dealId: string) => {
    soundFx.playSuccessTick();
    await deletePropertyDeal(property.id, dealId);
    setDeals(loadPropertyDeals(property.id));
    toast.info("Deal Removed");
  };

  const addMenuItem = async (item: MenuItem) => {
    soundFx.playSuccessTick();
    await savePropertyMenuItem(property.id, item);
    setMenuItems(loadPropertyMenu(property.id));
    toast.success("Menu Item Added", {
      description: `${item.name} (${item.category}) added to Dining Menu.`,
    });
  };

  const updateMenuItem = async (item: MenuItem) => {
    soundFx.playSuccessTick();
    await savePropertyMenuItem(property.id, item);
    setMenuItems(loadPropertyMenu(property.id));
    toast.info("Menu Item Updated");
  };

  const removeMenuItem = async (itemId: string) => {
    soundFx.playSuccessTick();
    await deletePropertyMenuItem(property.id, itemId);
    setMenuItems(loadPropertyMenu(property.id));
    toast.info("Menu Item Removed");
  };

  const addPlace = async (place: LocalPlace) => {
    soundFx.playSuccessTick();
    await savePropertyPlace(property.id, place);
    setPlaces(loadPropertyPlaces(property.id));
    toast.success("Local Recommendation Added");
  };

  const removePlace = async (placeId: string) => {
    soundFx.playSuccessTick();
    await deletePropertyPlace(property.id, placeId);
    setPlaces(loadPropertyPlaces(property.id));
    toast.info("Recommendation Removed");
  };

  // Convert active deals to UpsellItems for guest companion
  const upsells: UpsellItem[] = deals
    .filter((d) => d.active !== false)
    .map((d) => ({
      id: d.id,
      title: d.title,
      subtitle: d.subtitle,
      price: d.price,
      badge: d.discountBadge || d.badge || "Special Offer",
      iconName: d.iconName || "Sparkles",
      category: d.category || "stay",
    }));

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
    soundFx.playDeskBell();
    const newTicket: StaffTicket = {
      id: `t-${Date.now().toString().slice(-4)}`,
      propertyId: property.id,
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

    addNotification({
      title: `Staff Request Sent 🛎️ (${category.replace("_", " ")})`,
      message: `Room ${roomNumber}: "${details.slice(0, 50)}" received by Front Desk.`,
      type: "service",
    });

    toast.success("Staff Notification Sent", {
      description: `Front Desk received your ${category.replace("_", " ")} request for Room ${roomNumber}.`,
    });
    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: StaffTicket["status"]) => {
    soundFx.playGuestChime();
    setStaffTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket))
    );
    void updateRemoteTicket(ticketId, status, property.id);

    const found = staffTickets.find((t) => t.id === ticketId);
    const room = found?.roomNumber || roomNumber;
    addNotification({
      title: status === "in_progress" ? "Staff Dispatched 🛎️" : status === "resolved" ? "Request Resolved ✓" : "Request Updated",
      message: `Room ${room}: Request status is now ${status.replace("_", " ")}.`,
      type: "service",
    });

    toast.info("Ticket Updated", {
      description: `Request status changed to ${status.replace("_", " ")}.`,
    });
  };

  const addToCart = (item: MenuItem) => {
    soundFx.playSuccessTick();
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
    soundFx.playSuccessTick();
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
    const up = upsells.find((item) => item.id === upsellId) || HOTEL_UPSELLS.find((item) => item.id === upsellId);
    if (up) {
      soundFx.playSuccessTick();
      void recordTransaction({
        propertyId: property.id,
        roomNumber,
        product: up.title,
        amount: up.price,
        kind: "upsell",
      });
      trackEvent("upsell_purchase", { upsellId, amount: up.price });

      addNotification({
        title: `Folio Charged: ${up.title}`,
        message: `$${up.price} billed to Room ${roomNumber}.`,
        type: "order",
      });
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
        propertyId,
        setPropertyId,
        property,
        updateProperty,
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
        staffTickets: staffTickets.filter((ticket) => (ticket.propertyId || "harbour-hotel") === property.id),
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
        places,
        addPlace,
        removePlace,
        experiences: BOOKABLE_EXPERIENCES,
        deals,
        addDeal,
        updateDeal,
        removeDeal,
        menuItems,
        addMenuItem,
        updateMenuItem,
        removeMenuItem,
        upsells,
        notifications,
        unreadNotificationCount,
        addNotification,
        markNotificationRead,
        clearAllNotifications,
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
