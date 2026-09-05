import React, { useEffect, useState } from "react";
import { campusQrPayload, makeQrDataUrl, stayQrPayload, tripQrPayload } from "../../lib/qr";
import type { Trip } from "@shared/travel-os";

export function TripQrCard({ trip }: { trip: Trip }) {
  const [src, setSrc] = useState<string>("");
  const isCampus = trip.propertyId === "harbour-college";
  const payload = isCampus
    ? campusQrPayload(trip.propertyId, "R12")
    : trip.propertyId
      ? stayQrPayload(trip.propertyId, "508")
      : tripQrPayload(trip.id);
  const label = isCampus ? "College companion QR" : trip.propertyId ? "Hotel companion QR" : "Trip QR for your people";

  useEffect(() => {
    void makeQrDataUrl(payload).then(setSrc);
  }, [payload]);

  return (
    <section className="rounded-2xl bg-white border border-[#dde3db] p-3.5 flex items-center gap-3">
      {src ? (
        <img src={src} alt={label} className="w-24 h-24 rounded-xl border border-[#dde3db] bg-white" />
      ) : (
        <div className="w-24 h-24 rounded-xl bg-[#f3f6f1]" />
      )}
      <div className="min-w-0">
        <span className="text-[10px] font-mono uppercase text-[#c57a32]">{label}</span>
        <p className="text-xs text-[#5a6b62] leading-relaxed">
          Family, mates or colleagues scan this to open the same {trip.city} plan. No app required.
        </p>
      </div>
    </section>
  );
}
