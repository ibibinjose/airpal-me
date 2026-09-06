import React, { useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, QrCode } from "lucide-react";
import { toast } from "sonner";
import { QrScanSheet } from "../components/os/QrScanSheet";

export default function ScanPage() {
  const [, setLocation] = useLocation();
  const [scanOpen, setScanOpen] = useState(true);
  const [code, setCode] = useState("");

  const openCode = () => {
    const raw = code.trim();
    if (!raw) return;
    if (raw.startsWith("http") || raw.startsWith("/")) {
      const parsed = new URL(raw.startsWith("http") ? raw : `${window.location.origin}${raw.startsWith("/") ? raw : `/${raw}`}`);
      setLocation(parsed.pathname + parsed.search);
      return;
    }
    if (raw.startsWith("c/") || raw.startsWith("g/")) {
      setLocation(`/${raw}`);
      return;
    }
    setLocation(`/g/${raw}?type=room&room=101`);
  };

  return (
    <div className="relative min-h-dvh bg-[#f9f8f4] grid place-items-center px-4">
      <div className="max-w-md w-full ap-card p-8 space-y-4 text-center">
        <QrCode className="mx-auto text-[#c57a32]" size={28} />
        <h1 className="ap-display text-3xl">Scan the QR in the room</h1>
        <p className="text-sm text-[#5a6b62]">
          Guests and students don’t create an account. Point the camera at the code on the desk, door, or gate.
        </p>
        <button onClick={() => setScanOpen(true)} className="w-full py-3 rounded-full bg-[#18271f] text-white text-sm font-semibold">
          Open camera
        </button>
        <div className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Or paste a link / property id"
            className="flex-1 px-3 py-2.5 rounded-xl border border-[#e3e9e1] text-sm"
          />
          <button onClick={openCode} className="ap-icon-btn bg-[#18271f] text-white border-[#18271f]" aria-label="Open">
            <ArrowRight size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200">
          <button onClick={() => setLocation("/")} className="hover:text-stone-900 font-medium">
            ← AirPal Portal
          </button>
          <button onClick={() => setLocation("/auth")} className="text-amber-700 hover:text-amber-800 font-semibold">
            Host Sign In →
          </button>
        </div>
      </div>
      <QrScanSheet
        isOpen={scanOpen}
        onClose={() => setScanOpen(false)}
        onResult={(intent) => {
          if (intent.kind === "stay") {
            setLocation(`/g/${intent.propertyId}${intent.room ? `?type=room&room=${intent.room}` : ""}`);
          } else if (intent.kind === "campus") {
            setLocation(`/c/${intent.campusId}${intent.room ? `?room=${intent.room}` : ""}`);
          } else if (intent.kind === "url") {
            setLocation(intent.href);
          } else if (intent.kind === "trip") {
            setLocation(`/os?trip=${intent.tripId}`);
          } else {
            toast.message("Not an AirPal QR", { description: "Ask the host for the code on the desk." });
          }
        }}
      />
    </div>
  );
}
