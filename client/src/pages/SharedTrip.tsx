import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Compass, Copy, Share2, Users } from "lucide-react";
import { toast } from "sonner";
import {
  durationLabel,
  formatTripMessage,
  loadSharedTrip,
  shareTripNative,
  tripShareUrl,
  type SharedTrip as TripPlan,
} from "../lib/trip-share";

export const SharedTrip: React.FC<{ params?: { tripId?: string } }> = ({ params }) => {
  const [, setLocation] = useLocation();
  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    const id = params?.tripId;
    if (!id) {
      setStatus("missing");
      return;
    }
    void loadSharedTrip(id).then((found) => {
      setTrip(found);
      setStatus(found ? "ready" : "missing");
    });
  }, [params?.tripId]);

  if (status === "loading") {
    return (
      <div className="min-h-dvh grid place-items-center bg-[#f9f8f4] text-[#5a6b62] text-sm">
        Opening itinerary…
      </div>
    );
  }

  if (status === "missing" || !trip) {
    return (
      <div className="min-h-dvh grid place-items-center bg-[#f9f8f4] px-6 text-center">
        <div className="max-w-sm space-y-3">
          <h1 className="text-xl font-bold text-[#16211c]">This plan isn’t available</h1>
          <p className="text-sm text-[#5a6b62]">Ask your travel companion to share the itinerary again from AirPal Trip Mode.</p>
          <button
            onClick={() => setLocation("/stay")}
            className="px-4 py-2 rounded-xl bg-[#18271f] text-[#fffdf8] text-sm font-semibold"
          >
            Open AirPal
          </button>
        </div>
      </div>
    );
  }

  const party = [trip.hostName, ...trip.companions].filter(Boolean);

  return (
    <div className="min-h-dvh bg-[#f9f8f4] text-[#16211c] flex justify-center">
      <div className="w-full max-w-[440px] min-h-dvh bg-[#fffdf9] shadow-2xl flex flex-col">
        <header className="px-4 pt-6 pb-4 border-b border-[#dde3db] bg-[#f7f5ef]">
          <span className="text-[10px] font-mono tracking-widest uppercase text-[#c57a32]">Shared itinerary</span>
          <h1 className="text-2xl font-bold mt-1">{trip.destination} with {trip.hostName}</h1>
          <p className="text-sm text-[#5a6b62] mt-1">
            From {trip.propertyName} · {durationLabel(trip.duration)} · {trip.budget}
          </p>
          {party.length > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-[#2d7a55]">
              <Users size={14} />
              {party.join(" · ")}
            </div>
          )}
        </header>

        <div className="flex-1 px-4 py-5 space-y-3">
          <div className="relative border-l-2 border-amber-400/30 ml-3 space-y-3 pl-4">
            {trip.stops.map((stop, index) => (
              <div key={`${stop.title}-${index}`} className="relative">
                <div className="absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white" />
                <article className="rounded-2xl bg-white border border-[#dde3db] p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-[#c57a32] font-semibold">{stop.time}</span>
                      <h2 className="text-sm font-semibold leading-snug">{stop.title}</h2>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#f8e4c8] text-[#c57a32]">{stop.cost}</span>
                  </div>
                  <p className="text-xs text-[#5a6b62] mt-1 leading-relaxed">{stop.description}</p>
                  <span className="mt-1 block text-[10px] font-mono text-[#7a877f]">{stop.duration} · {stop.type}</span>
                </article>
              </div>
            ))}
          </div>
        </div>

        <footer className="p-3 border-t border-[#dde3db] bg-[#f7f5ef] grid grid-cols-2 gap-2">
          <button
            onClick={async () => {
              try {
                const result = await shareTripNative(trip);
                toast.success(result === "shared" ? "Passed along" : "Copied");
              } catch {
                await navigator.clipboard.writeText(formatTripMessage(trip, tripShareUrl(trip.id)));
                toast.success("Itinerary copied");
              }
            }}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-[#dde3db] text-xs font-semibold"
          >
            <Share2 size={14} />
            Share again
          </button>
          <button
            onClick={() => setLocation("/stay")}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-400 text-stone-950 text-xs font-semibold"
          >
            <Compass size={14} />
            Open in AirPal
          </button>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(tripShareUrl(trip.id));
              toast.success("Link copied");
            }}
            className="col-span-2 flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] text-[#5a6b62]"
          >
            <Copy size={13} />
            Copy live link
          </button>
        </footer>
      </div>
    </div>
  );
};
