import React, { useEffect, useState } from "react";
import { useAirPal } from "../contexts/AirPalContext";
import {
  Wifi,
  Sparkles,
  MapPin,
  Compass,
  Utensils,
  BellRing,
  Bell,
  ChevronRight,
  Star,
  ShieldAlert,
  CalendarDays,
  Coffee,
  Heart,
  PhoneCall,
  Check,
  ArrowRight,
  Sun,
  CloudRain,
  BedDouble,
  Waves,
  Dumbbell,
  Wine,
  Luggage,
  Shirt,
  Car,
  Train,
  Bus,
  DoorOpen,
  ChevronDown,
  Key,
} from "lucide-react";
import { WifiCardModal } from "../components/companion/WifiCardModal";
import { WhatToDoNowModal } from "../components/companion/WhatToDoNowModal";
import { AskAirPalDrawer } from "../components/companion/AskAirPalDrawer";
import { TripModeModal } from "../components/companion/TripModeModal";
import { InRoomDiningModal } from "../components/companion/InRoomDiningModal";
import { SafetyModal } from "../components/companion/SafetyModal";
import { StaffRequestModal } from "../components/companion/StaffRequestModal";
import { GuestNotificationsModal } from "../components/companion/GuestNotificationsModal";
import { RoomPickerModal } from "../components/companion/RoomPickerModal";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { HOTEL_EVENTS, TRANSPORT_OPTIONS } from "../../../shared/airpal-data";
import { isSeededProperty } from "../lib/airpal-backend";
import { DeviceStage } from "../components/os/DeviceStage";

