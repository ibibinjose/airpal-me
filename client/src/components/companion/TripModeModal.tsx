import React, { useMemo, useState } from "react";
import { useAirPal } from "../../contexts/AirPalContext";
import { useLocation } from "wouter";
import {
  Compass,
  CloudRain,
  Sun,
  X,
  ArrowRight,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Share2,
  Copy,
  MessageCircle,
  Link2,
  Users,
  Plus,
} from "lucide-react";
import { ItineraryStop } from "../../../../shared/airpal-data";
import { toast } from "sonner";
import { CompanionSheet } from "./CompanionSheet";
import {
  durationLabel,
  formatTripMessage,
  saveSharedTrip,
  shareTripNative,
  tripShareUrl,
  type SharedTrip,
} from "../../lib/trip-share";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TripModeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [, setLocation] = useLocation();
  const { weather, setWeather, guestName, property, trackEvent } = useAirPal();
  const [duration, setDuration] = useState<string>("half-day");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Culture", "Food"]);
  const [budget, setBudget] = useState<string>("$$");
  const [panel, setPanel] = useState<"plan" | "share">("plan");
  const [companionName, setCompanionName] = useState("");
  const [companions, setCompanions] = useState<string[]>([]);
  const [sharedTrip, setSharedTrip] = useState<SharedTrip | null>(null);

  const interestsList = [
    "Food",
    "Culture",
    "Nature",
    "Shopping",
    "Nightlife",
    "Family",
    "History",
    "Hidden gems",
    "Wellness",
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((item) => item !== interest) : [...prev, interest]
    );
  };

  const getStops = (): ItineraryStop[] => {
    if (weather === "rainy") {
      return [
        {
          time: "10:00 AM",
          title: "Museum of Contemporary Art (MCA)",
          duration: "90 mins",
          type: "Culture & Art",
          cost: "Free",
          description: "World-class contemporary Australian & Indigenous art directly opposite the hotel. Weather sheltered.",
        },
        {
          time: "12:00 PM",
          title: "The Tea Room Queen Victoria Building",
          duration: "75 mins",
          type: "Food & Heritage",
          cost: "$$",
          description: "Sublime high tea under stained-glass Romanesque arches with hot tea and freshly baked scones.",
        },
        {
          time: "2:00 PM",
          title: "State Library of NSW & Mitchell Galleries",
          duration: "60 mins",
          type: "History & Books",
          cost: "Free",
          description: "Magnificent sandstone historic reading rooms, historical maps, and rare exhibitions.",
        },
        {
          time: "4:00 PM",
          title: "The Rocks Underground Cellar Wine Tasting",
          duration: "60 mins",
          type: "Lounge & Drinks",
          cost: "$$",
          description: "Warm candlelit sandstone cellar on hotel Ground Floor with biodynamic Australian wines.",
        },
      ];
    }

    return [
      {
        time: "9:30 AM",
        title: "The Rocks Sandstone & Hidden Laneways",
        duration: "45 mins",
        type: "History & Walking",
        cost: "Free",
        description: "Cobblestone alleys dating back to 1788 with sandstone cuts and scenic harbour vistas right behind the hotel.",
        weatherSensitive: true,
      },
      {
        time: "10:30 AM",
        title: "Sydney Harbour Bridge Pylon Lookout",
        duration: "60 mins",
        type: "Views & Nature",
        cost: "$22",
        description: "Breathtaking 360-degree panoramic vista across the Opera House, harbour islands, and city skyline.",
        weatherSensitive: true,
      },
      {
        time: "12:00 PM",
        title: "Circular Quay to Opera House Forecourt",
        duration: "75 mins",
        type: "Culture & Sights",
        cost: "Free",
        description: "Coastal walk along the wharf with street performers, ferry views, and iconic architectural sails.",
        weatherSensitive: true,
      },
      {
        time: "1:30 PM",
        title: "Spice Alley Hawker Lunch Trail",
        duration: "60 mins",
        type: "Food & Drink",
        cost: "$15–$20",
        description: "Open-air Singaporean and Malaysian street feast with fresh laksa, roti canai, and dumplings.",
      },
      {
        time: "3:00 PM",
        title: "Royal Botanic Garden Coastal Stroll",
        duration: "60 mins",
        type: "Nature & Relaxation",
        cost: "Free",
        description: "Shaded coastal path leading past Mrs Macquarie's Chair with afternoon harbour breeze.",
        weatherSensitive: true,
      },
    ];
  };

  const stops = useMemo(() => {
    let next = getStops();
    if (selectedInterests.includes("Family")) {
      next = next.filter((stop) => !stop.type.toLowerCase().includes("lounge") && !stop.type.toLowerCase().includes("drink"));
    }
    if (duration === "2h") return next.slice(0, 2);
    if (duration === "half-day") return next.slice(0, 4);
    return next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather, duration, selectedInterests]);

  const addCompanion = () => {
    const name = companionName.trim();
    if (!name || companions.includes(name)) return;
    setCompanions((prev) => [...prev, name]);
    setCompanionName("");
  };

  const persistTrip = async () => {
    const trip = await saveSharedTrip({
      id: sharedTrip?.id,
      hostName: guestName || "A guest",
      propertyName: property.name,
      destination: property.destination,
      duration,
      interests: selectedInterests,
      budget,
      weather,
      companions,
      stops,
    });
    setSharedTrip(trip);
    trackEvent("trip_shared", { tripId: trip.id, companions: companions.length });
    return trip;
  };

  const handleNativeShare = async () => {
    const trip = await persistTrip();
    try {
      const result = await shareTripNative(trip);
      toast.success(result === "shared" ? "Itinerary sent" : "Itinerary copied", {
        description: result === "shared"
          ? "Your travel companions can open the live plan on their phones."
          : "Paste it into WhatsApp, Messages, or email.",
      });
    } catch {
      toast.error("Share cancelled");
    }
  };

  const handleCopyLink = async () => {
    const trip = await persistTrip();
    await navigator.clipboard.writeText(tripShareUrl(trip.id));
    toast.success("Link copied", {
      description: "Anyone with this link can view the itinerary — no app required.",
    });
  };

  const handleCopyPlan = async () => {
    const trip = await persistTrip();
    await navigator.clipboard.writeText(formatTripMessage(trip, tripShareUrl(trip.id)));
    toast.success("Itinerary copied", {
      description: "Times, stops, and the live link are ready to paste.",
    });
  };

  const handleWhatsApp = async () => {
    const trip = await persistTrip();
    const text = formatTripMessage(trip, tripShareUrl(trip.id));
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const handleMessages = async () => {
    const trip = await persistTrip();
    const text = formatTripMessage(trip, tripShareUrl(trip.id));
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
  };

  return (
    <CompanionSheet isOpen={isOpen}>
      <div className="flex min-h-0 flex-1 flex-col bg-[#fffdf9] text-[#16211c]">
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-[#dde3db] bg-[#f7f5ef]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid place-items-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-bold shadow-md shadow-amber-400/20">
              {panel === "share" ? <Share2 size={18} /> : <Compass size={20} />}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[#c57a32]">
                {panel === "share" ? "Share with companions" : "Live companion"}
              </span>
              <h2 className="text-base font-bold text-[#16211c] truncate">
                {panel === "share" ? "Send this itinerary" : "AirPal Trip Mode"}
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              if (panel === "share") setPanel("plan");
              else onClose();
            }}
            aria-label="Close trip mode"
            className="grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#5a6b62]"
          >
            <X size={16} />
          </button>
        </div>

        {panel === "plan" ? (
          <>
            <div className="guest-scroll flex-1 p-4 space-y-4">
              <div
                className={`rounded-2xl p-3.5 border flex items-center justify-between gap-3 text-xs ${
                  weather === "rainy"
                    ? "bg-blue-500/15 border-blue-400/30 text-[#1d6aa5]"
                    : "bg-[#fff4e4] border-amber-400/20 text-[#c57a32]"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {weather === "rainy" ? <CloudRain size={18} className="shrink-0" /> : <Sun size={18} className="text-amber-400 shrink-0" />}
                  <div className="min-w-0">
                    <strong className="block text-[#16211c] font-medium">
                      {weather === "rainy" ? "Rain in Sydney (18°C)" : "Clear & sunny (24°C)"}
                    </strong>
                    <span className="text-[11px] opacity-80">
                      {weather === "rainy"
                        ? "Outdoor stops swapped for indoor galleries and tea rooms."
                        : "Route favours harbour walks, viewpoints, and parks."}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setWeather(weather === "sunny" ? "rainy" : "sunny")}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-[#dde3db] text-[#16211c] text-[11px] font-semibold whitespace-nowrap flex items-center gap-1"
                >
                  <RefreshCw size={11} />
                  {weather === "sunny" ? "Rain" : "Sun"}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a6b62] mb-2">How much time do you have?</label>
                <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                  {[
                    { id: "2h", label: "2 hrs" },
                    { id: "half-day", label: "Half day" },
                    { id: "1-day", label: "1 day" },
                    { id: "2-days", label: "2+ days" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setDuration(opt.id)}
                      className={`py-2 px-1 rounded-xl border text-center ${
                        duration === opt.id
                          ? "bg-amber-400 text-stone-950 font-semibold border-amber-400"
                          : "bg-white border-[#dde3db] text-[#5a6b62]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a6b62] mb-2">Interests</label>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {interestsList.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-xl border ${
                        selectedInterests.includes(interest)
                          ? "bg-amber-400 text-stone-950 font-semibold border-amber-400"
                          : "bg-white border-[#dde3db] text-[#5a6b62]"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#5a6b62] mb-2">Budget</label>
                <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                  {[
                    { id: "Free", label: "Free" },
                    { id: "$", label: "$" },
                    { id: "$$", label: "$$" },
                    { id: "$$$", label: "$$$" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setBudget(item.id)}
                      className={`py-2 rounded-xl border ${
                        budget === item.id
                          ? "bg-amber-400 text-stone-950 font-semibold border-amber-400"
                          : "bg-white border-[#dde3db] text-[#5a6b62]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3 gap-2">
                  <h3 className="text-sm font-bold text-[#16211c] flex items-center gap-1.5">
                    <CheckCircle2 size={16} className="text-[#2d7a55]" />
                    {property.destination} route
                  </h3>
                  <span className="text-[11px] font-mono text-[#c57a32] shrink-0">
                    {stops.length} stops · {durationLabel(duration)}
                  </span>
                </div>
                <div className="relative border-l-2 border-amber-400/30 ml-3 space-y-3 pl-4 py-1">
                  {stops.map((stop, idx) => (
                    <div key={`${stop.title}-${idx}`} className="relative">
                      <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white" />
                      <div className="rounded-2xl bg-white border border-[#dde3db] p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <span className="text-[11px] font-mono text-[#c57a32] font-semibold">{stop.time}</span>
                            <h4 className="font-semibold text-sm text-[#16211c] leading-snug">{stop.title}</h4>
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-[#f8e4c8] text-[#c57a32] font-mono text-[10px] shrink-0">
                            {stop.cost}
                          </span>
                        </div>
                        <p className="text-xs text-[#5a6b62] leading-relaxed">{stop.description}</p>
                        <span className="mt-1 block text-[10px] text-[#7a877f] font-mono">
                          {stop.duration} · {stop.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 p-3 bg-[#f7f5ef] border-t border-[#dde3db] grid grid-cols-2 gap-2">
              <button
                onClick={() => setPanel("share")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-[#dde3db] text-[#16211c] font-semibold text-xs"
              >
                <Share2 size={14} />
                Share itinerary
              </button>
              <button
                onClick={() => {
                  onClose();
                  setLocation("/tour/rocks-harbour");
                }}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-semibold text-xs"
              >
                <MapPin size={14} />
                Walk this tour
                <ArrowRight size={14} />
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="guest-scroll flex-1 p-4 space-y-4">
              <p className="text-sm text-[#5a6b62] leading-relaxed">
                Send this {property.destination} plan to friends, family, or anyone traveling with you. They open one link — no app, no login.
              </p>

              <div className="rounded-2xl bg-white border border-[#dde3db] p-3.5 space-y-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#16211c]">
                  <Users size={14} className="text-[#c57a32]" />
                  Who is coming with you?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#18271f] text-[#fffdf8] text-[11px] font-medium">
                    You · {guestName}
                  </span>
                  {companions.map((name) => (
                    <button
                      key={name}
                      onClick={() => setCompanions((prev) => prev.filter((item) => item !== name))}
                      className="px-2.5 py-1 rounded-full bg-[#f8e4c8] text-[#c57a32] text-[11px] font-medium"
                    >
                      {name} ×
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCompanion()}
                    placeholder="Add a name, e.g. Priya"
                    className="flex-1 rounded-xl border border-[#dde3db] bg-[#f9f8f4] px-3 py-2 text-sm outline-none"
                  />
                  <button
                    onClick={addCompanion}
                    className="grid place-items-center w-10 rounded-xl bg-[#18271f] text-white"
                    aria-label="Add companion"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleNativeShare}
                  className="w-full flex items-center gap-3 rounded-2xl bg-[#18271f] text-[#fffdf8] p-3.5 text-left"
                >
                  <Share2 size={18} />
                  <span>
                    <strong className="block text-sm">Share sheet</strong>
                    <span className="text-[11px] text-[#c9d4cc]">AirDrop, WhatsApp, Mail, Messages</span>
                  </span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handleWhatsApp} className="flex items-center gap-2 rounded-2xl bg-white border border-[#dde3db] p-3 text-xs font-semibold">
                    <MessageCircle size={16} className="text-[#2d7a55]" />
                    WhatsApp
                  </button>
                  <button onClick={handleMessages} className="flex items-center gap-2 rounded-2xl bg-white border border-[#dde3db] p-3 text-xs font-semibold">
                    <MessageCircle size={16} className="text-[#1d6aa5]" />
                    Messages
                  </button>
                  <button onClick={handleCopyLink} className="flex items-center gap-2 rounded-2xl bg-white border border-[#dde3db] p-3 text-xs font-semibold">
                    <Link2 size={16} className="text-[#c57a32]" />
                    Copy link
                  </button>
                  <button onClick={handleCopyPlan} className="flex items-center gap-2 rounded-2xl bg-white border border-[#dde3db] p-3 text-xs font-semibold">
                    <Copy size={16} className="text-[#5a6b62]" />
                    Copy plan
                  </button>
                </div>
              </div>

              {sharedTrip && (
                <div className="rounded-2xl bg-[#e7f4ec] border border-[#cfe6da] p-3 text-[11px] text-[#2d7a55] break-all">
                  Live link: {tripShareUrl(sharedTrip.id)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </CompanionSheet>
  );
};
