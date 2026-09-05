import React, { useState } from "react";
import { useAirPal } from "../../contexts/AirPalContext";
import {
  Compass,
  Clock,
  DollarSign,
  Heart,
  CloudRain,
  Sun,
  X,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { ItineraryStop } from "../../../../shared/airpal-data";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TripModeModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { weather, setWeather, seniorMode } = useAirPal();
  const [duration, setDuration] = useState<string>("half-day");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Culture", "Food"]);
  const [budget, setBudget] = useState<string>("$$");
  const [generated, setGenerated] = useState<boolean>(true);

  if (!isOpen) return null;

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
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  // Dynamic Stops adapted by Weather condition
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

    // Sunny itinerary
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

  const stops = getStops();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#15241c]/45 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col w-full max-w-xl max-h-[92vh] rounded-3xl bg-[#f4f1ea] border border-amber-400/20 text-[#16211c] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dde3db] bg-[#f7f5ef]">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-bold shadow-md shadow-amber-400/20">
              <Compass size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                Live Companion Engine
              </span>
              <h2 className="text-lg font-bold text-[#16211c]">AirPal Trip Mode</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close trip mode"
            className="grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#5a6b62]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Dynamic Weather Banner */}
          <div
            className={`rounded-2xl p-3.5 border flex items-center justify-between gap-3 text-xs transition-all ${
              weather === "rainy"
                ? "bg-blue-500/15 border-blue-400/30 text-[#1d6aa5]"
                : "bg-amber-400/10 border-amber-400/20 text-amber-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {weather === "rainy" ? (
                <CloudRain size={18} className="text-[#1d6aa5] flex-shrink-0" />
              ) : (
                <Sun size={18} className="text-amber-400 flex-shrink-0" />
              )}
              <div>
                <strong className="block text-[#16211c] font-medium">
                  {weather === "rainy" ? "Rain Alert in Sydney (18°C)" : "Clear & Sunny in Sydney (24°C)"}
                </strong>
                <span className="text-[11px] opacity-80">
                  {weather === "rainy"
                    ? "Itinerary dynamically shifted to indoor museums, covered galleries & tea rooms."
                    : "Optimized for harbourside walking, bridge viewpoints & outdoor parks."}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                const nextWeather = weather === "sunny" ? "rainy" : "sunny";
                setWeather(nextWeather);
                toast.info("Dynamic Weather Shift", {
                  description: `AirPal recalculated stops for ${nextWeather === "rainy" ? "Rainy Indoor Mode" : "Sunny Outdoor Mode"}.`,
                });
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#16211c] text-[11px] font-semibold whitespace-nowrap transition-all flex items-center gap-1"
            >
              <RefreshCw size={11} />
              <span>Simulate {weather === "sunny" ? "Rain" : "Sun"}</span>
            </button>
          </div>

          {/* Time Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#5a6b62] mb-2">
              How much time do you have?
            </label>
            <div className="grid grid-cols-4 gap-2 text-xs">
              {[
                { id: "2h", label: "2 Hours" },
                { id: "half-day", label: "Half Day (4h)" },
                { id: "1-day", label: "1 Full Day" },
                { id: "2-days", label: "2+ Days" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDuration(opt.id)}
                  className={`py-2 px-1 rounded-xl border text-center transition-all ${
                    duration === opt.id
                      ? "bg-amber-400 text-stone-950 font-semibold border-amber-400 shadow-sm"
                      : "bg-white border-[#dde3db] text-[#5a6b62] hover:bg-[#eef3ed]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests Pills */}
          <div>
            <label className="block text-xs font-semibold text-[#5a6b62] mb-2">
              What are you interested in?
            </label>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {interestsList.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    selectedInterests.includes(interest)
                      ? "bg-amber-400 text-stone-950 font-semibold border-amber-400"
                      : "bg-white border-[#dde3db] text-[#5a6b62] hover:bg-[#eef3ed]"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#5a6b62] mb-2">
              Budget Preference
            </label>
            <div className="flex items-center gap-2 text-xs">
              {[
                { id: "Free", label: "Free / Under $10" },
                { id: "$", label: "$ · Cheap & Street" },
                { id: "$$", label: "$$ · Moderate" },
                { id: "$$$", label: "$$$ · Premium" },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  className={`flex-1 py-1.5 px-2 rounded-xl border text-center transition-all ${
                    budget === b.id
                      ? "bg-amber-400 text-stone-950 font-semibold border-amber-400"
                      : "bg-white border-[#dde3db] text-[#5a6b62] hover:bg-[#eef3ed]"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Itinerary Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#16211c] flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[#2d7a55]" />
                <span>Personalised Sydney Route</span>
              </h3>
              <span className="text-[11px] font-mono text-[#c57a32]">
                {stops.length} Stops · Starts from Hotel Lobby
              </span>
            </div>

            <div className="relative border-l-2 border-amber-400/30 ml-3 space-y-4 pl-4 py-1">
              {stops.map((stop, idx) => (
                <div key={idx} className="relative group">
                  {/* Pin Dot */}
                  <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-[#121c15] shadow-sm shadow-amber-400/40" />

                  <div className="rounded-2xl bg-white hover:bg-[#f7faf6] border border-[#dde3db] p-3.5 transition-all">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-amber-400 font-semibold">
                          {stop.time}
                        </span>
                        <h4 className="font-semibold text-sm text-[#16211c]">
                          {stop.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="text-stone-400">{stop.duration}</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#f8e4c8] text-[#c57a32] font-medium">
                          {stop.cost}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#5a6b62] leading-relaxed">
                      {stop.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#f7f5ef] border-t border-[#dde3db] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              toast.success("Itinerary Saved to My AirPal", {
                description: "You can access this route offline or share with travel companions.",
              });
            }}
            className="text-xs text-[#5a6b62] hover:text-[#16211c] font-medium"
          >
            Save to My AirPal
          </button>

          <button
            onClick={() => {
              toast.success("Live Route Started", {
                description: "Turn-by-turn guidance initiated from Harbour Hotel lobby.",
              });
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 font-semibold text-xs transition-all shadow-md shadow-amber-400/20"
          >
            <span>Start Route on Map</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
