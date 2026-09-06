import React, { useState, useEffect } from "react";
import { useAirPal } from "../contexts/AirPalContext";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RealtimeTopBar } from "../components/RealtimeTopBar";
import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  QrCode,
  BellRing,
  BarChart3,
  Settings2,
  Users,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Printer,
  Utensils,
  Wrench,
  Shirt,
  HelpCircle,
  ShieldCheck,
  Building,
  Check,
  AlertCircle,
  BedDouble,
  DollarSign,
  Tag,
  Trash2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Coffee,
  Car,
  Compass,
  Waves,
  Dumbbell,
  Wine,
  Luggage,
  Wifi,
  Save,
  ChevronDown,
  Volume2,
  VolumeX,
  Send,
  Eye,
  EyeOff,
  DoorOpen,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { DealItem, MenuItem, PropertyInfo, LocalPlace, StaffTicket, FacilityItem, RoomType } from "@shared/airpal-data";
import { nanoid } from "nanoid";
import { makeQrDataUrl, stayQrPayload, campusQrPayload } from "../lib/qr";
import { DemoEntryPanel } from "../components/DemoEntryPanel";
import { soundFx } from "../lib/sound";

export const HostDashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, role, userProperties, isSuperAdmin, activePropertyId, setActivePropertyId, logout } = useAuth();
  const {
    property,
    updateProperty,
    setPropertyId,
    staffTickets,
    updateTicketStatus,
    deals,
    addDeal,
    updateDeal,
    removeDeal,
    menuItems,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    places,
    addPlace,
    removePlace,
  } = useAirPal();

  const [activeSection, setActiveSection] = useState<
    "overview" | "inbox" | "deals" | "menu" | "places" | "knowledge" | "qr-kit" | "analytics" | "demo"
  >("overview");

  const [ticketFilter, setTicketFilter] = useState<"all" | "pending" | "in_progress" | "resolved">("all");
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState<string>("all");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [qrRoomInput, setQrRoomInput] = useState<string>(property.kind === "campus" ? "R12" : "101");
  const [qrTypeSelection, setQrTypeSelection] = useState<"room" | "lobby" | "restaurant" | "emergency">("room");
  const [qrImage, setQrImage] = useState("");

  // Filters for Deals, Menu, and Places
  const [dealFilter, setDealFilter] = useState<"all" | "stay" | "dining" | "transport" | "wellness">("all");
  const [menuFilter, setMenuFilter] = useState<string>("All");
  const [placeFilter, setPlaceFilter] = useState<string>("All");

  const displayedDeals = dealFilter === "all" ? deals : deals.filter((d) => d.category === dealFilter);
  const displayedMenuItems = menuFilter === "All" ? menuItems : menuItems.filter((m) => m.category === menuFilter);
  const displayedPlaces = placeFilter === "All" ? places : places.filter((p) => p.category === placeFilter);

  useEffect(() => {
    const id = activePropertyId || user?.propertyIds?.[0];
    if (id && id !== property.id) setPropertyId(id);
  }, [activePropertyId, user, property.id, setPropertyId]);

  // Compendium CMS form state
  const [compName, setCompName] = useState(property.name);
  const [compTagline, setCompTagline] = useState(property.tagline);
  const [compAddress, setCompAddress] = useState(property.address);
  const [compPhone, setCompPhone] = useState(property.phone);
  const [compWhatsapp, setCompWhatsapp] = useState(property.whatsapp);
  const [compWifiSsid, setCompWifiSsid] = useState(property.wifi.network);
  const [compWifiPass, setCompWifiPass] = useState(property.wifi.password);
  const [compWifiSpeed, setCompWifiSpeed] = useState(property.wifi.speed);
  const [compCheckIn, setCompCheckIn] = useState(property.checkIn);
  const [compCheckOut, setCompCheckOut] = useState(property.checkOut);
  const [compBreakfastHours, setCompBreakfastHours] = useState(property.breakfast.hours);
  const [compBreakfastLocation, setCompBreakfastLocation] = useState(property.breakfast.location);
  const [compBreakfastPrice, setCompBreakfastPrice] = useState(property.breakfast.price);

  useEffect(() => {
    setCompName(property.name);
    setCompTagline(property.tagline);
    setCompAddress(property.address);
    setCompPhone(property.phone);
    setCompWhatsapp(property.whatsapp);
    setCompWifiSsid(property.wifi.network);
    setCompWifiPass(property.wifi.password);
    setCompWifiSpeed(property.wifi.speed);
    setCompCheckIn(property.checkIn);
    setCompCheckOut(property.checkOut);
    setCompBreakfastHours(property.breakfast.hours);
    setCompBreakfastLocation(property.breakfast.location);
    setCompBreakfastPrice(property.breakfast.price);
  }, [property]);

  const guestQrUrl =
    property.kind === "campus"
      ? campusQrPayload(property.id, qrRoomInput || "R12")
      : stayQrPayload(
          property.id,
          qrTypeSelection === "room" ? qrRoomInput : qrTypeSelection === "lobby" ? "lobby" : qrRoomInput,
        );

  useEffect(() => {
    void makeQrDataUrl(guestQrUrl).then(setQrImage);
  }, [guestQrUrl]);

  // Deal Modal state (Create & Edit)
  const [showDealModal, setShowDealModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealItem | null>(null);
  const [dealTitle, setDealTitle] = useState("");
  const [dealSubtitle, setDealSubtitle] = useState("");
  const [dealPrice, setDealPrice] = useState(45);
  const [dealOriginalPrice, setDealOriginalPrice] = useState(65);
  const [dealBadge, setDealBadge] = useState("Special Deal");
  const [dealCategory, setDealCategory] = useState<"stay" | "dining" | "transport" | "wellness">("stay");
  const [dealIcon, setDealIcon] = useState("Sparkles");

  // Menu Item Modal state (Create & Edit)
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuName, setMenuName] = useState("");
  const [menuCategory, setMenuCategory] = useState<MenuItem["category"]>("Mains");
  const [menuPrice, setMenuPrice] = useState(24);
  const [menuDesc, setMenuDesc] = useState("");
  const [menuDietary, setMenuDietary] = useState("GF");

  // Places / Local Recommendations Modal state (Create)
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [placeCategory, setPlaceCategory] = useState<LocalPlace["category"]>("Coffee");
  const [placeWalkTime, setPlaceWalkTime] = useState("4 min walk");
  const [placeDistance, setPlaceDistance] = useState("350m");
  const [placePriceLevel, setPlacePriceLevel] = useState<"Free" | "$" | "$$" | "$$$">("$$");
  const [placeRating, setPlaceRating] = useState(4.8);
  const [placeAddress, setPlaceAddress] = useState("George Street, Sydney");
  const [placeWhyGo, setPlaceWhyGo] = useState("Artisan roasters and incredible pastries.");
  const [placeStaffPick, setPlaceStaffPick] = useState(true);

  // Compendium Subtabs: Policies, Facilities (Gym/Pool), Rooms
  const [compendiumTab, setCompendiumTab] = useState<"policies" | "facilities" | "rooms">("facilities");

  // Amenities & Facilities state (Create & Edit)
  const [facilities, setFacilities] = useState<FacilityItem[]>(property.facilities || []);
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityItem | null>(null);
  const [facName, setFacName] = useState("");
  const [facHours, setFacHours] = useState("");
  const [facFloor, setFacFloor] = useState("");
  const [facDetails, setFacDetails] = useState("");
  const [facIcon, setFacIcon] = useState("Waves");

  // Room Types & Inventory state (Create & Edit)
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(
    property.roomTypes || [
      { id: "deluxe-king", name: "Deluxe King Harbour View", category: "Deluxe", capacity: 2, sizeSqm: 38, bedConfig: "1 King Bed", totalRooms: 42, startingPrice: 320, features: ["Harbour & Bridge View", "Rain Shower", "Espresso Machine", "Smart TV"] },
      { id: "executive-suite", name: "Executive Sanctuary Suite", category: "Suite", capacity: 3, sizeSqm: 56, bedConfig: "1 King Bed + Lounge", totalRooms: 28, startingPrice: 480, features: ["Deep Soaking Tub", "Complimentary Mini-Bar", "Balcony", "Lounge Area"] },
      { id: "penthouse-sky", name: "The Rocks Panoramic Penthouse", category: "Penthouse", capacity: 4, sizeSqm: 95, bedConfig: "2 King Bedrooms", totalRooms: 14, startingPrice: 850, features: ["Private Rooftop Terrace", "Full Kitchen", "Butler Service", "Unrestricted Skyline Views"] },
    ]
  );
  const [compRoomsCount, setCompRoomsCount] = useState<number>(property.roomsCount || 84);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [rtName, setRtName] = useState("");
  const [rtCategory, setRtCategory] = useState<RoomType["category"]>("Deluxe");
  const [rtCapacity, setRtCapacity] = useState(2);
  const [rtSizeSqm, setRtSizeSqm] = useState(38);
  const [rtBedConfig, setRtBedConfig] = useState("1 King Bed");
  const [rtTotalRooms, setRtTotalRooms] = useState(24);
  const [rtStartingPrice, setRtStartingPrice] = useState(320);
  const [rtFeatures, setRtFeatures] = useState("Harbour View, Rain Shower, Espresso Machine");
  const [rtRoomNumbers, setRtRoomNumbers] = useState("");
  const [ticketRoomFilter, setTicketRoomFilter] = useState("all");

  useEffect(() => {
    if (property.facilities) setFacilities(property.facilities);
    if (property.roomTypes) setRoomTypes(property.roomTypes);
    if (property.roomsCount) setCompRoomsCount(property.roomsCount);
  }, [property]);

  const pendingCount = staffTickets.filter((t) => t.status === "pending").length;

  const filteredTickets = staffTickets.filter((t) => {
    const statusMatch = ticketFilter === "all" ? true : t.status === ticketFilter;
    const catMatch = ticketCategoryFilter === "all" ? true : t.category === ticketCategoryFilter;
    const roomMatch = ticketRoomFilter === "all" ? true : t.roomNumber === ticketRoomFilter;
    return statusMatch && catMatch && roomMatch;
  });

  const handleSaveCompendium = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PropertyInfo = {
      ...property,
      name: compName,
      tagline: compTagline,
      address: compAddress,
      phone: compPhone,
      whatsapp: compWhatsapp,
      wifi: {
        network: compWifiSsid,
        password: compWifiPass,
        speed: compWifiSpeed,
      },
      checkIn: compCheckIn,
      checkOut: compCheckOut,
      breakfast: {
        ...property.breakfast,
        hours: compBreakfastHours,
        location: compBreakfastLocation,
        price: compBreakfastPrice,
      },
      facilities: facilities,
      roomTypes: roomTypes,
      roomsCount: compRoomsCount,
    };
    await updateProperty(updated);
  };

  const handleOpenCreateFacility = () => {
    setEditingFacility(null);
    setFacName("");
    setFacHours("6:00 AM – 10:00 PM");
    setFacFloor("Level 1");
    setFacDetails("");
    setFacIcon("Waves");
    setShowFacilityModal(true);
  };

  const handleOpenEditFacility = (item: FacilityItem) => {
    setEditingFacility(item);
    setFacName(item.name);
    setFacHours(item.hours);
    setFacFloor(item.floor);
    setFacDetails(item.details);
    setFacIcon(item.icon);
    setShowFacilityModal(true);
  };

  const handleSaveFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim()) return;
    const newFac: FacilityItem = {
      id: editingFacility?.id || `fac_${nanoid(6)}`,
      name: facName.trim(),
      hours: facHours.trim(),
      floor: facFloor.trim(),
      details: facDetails.trim(),
      icon: facIcon,
    };
    let updated: FacilityItem[];
    if (editingFacility) {
      updated = facilities.map((f) => (f.name === editingFacility.name ? newFac : f));
      toast.success("Facility Updated", { description: `${newFac.name} saved.` });
    } else {
      updated = [...facilities, newFac];
      toast.success("Facility Added", { description: `${newFac.name} added to hotel compendium.` });
    }
    setFacilities(updated);
    await updateProperty({ ...property, facilities: updated });
    setShowFacilityModal(false);
    setEditingFacility(null);
  };

  const handleDeleteFacility = async (facNameToDelete: string) => {
    const updated = facilities.filter((f) => f.name !== facNameToDelete);
    setFacilities(updated);
    await updateProperty({ ...property, facilities: updated });
    toast.info("Facility Removed");
  };

  const handleApplyFacilityPreset = async (preset: { name: string; hours: string; floor: string; details: string; icon: string }) => {
    if (facilities.some((f) => f.name.toLowerCase() === preset.name.toLowerCase())) {
      toast.info("Amenity already active", { description: `${preset.name} is already in the hotel directory.` });
      return;
    }
    const updated = [...facilities, { ...preset, id: `fac_${nanoid(6)}` }];
    setFacilities(updated);
    await updateProperty({ ...property, facilities: updated });
    toast.success("Preset Amenity Added", { description: `${preset.name} added immediately.` });
  };

  const handleOpenCreateRoomType = () => {
    setEditingRoomType(null);
    setRtName("");
    setRtCategory("Deluxe");
    setRtCapacity(2);
    setRtSizeSqm(36);
    setRtBedConfig("1 King Bed");
    setRtTotalRooms(20);
    setRtStartingPrice(295);
    setRtFeatures("City Skyline View, Espresso Machine, Rain Shower");
    setRtRoomNumbers("101, 102, 103, 104, 105");
    setShowRoomModal(true);
  };

  const handleOpenEditRoomType = (rt: RoomType) => {
    setEditingRoomType(rt);
    setRtName(rt.name);
    setRtCategory(rt.category);
    setRtCapacity(rt.capacity);
    setRtSizeSqm(rt.sizeSqm || 36);
    setRtBedConfig(rt.bedConfig);
    setRtTotalRooms(rt.totalRooms);
    setRtStartingPrice(rt.startingPrice || 295);
    setRtFeatures(rt.features.join(", "));
    setRtRoomNumbers(rt.roomNumbers && rt.roomNumbers.length > 0 ? rt.roomNumbers.join(", ") : "");
    setShowRoomModal(true);
  };

  const handleSaveRoomType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtName.trim()) return;
    const parsedRoomNumbers = rtRoomNumbers
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const newRt: RoomType = {
      id: editingRoomType?.id || `rt_${nanoid(6)}`,
      name: rtName.trim(),
      category: rtCategory,
      capacity: Number(rtCapacity),
      sizeSqm: Number(rtSizeSqm),
      bedConfig: rtBedConfig.trim(),
      totalRooms: Number(rtTotalRooms),
      startingPrice: Number(rtStartingPrice),
      features: rtFeatures.split(",").map((s) => s.trim()).filter(Boolean),
      roomNumbers: parsedRoomNumbers.length > 0 ? parsedRoomNumbers : undefined,
    };
    let updated: RoomType[];
    if (editingRoomType) {
      updated = roomTypes.map((r) => (r.id === editingRoomType.id ? newRt : r));
      toast.success("Room Type Updated", { description: `${newRt.name} updated.` });
    } else {
      updated = [...roomTypes, newRt];
      toast.success("Room Type Added", { description: `${newRt.name} added to inventory.` });
    }
    setRoomTypes(updated);
    const sumRooms = updated.reduce((acc, r) => acc + r.totalRooms, 0);
    setCompRoomsCount(sumRooms);
    await updateProperty({ ...property, roomTypes: updated, roomsCount: sumRooms });
    setShowRoomModal(false);
    setEditingRoomType(null);
  };

  const handleDeleteRoomType = async (rtIdToDelete: string) => {
    const updated = roomTypes.filter((r) => r.id !== rtIdToDelete);
    setRoomTypes(updated);
    const sumRooms = updated.reduce((acc, r) => acc + r.totalRooms, 0);
    setCompRoomsCount(sumRooms);
    await updateProperty({ ...property, roomTypes: updated, roomsCount: sumRooms });
    toast.info("Room Type Removed");
  };

  const handleOpenCreateDeal = () => {
    setEditingDeal(null);
    setDealTitle("");
    setDealSubtitle("");
    setDealPrice(45);
    setDealOriginalPrice(65);
    setDealBadge("Special Deal");
    setDealCategory("stay");
    setDealIcon("Sparkles");
    setShowDealModal(true);
  };

  const handleOpenEditDeal = (deal: DealItem) => {
    setEditingDeal(deal);
    setDealTitle(deal.title);
    setDealSubtitle(deal.subtitle || "");
    setDealPrice(deal.price);
    setDealOriginalPrice(deal.originalPrice || deal.price);
    setDealBadge(deal.discountBadge || deal.badge || "Special Deal");
    setDealCategory(deal.category || "stay");
    setDealIcon(deal.iconName || "Sparkles");
    setShowDealModal(true);
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle.trim()) return;
    const dealPayload: DealItem = {
      id: editingDeal ? editingDeal.id : `deal_${nanoid(6)}`,
      propertyId: property.id,
      title: dealTitle,
      subtitle: dealSubtitle,
      price: Number(dealPrice),
      originalPrice: Number(dealOriginalPrice),
      discountBadge: dealBadge,
      badge: dealBadge,
      category: dealCategory,
      iconName: dealIcon,
      active: editingDeal ? editingDeal.active !== false : true,
      soldCount: editingDeal ? editingDeal.soldCount || 0 : 0,
      inventoryLimit: editingDeal ? editingDeal.inventoryLimit || 20 : 20,
    };
    if (editingDeal) {
      await updateDeal(dealPayload);
      toast.success("Deal Updated", { description: `${dealPayload.title} saved.` });
    } else {
      await addDeal(dealPayload);
    }
    setShowDealModal(false);
    setEditingDeal(null);
  };

  const handleOpenCreateMenu = () => {
    setEditingMenuItem(null);
    setMenuName("");
    setMenuCategory("Mains");
    setMenuPrice(24);
    setMenuDesc("");
    setMenuDietary("GF");
    setShowMenuModal(true);
  };

  const handleOpenEditMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuName(item.name);
    setMenuCategory(item.category);
    setMenuPrice(item.price);
    setMenuDesc(item.description || "");
    setMenuDietary(item.dietary ? item.dietary.join(", ") : "");
    setShowMenuModal(true);
  };

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) return;
    const itemPayload: MenuItem = {
      id: editingMenuItem ? editingMenuItem.id : `m_${nanoid(6)}`,
      propertyId: property.id,
      name: menuName,
      category: menuCategory,
      price: Number(menuPrice),
      description: menuDesc,
      dietary: menuDietary ? menuDietary.split(",").map((s) => s.trim()).filter(Boolean) : [],
      popular: editingMenuItem ? editingMenuItem.popular : true,
      available: editingMenuItem ? editingMenuItem.available !== false : true,
    };
    if (editingMenuItem) {
      await updateMenuItem(itemPayload);
      toast.success("Dish Updated", { description: `${itemPayload.name} modified.` });
    } else {
      await addMenuItem(itemPayload);
    }
    setShowMenuModal(false);
    setEditingMenuItem(null);
  };

  const handleToggleMenuAvailability = async (item: MenuItem) => {
    const updated = { ...item, available: item.available === false ? true : false };
    await updateMenuItem(updated);
    toast.info(updated.available ? `${item.name} is now Available` : `${item.name} marked as Sold Out`);
  };

  const handleCreatePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeName.trim()) return;
    const newPlace: LocalPlace = {
      id: `pl-${nanoid(6)}`,
      propertyId: property.id,
      name: placeName,
      category: placeCategory,
      walkTime: placeWalkTime,
      distance: placeDistance,
      priceLevel: placePriceLevel,
      rating: Number(placeRating),
      address: placeAddress,
      whyGo: placeWhyGo,
      staffPick: placeStaffPick,
      coordinates: { lat: -33.8568, lng: 151.2153 },
    };
    await addPlace(newPlace);
    setShowPlaceModal(false);
    setPlaceName("");
    setPlaceWhyGo("");
    toast.success("Local Recommendation Added", {
      description: `${newPlace.name} (${newPlace.category}) added to Guest Companion.`,
    });
  };

  const handleSendTicketPreset = (ticket: StaffTicket, presetNote: string) => {
    if (soundEnabled) soundFx.playDeskBell();
    updateTicketStatus(ticket.id, "in_progress");
    toast.success("Staff Update Dispatched", {
      description: `Room ${ticket.roomNumber}: "${presetNote}"`,
    });
  };

  return (
    <ProtectedRoute allowedRoles={["host_admin", "super_admin", "staff"]} resourceName="Host Operations Dashboard">
      <div className="min-h-screen bg-[#f4f6f1] text-[#16211c] flex flex-col font-sans">
        <RealtimeTopBar className="sticky top-0 z-40 border-b border-[#dde3db]" />

        {/* Real App Operator Session Strip */}
        <div className="bg-stone-900 text-white px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-300">
              Signed in: <strong className="text-white">{user?.displayName || user?.email}</strong>
            </span>
            <span
              className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase border ${
                role === "super_admin"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                  : role === "host_admin"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : "bg-blue-500/20 text-blue-300 border-blue-500/30"
              }`}
            >
              {role === "super_admin" ? "Super Admin" : role === "host_admin" ? "General Manager" : "Front Desk Staff"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isSuperAdmin && (
              <button
                onClick={() => setLocation("/admin")}
                className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-purple-300 text-xs transition-colors flex items-center gap-1"
              >
                <ShieldCheck size={12} />
                <span>Super Admin</span>
              </button>
            )}
            <button
              onClick={() =>
                setLocation(
                  property.kind === "campus"
                    ? `/c/${property.id}?room=${qrRoomInput || "R12"}`
                    : `/g/${property.id}?type=room&room=${qrRoomInput || "101"}`
                )
              }
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors flex items-center gap-1"
            >
              <ExternalLink size={12} />
              <span>Guest App</span>
            </button>
            <button
              onClick={() => {
                logout();
                setLocation("/auth");
              }}
              className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-red-900/60 text-stone-300 hover:text-red-200 text-xs transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* If user is staff, show role notification ribbon */}
        {role === "staff" && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 sm:px-8 py-2 text-xs text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Front Desk & Housekeeping Staff Mode:</span>
              <span>You have operational dispatch permissions for Live Staff Inbox and In-Room Dining.</span>
            </div>
            <span className="text-[10px] font-mono uppercase font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
              Operational Access
            </span>
          </div>
        )}

        <div className="flex-1 flex flex-col md:flex-row">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#dde3db] bg-[#fffdf9] p-4 flex flex-col justify-between">
            <div className="space-y-5">
          {/* Property Selector Card */}
          <div className="p-3 rounded-2xl bg-white border border-[#dde3db] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="grid place-items-center w-9 h-9 rounded-xl bg-amber-400 text-stone-950 font-bold text-sm shadow">
                {property.name.charAt(0)}
              </div>
              <div className="overflow-hidden flex-1">
                <strong className="block text-xs font-bold text-[#16211c] truncate">
                  {property.name}
                </strong>
                <span className="text-[10px] text-[#c57a32] font-mono block truncate">
                  {property.city} · {property.roomsCount || 84} Rooms
                </span>
              </div>
            </div>

            {/* Switch Property if multiple */}
            {userProperties.length > 1 && (
              <select
                value={property.id}
                onChange={(e) => {
                  setPropertyId(e.target.value);
                  setActivePropertyId(e.target.value);
                }}
                className="w-full py-1.5 px-2 rounded-lg bg-[#f4f7f2] border border-[#dde3db] text-[11px] font-semibold text-[#16211c] outline-none"
              >
                {userProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    Switch to: {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <span className="block px-3 text-[10px] font-mono tracking-wider uppercase text-stone-400 mb-2">
              Hotel Business Tools
            </span>

            {[
              { id: "overview", label: "Overview & Health", icon: LayoutDashboard },
              {
                id: "inbox",
                label: "Live Staff Inbox",
                icon: BellRing,
                badge: pendingCount > 0 ? `${pendingCount} new` : undefined,
              },
              { id: "deals", label: "Deals & Offers Studio", icon: Sparkles, badge: `${deals.length} active` },
              { id: "menu", label: "In-Room Dining CMS", icon: Utensils },
              { id: "places", label: "Local Guide & Picks", icon: Compass, badge: places.length > 0 ? `${places.length} picks` : undefined },
              { id: "knowledge", label: "Property Compendium", icon: BedDouble },
              { id: "qr-kit", label: "Dynamic QR Kit", icon: QrCode },
              { id: "analytics", label: "Guest Intelligence", icon: BarChart3 },
              { id: "demo", label: "Partner sample", icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    activeSection === item.id
                      ? "bg-amber-400 text-stone-950 font-bold shadow-sm"
                      : "text-[#5a6b62] hover:bg-[#f3f6f1] hover:text-[#16211c]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#dde3db] space-y-2 text-xs">
          {isSuperAdmin && (
            <button
              onClick={() => setLocation("/admin")}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold border border-purple-200 transition-all text-xs"
            >
              <ShieldCheck size={13} className="text-purple-700" />
              <span>Platform Super Admin</span>
            </button>
          )}

          <button
            onClick={() =>
              setLocation(
                property.kind === "campus"
                  ? `/c/${property.id}?room=${qrRoomInput || "R12"}`
                  : `/g/${property.id}?type=room&room=${qrRoomInput || "101"}`,
              )
            }
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-[#eef3ed] text-[#c57a32] font-semibold border border-amber-400/30 transition-all text-xs"
          >
            <ExternalLink size={13} />
            <span>Open as guest</span>
          </button>
          <button
            onClick={() => {
              logout();
              setLocation("/");
            }}
            className="w-full py-2 text-[11px] text-[#7a877f] hover:text-[#16211c]"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Operational Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#dde3db]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold">
                Host Operating System · {property.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#dceee4] text-[#2f7a56] text-[10px] font-mono font-bold border border-emerald-500/30">
                Live & Synced
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#16211c] tracking-tight">
              {activeSection === "overview" && "Property Operations & Health"}
              {activeSection === "inbox" && "Live Guest Requests & Escalations"}
              {activeSection === "deals" && "Deals, Offers & Upsell Studio"}
              {activeSection === "menu" && "In-Room Dining Menu Manager"}
              {activeSection === "places" && "Local Guide & Concierge Recommendations"}
              {activeSection === "knowledge" && "Property Compendium & Wi-Fi CMS"}
              {activeSection === "qr-kit" && "Dynamic QR Deployment Studio"}
              {activeSection === "analytics" && "Guest Demand & Search Intelligence"}
              {activeSection === "demo" && "Show partners the sample"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {activeSection === "deals" && (
              <button
                onClick={handleOpenCreateDeal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
              >
                <Plus size={14} />
                <span>Create New Deal</span>
              </button>
            )}

            {activeSection === "menu" && (
              <button
                onClick={handleOpenCreateMenu}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
              >
                <Plus size={14} />
                <span>Add New Dish</span>
              </button>
            )}

            {activeSection === "places" && (
              <button
                onClick={() => setShowPlaceModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
              >
                <Plus size={14} />
                <span>Add Local Pick</span>
              </button>
            )}

            <button
              onClick={() => setActiveSection("inbox")}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all"
            >
              <BellRing size={14} />
              <span>Inbox ({pendingCount})</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: OVERVIEW */}
        {activeSection === "overview" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-5 rounded-3xl bg-white border border-[#dde3db] flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold">How guests get in</p>
                <h3 className="font-bold text-base text-[#16211c]">They scan. They don’t sign up.</h3>
                <p className="text-xs text-[#5a6b62] max-w-xl">
                  Print the QR from the kit. Put it on the desk or gate. Guests open the companion with Wi-Fi, dining, and help — no app store, no account.
                </p>
              </div>
              <button
                onClick={() => setActiveSection("qr-kit")}
                className="shrink-0 px-4 py-2.5 rounded-xl bg-amber-400 text-stone-950 text-xs font-bold"
              >
                Open QR kit
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>Active Deals & Upsells</span>
                  <Sparkles size={16} className="text-amber-500" />
                </span>
                <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#16211c]">
                  {deals.filter((d) => d.active !== false).length}
                </strong>
                <span className="text-[11px] text-[#2d7a55] font-mono">Live on guest app</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>Dining Menu Items</span>
                  <Utensils size={16} className="text-blue-500" />
                </span>
                <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#16211c]">
                  {menuItems.length}
                </strong>
                <span className="text-[11px] text-stone-500 font-mono">Available for order</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>Pending Staff Tickets</span>
                  <BellRing size={16} className="text-red-500" />
                </span>
                <strong className="block text-2xl sm:text-3xl font-bold font-mono text-red-600">
                  {pendingCount}
                </strong>
                <span className="text-[11px] text-stone-500 font-mono">Requires attention</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>Wi-Fi Network</span>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </span>
                <strong className="block text-base sm:text-lg font-bold font-mono text-emerald-800 truncate">
                  {property.wifi.network}
                </strong>
                <span className="text-[11px] text-stone-500 font-mono">{property.wifi.speed}</span>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setActiveSection("deals")}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200/70 space-y-2 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Deals & Offers</span>
                  <Sparkles size={16} className="text-amber-600" />
                </div>
                <h3 className="font-bold text-base text-[#16211c]">Boost In-Stay Revenue</h3>
                <p className="text-xs text-[#5a6b62]">
                  Create late checkout deals, breakfast bundles, or spa treatments with custom prices.
                </p>
              </div>

              <div
                onClick={() => setActiveSection("knowledge")}
                className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-200/70 space-y-2 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Compendium CMS</span>
                  <BedDouble size={16} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-base text-[#16211c]">Update Wi-Fi & House Info</h3>
                <p className="text-xs text-[#5a6b62]">
                  Change passwords, check-in rules, and emergency guidelines without reprinting signs.
                </p>
              </div>

              <div
                onClick={() => setActiveSection("menu")}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/70 space-y-2 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Dining Menu</span>
                  <Utensils size={16} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-base text-[#16211c]">Manage In-Room Orders</h3>
                <p className="text-xs text-[#5a6b62]">
                  Update dish prices, 86 out-of-stock items, and add specialty chef specials.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: LIVE STAFF INBOX */}
        {activeSection === "inbox" && (
          <div className="space-y-4 animate-in fade-in">
            {/* Control Bar: Status Filter + Category Filter + Audio Bell Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#dde3db] shadow-sm">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-stone-400 mr-1">Status:</span>
                {(["all", "pending", "in_progress", "resolved"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTicketFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                      ticketFilter === filter
                        ? "bg-amber-400 text-stone-950 font-bold shadow-sm"
                        : "bg-[#f4f7f2] text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {filter.replace("_", " ")}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-400 mr-1">Category:</span>
                  <select
                    value={ticketCategoryFilter}
                    onChange={(e) => setTicketCategoryFilter(e.target.value)}
                    className="py-1 px-2.5 rounded-xl bg-[#f4f7f2] border border-[#dde3db] text-xs font-semibold text-stone-800 outline-none"
                  >
                    <option value="all">All Categories</option>
                    <option value="dining">Dining & Room Service</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="reception">Front Desk / Concierge</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="wifi">Wi-Fi & Tech</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-stone-400 mr-1">Room:</span>
                  <select
                    value={ticketRoomFilter}
                    onChange={(e) => setTicketRoomFilter(e.target.value)}
                    className="py-1 px-2.5 rounded-xl bg-[#f4f7f2] border border-[#dde3db] text-xs font-semibold text-stone-800 outline-none font-mono"
                  >
                    <option value="all">All Rooms</option>
                    {Array.from(new Set(staffTickets.map((t) => t.roomNumber))).sort().map((rm) => (
                      <option key={rm} value={rm}>
                        Room {rm}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    if (next) soundFx.playSuccessTick();
                    toast.info(next ? "Bell Audio Alerts Enabled" : "Audio Alerts Muted");
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    soundEnabled
                      ? "bg-amber-50 border-amber-300 text-amber-900"
                      : "bg-stone-100 border-stone-200 text-stone-400"
                  }`}
                  title={soundEnabled ? "Mute audio alerts" : "Enable bell audio alerts"}
                >
                  {soundEnabled ? <Volume2 size={14} className="text-amber-600" /> : <VolumeX size={14} />}
                  <span className="text-[11px]">{soundEnabled ? "Chimes On" : "Muted"}</span>
                </button>
              </div>
            </div>

            {/* Tickets List */}
            <div className="space-y-3">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#dde3db] text-xs text-stone-400">
                  No tickets found matching the current filters.
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-2xl bg-white border border-[#dde3db] space-y-3 shadow-sm hover:border-amber-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-[#16211c]">
                            Room {ticket.roomNumber}
                          </strong>
                          <span className="text-xs text-stone-500">· {ticket.guestName}</span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[10px] font-bold uppercase">
                            {ticket.category.replace("_", " ")}
                          </span>
                          {ticket.urgency === "urgent" && (
                            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-mono text-[10px] font-bold">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#3a4a42] pt-1">{ticket.details}</p>
                        <span className="text-[10px] font-mono text-stone-400">
                          Received {ticket.createdAt}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                          ticket.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : ticket.status === "in_progress"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>

                    {/* Quick Dispatch Presets (if ticket is active) */}
                    {ticket.status !== "resolved" && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100">
                        <span className="text-[10px] font-mono uppercase text-stone-400 mr-1 flex items-center gap-1">
                          <Send size={10} /> Quick Dispatch:
                        </span>
                        <button
                          onClick={() => handleSendTicketPreset(ticket, "Towels dispatched to your room door.")}
                          className="px-2 py-1 rounded-lg bg-[#f4f7f2] hover:bg-amber-100 hover:text-amber-950 text-stone-700 text-[10px] font-semibold transition-all"
                        >
                          Towels Dispatched
                        </button>
                        <button
                          onClick={() => handleSendTicketPreset(ticket, "Team member is on their way (ETA 10 mins).")}
                          className="px-2 py-1 rounded-lg bg-[#f4f7f2] hover:bg-amber-100 hover:text-amber-950 text-stone-700 text-[10px] font-semibold transition-all"
                        >
                          10m ETA
                        </button>
                        <button
                          onClick={() => handleSendTicketPreset(ticket, "Late check-out granted until 1:00 PM.")}
                          className="px-2 py-1 rounded-lg bg-[#f4f7f2] hover:bg-amber-100 hover:text-amber-950 text-stone-700 text-[10px] font-semibold transition-all"
                        >
                          Late Checkout OK
                        </button>
                        <button
                          onClick={() => handleSendTicketPreset(ticket, "Dining order is being prepared in the kitchen.")}
                          className="px-2 py-1 rounded-lg bg-[#f4f7f2] hover:bg-amber-100 hover:text-amber-950 text-stone-700 text-[10px] font-semibold transition-all"
                        >
                          Order In Kitchen
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                      {ticket.status !== "in_progress" && ticket.status !== "resolved" && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, "in_progress")}
                          className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-all shadow-sm"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {ticket.status !== "resolved" && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, "resolved")}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all shadow-sm"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: DEALS & OFFERS STUDIO */}
        {activeSection === "deals" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <strong className="block text-xs font-bold text-amber-950">
                  Guest Revenue & Upsell Engine
                </strong>
                <p className="text-[11px] text-amber-800">
                  Deals created here appear immediately on your guests’ phones in the AirPal companion.
                </p>
              </div>
              <button
                onClick={handleOpenCreateDeal}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>New Deal</span>
              </button>
            </div>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-white rounded-2xl border border-[#dde3db] shadow-sm">
              <span className="text-[10px] font-mono uppercase font-bold text-stone-400 mr-1">Filter Offers:</span>
              {(["all", "stay", "dining", "transport", "wellness"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDealFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                    dealFilter === cat
                      ? "bg-amber-400 text-stone-950 font-bold shadow-sm"
                      : "bg-[#f4f7f2] text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-[11px] font-mono text-stone-400">
                Showing {displayedDeals.length} of {deals.length} deals
              </span>
            </div>

            {displayedDeals.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-[#dde3db] space-y-3">
                <Sparkles className="mx-auto text-amber-400" size={28} />
                <p className="text-xs text-stone-500 font-medium">No deals found in this category.</p>
                <button
                  onClick={handleOpenCreateDeal}
                  className="px-4 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs shadow"
                >
                  Create Deal Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedDeals.map((deal) => (
                  <div
                    key={deal.id}
                    className={`p-4 rounded-2xl bg-white border transition-all space-y-3 flex flex-col justify-between ${
                      deal.active !== false
                        ? "border-[#dde3db] shadow-sm hover:border-amber-300"
                        : "border-stone-200 opacity-60 bg-stone-50"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                          {deal.discountBadge || deal.badge || "Special Deal"}
                        </span>
                        <span className="text-xs font-mono font-bold text-stone-400 capitalize">
                          {deal.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-[#16211c]">{deal.title}</h4>
                        <p className="text-xs text-[#5a6b62] line-clamp-2 pt-1">{deal.subtitle}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-stone-100">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold font-mono text-[#16211c]">${deal.price}</span>
                        {deal.originalPrice && (
                          <span className="text-xs font-mono text-stone-400 line-through">
                            ${deal.originalPrice}
                          </span>
                        )}
                        <span className="text-[11px] text-stone-500">AUD</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs">
                        <button
                          onClick={() => updateDeal({ ...deal, active: !deal.active })}
                          className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5"
                          title="Toggle Active Status"
                        >
                          {deal.active !== false ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                            </span>
                          ) : (
                            <span className="text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-400" /> Paused
                            </span>
                          )}
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditDeal(deal)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#f4f7f2] transition-colors"
                            title="Edit Deal"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => removeDeal(deal.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Deal"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 4: IN-ROOM DINING CMS */}
        {activeSection === "menu" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <strong className="block text-xs font-bold text-emerald-950">
                  Digital Dining & Room Service Menu
                </strong>
                <p className="text-[11px] text-emerald-800">
                  Manage categories, dish descriptions, dietary tags, prices, and 1-click 86/Sold-Out availability in real-time.
                </p>
              </div>
              <button
                onClick={handleOpenCreateMenu}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-stone-950 shadow flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add Dish</span>
              </button>
            </div>

            {/* Menu Category Filter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-white rounded-2xl border border-[#dde3db] shadow-sm">
              <span className="text-[10px] font-mono uppercase font-bold text-stone-400 mr-1">Menu Category:</span>
              {(["All", "Starters", "Mains", "Desserts", "Drinks", "Breakfast", "Late Night"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMenuFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                    menuFilter === cat
                      ? "bg-emerald-500 text-stone-950 font-bold shadow-sm"
                      : "bg-[#f4f7f2] text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-[11px] font-mono text-stone-400">
                Showing {displayedMenuItems.length} of {menuItems.length} items
              </span>
            </div>

            {displayedMenuItems.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-[#dde3db] space-y-3">
                <Utensils className="mx-auto text-emerald-500" size={28} />
                <p className="text-xs text-stone-500 font-medium">No dishes found in this category.</p>
                <button
                  onClick={handleOpenCreateMenu}
                  className="px-4 py-1.5 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs shadow"
                >
                  Add Dish Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {displayedMenuItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl bg-white border transition-all flex items-start justify-between gap-3 shadow-sm ${
                      item.available === false ? "border-stone-200 bg-stone-50/70 opacity-75" : "border-[#dde3db] hover:border-emerald-300"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <strong className="font-bold text-sm text-[#16211c]">{item.name}</strong>
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[10px] font-bold">
                          {item.category}
                        </span>
                        {item.available === false && (
                          <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-mono text-[10px] font-bold">
                            Sold Out
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5a6b62] line-clamp-2">{item.description}</p>
                      {item.dietary && item.dietary.length > 0 && (
                        <div className="flex gap-1 pt-1 flex-wrap">
                          {item.dietary.map((d, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-mono text-[9px] font-semibold"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="text-right space-y-2 shrink-0">
                      <span className="block text-base font-mono font-bold text-[#16211c]">
                        ${item.price}
                      </span>

                      {/* In Stock vs Sold Out Toggle */}
                      <button
                        onClick={() => handleToggleMenuAvailability(item)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 border transition-all ${
                          item.available !== false
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100"
                            : "bg-red-50 border-red-300 text-red-800 hover:bg-red-100"
                        }`}
                        title={item.available !== false ? "Click to 86 / Mark Sold Out" : "Click to mark Available"}
                      >
                        {item.available !== false ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-end gap-1 pt-1">
                        <button
                          onClick={() => handleOpenEditMenu(item)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#f4f7f2] transition-colors"
                          title="Edit Dish"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => removeMenuItem(item.id)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Remove Item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: LOCAL GUIDE & CONCIERGE RECOMMENDATIONS */}
        {activeSection === "places" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
              <div>
                <strong className="block text-xs font-bold text-sky-950">
                  Local Guide & Concierge Recommendations
                </strong>
                <p className="text-[11px] text-sky-800">
                  Curate neighborhood secrets, cafes, and sights that populate the guest companion "Local Picks" tab in real time.
                </p>
              </div>
              <button
                onClick={() => setShowPlaceModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add Local Pick</span>
              </button>
            </div>

            {/* Category Filter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-white rounded-2xl border border-[#dde3db] shadow-sm">
              <span className="text-[10px] font-mono uppercase font-bold text-stone-400 mr-1">Category:</span>
              {(["All", "Coffee", "Food & Drink", "Sights & Culture", "Nightlife", "Nature & Walks", "Family"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPlaceFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-all ${
                    placeFilter === cat
                      ? "bg-sky-600 text-white font-bold shadow-sm"
                      : "bg-[#f4f7f2] text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-[11px] font-mono text-stone-400">
                Showing {displayedPlaces.length} of {places.length} picks
              </span>
            </div>

            {displayedPlaces.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-[#dde3db] space-y-3">
                <Compass className="mx-auto text-sky-500" size={28} />
                <p className="text-xs text-stone-500 font-medium">No recommendations found in this category.</p>
                <button
                  onClick={() => setShowPlaceModal(true)}
                  className="px-4 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow"
                >
                  Add First Pick
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayedPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="p-4 rounded-2xl bg-white border border-[#dde3db] hover:border-sky-300 transition-all space-y-3 shadow-sm flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 font-mono text-[10px] font-bold">
                            {place.category}
                          </span>
                          {place.staffPick && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold flex items-center gap-1">
                              <Sparkles size={10} /> Staff Favorite
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                          {place.priceLevel}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-[#16211c]">{place.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-stone-500 pt-0.5">
                          <span className="font-semibold text-emerald-700 font-mono">{place.walkTime}</span>
                          <span>·</span>
                          <span className="font-mono">{place.distance}</span>
                          <span>·</span>
                          <span className="text-amber-600 font-bold">★ {place.rating}</span>
                        </div>
                      </div>

                      {place.whyGo && (
                        <p className="text-xs text-[#3a4a42] bg-[#f8faf7] p-2.5 rounded-xl border border-stone-100 italic">
                          "{place.whyGo}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-400">
                      <span className="truncate max-w-[200px] text-[11px]">{place.address}</span>
                      <button
                        onClick={() => removePlace(place.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Recommendation"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECTION 5: PROPERTY COMPENDIUM, AMENITIES & ROOMS CMS */}
        {activeSection === "knowledge" && (
          <div className="space-y-5 animate-in fade-in">
            {/* Compendium Subtab Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#dde3db] shadow-sm">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCompendiumTab("facilities")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    compendiumTab === "facilities"
                      ? "bg-amber-400 text-stone-950 shadow-sm"
                      : "bg-[#f4f7f2] text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <Waves size={14} />
                  <span>Amenities & Facilities ({facilities.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCompendiumTab("rooms")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    compendiumTab === "rooms"
                      ? "bg-amber-400 text-stone-950 shadow-sm"
                      : "bg-[#f4f7f2] text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <BedDouble size={14} />
                  <span>Rooms & Suites ({compRoomsCount} Keys)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCompendiumTab("policies")}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    compendiumTab === "policies"
                      ? "bg-amber-400 text-stone-950 shadow-sm"
                      : "bg-[#f4f7f2] text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  <Wifi size={14} />
                  <span>Stay Policies & Wi-Fi</span>
                </button>
              </div>

              {compendiumTab === "facilities" && (
                <button
                  type="button"
                  onClick={handleOpenCreateFacility}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
                >
                  <Plus size={14} />
                  <span>Add Facility / Amenity</span>
                </button>
              )}

              {compendiumTab === "rooms" && (
                <button
                  type="button"
                  onClick={handleOpenCreateRoomType}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
                >
                  <Plus size={14} />
                  <span>Add Room Type</span>
                </button>
              )}
            </div>

            {/* TAB 1: AMENITIES & FACILITIES CMS */}
            {compendiumTab === "facilities" && (
              <div className="space-y-4">
                {/* 1-Click Preset Amenities Toolbar */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-xs font-bold text-amber-950">
                        1-Click Quick Add Popular Amenities
                      </strong>
                      <p className="text-[11px] text-amber-800">
                        Click any amenity below to instantly add standard operating hours, icons, and floor locations.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyFacilityPreset({
                          name: "Rooftop Heated Infinity Pool",
                          hours: "6:00 AM – 10:00 PM",
                          floor: "Level 7 Rooftop",
                          details: "Heated water, luxury sun loungers, towel service & panoramic harbour skyline views.",
                          icon: "Waves",
                        })
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Waves size={13} className="text-sky-600" />
                      <span>+ Swimming Pool</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyFacilityPreset({
                          name: "24/7 Technogym Fitness Centre",
                          hours: "24 Hours (Keycard Access)",
                          floor: "Level 2",
                          details: "Cardio treadmills, ellipticals, free weights up to 32kg, yoga mats & sauna access.",
                          icon: "Dumbbell",
                        })
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Dumbbell size={13} className="text-amber-700" />
                      <span>+ 24/7 Gym & Fitness</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyFacilityPreset({
                          name: "Sanctuary Day Spa & Sauna",
                          hours: "9:00 AM – 8:00 PM",
                          floor: "Level 1 Wellness Wing",
                          details: "Hydrotherapy pool, eucalyptus dry sauna, steam room & booked massage therapies.",
                          icon: "Sparkles",
                        })
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Sparkles size={13} className="text-purple-600" />
                      <span>+ Spa & Sauna</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyFacilityPreset({
                          name: "The Rooftop Cellar & Cocktail Bar",
                          hours: "4:00 PM – 11:30 PM",
                          floor: "Level 7",
                          details: "Australian natural wines, artisanal craft cocktails, and sunset skyline seating.",
                          icon: "Wine",
                        })
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Wine size={13} className="text-red-600" />
                      <span>+ Rooftop Bar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyFacilityPreset({
                          name: "Valet Parking & EV Supercharging",
                          hours: "24/7 Front Entrance",
                          floor: "Driveway & Basement",
                          details: "Full valet service, secure underground lockup, and 22kW Type 2 EV chargers.",
                          icon: "Car",
                        })
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Car size={13} className="text-emerald-700" />
                      <span>+ Valet & Parking</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApplyFacilityPreset({
                          name: "Guest Laundry & Steamer Suite",
                          hours: "7:00 AM – 9:00 PM",
                          floor: "Level 3",
                          details: "Complimentary self-service Miele washers & dryers, dry cleaning drop-off available.",
                          icon: "Shirt",
                        })
                      }
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-800 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Shirt size={13} className="text-blue-600" />
                      <span>+ Guest Laundry</span>
                    </button>
                  </div>
                </div>

                {/* Facilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilities.map((fac, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-[#dde3db] hover:border-amber-300 transition-all space-y-3 shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="grid place-items-center w-10 h-10 rounded-xl bg-[#e7f0ec] text-[#c57a32] flex-shrink-0">
                              {fac.icon === "Waves" && <Waves size={18} />}
                              {fac.icon === "Dumbbell" && <Dumbbell size={18} />}
                              {fac.icon === "Wine" && <Wine size={18} />}
                              {fac.icon === "Luggage" && <Luggage size={18} />}
                              {fac.icon === "Shirt" && <Shirt size={18} />}
                              {fac.icon === "Sparkles" && <Sparkles size={18} />}
                              {fac.icon === "Coffee" && <Coffee size={18} />}
                              {fac.icon === "Utensils" && <Utensils size={18} />}
                              {fac.icon === "Car" && <Car size={18} />}
                              {fac.icon === "Wifi" && <Wifi size={18} />}
                              {fac.icon === "BedDouble" && <BedDouble size={18} />}
                              {!["Waves", "Dumbbell", "Wine", "Luggage", "Shirt", "Sparkles", "Coffee", "Utensils", "Car", "Wifi", "BedDouble"].includes(fac.icon) && <Sparkles size={18} />}
                            </div>
                            <div>
                              <strong className="block text-sm font-bold text-[#16211c]">{fac.name}</strong>
                              <span className="text-[11px] font-mono text-stone-500">{fac.hours}</span>
                            </div>
                          </div>

                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-mono text-[10px] font-bold">
                            {fac.floor}
                          </span>
                        </div>

                        <p className="text-xs text-[#5a6b62] bg-[#f8faf7] p-2.5 rounded-xl border border-stone-100">
                          {fac.details}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                          Live on /stay companion
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditFacility(fac)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#f4f7f2] transition-colors"
                            title="Edit Facility"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFacility(fac.name)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove Facility"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ROOM TYPES & INVENTORY */}
            {compendiumTab === "rooms" && (
              <div className="space-y-4">
                {/* Rooms Overview Banner */}
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <strong className="block text-xs font-bold text-blue-950">
                      Property Key Inventory & Room Categories
                    </strong>
                    <p className="text-[11px] text-blue-800">
                      Configure room categories, bedding layouts, room sizes, and starting prices.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-blue-900">Total Rooms:</label>
                    <input
                      type="number"
                      value={compRoomsCount}
                      onChange={(e) => setCompRoomsCount(Number(e.target.value))}
                      className="w-20 px-2.5 py-1.5 rounded-xl bg-white border border-blue-300 font-mono text-xs font-bold text-blue-950 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        void updateProperty({ ...property, roomsCount: compRoomsCount });
                        toast.success("Room Count Updated", { description: `${compRoomsCount} total rooms registered.` });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow hover:bg-blue-500"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Room Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roomTypes.map((rt) => (
                    <div
                      key={rt.id}
                      className="p-4 rounded-2xl bg-white border border-[#dde3db] hover:border-blue-300 transition-all space-y-3 shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-mono text-[10px] font-bold">
                            {rt.category}
                          </span>
                          <span className="font-mono text-xs text-stone-500 font-semibold">
                            {rt.totalRooms} Keys
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-[#16211c]">{rt.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-stone-500 pt-0.5 font-mono">
                            <span>{rt.bedConfig}</span>
                            <span>·</span>
                            <span>{rt.sizeSqm} m²</span>
                            <span>·</span>
                            <span>Max {rt.capacity} guests</span>
                          </div>
                        </div>

                        {rt.features && rt.features.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {rt.features.map((f, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-[#f4f7f2] text-stone-700 font-mono text-[10px]"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Assigned Room Numbers list */}
                        <div className="pt-1 bg-[#fbfcfb] p-2.5 rounded-xl border border-stone-200/70 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-stone-700 flex items-center gap-1 font-mono">
                              <Key size={11} className="text-amber-600" />
                              Room Keys ({rt.roomNumbers?.length || 0}):
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenEditRoomType(rt)}
                              className="text-[10px] text-amber-700 hover:text-amber-800 font-semibold underline"
                            >
                              Edit Keys
                            </button>
                          </div>
                          {rt.roomNumbers && rt.roomNumbers.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {rt.roomNumbers.slice(0, 8).map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => {
                                    setQrRoomInput(num);
                                    setQrTypeSelection("room");
                                    setActiveSection("qr-kit");
                                    toast.info(`Configured QR Stand for Room ${num}`);
                                  }}
                                  className="px-2 py-0.5 rounded-md bg-white hover:bg-amber-100 text-stone-900 font-mono text-[10px] font-bold border border-stone-300 shadow-2xs transition-colors"
                                  title={`Click to generate QR Stand for Room ${num}`}
                                >
                                  {num}
                                </button>
                              ))}
                              {rt.roomNumbers.length > 8 && (
                                <span className="text-[10px] text-stone-400 font-mono self-center">
                                  +{rt.roomNumbers.length - 8} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-[10px] text-stone-400 italic">No room numbers assigned yet.</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-stone-100">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1">
                            <span className="text-base font-bold font-mono text-[#16211c]">
                              ${rt.startingPrice || 280}
                            </span>
                            <span className="text-[10px] text-stone-400">/night avg</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const targetRoom = rt.roomNumbers?.[0] || "101";
                              setQrRoomInput(targetRoom);
                              setQrTypeSelection("room");
                              setActiveSection("qr-kit");
                              toast.info("Opened Dynamic QR Kit", { description: `Generate stands for Room ${targetRoom} (${rt.name})` });
                            }}
                            className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                          >
                            <QrCode size={12} />
                            <span>Room QRs</span>
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-1 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              const targetRoom = rt.roomNumbers?.[0] || "101";
                              window.open(`/stay?room=${targetRoom}`, "_blank");
                            }}
                            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/60"
                            title={`Open /stay?room=${rt.roomNumbers?.[0] || "101"} in new tab`}
                          >
                            <ExternalLink size={11} />
                            <span>Test /stay ({rt.roomNumbers?.[0] || "101"})</span>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditRoomType(rt)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-[#f4f7f2] transition-colors"
                              title="Edit Room Type"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRoomType(rt.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Remove Room Type"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ACTIVE ROOM DIRECTORY & KEY MANAGEMENT */}
                <div className="p-5 rounded-2xl bg-white border border-[#dde3db] space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 grid place-items-center font-bold">
                        <DoorOpen size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#16211c]">
                          Active Rooms Directory ({roomTypes.reduce((acc, r) => acc + (r.roomNumbers?.length || 0), 0)} Configured Keys)
                        </h4>
                        <p className="text-[11px] text-stone-500">
                          Live room numbers mapped to categories. Click any room to test its In-Room Companion or generate its QR Stand.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        // Auto-populate default room numbers if none exists
                        const defaults = [
                          { id: "deluxe-king", nums: ["101", "102", "103", "104", "105", "106", "107", "108", "201", "202", "203", "204"] },
                          { id: "executive-suite", nums: ["301", "302", "303", "304", "305", "401", "402", "403"] },
                          { id: "penthouse-sky", nums: ["501", "502", "503", "504", "505", "508"] },
                        ];
                        const updated = roomTypes.map((rt, idx) => {
                          if (rt.roomNumbers && rt.roomNumbers.length > 0) return rt;
                          const fallback = defaults[idx] || { nums: [`${(idx + 1) * 100 + 1}`, `${(idx + 1) * 100 + 2}`] };
                          return { ...rt, roomNumbers: fallback.nums };
                        });
                        setRoomTypes(updated);
                        void updateProperty({ ...property, roomTypes: updated });
                        toast.success("Standard Room Directory Populated", { description: "Room numbers 101–508 registered." });
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#f4f7f2] hover:bg-amber-100 text-stone-800 font-semibold text-xs border border-stone-200 flex items-center gap-1.5"
                    >
                      <Sparkles size={12} className="text-amber-600" />
                      <span>Auto-Generate Room Numbers</span>
                    </button>
                  </div>

                  {/* Room Keys Grid */}
                  <div className="space-y-3">
                    {roomTypes.map((rt) => (
                      <div key={rt.id} className="p-3.5 rounded-xl bg-[#fbfcfb] border border-stone-200/80 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-900 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 font-mono text-[10px] font-bold">
                              {rt.category}
                            </span>
                            <span>{rt.name}</span>
                          </span>
                          <span className="font-mono text-[11px] text-stone-500">
                            {rt.roomNumbers?.length || 0} Rooms Configured
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {(rt.roomNumbers || ["101", "102"]).map((num) => (
                            <div
                              key={num}
                              className="p-2 rounded-xl bg-white border border-stone-200 flex flex-col justify-between space-y-1.5 shadow-2xs hover:border-amber-400 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-stone-950">
                                  Room {num}
                                </span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active Key" />
                              </div>
                              <div className="flex items-center gap-1 pt-1 border-t border-stone-100">
                                <button
                                  type="button"
                                  onClick={() => window.open(`/stay?room=${num}`, "_blank")}
                                  className="flex-1 text-[10px] font-semibold text-emerald-700 hover:underline flex items-center justify-center gap-0.5"
                                  title="Test companion"
                                >
                                  <span>/stay</span>
                                  <ExternalLink size={9} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQrRoomInput(num);
                                    setQrTypeSelection("room");
                                    setActiveSection("qr-kit");
                                    toast.info(`Configured QR Kit for Room ${num}`);
                                  }}
                                  className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800"
                                  title="Print QR Stand"
                                >
                                  <QrCode size={11} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: STAY POLICIES & WI-FI */}
            {compendiumTab === "policies" && (
              <form onSubmit={handleSaveCompendium} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Wi-Fi Settings */}
                  <div className="p-5 rounded-2xl bg-white border border-[#dde3db] space-y-3 shadow-sm">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 font-mono flex items-center gap-1.5">
                      <Wifi size={14} /> Wi-Fi Credentials
                    </h3>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Network Name (SSID)</label>
                      <input
                        type="text"
                        value={compWifiSsid}
                        onChange={(e) => setCompWifiSsid(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Password</label>
                      <input
                        type="text"
                        value={compWifiPass}
                        onChange={(e) => setCompWifiPass(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Advertised Speed</label>
                      <input
                        type="text"
                        value={compWifiSpeed}
                        onChange={(e) => setCompWifiSpeed(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Check-In / Check-Out */}
                  <div className="p-5 rounded-2xl bg-white border border-[#dde3db] space-y-3 shadow-sm">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 font-mono flex items-center gap-1.5">
                      <Clock size={14} /> Stay Policies
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#3a4a42]">Check-In Time</label>
                        <input
                          type="text"
                          value={compCheckIn}
                          onChange={(e) => setCompCheckIn(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#3a4a42]">Check-Out Time</label>
                        <input
                          type="text"
                          value={compCheckOut}
                          onChange={(e) => setCompCheckOut(e.target.value)}
                          className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Front Desk Phone</label>
                      <input
                        type="text"
                        value={compPhone}
                        onChange={(e) => setCompPhone(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Breakfast Settings */}
                  <div className="p-5 rounded-2xl bg-white border border-[#dde3db] space-y-3 shadow-sm">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 font-mono flex items-center gap-1.5">
                      <Coffee size={14} /> Breakfast Compendium
                    </h3>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Operating Hours</label>
                      <input
                        type="text"
                        value={compBreakfastHours}
                        onChange={(e) => setCompBreakfastHours(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Dining Location</label>
                      <input
                        type="text"
                        value={compBreakfastLocation}
                        onChange={(e) => setCompBreakfastLocation(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Standard Pricing</label>
                      <input
                        type="text"
                        value={compBreakfastPrice}
                        onChange={(e) => setCompBreakfastPrice(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-5 rounded-2xl bg-white border border-[#dde3db] space-y-3 shadow-sm">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 font-mono flex items-center gap-1.5">
                      <Building size={14} /> Property Identity
                    </h3>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Display Name</label>
                      <input
                        type="text"
                        value={compName}
                        onChange={(e) => setCompName(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Tagline</label>
                      <input
                        type="text"
                        value={compTagline}
                        onChange={(e) => setCompTagline(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Street Address</label>
                      <input
                        type="text"
                        value={compAddress}
                        onChange={(e) => setCompAddress(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
                  >
                    <Save size={14} />
                    <span>Save & Publish Changes</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* SECTION 6: DYNAMIC QR DEPLOYMENT STUDIO */}
        {activeSection === "qr-kit" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-transparent border border-[#dde3db] space-y-2">
              <h3 className="font-bold text-lg text-[#16211c]">Dynamic QR Deployment Studio</h3>
              <p className="text-xs text-[#5a6b62] max-w-2xl leading-relaxed">
                The printed QR code points to your live digital environment. Whenever you update Wi-Fi, menus, or deals in this dashboard, the guest’s companion reflects it immediately without reprinting.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* QR Customizer */}
              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <h4 className="font-bold text-sm text-[#16211c]">Generate Code</h4>

                <div>
                  <label className="block text-xs font-semibold text-[#5a6b62] mb-1.5">QR Target Type</label>
                  <select
                    value={qrTypeSelection}
                    onChange={(e) => setQrTypeSelection(e.target.value as any)}
                    className="w-full rounded-xl bg-[#f1f5f0] border border-[#dde3db] p-2.5 text-xs text-[#16211c] outline-none"
                  >
                    <option value="room">In-Room Desk Stand (Specific Room)</option>
                    <option value="lobby">Lobby Reception Stand (Property Wide)</option>
                    <option value="restaurant">Dining Table QR (In-Room Dining)</option>
                    <option value="emergency">Emergency Signage</option>
                  </select>
                </div>

                {qrTypeSelection === "room" && (
                  <div>
                    <label className="block text-xs font-semibold text-[#5a6b62] mb-1.5">Room Number</label>
                    <input
                      type="text"
                      value={qrRoomInput}
                      onChange={(e) => setQrRoomInput(e.target.value)}
                      placeholder="e.g. 508"
                      className="w-full rounded-xl bg-[#f1f5f0] border border-[#dde3db] p-2.5 text-xs text-[#16211c] outline-none"
                    />
                  </div>
                )}

                <div className="p-3 rounded-xl bg-white border border-[#e8ece4] space-y-1 text-xs text-[#5a6b62]">
                  <span className="block font-mono text-[10px] text-amber-600 uppercase">Guest URL — print this QR</span>
                  <span className="font-mono text-xs text-[#16211c] break-all">{guestQrUrl}</span>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      void navigator.clipboard.writeText(guestQrUrl);
                      toast.success("Guest link copied");
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#f1f5f0] text-xs font-bold"
                  >
                    Copy guest link
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(guestQrUrl, "_blank")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-all shadow"
                    >
                      <ExternalLink size={14} />
                      <span>Open as guest</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-2.5 rounded-xl bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#3a4a42] border border-[#dde3db] transition-all"
                    >
                      <Printer size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Physical Stand Mockup Preview */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-[#1d3025] to-[#24382d] border border-[#dde3db] flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                  Physical Stand Mockup · Premium Oak Finish
                </span>

                <div className="w-64 p-6 rounded-2xl bg-[#fdfbf7] text-stone-950 shadow-2xl border border-stone-200 flex flex-col items-center space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <img src="/logo-mark.png" alt="" className="w-5 h-5 object-contain rounded-md" />
                    <span>AirPal<span className="text-[#0050d8]">.me</span></span>
                  </div>

                  <div className="w-36 h-36 border-4 border-stone-950 rounded-2xl p-2.5 flex items-center justify-center bg-white shadow-inner overflow-hidden">
                    {qrImage ? (
                      <img src={qrImage} alt="Guest QR" className="w-full h-full object-contain" />
                    ) : (
                      <QrCode size={110} strokeWidth={1.5} className="text-stone-950" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[11px] font-mono uppercase font-bold tracking-wider text-amber-800">
                      {qrTypeSelection === "room" ? `Room ${qrRoomInput}` : property.name}
                    </span>
                    <strong className="block text-sm font-bold tracking-tight">
                      One Scan. Your Entire Stay.
                    </strong>
                    <span className="block text-[10px] text-stone-600 leading-snug">
                      Wi-Fi · In-Room Dining · Deals · Ask AirPal
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-400 max-w-sm">
                  Ready for wooden room stands, acrylic bedside displays, elevator cards, and keycard sleeves.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 7: GUEST DEMAND & SEARCH INTELLIGENCE */}
        {activeSection === "analytics" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <h3 className="font-bold text-base text-[#16211c]">Top Guest Inquiries & Searches</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { query: "Where can I get good Indian food nearby?", count: 142, category: "Dining" },
                    { query: "Can I get late checkout until 4 PM?", count: 118, category: "Upsell" },
                    { query: "What time does breakfast finish?", count: 94, category: "Compendium" },
                    { query: "How do I get to the Opera House?", count: 87, category: "Local" },
                    { query: "Extra towels and feather pillows", count: 64, category: "Housekeeping" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#f8faf7]">
                      <div>
                        <span className="text-[#16211c] font-medium">{row.query}</span>
                        <span className="block text-[10px] text-stone-400 font-mono">{row.category}</span>
                      </div>
                      <span className="font-bold text-amber-700 font-mono">{row.count} queries</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <h3 className="font-bold text-base text-[#16211c]">Peak Guest Scan Hours</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { time: "2:00 PM – 4:00 PM (Check-in Rush)", activity: "Wi-Fi, Room service, Air Conditioning" },
                    { time: "6:00 PM – 7:30 PM (Dinner & Sunset)", activity: "Dining menu, Rooftop bars, Sunset cruise deal" },
                    { time: "8:00 AM – 9:30 AM (Breakfast Rush)", activity: "Breakfast times, Luggage storage, Late checkout" },
                  ].map((row, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#f8faf7] space-y-1">
                      <strong className="block text-[#c57a32]">{row.time}</strong>
                      <span className="text-[11px] text-[#5a6b62]">{row.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "demo" && (
          <div className="max-w-xl animate-in fade-in">
            <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-3">
              <p className="text-xs text-[#5a6b62]">
                Optional sales sample. Opens the Harbour Hotel demo without changing this live property. Leave demo to return here.
              </p>
              <DemoEntryPanel compact />
            </div>
          </div>
        )}

        {/* MODAL 1: CREATE OR EDIT DEAL */}
        {showDealModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#dde3db] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#dde3db]">
                <h3 className="font-bold text-sm text-[#16211c]">
                  {editingDeal ? "Edit Deal / Upsell" : "Publish New Deal or Upsell"}
                </h3>
                <button
                  onClick={() => {
                    setShowDealModal(false);
                    setEditingDeal(null);
                  }}
                  className="text-stone-400 hover:text-stone-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveDeal} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Deal Title</label>
                  <input
                    type="text"
                    required
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    placeholder="e.g. VIP Guaranteed 4 PM Late Check-out"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Subtitle / Offer Description</label>
                  <input
                    type="text"
                    value={dealSubtitle}
                    onChange={(e) => setDealSubtitle(e.target.value)}
                    placeholder="Keep your room and shower before your evening flight."
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Special Price ($ AUD)</label>
                    <input
                      type="number"
                      required
                      value={dealPrice}
                      onChange={(e) => setDealPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Normal / Original Price ($)</label>
                    <input
                      type="number"
                      value={dealOriginalPrice}
                      onChange={(e) => setDealOriginalPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Promo Badge</label>
                    <input
                      type="text"
                      value={dealBadge}
                      onChange={(e) => setDealBadge(e.target.value)}
                      placeholder="Save $20, Best Seller, 30% Off"
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Category</label>
                    <select
                      value={dealCategory}
                      onChange={(e) => setDealCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    >
                      <option value="stay">Stay / Room Upgrade</option>
                      <option value="dining">Dining & Breakfast</option>
                      <option value="transport">Transport & Chauffeur</option>
                      <option value="wellness">Spa & Wellness</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowDealModal(false);
                      setEditingDeal(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-stone-950 shadow"
                  >
                    {editingDeal ? "Update Deal" : "Publish Deal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD OR EDIT DISH */}
        {showMenuModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#dde3db] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#dde3db]">
                <h3 className="font-bold text-sm text-[#16211c]">
                  {editingMenuItem ? "Edit In-Room Dining Dish" : "Add In-Room Dining Dish"}
                </h3>
                <button
                  onClick={() => {
                    setShowMenuModal(false);
                    setEditingMenuItem(null);
                  }}
                  className="text-stone-400 hover:text-stone-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveMenuItem} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    placeholder="e.g. Truffle Mushroom Gnocchi"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Category</label>
                    <select
                      value={menuCategory}
                      onChange={(e) => setMenuCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Mains">Mains</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Late Night">Late Night</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Price ($ AUD)</label>
                    <input
                      type="number"
                      required
                      value={menuPrice}
                      onChange={(e) => setMenuPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Description</label>
                  <textarea
                    rows={2}
                    value={menuDesc}
                    onChange={(e) => setMenuDesc(e.target.value)}
                    placeholder="Pan-seared potato gnocchi with forest mushrooms and aged parmesan..."
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Dietary Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={menuDietary}
                    onChange={(e) => setMenuDietary(e.target.value)}
                    placeholder="GF, Vegan, Halal, V"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenuModal(false);
                      setEditingMenuItem(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-stone-950 shadow"
                  >
                    {editingMenuItem ? "Update Dish" : "Save to Menu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: ADD LOCAL RECOMMENDATION */}
        {showPlaceModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#dde3db] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#dde3db]">
                <h3 className="font-bold text-sm text-[#16211c]">Add Local Recommendation</h3>
                <button
                  onClick={() => setShowPlaceModal(false)}
                  className="text-stone-400 hover:text-stone-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePlace} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Place / Experience Name</label>
                  <input
                    type="text"
                    required
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    placeholder="e.g. Edition Coffee Roasters"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Category</label>
                    <select
                      value={placeCategory}
                      onChange={(e) => setPlaceCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    >
                      <option value="Coffee">Coffee & Breakfast</option>
                      <option value="Food & Drink">Food & Dining</option>
                      <option value="Sights & Culture">Sights & Culture</option>
                      <option value="Nightlife">Nightlife & Bars</option>
                      <option value="Nature & Walks">Nature & Walks</option>
                      <option value="Family">Family Friendly</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Price Level</label>
                    <select
                      value={placePriceLevel}
                      onChange={(e) => setPlacePriceLevel(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    >
                      <option value="Free">Free</option>
                      <option value="$">$ (Budget friendly)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Upscale)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Walking Time</label>
                    <input
                      type="text"
                      required
                      value={placeWalkTime}
                      onChange={(e) => setPlaceWalkTime(e.target.value)}
                      placeholder="4 min walk"
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Distance</label>
                    <input
                      type="text"
                      required
                      value={placeDistance}
                      onChange={(e) => setPlaceDistance(e.target.value)}
                      placeholder="350m"
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Rating (★)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      required
                      value={placeRating}
                      onChange={(e) => setPlaceRating(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Address / Location</label>
                  <input
                    type="text"
                    required
                    value={placeAddress}
                    onChange={(e) => setPlaceAddress(e.target.value)}
                    placeholder="60 Darling Drive, Haymarket"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Host Recommendation Note / Why Go</label>
                  <textarea
                    rows={2}
                    required
                    value={placeWhyGo}
                    onChange={(e) => setPlaceWhyGo(e.target.value)}
                    placeholder="Japanese-inspired Nordic cafe. Try the soufflé pancakes and pour-over coffee."
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="staffPick"
                    checked={placeStaffPick}
                    onChange={(e) => setPlaceStaffPick(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-400"
                  />
                  <label htmlFor="staffPick" className="font-semibold text-stone-700 cursor-pointer">
                    Feature as Staff Favorite / Top Host Pick
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPlaceModal(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 font-bold text-white shadow"
                  >
                    Add to Local Guide
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: ADD OR EDIT HOTEL FACILITY / AMENITY */}
        {showFacilityModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#dde3db] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#dde3db]">
                <h3 className="font-bold text-sm text-[#16211c]">
                  {editingFacility ? "Edit Hotel Facility / Amenity" : "Add Hotel Facility / Amenity"}
                </h3>
                <button
                  onClick={() => {
                    setShowFacilityModal(false);
                    setEditingFacility(null);
                  }}
                  className="text-stone-400 hover:text-stone-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveFacility} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Amenity / Facility Name</label>
                  <input
                    type="text"
                    required
                    value={facName}
                    onChange={(e) => setFacName(e.target.value)}
                    placeholder="e.g. Heated Infinity Pool & Cabanas or 24/7 Technogym"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Category Icon</label>
                    <select
                      value={facIcon}
                      onChange={(e) => setFacIcon(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    >
                      <option value="Waves">🏊‍♂️ Swimming Pool & Beach</option>
                      <option value="Dumbbell">🏋️‍♂️ Gym & Fitness Centre</option>
                      <option value="Sparkles">🧖‍♀️ Day Spa, Sauna & Wellness</option>
                      <option value="Wine">🍸 Bar, Cellar & Lounge</option>
                      <option value="Coffee">☕ Cafe & Breakfast</option>
                      <option value="Utensils">🍽️ Restaurant & Dining</option>
                      <option value="Car">🚗 Valet Parking & EV Charging</option>
                      <option value="Shirt">🧺 Laundry & Steamer Suite</option>
                      <option value="Luggage">🧳 Luggage Storage & Concierge</option>
                      <option value="Wifi">💻 Business Lounge & Co-working</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Floor / Location</label>
                    <input
                      type="text"
                      required
                      value={facFloor}
                      onChange={(e) => setFacFloor(e.target.value)}
                      placeholder="e.g. Level 7 Rooftop, Level 2, Ground Floor"
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Operating Hours</label>
                  <input
                    type="text"
                    required
                    value={facHours}
                    onChange={(e) => setFacHours(e.target.value)}
                    placeholder="e.g. 6:00 AM – 10:00 PM or 24 Hours (Keycard Access)"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Guest Guidelines / Details</label>
                  <textarea
                    rows={2}
                    required
                    value={facDetails}
                    onChange={(e) => setFacDetails(e.target.value)}
                    placeholder="Heated water, luxury sun loungers, towel service & panoramic harbour skyline views."
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFacilityModal(false);
                      setEditingFacility(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-stone-950 shadow"
                  >
                    {editingFacility ? "Update Facility" : "Save Facility"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 5: ADD OR EDIT ROOM TYPE / SUITE */}
        {showRoomModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#dde3db] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#dde3db]">
                <h3 className="font-bold text-sm text-[#16211c]">
                  {editingRoomType ? "Edit Room Category" : "Add Room Category / Suite"}
                </h3>
                <button
                  onClick={() => {
                    setShowRoomModal(false);
                    setEditingRoomType(null);
                  }}
                  className="text-stone-400 hover:text-stone-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveRoomType} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Room Category / Name</label>
                  <input
                    type="text"
                    required
                    value={rtName}
                    onChange={(e) => setRtName(e.target.value)}
                    placeholder="e.g. Deluxe King Harbour View or Executive Sanctuary Suite"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Tier / Classification</label>
                    <select
                      value={rtCategory}
                      onChange={(e) => setRtCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Villa">Villa / Cottage</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Allocated Keys (Count)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={rtTotalRooms}
                      onChange={(e) => setRtTotalRooms(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Bedding</label>
                    <input
                      type="text"
                      required
                      value={rtBedConfig}
                      onChange={(e) => setRtBedConfig(e.target.value)}
                      placeholder="1 King Bed"
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Size (m²)</label>
                    <input
                      type="number"
                      required
                      value={rtSizeSqm}
                      onChange={(e) => setRtSizeSqm(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Capacity</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={10}
                      value={rtCapacity}
                      onChange={(e) => setRtCapacity(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Standard / Starting Rate ($ AUD / night)</label>
                  <input
                    type="number"
                    required
                    value={rtStartingPrice}
                    onChange={(e) => setRtStartingPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Room Inclusions & Features (comma-separated)</label>
                  <textarea
                    rows={2}
                    value={rtFeatures}
                    onChange={(e) => setRtFeatures(e.target.value)}
                    placeholder="Harbour View, Rain Shower, Nespresso Machine, Smart TV, Bathrobes"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-stone-700">Room Numbers (comma-separated)</label>
                    <span className="text-[10px] font-mono text-stone-400">Used for QR stands & in-room companion</span>
                  </div>
                  <input
                    type="text"
                    value={rtRoomNumbers}
                    onChange={(e) => setRtRoomNumbers(e.target.value)}
                    placeholder="e.g. 101, 102, 103, 104, 105, 201, 202, 203"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono text-xs text-[#16211c]"
                  />
                  <span className="text-[10px] text-stone-500 block">
                    Guests visiting /stay?room=... with these numbers will automatically bind to this category & folio.
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoomModal(false);
                      setEditingRoomType(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-stone-950 shadow"
                  >
                    {editingRoomType ? "Update Room Type" : "Save Room Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
