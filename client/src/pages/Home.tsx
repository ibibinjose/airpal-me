import { useState } from "react";
import {
  ArrowRight,
  DoorOpen,
  ExternalLink,
  Key,
  LogIn,
  LogOut,
  MapPin,
  QrCode,
  Send,
  Sparkles,
  Utensils,
  Wifi,
  BedDouble,
  Building2,
  ChevronRight,
  Smartphone,
  Check,
  Clock,
  Waves,
  Coffee,
  HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { RealtimeTopBar } from "../components/RealtimeTopBar";
import { CURRENT_PROPERTY } from "@shared/airpal-data";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, role, logout } = useAuth();
  const [selectedRoom, setSelectedRoom] = useState<string>("508");
  const [customRoomInput, setCustomRoomInput] = useState<string>("");

  // In-app interactive preview states
  const [wifiCopied, setWifiCopied] = useState(false);
  const [previewCategory, setPreviewCategory] = useState<"stay" | "dining" | "concierge">("stay");
  const [conciergeQuery, setConciergeQuery] = useState("");
  const [conciergeReply, setConciergeReply] = useState<string | null>(null);

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(CURRENT_PROPERTY.wifi.password);
    setWifiCopied(true);
    toast.success("Wi-Fi Password Copied to Clipboard", {
      description: `Network: ${CURRENT_PROPERTY.wifi.network}`,
    });
    setTimeout(() => setWifiCopied(false), 2500);
  };

  const handleSendConcierge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conciergeQuery.trim()) return;
    const q = conciergeQuery.trim();
    setConciergeQuery("");
    if (q.toLowerCase().includes("wifi") || q.toLowerCase().includes("password")) {
      setConciergeReply(`Wi-Fi is "${CURRENT_PROPERTY.wifi.network}" (Password: ${CURRENT_PROPERTY.wifi.password})`);
    } else if (q.toLowerCase().includes("towel") || q.toLowerCase().includes("housekeeping")) {
      setConciergeReply(`Housekeeping has been dispatched to Room ${selectedRoom}! Fresh towels on the way.`);
    } else if (q.toLowerCase().includes("breakfast") || q.toLowerCase().includes("food") || q.toLowerCase().includes("dining")) {
      setConciergeReply("Artisan Breakfast is served 6:30 AM – 10:30 AM in the Atrium. You can also order room service below.");
    } else if (q.toLowerCase().includes("pool") || q.toLowerCase().includes("gym")) {
      setConciergeReply("Rooftop Plunge Pool (Level 7) & Wellness Gym are open 6:00 AM – 10:00 PM.");
    } else {
      setConciergeReply(`Front desk notified for Room ${selectedRoom}. Our team will assist you immediately.`);
    }
  };

  const handleUnlockRoom = (roomNum?: string) => {
    const target = (roomNum || customRoomInput || selectedRoom).trim();
    if (!target) {
      toast.error("Please enter a room number");
      return;
    }
    setLocation(`/stay?room=${encodeURIComponent(target)}`);
  };

  return (
    <main className="min-h-screen bg-[#f9f8f4] text-[#16211c] flex flex-col font-sans selection:bg-amber-200">
      {/* Realtime Sydney Local Time & Weather Header */}
      <RealtimeTopBar className="sticky top-0 z-50 border-b border-[#dde3db] bg-[#fffdf9]/95 backdrop-blur-md" />

      {/* Clean Luxury Hospitality Navigation */}
      <header className="border-b border-[#dde3db] bg-[#fffdf9]/85 backdrop-blur-sm sticky top-[37px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2.5 text-left group"
            >
              <span className="w-8 h-8 rounded-xl bg-[#16211c] text-white font-bold grid place-items-center text-sm shadow-sm group-hover:scale-105 transition-transform">
                A
              </span>
              <div>
                <span className="font-display text-lg font-bold tracking-tight text-[#16211c] block leading-tight">
                  AirPal<span className="text-amber-600">.me</span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 block leading-tight">
                  Hospitality Experience OS
                </span>
              </div>
            </button>
          </div>

          {/* Core Useful Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium text-stone-700">
            <button
              onClick={() => setLocation(`/stay?room=${selectedRoom}`)}
              className="px-3 py-2 rounded-xl hover:bg-[#f2f5ef] hover:text-stone-950 transition-colors flex items-center gap-1.5"
            >
              <DoorOpen size={14} className="text-amber-700" />
              <span>In-Room Stay</span>
            </button>

            <button
              onClick={() => setLocation(`/stay?room=${selectedRoom}&open=dining`)}
              className="px-3 py-2 rounded-xl hover:bg-[#f2f5ef] hover:text-stone-950 transition-colors flex items-center gap-1.5"
            >
              <Utensils size={14} className="text-emerald-700" />
              <span>Dining & Bar</span>
            </button>

            <button
              onClick={() => setLocation("/scan")}
              className="px-3 py-2 rounded-xl hover:bg-[#f2f5ef] hover:text-stone-950 transition-colors flex items-center gap-1.5"
            >
              <QrCode size={14} className="text-stone-600" />
              <span>Scan Key QR</span>
            </button>

            <button
              onClick={() => setLocation("/host")}
              className="px-3 py-2 rounded-xl hover:bg-[#f2f5ef] hover:text-stone-950 transition-colors flex items-center gap-1.5"
            >
              <Building2 size={14} className="text-stone-600" />
              <span>Host Studio</span>
            </button>
          </nav>

          {/* Session & Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLocation("/demo")}
              className="px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-950 font-mono text-xs font-bold border border-amber-300 transition-all flex items-center gap-1.5 shadow-2xs"
              title="Safe simulated sandbox"
            >
              <Sparkles size={13} className="text-amber-600" />
              <span>Sandbox Demo</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <button
                  onClick={() => setLocation(role === "super_admin" ? "/admin" : "/host")}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="max-w-[120px] truncate">{user.displayName}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    toast.success("Signed out successfully");
                  }}
                  className="p-2 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={15} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLocation("/auth")}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow transition-all flex items-center gap-1.5"
              >
                <LogIn size={13} />
                <span>Hotelier Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Experience Hub */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Luxury Hero & Quick Room Access Card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#fffefc] to-[#f4f7f1] border border-[#dce3da] p-6 sm:p-10 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 font-mono text-xs font-bold border border-emerald-300/80">
              <MapPin size={12} className="text-emerald-700" />
              <span>Harbour Hotel & Suites · The Rocks, Sydney</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight text-[#16211c] leading-[1.08]">
              Your Stay, Seamlessly Curated.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
              Instant high-speed Wi-Fi, artisan room service dining, rooftop pool access, and 24/7 in-room concierge. Zero app store downloads required.
            </p>
          </div>

          {/* Quick Room Unlock Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-sm space-y-3 max-w-2xl">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span className="flex items-center gap-1.5">
                <Key size={14} className="text-amber-700" />
                <span>Unlock Your In-Room Companion</span>
              </span>
              <span className="text-[11px] text-stone-500 font-mono">No password required</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customRoomInput}
                  onChange={(e) => setCustomRoomInput(e.target.value)}
                  placeholder={`Enter your room number (e.g. ${selectedRoom})`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleUnlockRoom()}
                />
              </div>

              <button
                onClick={() => handleUnlockRoom()}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0"
              >
                <span>Unlock Room {customRoomInput || selectedRoom}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Quick Room Preset Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-stone-500">Quick select:</span>
              {["101", "204", "305", "508"].map((rm) => (
                <button
                  key={rm}
                  onClick={() => {
                    setSelectedRoom(rm);
                    setCustomRoomInput(rm);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    selectedRoom === rm && !customRoomInput
                      ? "bg-amber-100 text-amber-950 border border-amber-300 font-bold shadow-2xs"
                      : "bg-[#f5f8f3] text-stone-700 hover:bg-stone-200 border border-transparent"
                  }`}
                >
                  Room {rm}
                </button>
              ))}

              <button
                onClick={() => setLocation("/scan")}
                className="ml-auto text-[11px] font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
              >
                <QrCode size={12} />
                <span>Scan Key QR Instead</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4 Core Useful Application Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: In-Room Companion */}
          <div className="p-5 rounded-3xl bg-white border border-[#dde3db] shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 grid place-items-center font-bold">
                <DoorOpen size={20} />
              </div>
              <div>
                <h2 className="font-bold text-base text-[#16211c]">In-Room Companion</h2>
                <p className="text-xs text-stone-500 leading-relaxed mt-1">
                  1-tap hotel Wi-Fi connection, live room charges folio, express check-out, and housekeeping dispatch.
                </p>
              </div>

              <div className="space-y-1 text-xs text-stone-600 font-mono pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Wi-Fi: Harbour_Guest (5G)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Room {selectedRoom} active folio</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleUnlockRoom()}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Companion</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 2: In-Room Dining & Bar */}
          <div className="p-5 rounded-3xl bg-white border border-[#dde3db] shadow-sm hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 grid place-items-center font-bold">
                <Utensils size={20} />
              </div>
              <div>
                <h2 className="font-bold text-base text-[#16211c]">Artisan Dining & Bar</h2>
                <p className="text-xs text-stone-500 leading-relaxed mt-1">
                  Order gourmet breakfast, barista coffee, evening dining, and wine direct to Room {selectedRoom} with live kitchen updates.
                </p>
              </div>

              <div className="space-y-1 text-xs text-stone-600 font-mono pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Breakfast: 6:30 AM – 10:30 AM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>Room service: ~20 min delivery</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setLocation(`/stay?room=${selectedRoom}&open=dining`)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Browse Dining Menu</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 3: Amenities & Wellness */}
          <div className="p-5 rounded-3xl bg-white border border-[#dde3db] shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 grid place-items-center font-bold">
                <Waves size={20} />
              </div>
              <div>
                <h2 className="font-bold text-base text-[#16211c]">Amenities & Wellness</h2>
                <p className="text-xs text-stone-500 leading-relaxed mt-1">
                  Rooftop heated plunge pool (Level 7), 24h wellness studio, steam sauna, and curated Sydney Harbour audio walks.
                </p>
              </div>

              <div className="space-y-1 text-xs text-stone-600 font-mono pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span>Plunge Pool: 6 AM – 10 PM</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>The Rocks heritage audio walking tour</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setLocation(`/stay?room=${selectedRoom}&tab=explore`)}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Facilities</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 4: Hotelier & Host Studio */}
          <div className="p-5 rounded-3xl bg-white border border-[#dde3db] shadow-sm hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 grid place-items-center font-bold">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="font-bold text-base text-[#16211c]">Hotelier & Host Studio</h2>
                <p className="text-xs text-stone-500 leading-relaxed mt-1">
                  Property management suite to configure Wi-Fi credentials, dining menus, room service tickets, and print-ready QR keys.
                </p>
              </div>

              <div className="space-y-1 text-xs text-stone-600 font-mono pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>Live ticket dispatch & audio alerts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Instant menu item price updates</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setLocation("/host")}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-900 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Host Studio</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </section>

        {/* Tactile In-Room Companion Simulator */}
        <section className="bg-white rounded-3xl border border-[#dde3db] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-700">
                Live Interactive Experience
              </span>
              <h2 className="text-2xl font-bold font-display text-[#16211c]">
                Your Stay in the Palm of Your Hand
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLocation(`/stay?room=${selectedRoom}`)}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow flex items-center gap-1.5"
              >
                <span>Full-Screen Companion</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Phone Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-[300px] sm:w-[320px] rounded-[2.5rem] border-[6px] border-stone-800 bg-[#f9f8f4] shadow-2xl overflow-hidden flex flex-col h-[520px]">
                {/* Phone Speaker Notch */}
                <div className="h-6 bg-stone-800 flex justify-center items-center">
                  <div className="w-16 h-2 bg-stone-700 rounded-full" />
                </div>

                {/* Companion Header */}
                <div className="p-4 bg-white border-b border-stone-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                      Room {selectedRoom}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="font-display font-bold text-base text-stone-900 leading-tight">
                    Harbour Hotel Sydney
                  </div>
                </div>

                {/* Interactive Wi-Fi Button */}
                <div className="p-3 bg-amber-50/80 border-b border-amber-200/80">
                  <button
                    onClick={handleCopyWifi}
                    className="w-full p-2.5 rounded-xl bg-white border border-amber-300 shadow-2xs hover:bg-amber-50 flex items-center justify-between text-left transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Wifi size={16} className="text-amber-700" />
                      <div>
                        <strong className="block text-xs text-stone-900 font-bold">1-Tap Wi-Fi Access</strong>
                        <span className="text-[10px] text-stone-500 font-mono">
                          {CURRENT_PROPERTY.wifi.network}
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md bg-stone-900 text-white font-mono text-[10px] font-bold">
                      {wifiCopied ? "Copied!" : "Connect"}
                    </span>
                  </button>
                </div>

                {/* Sub-tab Navigation */}
                <div className="flex items-center justify-around border-b border-stone-200 bg-[#fbfbfa] p-1 mx-3 mt-3 rounded-xl text-[11px] font-semibold">
                  <button
                    onClick={() => setPreviewCategory("stay")}
                    className={`flex-1 py-1 rounded-lg text-center ${previewCategory === "stay" ? "bg-white text-stone-950 shadow-2xs font-bold" : "text-stone-500"}`}
                  >
                    Stay
                  </button>
                  <button
                    onClick={() => setPreviewCategory("dining")}
                    className={`flex-1 py-1 rounded-lg text-center ${previewCategory === "dining" ? "bg-white text-stone-950 shadow-2xs font-bold" : "text-stone-500"}`}
                  >
                    Dining
                  </button>
                  <button
                    onClick={() => setPreviewCategory("concierge")}
                    className={`flex-1 py-1 rounded-lg text-center ${previewCategory === "concierge" ? "bg-white text-stone-950 shadow-2xs font-bold" : "text-stone-500"}`}
                  >
                    AI Concierge
                  </button>
                </div>

                {/* Simulator Body */}
                <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                  {previewCategory === "stay" && (
                    <div className="space-y-2">
                      <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-1">
                        <span className="text-[10px] font-mono text-amber-700 font-bold uppercase">Amenities</span>
                        <div className="font-semibold text-stone-900">Rooftop Plunge Pool (Level 7)</div>
                        <span className="text-[11px] text-stone-500 block">Open 6:00 AM – 10:00 PM · Heated</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-white border border-stone-200 space-y-1">
                        <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">Breakfast</span>
                        <div className="font-semibold text-stone-900">Atrium Restaurant</div>
                        <span className="text-[11px] text-stone-500 block">6:30 AM – 10:30 AM · Ground Floor</span>
                      </div>
                    </div>
                  )}

                  {previewCategory === "dining" && (
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                        <div>
                          <strong className="block text-stone-900 font-bold">Artisan Wagyu Burger</strong>
                          <span className="text-[10px] text-stone-500">$26 · Truffle Fries</span>
                        </div>
                        <button
                          onClick={() => toast.success(`Added Burger to Room ${selectedRoom} tab`)}
                          className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-bold"
                        >
                          Order
                        </button>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                        <div>
                          <strong className="block text-stone-900 font-bold">Barista Flat White</strong>
                          <span className="text-[10px] text-stone-500">$6 · Organic Oat Milk</span>
                        </div>
                        <button
                          onClick={() => toast.success(`Added Coffee to Room ${selectedRoom} tab`)}
                          className="px-2.5 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-bold"
                        >
                          Order
                        </button>
                      </div>
                    </div>
                  )}

                  {previewCategory === "concierge" && (
                    <div className="space-y-2">
                      {conciergeReply && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] leading-relaxed">
                          {conciergeReply}
                        </div>
                      )}
                      <form onSubmit={handleSendConcierge} className="flex gap-1 pt-1">
                        <input
                          type="text"
                          value={conciergeQuery}
                          onChange={(e) => setConciergeQuery(e.target.value)}
                          placeholder="Ask for towels, checkout, food..."
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs outline-none focus:border-stone-800"
                        />
                        <button type="submit" className="p-2 rounded-lg bg-stone-900 text-white">
                          <Send size={12} />
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Phone footer */}
                <div className="p-2.5 bg-white border-t border-stone-200 text-center">
                  <button
                    onClick={() => setLocation(`/stay?room=${selectedRoom}`)}
                    className="text-[11px] font-bold text-amber-800 hover:underline flex items-center justify-center gap-1 mx-auto"
                  >
                    <span>Launch Full Experience</span>
                    <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            </div>

            {/* Explanatory Luxury Highlights Beside Phone */}
            <div className="lg:col-span-7 space-y-6 pt-2">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-[#16211c]">
                  Effortless In-Room Hospitality
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Crafted for high-end boutique hotels and luxury resorts. Guests scan the bedside key stand with their smartphone camera to instantly access property amenities, dining, and Wi-Fi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-[#fbfcfb] border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                    <Key size={14} className="text-amber-600" />
                    <span>Bound to Room {selectedRoom}</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Dining orders, room requests, and billing automatically connect to this specific guest room.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#fbfcfb] border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                    <Wifi size={14} className="text-amber-600" />
                    <span>Instant 1-Tap Wi-Fi</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Guests tap once to copy the password. Eliminates reception phone calls for network credentials.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#fbfcfb] border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                    <Utensils size={14} className="text-emerald-600" />
                    <span>Digital Room Service</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Full menu with breakfast, chef specials, and drinks. Orders route directly to the kitchen.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#fbfcfb] border border-stone-200/80 space-y-1">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                    <Sparkles size={14} className="text-purple-600" />
                    <span>24/7 AI Concierge</span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Instant answers for pool hours, check-out times, extra pillows, and Sydney local recommendations.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setLocation(`/stay?room=${selectedRoom}`)}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs shadow hover:bg-stone-800 flex items-center gap-2"
                >
                  <span>Open Room {selectedRoom} Companion</span>
                  <ArrowRight size={13} />
                </button>
                <button
                  onClick={() => setLocation("/scan")}
                  className="px-4 py-2.5 rounded-xl bg-[#f4f7f2] text-stone-800 font-semibold text-xs border border-stone-300 hover:bg-stone-100 flex items-center gap-1.5"
                >
                  <QrCode size={13} />
                  <span>Scan Room QR</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Hotelier Callout Banner */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#f5f8f3] border border-[#d9e0d6] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono uppercase font-bold text-stone-500">
              For Hotel Owners & Property Operators
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#16211c]">
              Empower Your Hotel Team with AirPal Host Studio
            </h3>
            <p className="text-xs text-stone-600 max-w-xl">
              Set up your property in minutes. Customize dining menus, generate print-ready wooden QR key stands, and fulfill guest requests in real time.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setLocation("/start")}
              className="px-4 py-2.5 rounded-xl bg-[#16211c] hover:bg-stone-800 text-white font-bold text-xs shadow flex items-center gap-1.5"
            >
              <span>Set Up Property</span>
              <ArrowRight size={12} />
            </button>
            <button
              onClick={() => setLocation("/host")}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-900 font-semibold text-xs border border-stone-300 shadow-xs"
            >
              <span>Host Sign In</span>
            </button>
          </div>
        </section>
      </div>

      {/* Clean Minimalist Modern Footer */}
      <footer className="border-t border-[#dde3db] bg-[#fffdf9] py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-stone-800">AirPal Hospitality Cloud</span>
            <span>· All Systems Operational</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-600">
            <button onClick={() => setLocation(`/stay?room=${selectedRoom}`)} className="hover:text-stone-950">
              In-Room Stay
            </button>
            <button onClick={() => setLocation(`/stay?room=${selectedRoom}&open=dining`)} className="hover:text-stone-950">
              Dining & Bar
            </button>
            <button onClick={() => setLocation("/host")} className="hover:text-stone-950">
              Host Studio
            </button>
            <button onClick={() => setLocation("/scan")} className="hover:text-stone-950">
              Scan Room QR
            </button>
            <button onClick={() => setLocation("/demo")} className="hover:text-stone-950">
              Sandbox Demo
            </button>
            <button onClick={() => setLocation("/auth")} className="hover:text-stone-950">
              Sign In
            </button>
          </div>

          <div className="text-stone-400 font-mono text-[11px]">
            © 2026 AirPal.me · Sydney, Australia
          </div>
        </div>
      </footer>
    </main>
  );
}
