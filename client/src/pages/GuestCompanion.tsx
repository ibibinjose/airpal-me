import React, { useEffect, useState } from "react";
import { useAirPal } from "../contexts/AirPalContext";
import {
  Wifi,
  Sparkles,
  MapPin,
  Compass,
  Utensils,
  BellRing,
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
  Train,
  Bus,
} from "lucide-react";
import { WifiCardModal } from "../components/companion/WifiCardModal";
import { WhatToDoNowModal } from "../components/companion/WhatToDoNowModal";
import { AskAirPalDrawer } from "../components/companion/AskAirPalDrawer";
import { TripModeModal } from "../components/companion/TripModeModal";
import { InRoomDiningModal } from "../components/companion/InRoomDiningModal";
import { SafetyModal } from "../components/companion/SafetyModal";
import { StaffRequestModal } from "../components/companion/StaffRequestModal";
import { toast } from "sonner";
import { HOTEL_EVENTS, TRANSPORT_OPTIONS } from "../../../shared/airpal-data";

export const GuestCompanion: React.FC = () => {
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
    upsells,
    activeUpsells,
    purchaseUpsell,
    savedPlaces,
    toggleSavePlace,
    trackEvent,
  } = useAirPal();

  const [activeTab, setActiveTab] = useState<"stay" | "discover" | "experiences" | "services">("stay");
  const [wifiModalOpen, setWifiModalOpen] = useState(false);
  const [whatToDoModalOpen, setWhatToDoModalOpen] = useState(false);
  const [askAirPalOpen, setAskAirPalOpen] = useState(false);
  const [tripModeOpen, setTripModeOpen] = useState(false);
  const [diningModalOpen, setDiningModalOpen] = useState(false);
  const [safetyModalOpen, setSafetyModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [placeCategory, setPlaceCategory] = useState<string>("All");

  useEffect(() => {
    if (qrType === "emergency") setSafetyModalOpen(true);
    if (qrType === "dining") setDiningModalOpen(true);
    if (qrType === "experience") setActiveTab("experiences");
    trackEvent("qr_scan", { qrType, roomNumber });
  }, [qrType, roomNumber, trackEvent]);

  const filteredPlaces = places.filter((p) => {
    if (familyMode && p.category !== "Family" && p.category !== "Nature & Walks" && p.category !== "Sights & Culture") {
      return false;
    }
    if (placeCategory === "All") return true;
    return p.category === placeCategory;
  });

  const nowLabel = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const content = (
    <div className={`relative min-h-full flex flex-col bg-[#f9f8f4] text-[#16211c] ${seniorMode ? "text-base" : "text-sm"} select-none`}>
      <div className="bg-gradient-to-r from-[#fbe8d0] via-[#e7f3ec] to-[#fbe8d0] px-4 py-2 border-b border-[#dde3db] flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[#5a6b62]">{property.name}</span>
          <span className="text-[#16211c] font-semibold">· Room {roomNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          {weather === "rainy" ? (
            <span className="flex items-center gap-1 text-[#1d6aa5] font-mono">
              <CloudRain size={12} /> Rain 18°C
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[#c57a32] font-mono">
              <Sun size={12} /> Sunny 24°C
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-28 px-4 pt-4 space-y-5">
        <section className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono tracking-wider uppercase text-[#c57a32]">
              {t("welcome")}, {guestName}
            </span>
            <span className="text-[11px] text-[#7a877f] font-mono">{property.destination}</span>
          </div>
          <h1 className={`font-bold tracking-tight text-[#16211c] ${seniorMode ? "text-3xl" : "text-2xl"}`}>
            {property.name}
          </h1>
          <p className="text-xs text-[#5a6b62]">{property.tagline}</p>
        </section>

        <section className="grid grid-cols-4 gap-2">
          {[
            { label: "Wi-Fi", hint: "Connected", icon: Wifi, tone: "bg-[#f8e4c8] text-[#c57a32]", onClick: () => setWifiModalOpen(true) },
            { label: "Order Food", hint: "Room Menu", icon: Utensils, tone: "bg-[#dceee4] text-[#2d7a55]", onClick: () => setDiningModalOpen(true) },
            { label: "Staff Desk", hint: "24/7 Service", icon: BellRing, tone: "bg-[#ece4f6] text-[#6b46a5]", onClick: () => setStaffModalOpen(true) },
            { label: "Emergency", hint: "000 / Duty", icon: ShieldAlert, tone: "bg-[#fadad6] text-[#b42318]", onClick: () => setSafetyModalOpen(true) },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-white hover:bg-[#f3f6f1] border border-[#dde3db] shadow-[0_8px_18px_#5d765b0d] transition-all active:scale-95"
              >
                <div className={`grid place-items-center w-9 h-9 rounded-xl mb-1.5 ${action.tone}`}>
                  <Icon size={18} />
                </div>
                <span className="text-[11px] font-medium text-[#16211c]">{action.label}</span>
                <span className="text-[9px] text-[#7a877f] font-mono">{action.hint}</span>
              </button>
            );
          })}
        </section>

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fde9c8] via-[#fff8ee] to-[#e5f3ea] border border-[#f0d4a8] p-5 shadow-[0_16px_32px_#c9a06a18]">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 border border-[#f0d4a8] text-[#c57a32] text-[10px] font-mono tracking-wider uppercase font-semibold">
                <Sparkles size={11} /> AirPal Signature
              </span>
              <h2 className={`font-bold text-[#16211c] mt-1.5 ${seniorMode ? "text-2xl" : "text-xl"}`}>
                {t("whatToDoNow")}
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#7a877f]">{nowLabel}</span>
          </div>
          <p className="text-xs text-[#5a6b62] mb-4 leading-relaxed max-w-xs">
            AirPal reads your time, weather, and walk from {property.name} to serve 3 curated options.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                trackEvent("what_to_do_now_open");
                setWhatToDoModalOpen(true);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#18271f] hover:bg-[#284236] active:scale-98 text-[#fffdf8] font-bold text-xs transition-all shadow-md"
            >
              <span>See 3 Instant Options</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => setTripModeOpen(true)}
              className="flex items-center gap-1.5 py-3 px-3.5 rounded-2xl bg-white hover:bg-[#f3f6f1] active:scale-98 text-[#254137] text-xs font-semibold transition-all border border-[#dde3db]"
            >
              <Compass size={14} />
              <span>Trip Mode</span>
            </button>
          </div>
        </section>

        <section
          onClick={() => setAskAirPalOpen(true)}
          className="rounded-2xl bg-white hover:bg-[#f7faf6] border border-[#dde3db] p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-all group shadow-[0_8px_18px_#5d765b0d]"
        >
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-[#24180d] font-bold shadow-md shadow-amber-400/20">
              <Sparkles size={18} />
            </div>
            <div>
              <span className="block text-xs font-semibold text-[#16211c] group-hover:text-[#c57a32] transition-colors">
                {t("askAirPal")} anything...
              </span>
              <span className="text-[11px] text-[#7a877f]">“Indian food nearby?” · “Late checkout?” · “Fix A/C”</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#7a877f] group-hover:translate-x-0.5 transition-transform" />
        </section>

        <div className="flex rounded-2xl bg-white border border-[#dde3db] p-1 text-xs shadow-[0_8px_18px_#5d765b0d]">
          {[
            { id: "stay", label: t("yourStay"), icon: BedDouble },
            { id: "discover", label: "Local Gems", icon: MapPin },
            { id: "experiences", label: t("experiences"), icon: CalendarDays },
            { id: "services", label: t("hotelServices"), icon: BellRing },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all font-medium ${
                  activeTab === tab.id
                    ? "bg-[#18271f] text-[#fffdf8] font-semibold shadow-sm"
                    : "text-[#7a877f] hover:text-[#16211c]"
                }`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
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
                  <strong className="text-sm text-[#16211c]">Artisan Breakfast</strong>
                </div>
                <span className="text-xs font-mono text-[#c57a32]">{property.breakfast.hours}</span>
              </div>
              <p className="text-xs text-[#5a6b62]">
                {property.breakfast.type} served at {property.breakfast.location}.
              </p>
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[#7a877f]">{property.breakfast.price}</span>
                <button
                  onClick={() => purchaseUpsell("up_breakfast")}
                  className="px-3 py-1.5 rounded-xl bg-[#f8e4c8] hover:bg-amber-400 text-[#c57a32] hover:text-[#24180d] font-semibold text-xs transition-all"
                >
                  Pre-Book ($22)
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-[#fff4e4] to-[#eef6f0] border border-[#f0d4a8] p-4 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-[#c57a32] font-bold">Flight later today?</span>
                <h4 className="text-sm font-bold text-[#16211c]">Keep Room {roomNumber} until 4 PM</h4>
                <span className="text-xs text-[#5a6b62]">Special guest rate: $45 AUD</span>
              </div>
              <button
                onClick={() => purchaseUpsell("up_late_checkout")}
                disabled={activeUpsells.includes("up_late_checkout")}
                className="px-4 py-2 rounded-xl bg-[#18271f] hover:bg-[#284236] active:scale-95 disabled:opacity-60 text-[#fffdf8] font-bold text-xs whitespace-nowrap transition-all"
              >
                {activeUpsells.includes("up_late_checkout") ? "Added to Room" : "Add for $45"}
              </button>
            </div>

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
          </section>
        )}

        {activeTab === "discover" && (
          <section className="space-y-4 animate-in fade-in">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
              {["All", "Food & Drink", "Coffee", "Nature & Walks", "Sights & Culture", "Nightlife"].map((cat) => (
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
            <div className="rounded-2xl bg-gradient-to-r from-[#fff4e4] via-[#eef6f0] to-transparent border border-[#dde3db] p-4 space-y-1">
              <h3 className="font-bold text-sm text-[#16211c]">Curated Sydney Experiences</h3>
              <p className="text-xs text-[#5a6b62]">Direct booking with hotel concierge partner rates and guaranteed availability.</p>
            </div>
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

      <nav className="absolute bottom-0 left-0 right-0 z-30 border-t border-[#dde3db] bg-[#fffdf9]/95 backdrop-blur-xl py-2 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around text-[10px] text-[#7a877f]">
        <button onClick={() => setActiveTab("stay")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "stay" ? "text-[#c57a32] font-bold" : "hover:text-[#16211c]"}`}>
          <BedDouble size={18} />
          <span>Stay</span>
        </button>
        <button onClick={() => setActiveTab("discover")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "discover" ? "text-[#c57a32] font-bold" : "hover:text-[#16211c]"}`}>
          <MapPin size={18} />
          <span>Discover</span>
        </button>
        <button onClick={() => setAskAirPalOpen(true)} className="flex flex-col items-center -mt-5 group">
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-[#24180d] font-bold shadow-lg shadow-amber-500/25 group-hover:scale-105 active:scale-95 transition-all">
            <Sparkles size={22} />
          </div>
          <span className="text-[10px] font-bold text-[#c57a32] mt-1">Ask AirPal</span>
        </button>
        <button onClick={() => setTripModeOpen(true)} className="flex flex-col items-center gap-1 hover:text-[#16211c] transition-all">
          <Compass size={18} />
          <span>Trip Mode</span>
        </button>
        <button onClick={() => setActiveTab("services")} className={`flex flex-col items-center gap-1 transition-all ${activeTab === "services" ? "text-[#c57a32] font-bold" : "hover:text-[#16211c]"}`}>
          <BellRing size={18} />
          <span>Services</span>
        </button>
      </nav>

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
    </div>
  );

  if (deviceMode === "iphone") {
    return (
      <div className="min-h-[calc(100vh-52px)] py-6 px-2 flex justify-center items-center bg-[#e8eee8]">
        <div className="relative w-[385px] h-[810px] rounded-[52px] border-[10px] border-[#202d26] bg-[#f9f8f4] shadow-[20px_28px_70px_#5d765b2c] overflow-hidden flex flex-col">
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#111] rounded-full z-50 flex items-center justify-between px-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#222] border border-white/10" />
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex-1 overflow-hidden pt-6">{content}</div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#16211c]/20 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    );
  }

  if (deviceMode === "android") {
    return (
      <div className="min-h-[calc(100vh-52px)] py-6 px-2 flex justify-center items-center bg-[#e8eee8]">
        <div className="relative w-[380px] h-[810px] rounded-[40px] border-[8px] border-[#252f28] bg-[#f9f8f4] shadow-[20px_28px_70px_#5d765b2c] overflow-hidden flex flex-col">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#111] rounded-full z-50" />
          <div className="flex-1 overflow-hidden pt-5">{content}</div>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#16211c]/25 rounded-full z-50 pointer-events-none" />
        </div>
      </div>
    );
  }

  if (deviceMode === "tablet") {
    return (
      <div className="min-h-[calc(100vh-52px)] py-6 px-2 flex justify-center items-center bg-[#e8eee8]">
        <div className="relative w-[680px] h-[850px] rounded-[36px] border-[14px] border-[#1e2621] bg-[#f9f8f4] shadow-[20px_28px_70px_#5d765b2c] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-hidden">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-52px)] bg-[#e8eee8] flex justify-center">
      <div className="w-full max-w-[440px] min-h-[calc(100vh-52px)] bg-[#f9f8f4] shadow-2xl">{content}</div>
    </div>
  );
};