export const GuestCompanion: React.FC<{ bare?: boolean }> = ({ bare = false }) => {
  const [, setLocation] = useLocation();
  const {
    property,
    roomNumber,
    guestName,
    qrType,
    deviceMode,
    weather,
    familyMode,
    seniorMode,
    t,
    places,
    experiences,
    activeUpsells,
    purchaseUpsell,
    savedPlaces,
    toggleSavePlace,
    trackEvent,
    upsells,
    unreadNotificationCount,
  } = useAirPal();
  const seededStay = isSeededProperty(property.id);
  const stayOffer = upsells.find((item) => item.category === "stay") || upsells[0];

  const [activeTab, setActiveTab] = useState<"stay" | "discover" | "experiences" | "services">("stay");
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [whatToDoModalOpen, setWhatToDoModalOpen] = useState(false);
  const [askAirPalOpen, setAskAirPalOpen] = useState(false);
  const [tripModeOpen, setTripModeOpen] = useState(false);
  const [diningModalOpen, setDiningModalOpen] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [placeCategory, setPlaceCategory] = useState<string>("All");

  const currentRoomType = property.roomTypes?.find((rt) =>
    rt.roomNumbers?.includes(roomNumber)
  );

  useEffect(() => {
    if (qrType === "emergency") setSafetyModalOpen(true);
    if (qrType === "dining") setDiningModalOpen(true);
    if (qrType === "experience") setActiveTab("experiences");
    trackEvent("qr_scan", { qrType, roomNumber });
    const open = new URLSearchParams(window.location.search).get("open");
    if (open === "trip") setTripModeOpen(true);
    if (open === "ask") setAskAirPalOpen(true);
  }, [qrType, roomNumber, trackEvent]);

  useEffect(() => {
    if (familyMode && placeCategory === "Nightlife") setPlaceCategory("All");
  }, [familyMode, placeCategory]);

  const scanLabel =
    qrType === "room"
      ? `Room ${roomNumber}`
      : qrType === "property"
        ? "Lobby"
        : qrType === "dining"
          ? "Restaurant"
          : qrType === "experience"
            ? "Experience"
            : "Safety";

  const filteredPlaces = places.filter((p) => {
    if (familyMode && p.category === "Nightlife") return false;
    if (placeCategory === "All") return true;
    return p.category === placeCategory;
  });

  const nowLabel = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const content = (
    <div className={`relative h-full min-h-0 flex flex-col overflow-hidden bg-[#f9f8f4] text-[#16211c] ${seniorMode ? "text-base" : "text-sm"}`}>
      <div className="guest-scroll flex-1 px-5 pt-5 pb-16 space-y-5">
        <section>
          <div className="flex items-center justify-between gap-2">
            <p className="ap-kicker">
              {guestName && guestName !== "Guest" ? `${t("welcome")}, ${guestName}` : t("welcome")}
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRoomModalOpen(true)}
                className="px-2.5 py-1 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
                title="Active Room Key - tap to view or switch room"
              >
                <DoorOpen size={13} className="text-amber-800" />
                <span>Room {roomNumber}</span>
                <ChevronDown size={11} className="text-amber-700 opacity-70" />
              </button>
              <span className="flex items-center gap-1 text-[11px] text-[#7a877f] px-1.5">
                {weather === "rainy" ? <CloudRain size={12} className="text-[#1d6aa5]" /> : <Sun size={12} className="text-[#c57a32]" />}
                {weather === "rainy" ? "18°" : "24°"}
              </span>
              <button
                onClick={() => setNotificationsOpen(true)}
                className="relative p-1.5 rounded-xl bg-white border border-[#dde3db] text-stone-700 hover:text-stone-950 transition-all shadow-xs active:scale-95"
                title="Room Activity & Notifications"
              >
                <Bell size={13} />
                {unreadNotificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-mono font-bold grid place-items-center animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            </div>
          </div>
          <h1 className={`ap-display leading-[1.05] mt-1 ${seniorMode ? "text-[34px]" : "text-[28px]"}`}>
            {property.name}
          </h1>
          <p className="text-xs text-[#7a877f] mt-1">{property.tagline}</p>

          {/* Prominent Active Room Status Banner */}
          <div className="mt-3 flex items-center justify-between p-2.5 px-3 rounded-2xl bg-white/95 border border-amber-200/90 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="text-left truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wider font-mono text-stone-500 font-semibold">Active Guest Key:</span>
                  <strong className="text-xs font-mono font-extrabold text-[#16211c]">Room {roomNumber}</strong>
                  {currentRoomType && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-mono text-[9px] font-bold">
                      {currentRoomType.category}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-stone-500 block leading-tight truncate">
                  {currentRoomType ? currentRoomType.name : "Sanctuary Guest Key"} · Direct Folio & Staff Connected
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRoomModalOpen(true)}
              className="shrink-0 px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-[11px] transition-colors border border-amber-300/70 shadow-2xs active:scale-95"
            >
              Switch Room
            </button>
          </div>
        </section>

        <section className="grid grid-cols-4 gap-2">
          {[
            { label: "Wi-Fi", icon: Wifi, tone: "bg-[#f8e4c8] text-[#c57a32]", onClick: () => setWifiModalOpen(true) },
            { label: "Food", icon: Utensils, tone: "bg-[#dceee4] text-[#2d7a55]", onClick: () => setDiningModalOpen(true) },
            { label: "Staff", icon: BellRing, tone: "bg-[#ece4f6] text-[#6b46a5]", onClick: () => setStaffModalOpen(true) },
            { label: "Help", icon: ShieldAlert, tone: "bg-[#fadad6] text-[#b42318]", onClick: () => setSafetyModalOpen(true) },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex flex-col items-center justify-center min-w-0 py-3 rounded-2xl ap-card active:scale-95"
              >
                <div className={`grid place-items-center w-10 h-10 rounded-2xl mb-1.5 ${action.tone}`}>
                  <Icon size={17} />
                </div>
                <span className="text-[11px] font-medium">{action.label}</span>
              </button>
            );
          })}
        </section>

        <section className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#fde9c8] via-[#fff8ee] to-[#e5f3ea] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="ap-kicker">Right now · {nowLabel}</p>
              <h2 className={`ap-display leading-tight mt-1 ${seniorMode ? "text-2xl" : "text-[22px]"}`}>
                {t("whatToDoNow")}
              </h2>
            </div>
          </div>
          <p className="text-xs text-[#5a6b62] mt-2 mb-4 leading-relaxed">
            {seededStay
              ? "Three walks from the door, matched to time and weather."
              : "Ask AirPal, open Wi-Fi, or request staff — this stay is live from the QR."}
          </p>
          <button
            onClick={() => {
              trackEvent("what_to_do_now_open");
              setWhatToDoModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#18271f] text-[#fffdf8] font-semibold text-sm"
          >
            See options <ArrowRight size={15} />
          </button>
        </section>

        <section
          onClick={() => setAskAirPalOpen(true)}
          className="ap-card p-3.5 flex items-center justify-between gap-3 cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-[#24180d]">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="block text-sm font-semibold">{t("askAirPal")}</span>
              <span className="text-[11px] text-[#7a877f]">Indian food · late checkout · A/C</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#7a877f]" />
        </section>

        <div className="flex rounded-full bg-white border border-[#e3e9e1] p-1 text-[11px]">
          {[
            { id: "stay", label: "Stay", icon: BedDouble },
            { id: "discover", label: "Local", icon: MapPin },
            { id: "experiences", label: "Tours", icon: CalendarDays },
            { id: "services", label: "Hotel", icon: BellRing },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 min-w-0 flex items-center justify-center gap-1 py-2 rounded-xl transition-all font-medium ${
                  activeTab === tab.id
                    ? "bg-[#18271f] text-[#fffdf8] font-semibold shadow-sm"
                    : "text-[#7a877f] hover:text-[#16211c]"
                }`}
              >
                <Icon size={13} className="shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "stay" && (
          <section className="space-y-4 animate-in fade-in">
            <div className="rounded-2xl bg-white border border-[#dde3db] p-4 space-y-3 shadow-[0_8px_18px_#5d765b0d]">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#e8ece4]">
                <div className="flex items-center gap-2">
                  <Coffee size={16} className="text-[#c57a32]" />
                  <strong className="text-sm text-[#16211c]">{property.breakfast.type || "Breakfast"}</strong>
                </div>
                <span className="text-xs font-mono text-[#c57a32]">{property.breakfast.hours}</span>
              </div>
              <p className="text-xs text-[#5a6b62]">
                {property.breakfast.type} served at {property.breakfast.location}.
              </p>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#7a877f]">{property.breakfast.price}</span>
                {seededStay && (
                <button
                  onClick={() => purchaseUpsell("up_breakfast")}
                  className="px-3 py-1.5 rounded-xl bg-[#f8e4c8] hover:bg-amber-400 text-[#c57a32] hover:text-[#24180d] font-semibold text-xs transition-all"
                >
                  Pre-Book ($22)
                </button>
                )}
              </div>
            </div>

            {stayOffer && (
            <div className="rounded-2xl bg-gradient-to-r from-[#fff4e4] to-[#eef6f0] border border-[#f0d4a8] p-4 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-[#c57a32] font-bold">{stayOffer.badge}</span>
                <h4 className="text-sm font-bold text-[#16211c]">{stayOffer.title}</h4>
                <span className="text-xs text-[#5a6b62]">{stayOffer.subtitle}</span>
              </div>
              <button
                onClick={() => purchaseUpsell(stayOffer.id)}
                disabled={activeUpsells.includes(stayOffer.id)}
                className="px-4 py-2 rounded-xl bg-[#18271f] hover:bg-[#284236] active:scale-95 disabled:opacity-60 text-[#fffdf8] font-bold text-xs whitespace-nowrap transition-all"
              >
                {activeUpsells.includes(stayOffer.id) ? "Added to Room" : `Add for $${stayOffer.price}`}
              </button>
            </div>
            )}

            <div>
              <h3 className="text-xs font-semibold text-[#7a877f] uppercase tracking-wider mb-2.5">Hotel Facilities & Hours</h3>
              <div className="space-y-2">
                {property.facilities.map((fac, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white border border-[#dde3db] flex items-start gap-3">
                    <div className="grid place-items-center w-8 h-8 rounded-xl bg-[#e7f0ec] text-[#c57a32] flex-shrink-0 mt-0.5">
                      {fac.icon === "Waves" && <Waves size={16} />}
                      {fac.icon === "Dumbbell" && <Dumbbell size={16} />}
                      {fac.icon === "Wine" && <Wine size={16} />}
                      {fac.icon === "Luggage" && <Luggage size={16} />}
                      {fac.icon === "Shirt" && <Shirt size={16} />}
                      {fac.icon === "Sparkles" && <Sparkles size={16} />}
                      {fac.icon === "Coffee" && <Coffee size={16} />}
                      {fac.icon === "Utensils" && <Utensils size={16} />}
                      {fac.icon === "Car" && <Car size={16} />}
                      {fac.icon === "Wifi" && <Wifi size={16} />}
                      {fac.icon === "BedDouble" && <BedDouble size={16} />}
                      {!["Waves", "Dumbbell", "Wine", "Luggage", "Shirt", "Sparkles", "Coffee", "Utensils", "Car", "Wifi", "BedDouble"].includes(fac.icon) && <Sparkles size={16} />}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-semibold text-[#16211c]">{fac.name}</strong>
                        <span className="text-[10px] font-mono text-[#c57a32]">{fac.floor}</span>
                      </div>
                      <span className="block text-[11px] text-[#7a877f] font-mono">{fac.hours}</span>
                      <p className="text-[11px] text-[#5a6b62] pt-0.5">{fac.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {seededStay && (
            <div>
              <h3 className="text-xs font-semibold text-[#7a877f] uppercase tracking-wider mb-2.5">Getting around</h3>
              <div className="space-y-2">
                {TRANSPORT_OPTIONS.map((option) => (
                  <div key={option.id} className="p-3.5 rounded-2xl bg-white border border-[#dde3db] flex items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="grid place-items-center w-8 h-8 rounded-xl bg-[#e7f0ec] text-[#2d7a55]">
                        {option.id === "train" || option.id === "ferry" ? <Train size={16} /> : <Bus size={16} />}
                      </div>
                      <div>
                        <strong className="block text-xs text-[#16211c]">{option.title}</strong>
                        <span className="text-[11px] text-[#5a6b62]">{option.detail}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toast.success(option.action, { description: option.detail })}
                      className="text-[11px] font-semibold text-[#c57a32] whitespace-nowrap"
                    >
                      {option.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            )}
          </section>
        )}

        {activeTab === "discover" && (
          <section className="space-y-4 animate-in fade-in">
            {familyMode && (
              <div className="rounded-xl bg-[#e7f4ec] border border-[#cfe6da] px-3 py-2 text-[11px] text-[#2d7a55]">
                Family mode is on — nightlife is hidden, and walks, culture, and food stay front and centre.
              </div>
            )}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              {["All", "Food & Drink", "Coffee", "Nature & Walks", "Sights & Culture", ...(familyMode ? [] : ["Nightlife"])].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPlaceCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                    placeCategory === cat
                      ? "bg-[#18271f] text-[#fffdf8] font-semibold border-[#18271f]"
                      : "bg-white border-[#dde3db] text-[#5a6b62] hover:bg-[#f3f6f1]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredPlaces.length === 0 && (
                <div className="rounded-2xl bg-white border border-[#dde3db] p-4 text-xs text-[#5a6b62]">
                  {places.length === 0
                    ? "No local places yet. The host can add them from the dashboard."
                    : "No places in this category right now. Try another filter or turn off Family mode."}
                </div>
              )}
              {filteredPlaces.map((place) => {
                const isSaved = savedPlaces.includes(place.id);
                return (
                  <article key={place.id} className="rounded-2xl bg-white border border-[#dde3db] p-4 space-y-2 hover:border-[#f0d4a8] transition-all shadow-[0_8px_18px_#5d765b0d]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#16211c]">{place.name}</h4>
                          {place.badge && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f8e4c8] text-[#c57a32] border border-[#f0d4a8] font-medium">
                              {place.badge}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-[#7a877f] mt-0.5">
                          <span className="text-[#c57a32] font-semibold">{place.priceLevel}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-[#c57a32] font-medium">
                            <Star size={11} fill="currentColor" /> {place.rating}
                          </span>
                          <span>·</span>
                          <span>{place.walkTime} ({place.distance})</span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSavePlace(place.id)}
                        className={`p-2 rounded-xl transition-all ${isSaved ? "bg-[#f8e4c8] text-[#c57a32]" : "bg-[#f3f6f1] text-[#7a877f] hover:text-[#16211c]"}`}
                      >
                        <Heart size={15} fill={isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-[#f7f5ef] border border-[#eee6d8] space-y-1">
                      <span className="block text-[10px] font-mono tracking-wider uppercase text-[#c57a32] font-semibold">
                        Why should I go here?
                      </span>
                      <p className="text-xs text-[#3a4a42] leading-relaxed">{place.whyGo}</p>
                    </div>
                    {place.staffNote && (
                      <div className="text-[11px] text-[#2d7a55] bg-[#e7f4ec] border border-[#cfe6da] rounded-xl px-3 py-2 flex items-center gap-2">
                        <Sparkles size={12} className="flex-shrink-0" />
                        <span><strong>Staff tip:</strong> {place.staffNote}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-[#7a877f]">{place.address}</span>
                      <button
                        onClick={() => toast.success("Walking Directions Opened", { description: `Navigating to ${place.name} (${place.walkTime}).` })}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#f8e4c8] hover:bg-amber-400 text-[#c57a32] hover:text-[#24180d] font-semibold text-xs transition-all"
                      >
                        <MapPin size={12} />
                        <span>Start Route</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "experiences" && (
          <section className="space-y-4 animate-in fade-in">
            {seededStay && (
            <button
              onClick={() => setLocation("/tour/rocks-harbour")}
              className="w-full text-left rounded-[1.35rem] bg-gradient-to-br from-[#18271f] to-[#2a4036] text-[#fffdf8] p-4"
            >
              <span className="ap-kicker text-amber-300">Self-guided · no app</span>
              <h3 className="ap-display text-xl mt-1">The Rocks to the sails</h3>
              <p className="text-xs text-white/75 mt-1">90 min · 2.4 km · map, voice, and a share link like FreeGuides.</p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold">Start the walk <ArrowRight size={14} /></span>
            </button>
            )}
            {seededStay && (
            <button onClick={() => setLocation("/u/harbour-hotel")} className="w-full text-left ap-card p-3.5 text-xs">
              <span className="ap-kicker">Hotel profile</span>
              <strong className="block mt-0.5">Harbour Hotel on AirPal</strong>
              <span className="text-[11px] text-[#7a877f]">All walks from this stay · shareable QR</span>
            </button>
            )}
            <div className="rounded-2xl bg-gradient-to-r from-[#fff4e4] via-[#eef6f0] to-transparent border border-[#dde3db] p-4 space-y-1">
              <h3 className="font-bold text-sm text-[#16211c]">{seededStay ? "Curated Sydney Experiences" : "Experiences from this stay"}</h3>
              <p className="text-xs text-[#5a6b62]">
                {seededStay
                  ? "Direct booking with hotel concierge partner rates and guaranteed availability."
                  : "Add walks and offers in the host dashboard. Guests see them here after they scan."}
              </p>
            </div>
            {seededStay && (
            <>
            <div className="space-y-2">
              {HOTEL_EVENTS.map((event) => (
                <div key={event.id} className="p-3.5 rounded-2xl bg-white border border-[#dde3db] flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#c57a32] w-16">{event.time}</span>
                  <div className="flex-1">
                    <strong className="block text-xs text-[#16211c]">{event.title}</strong>
                    <span className="text-[11px] text-[#5a6b62]">{event.detail}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#2d7a55]">{event.price}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <article key={exp.id} className="rounded-2xl bg-white border border-[#dde3db] p-4 space-y-3 hover:border-[#f0d4a8] transition-all shadow-[0_8px_18px_#5d765b0d]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider uppercase text-[#c57a32]">{exp.category} · {exp.duration}</span>
                      <h4 className="font-bold text-base text-[#16211c] mt-0.5">{exp.title}</h4>
                      <span className="text-[11px] text-[#7a877f]">{exp.provider}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="block text-base font-bold font-mono text-[#c57a32]">${exp.price}</span>
                      <span className="text-[10px] font-mono text-[#2d7a55]">{exp.spotsLeft} spots left</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#5a6b62] leading-relaxed">{exp.description}</p>
                  <div className="flex flex-wrap gap-1.5 text-[11px] text-[#5a6b62]">
                    {exp.included.map((inc) => (
                      <span key={inc} className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#f3f6f1]">
                        <Check size={10} className="text-[#2d7a55]" /> {inc}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      trackEvent("experience_booked", { experienceId: exp.id, amount: exp.price });
                      toast.success("Experience Reserved", { description: `${exp.title} booked for Room ${roomNumber}. Concierge voucher issued.` });
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#18271f] hover:bg-[#284236] active:scale-98 text-[#fffdf8] font-bold text-xs transition-all"
                  >
                    Reserve for ${exp.price} AUD
                  </button>
                </article>
              ))}
            </div>
            </>
            )}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-[#7a877f] uppercase tracking-wider mb-2.5">Hotel Add-Ons & Folio Upgrades</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {upsells.map((up) => {
                  const purchased = activeUpsells.includes(up.id);
                  return (
                    <div key={up.id} className="p-3.5 rounded-2xl bg-white border border-[#dde3db] flex flex-col justify-between space-y-2">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#f8e4c8] text-[#c57a32]">{up.badge}</span>
                          <span className="font-mono font-bold text-[#16211c] text-xs">${up.price}</span>
                        </div>
                        <strong className="block text-xs font-semibold text-[#16211c] mt-1.5">{up.title}</strong>
                        <p className="text-[11px] text-[#7a877f] mt-0.5 leading-snug">{up.subtitle}</p>
                      </div>
                      <button
                        onClick={() => purchaseUpsell(up.id)}
                        disabled={purchased}
                        className="w-full py-1.5 rounded-xl bg-[#f3f6f1] hover:bg-[#18271f] hover:text-[#fffdf8] active:scale-95 disabled:opacity-60 text-xs font-semibold text-[#3a4a42] transition-all border border-[#dde3db]"
                      >
                        {purchased ? "✓ Added to Room Folio" : "Add to Stay"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {activeTab === "services" && (
          <section className="space-y-4 animate-in fade-in">
            <div className="rounded-2xl bg-white border border-[#dde3db] p-4 space-y-3 shadow-[0_8px_18px_#5d765b0d]">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[#16211c]">Instant Service Requests</h3>
                <span className="text-[10px] font-mono text-[#2d7a55]">Room {roomNumber}</span>
              </div>
              <p className="text-xs text-[#5a6b62]">
                Technology should reduce repetitive interactions, not destroy hospitality. Front desk and housekeeping stay one tap away.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                {[
                  { title: "Extra Towels & Pillows", hint: "Delivered within 15 min" },
                  { title: "Maintenance Request", hint: "A/C, plumbing, power" },
                  { title: "Luggage Assistance", hint: "Storage & bellhop" },
                  { title: "Room Change Request", hint: "Front desk transfer" },
                ].map((item) => (
                  <button
                    key={item.title}
                    onClick={() => setStaffModalOpen(true)}
                    className="p-3 rounded-xl bg-[#f7faf6] hover:bg-[#eef3ed] border border-[#dde3db] text-left transition-all active:scale-98"
                  >
                    <strong className="block text-[#c57a32]">{item.title}</strong>
                    <span className="text-[10px] text-[#7a877f]">{item.hint}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white border border-[#dde3db] p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#7a877f]">Prefer speaking to a human?</span>
                <strong className="block text-sm text-[#16211c]">Call Front Desk Directly</strong>
                <span className="text-xs font-mono text-[#c57a32]">{property.phone}</span>
              </div>
              <a
                href={`tel:${property.phone}`}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#18271f] hover:bg-[#284236] active:scale-95 text-[#fffdf8] font-bold text-xs transition-all"
              >
                <PhoneCall size={14} />
                <span>Call Now</span>
              </a>
            </div>
          </section>
        )}
      </div>

      {!bare && <nav className="ap-tabbar shrink-0 z-30 py-2 px-3 pb-[max(0.7rem,env(safe-area-inset-bottom))] flex items-center justify-around text-[10px] text-[#7a877f]">
        <button onClick={() => setActiveTab("stay")} className={`flex flex-col items-center gap-1 min-w-[52px] ${activeTab === "stay" ? "text-[#18271f] font-semibold" : ""}`}>
          <span className={`grid place-items-center w-10 h-8 rounded-full ${activeTab === "stay" ? "bg-amber-400/90 text-stone-950" : ""}`}><BedDouble size={17} /></span>
          Stay
        </button>
        <button onClick={() => setActiveTab("discover")} className={`flex flex-col items-center gap-1 min-w-[52px] ${activeTab === "discover" ? "text-[#18271f] font-semibold" : ""}`}>
          <span className={`grid place-items-center w-10 h-8 rounded-full ${activeTab === "discover" ? "bg-amber-400/90 text-stone-950" : ""}`}><MapPin size={17} /></span>
          Local
        </button>
        <button onClick={() => setAskAirPalOpen(true)} className="flex flex-col items-center gap-1 min-w-[52px] -mt-3">
          <span className="grid place-items-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-[#24180d] shadow-[0_10px_20px_#e8a84a44]">
            <Sparkles size={20} />
          </span>
          <span className="font-semibold text-[#18271f]">Ask</span>
        </button>
        <button onClick={() => setTripModeOpen(true)} className="flex flex-col items-center gap-1 min-w-[52px]">
          <span className="grid place-items-center w-10 h-8 rounded-full"><Compass size={17} /></span>
          Trip
        </button>
        <button onClick={() => setActiveTab("services")} className={`flex flex-col items-center gap-1 min-w-[52px] ${activeTab === "services" ? "text-[#18271f] font-semibold" : ""}`}>
          <span className={`grid place-items-center w-10 h-8 rounded-full ${activeTab === "services" ? "bg-amber-400/90 text-stone-950" : ""}`}><BellRing size={17} /></span>
          Hotel
        </button>
      </nav>}

      <WifiCardModal isOpen={wifiModalOpen} onClose={() => setWifiModalOpen(false)} />
      <WhatToDoNowModal isOpen={whatToDoModalOpen} onClose={() => setWhatToDoModalOpen(false)} onOpenTripMode={() => setTripModeOpen(true)} />
      <AskAirPalDrawer
        isOpen={askAirPalOpen}
        onClose={() => setAskAirPalOpen(false)}
        onOpenTripMode={() => setTripModeOpen(true)}
        onOpenDining={() => setDiningModalOpen(true)}
        onOpenStaffRequest={() => setStaffModalOpen(true)}
      />
      <TripModeModal isOpen={tripModeOpen} onClose={() => setTripModeOpen(false)} />
      <InRoomDiningModal isOpen={diningModalOpen} onClose={() => setDiningModalOpen(false)} />
      <SafetyModal isOpen={safetyModalOpen} onClose={() => setSafetyModalOpen(false)} />
      <StaffRequestModal isOpen={staffModalOpen} onClose={() => setStaffModalOpen(false)} />
      <GuestNotificationsModal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onOpenDining={() => setDiningModalOpen(true)}
        onOpenStaff={() => setStaffModalOpen(true)}
        onOpenWifi={() => setWifiModalOpen(true)}
      />
      <RoomPickerModal isOpen={roomModalOpen} onClose={() => setRoomModalOpen(false)} />
    </div>
  );

  if (bare) return content;
  return <DeviceStage mode={deviceMode}>{content}</DeviceStage>;
};
