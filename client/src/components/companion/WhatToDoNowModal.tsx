import React, { useState } from "react";
import { useAirPal } from "../../contexts/AirPalContext";
import {
  Sparkles,
  Clock,
  ArrowRight,
  X,
  MapPin,
  Sun,
  CloudRain,
  Compass,
  CheckCircle,
} from "lucide-react";
import { WHAT_TO_DO_NOW_RECOMMENDATIONS } from "../../../../shared/airpal-data";
import { toast } from "sonner";
import { CompanionSheet } from "./CompanionSheet";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenTripMode: () => void;
}

export const WhatToDoNowModal: React.FC<Props> = ({ isOpen, onClose, onOpenTripMode }) => {
  const { weather, property, seniorMode } = useAirPal();
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<"morning" | "afternoon" | "evening">("evening");

  if (!isOpen) return null;

  const getRecommendations = () => {
    if (weather === "rainy") {
      return [
        {
          id: "now_rain_1",
          title: "Museum of Contemporary Art (MCA)",
          timeEstimate: "75 mins",
          cost: "Free Entry",
          whyNow: "Shaded indoor galleries right across the street. Cozy up with Indigenous masterworks away from the rain.",
          actionLabel: "Walk to MCA (Covered walkway)",
          category: "Indoor Art",
        },
        {
          id: "now_rain_2",
          title: "The Tea Room at Queen Victoria Building",
          timeEstimate: "60 mins",
          cost: "$$",
          whyNow: "Stained glass domed sanctuary with fresh warm scones, clotted cream, and loose leaf tea.",
          actionLabel: "View High Tea Menu",
          category: "Historic Indoor",
        },
        {
          id: "now_rain_3",
          title: "The Rocks Cellar Bar Tasting",
          timeEstimate: "45 mins",
          cost: "$$",
          whyNow: "Warm sandstone underground cellar on hotel Ground Floor with organic Australian wines.",
          actionLabel: "Reserve Cozy Booth",
          category: "Hotel Lounge",
        },
      ];
    }
    return WHAT_TO_DO_NOW_RECOMMENDATIONS[selectedTimeOfDay];
  };

  const recommendations = getRecommendations();

  const handleAction = (title: string, actionLabel: string) => {
    toast.success("Action Started", {
      description: `${actionLabel}: Navigating to ${title} from ${property.name}.`,
    });
    onClose();
  };

  return (
    <CompanionSheet isOpen={isOpen}>
      <div className="relative h-full min-h-0 guest-scroll bg-[#fffdf9] p-5 text-[#16211c]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-bold shadow-lg shadow-amber-400/20">
              <Sparkles size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400 flex items-center gap-1.5">
                <Compass size={11} /> Context Engine
              </span>
              <h2 className={`font-bold tracking-tight text-[#16211c] ${seniorMode ? "text-2xl" : "text-xl"}`}>
                What should I do now?
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#5a6b62]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Context Indicators */}
        <div className="flex flex-wrap items-center gap-2 mb-5 text-[11px]">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#dde3db] text-[#5a6b62]">
            <Clock size={12} className="text-amber-400" />
            <span>Right now (6:20 PM)</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#dde3db] text-[#5a6b62]">
            {weather === "sunny" ? (
              <>
                <Sun size={12} className="text-amber-400" />
                <span>Clear 24°C</span>
              </>
            ) : (
              <>
                <CloudRain size={12} className="text-[#1d6aa5]" />
                <span className="text-[#1d6aa5] font-medium">Rain Alert 18°C (Indoor Mode)</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#dde3db] text-[#5a6b62]">
            <MapPin size={12} className="text-amber-400" />
            <span>Within 10 min walk</span>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#dde3db] mb-5 text-xs">
          {(["morning", "afternoon", "evening"] as const).map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTimeOfDay(time)}
              className={`flex-1 py-1.5 rounded-lg capitalize font-medium transition-all ${
                selectedTimeOfDay === time
                  ? "bg-amber-400 text-stone-950 shadow-sm"
                  : "text-stone-400 hover:text-[#16211c]"
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* 3 Actionable Instant Options */}
        <div className="space-y-3 mb-5">
          {recommendations.map((item, index) => (
            <article
              key={item.id}
              className="rounded-2xl bg-white hover:bg-[#f7faf6] border border-[#dde3db] p-4 transition-all group"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-[#f8e4c8] text-[#c57a32] font-mono text-[10px] font-bold">
                    {index + 1}
                  </span>
                  <h3 className={`font-semibold text-[#16211c] ${seniorMode ? "text-lg" : "text-sm"}`}>
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="text-stone-400">{item.timeEstimate}</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#f8ead4] text-[#c57a32] font-semibold">
                    {item.cost}
                  </span>
                </div>
              </div>

              <p className={`text-[#5a6b62] leading-relaxed mb-3 ${seniorMode ? "text-sm" : "text-xs"}`}>
                {item.whyNow}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#e8ece4]">
                <span className="text-[10px] font-mono text-stone-400 tracking-wide uppercase">
                  {item.category}
                </span>
                <button
                  onClick={() => handleAction(item.title, item.actionLabel)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 font-semibold text-xs transition-all shadow-sm shadow-amber-400/20"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Footer Deep Dive */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-400/10 to-emerald-400/10 border border-[#dde3db] p-3.5 flex items-center justify-between gap-3 text-xs">
          <div>
            <strong className="block text-[#16211c] font-medium">Want a full custom day itinerary?</strong>
            <span className="text-[#5a6b62] text-[11px]">Tell AirPal your hours, vibe & budget.</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenTripMode();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white text-stone-950 font-semibold text-xs whitespace-nowrap hover:bg-stone-200 transition-all active:scale-95"
          >
            <span>Plan My Trip</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </CompanionSheet>
  );
};
