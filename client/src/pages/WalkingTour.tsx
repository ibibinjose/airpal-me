import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  MapPin,
  Navigation,
  Pause,
  Share2,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { getWalkingTour, type TourStop, type WalkingTour } from "@shared/tours";
import { DeviceStage } from "../components/os/DeviceStage";
import { useAirPal } from "../contexts/AirPalContext";
import { isNativeShell } from "../lib/platform";

function mapsWalk(from: TourStop, to: TourStop) {
  return `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=walking`;
}

function mapsAll(tour: WalkingTour) {
  const stops = tour.stops;
  const origin = `${stops[0].lat},${stops[0].lng}`;
  const dest = `${stops[stops.length - 1].lat},${stops[stops.length - 1].lng}`;
  const mid = stops.slice(1, -1).map((s) => `${s.lat},${s.lng}`).join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&waypoints=${encodeURIComponent(mid)}&travelmode=walking`;
}

function RouteSketch({ tour, active }: { tour: WalkingTour; active: number }) {
  const boxes = useMemo(() => {
    const lats = tour.stops.map((s) => s.lat);
    const lngs = tour.stops.map((s) => s.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const padLat = (maxLat - minLat || 0.01) * 0.18;
    const padLng = (maxLng - minLng || 0.01) * 0.18;
    return tour.stops.map((stop) => {
      const x = ((stop.lng - (minLng - padLng)) / (maxLng - minLng + padLng * 2)) * 100;
      const y = (1 - (stop.lat - (minLat - padLat)) / (maxLat - minLat + padLat * 2)) * 100;
      return { ...stop, x, y };
    });
  }, [tour]);

  const line = boxes.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="relative h-40 rounded-[1.35rem] overflow-hidden bg-gradient-to-br from-[#e7f0ea] to-[#f3ead8] border border-[#e3e9e1]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <polyline points={line} fill="none" stroke="#c57a32" strokeWidth="1.4" strokeDasharray="2 1.5" />
      </svg>
      {boxes.map((stop, i) => (
        <span
          key={stop.id}
          className={`absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full text-[9px] font-bold border-2 border-white shadow ${
            i === active ? "w-6 h-6 bg-[#18271f] text-white" : i < active ? "w-5 h-5 bg-[#2d7a55] text-white" : "w-5 h-5 bg-white text-[#16211c]"
          }`}
          style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
        >
          {i + 1}
        </span>
      ))}
    </div>
  );
}

export const WalkingTourPage: React.FC<{ params?: { tourId?: string }; bare?: boolean }> = ({ params, bare = false }) => {
  const { deviceMode } = useAirPal();
  const [, setLocation] = useLocation();
  const tour = getWalkingTour(params?.tourId || "rocks-harbour");
  const [index, setIndex] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const stop = tour.stops[index];
  const prev = tour.stops[index - 1];

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, [index]);

  const listen = () => {
    if (!window.speechSynthesis) {
      toast.message("Voice not available on this device");
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(`${stop.name}. ${stop.story}`);
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  };

  const shareUrl = typeof window === "undefined" ? `/tour/${tour.id}` : `${window.location.origin}/tour/${tour.id}`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Tour link copied", { description: "No app. Friends open the same walk." });
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: tour.title, text: tour.tagline, url: shareUrl });
        return;
      } catch {
        /* fall through */
      }
    }
    await copyLink();
  };

  const content = (
    <div className="relative h-full min-h-0 flex flex-col overflow-hidden bg-[#f9f8f4] text-[#16211c]">
      <header className="shrink-0 px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="ap-kicker">Self-guided walk</p>
            <h1 className="ap-display text-[24px] leading-tight">{tour.title}</h1>
            <p className="text-xs text-[#7a877f] mt-1">
              {tour.city} · {tour.duration} · {tour.distance} · from {tour.from}
            </p>
            <button
              onClick={() => setLocation(tour.id === "hobart-treasures" ? "/u/nisha-sydney" : "/u/harbour-hotel")}
              className="mt-1 text-[11px] font-semibold text-[#c57a32]"
            >
              View guide profile
            </button>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button onClick={copyLink} className="ap-icon-btn" aria-label="Copy tour link">
              <Copy size={15} />
            </button>
            <button onClick={share} className="ap-icon-btn bg-[#18271f] text-white border-[#18271f]" aria-label="Share tour">
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </header>

      <div className="guest-scroll flex-1 px-5 pb-6 space-y-4">
        <RouteSketch tour={tour} active={index} />

        <section className="ap-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="ap-kicker">
              Stop {index + 1} of {tour.stops.length}
            </span>
            <span className="text-[11px] font-mono text-[#c57a32]">{stop.minutesFromPrev}</span>
          </div>
          <h2 className="ap-display text-[22px] leading-tight">{stop.name}</h2>
          <p className="text-xs text-[#7a877f] flex items-center gap-1">
            <MapPin size={12} /> {stop.address}
          </p>
          <p className="text-sm text-[#3a4a42] leading-relaxed">{stop.story}</p>
          <div className="flex gap-2">
            <button
              onClick={listen}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-amber-400 text-stone-950 text-xs font-semibold"
            >
              {speaking ? <Pause size={14} /> : <Volume2 size={14} />}
              {speaking ? "Pause voice" : "Hear this stop"}
            </button>
            {prev && (
              <a
                href={mapsWalk(prev, stop)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-[#18271f] text-white text-xs font-semibold"
              >
                <Navigation size={14} /> Walk here
              </a>
            )}
          </div>
        </section>

        <div className="flex items-center justify-between">
          <button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="inline-flex items-center gap-1 text-xs font-semibold disabled:opacity-30"
          >
            <ChevronLeft size={16} /> Back
          </button>
          {index < tour.stops.length - 1 ? (
            <button
              onClick={() => setIndex((i) => i + 1)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#18271f] text-white text-xs font-semibold"
            >
              Next stop <ChevronRight size={14} />
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#2d7a55]">
              <Check size={14} /> Walk complete
            </span>
          )}
        </div>

        <section className="space-y-2">
          {tour.stops.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              className={`w-full text-left ap-card p-3 flex gap-3 ${i === index ? "ring-1 ring-amber-400" : ""}`}
            >
              <span
                className={`grid place-items-center w-7 h-7 rounded-full text-[11px] font-bold shrink-0 ${
                  i === index ? "bg-[#18271f] text-white" : i < index ? "bg-[#dceee4] text-[#2d7a55]" : "bg-[#f3f6f1] text-[#7a877f]"
                }`}
              >
                {i < index ? <Check size={12} /> : i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{item.name}</span>
                <span className="block text-[11px] text-[#7a877f]">{item.minutesFromPrev} · {item.address}</span>
              </span>
            </button>
          ))}
        </section>

        <a
          href={mapsAll(tour)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-3 rounded-full border border-[#e3e9e1] bg-white text-xs font-semibold"
        >
          Open full walk in Google Maps <ArrowRight size={14} />
        </a>
        <button onClick={() => setLocation("/stay")} className="w-full text-center text-[11px] text-[#7a877f] pb-4">
          Back to stay
        </button>
      </div>
    </div>
  );

  if (bare || isNativeShell()) return content;
  return <DeviceStage mode={deviceMode}>{content}</DeviceStage>;
};
