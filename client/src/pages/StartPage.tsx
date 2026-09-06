import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, Building2, Copy, GraduationCap, Mail, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { makeQrDataUrl, stayQrPayload, campusQrPayload } from "../lib/qr";
import { leaveDemo } from "../lib/app-mode";
import { DEMO_USERS } from "@shared/airpal-data";

type Kind = "hotel" | "campus" | "guest";

export default function StartPage() {
  const { register, user, isHostAdmin } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [kind, setKind] = useState<Kind>("hotel");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [city, setCity] = useState("");
  const [wifiName, setWifiName] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [qr, setQr] = useState("");
  const [guestUrl, setGuestUrl] = useState("");

  useEffect(() => {
    leaveDemo();
  }, []);

  const kindLabel = kind === "campus" ? "college" : "property";

  const finish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !placeName) return;
    setBusy(true);
    const ok = await register(email, name, "host_admin", placeName, {
      kind,
      city,
      wifiNetwork: wifiName,
      wifiPassword: wifiPass,
      password,
    });
    setBusy(false);
    if (!ok) return;
    const id = placeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const payload = kind === "campus" ? campusQrPayload(id, "R12") : stayQrPayload(id, "101");
    setGuestUrl(payload);
    setQr(await makeQrDataUrl(payload));
    setStep(3);
  };

  const alreadyHost = user && isHostAdmin && !DEMO_USERS.some((row) => row.uid === user.uid);

  if (alreadyHost && step === 1) {
    return (
      <div className="min-h-dvh bg-[#f9f8f4] grid place-items-center px-4">
        <div className="max-w-md w-full ap-card p-8 text-center space-y-3">
          <p className="ap-kicker">You’re signed in</p>
          <h1 className="ap-display text-3xl">Welcome back, {user.displayName}</h1>
          <p className="text-sm text-[#5a6b62]">Manage Wi-Fi, menus, and print QR codes for your guests.</p>
          <button onClick={() => setLocation("/host")} className="w-full py-3 rounded-full bg-[#18271f] text-white text-sm font-semibold">
            Open dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#f9f8f4] text-[#16211c]">
      <div className="max-w-lg mx-auto px-4 py-10 space-y-6">
        <div className="text-center">
          <img src="/logo-mark.png" alt="" className="mx-auto w-12 h-12 object-contain" />
          <p className="ap-kicker mt-3">Get started</p>
          <h1 className="ap-display text-3xl mt-1">From signup to a QR on the door</h1>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-[#5a6b62] text-center">Who is this for?</p>
            {(
              [
                { id: "hotel" as const, icon: Building2, title: "I run a hotel or stay", text: "Create a guest companion. Print a room QR. Guests scan — no app." },
                { id: "campus" as const, icon: GraduationCap, title: "I run a college", text: "Timetable, dining, help. One campus QR." },
                { id: "guest" as const, icon: MapPin, title: "I’m a guest or student", text: "You don’t sign up. Scan the QR in the room or on the gate." },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  if (opt.id === "guest") {
                    setLocation("/scan");
                    return;
                  }
                  setKind(opt.id);
                  setStep(2);
                }}
                className="w-full text-left ap-card p-4 flex gap-3"
              >
                <opt.icon size={20} className="text-[#c57a32] shrink-0 mt-0.5" />
                <span>
                  <strong className="block text-sm">{opt.title}</strong>
                  <span className="text-xs text-[#5a6b62]">{opt.text}</span>
                </span>
              </button>
            ))}
            <p className="text-center text-[11px] text-[#7a877f] pt-2">
              Want the Harbour Hotel sample first?{" "}
              <button className="font-semibold text-[#c57a32]" onClick={() => setLocation("/demo")}>
                Open the demo
              </button>
            </p>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={finish} className="ap-card p-5 space-y-3">
            <p className="text-xs text-[#5a6b62]">
              Create your {kindLabel}. You can edit Wi-Fi and menus after this.
            </p>
            <label className="block text-xs font-semibold">
              Your name
              <span className="relative block mt-1">
                <User size={14} className="absolute left-3 top-3 text-[#7a877f]" />
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e3e9e1] bg-white text-sm" />
              </span>
            </label>
            <label className="block text-xs font-semibold">
              Email
              <span className="relative block mt-1">
                <Mail size={14} className="absolute left-3 top-3 text-[#7a877f]" />
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#e3e9e1] bg-white text-sm" />
              </span>
            </label>
            <label className="block text-xs font-semibold">
              Password
              <input required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#e3e9e1] bg-white text-sm" />
            </label>
            <label className="block text-xs font-semibold">
              {kind === "campus" ? "College name" : "Property name"}
              <input required value={placeName} onChange={(e) => setPlaceName(e.target.value)} placeholder={kind === "campus" ? "Harbour College" : "The Local Inn"} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#e3e9e1] bg-white text-sm" />
            </label>
            <label className="block text-xs font-semibold">
              City
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Sydney" className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#e3e9e1] bg-white text-sm" />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs font-semibold">
                Wi-Fi name
                <input value={wifiName} onChange={(e) => setWifiName(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#e3e9e1] bg-white text-sm" />
              </label>
              <label className="block text-xs font-semibold">
                Wi-Fi password
                <input value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-[#e3e9e1] bg-white text-sm" />
              </label>
            </div>
            <button disabled={busy} type="submit" className="w-full py-3 rounded-full bg-[#18271f] text-white text-sm font-semibold inline-flex items-center justify-center gap-2">
              Create {kindLabel} <ArrowRight size={16} />
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-[11px] text-[#7a877f]">
              Back
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="ap-card p-6 space-y-4 text-center">
            <p className="ap-kicker">Ready to print</p>
            <h2 className="ap-display text-2xl">{placeName} is live</h2>
            <p className="text-sm text-[#5a6b62]">Put this QR on the desk or gate. Guests scan it. They do not create an account.</p>
            {qr && <img src={qr} alt="Guest QR" className="mx-auto w-48 h-48 rounded-2xl border border-[#e3e9e1]" />}
            <p className="text-[10px] font-mono text-[#7a877f] break-all">{guestUrl}</p>
            <button
              onClick={() => {
                void navigator.clipboard.writeText(guestUrl);
                toast.success("Guest link copied");
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#c57a32]"
            >
              <Copy size={12} /> Copy guest link
            </button>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={() => window.open(guestUrl, "_blank")} className="py-3 rounded-full bg-[#18271f] text-white text-xs font-semibold">
                Open as guest
              </button>
              <button onClick={() => setLocation("/host")} className="py-3 rounded-full border border-[#e3e9e1] bg-white text-xs font-semibold">
                Host dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
