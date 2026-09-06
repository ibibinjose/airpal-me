import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  Wifi,
  Utensils,
  Sparkles,
  Tag,
  BellRing,
  Coffee,
  CheckCircle2,
  Copy,
  Check,
  ChevronRight,
  ArrowLeft,
  Send,
  MessageSquare,
  Clock,
  MapPin,
  ExternalLink,
  DoorOpen,
  ChevronDown,
  BedDouble,
  X,
} from "lucide-react";
import {
  getSandboxProperties,
  getSandboxDeals,
  getSandboxMenu,
  addSandboxTicket,
  getSandboxActivePropertyId,
} from "./demo-sandbox";
import { DemoBanner } from "./DemoBanner";
import { RealtimeTopBar } from "../components/RealtimeTopBar";
import { toast } from "sonner";

export const DemoStayPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const properties = getSandboxProperties();
  const currentProperty = properties.find((p) => p.id === getSandboxActivePropertyId()) || properties[0];

  const deals = getSandboxDeals(currentProperty.id);
  const menu = getSandboxMenu(currentProperty.id);

  const [activeTab, setActiveTab] = useState<"hub" | "dining" | "deals" | "concierge">("hub");
  const [roomNumber, setRoomNumber] = useState<string>("508");
  const [showRoomModal, setShowRoomModal] = useState<boolean>(false);
  const [customRoomInput, setCustomRoomInput] = useState<string>("");
  const [wifiCopied, setWifiCopied] = useState(false);
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "guest" | "concierge"; text: string }>>([
    { sender: "concierge", text: `Welcome to ${currentProperty.name}! I am your in-house digital concierge. How may I assist your stay in Room ${roomNumber} today?` },
  ]);

  const copyWifi = () => {
    navigator.clipboard.writeText(currentProperty.wifi?.password || "HarbourLuxury2026");
    setWifiCopied(true);
    toast.success("Wi-Fi Password Copied to Clipboard!");
    setTimeout(() => setWifiCopied(false), 2500);
  };

  const handleOrderDining = (item: (typeof menu)[0]) => {
    addSandboxTicket({
      propertyId: currentProperty.id,
      roomNumber: roomNumber,
      guestName: "Sophia Rossi",
      category: "dining",
      details: `1x ${item.name} ($${item.price}) delivered to Room ${roomNumber}.`,
      status: "pending",
      urgency: "normal",
    });
    toast.success(`Ordered ${item.name}!`, {
      description: `Dispatched to front desk & kitchen queue for Room ${roomNumber}.`,
    });
  };

  const handleBookDeal = (deal: (typeof deals)[0]) => {
    addSandboxTicket({
      propertyId: currentProperty.id,
      roomNumber: roomNumber,
      guestName: "Sophia Rossi",
      category: "reception",
      details: `Guest in Room ${roomNumber} claimed promo "${deal.title}" for $${deal.price}.`,
      status: "in_progress",
      urgency: "urgent",
    });
    toast.success(`Booked ${deal.title}!`, {
      description: `Added to Room ${roomNumber} folio. Staff notified.`,
    });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const query = chatMessage.trim();
    setChatMessage("");
    setChatHistory((prev) => [...prev, { sender: "guest", text: query }]);

    setTimeout(() => {
      let reply = "Certainly! I have logged your request with our front desk team. Someone will assist you shortly.";
      if (query.toLowerCase().includes("towel") || query.toLowerCase().includes("pillow")) {
        reply = `I've dispatched housekeeping Floor 5 with extra plush towels and pillows for Room ${roomNumber} right away!`;
        addSandboxTicket({
          propertyId: currentProperty.id,
          roomNumber: roomNumber,
          guestName: "Sophia Rossi",
          category: "housekeeping",
          details: query,
          status: "pending",
          urgency: "normal",
        });
      } else if (query.toLowerCase().includes("checkout") || query.toLowerCase().includes("late")) {
        reply = `Standard checkout is 11:00 AM. I have reserved our late 2:00 PM checkout pass for Room ${roomNumber}!`;
      } else if (query.toLowerCase().includes("wifi") || query.toLowerCase().includes("password")) {
        reply = `Our Wi-Fi is '${currentProperty.wifi?.network}' with password '${currentProperty.wifi?.password}'.`;
      }

      setChatHistory((prev) => [...prev, { sender: "concierge", text: reply }]);
    }, 600);
  };

  const handleSwitchRoom = (newRoom: string) => {
    if (!newRoom.trim()) return;
    const r = newRoom.trim();
    setRoomNumber(r);
    setShowRoomModal(false);
    setChatHistory((prev) => [
      ...prev,
      { sender: "concierge", text: `Active key updated! Now assisting your stay in Room ${r}.` },
    ]);
    toast.success(`Switched to Room ${r}`, {
      description: `Guest orders and requests are now bound to Room ${r}.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f1] text-[#16211c] flex flex-col font-sans">
      <RealtimeTopBar className="sticky top-0 z-40 border-b border-[#dde3db]" />
      <DemoBanner currentRoute="/demo/stay" />

      <div className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 lg:p-8">
        
        {/* Mobile Device Frame Mockup */}
        <div className="w-full max-w-md bg-white rounded-3xl sm:rounded-[36px] border border-stone-300/80 shadow-2xl overflow-hidden flex flex-col min-h-[680px]">
          
          {/* Guest Companion Header */}
          <div className="bg-gradient-to-br from-[#1d2f25] via-[#16241c] to-[#0f1a14] text-white p-5 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-semibold">
                <Sparkles size={11} />
                <span>Zero-App Guest Companion</span>
              </div>
              <button
                type="button"
                onClick={() => setShowRoomModal(true)}
                className="font-mono text-xs text-amber-950 font-bold bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
                title="Click to switch room number"
              >
                <DoorOpen size={12} />
                <span>Room {roomNumber}</span>
                <ChevronDown size={11} className="opacity-80" />
              </button>
            </div>

            <div>
              <h1 className="text-xl font-bold font-display tracking-tight text-white leading-tight">
                {currentProperty.name}
              </h1>
              <p className="text-[11px] text-stone-300">{currentProperty.destination}</p>
            </div>

            {/* Room Key & Folio Status Pill */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/10 border border-white/15 text-[11px]">
              <div className="flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-stone-300">Active Key:</span>
                <strong className="text-amber-300 font-bold">Room {roomNumber}</strong>
              </div>
              <button
                type="button"
                onClick={() => setShowRoomModal(true)}
                className="text-[10px] text-amber-300 hover:text-white underline font-semibold"
              >
                Switch Room
              </button>
            </div>

            {/* Quick 1-Tap Wi-Fi Card */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-stone-950 grid place-items-center shrink-0">
                  <Wifi size={14} />
                </div>
                <div className="truncate">
                  <span className="text-[10px] text-stone-300 block">High-Speed Guest Wi-Fi</span>
                  <strong className="text-white text-xs block font-mono truncate">
                    {currentProperty.wifi?.network || "GrandHarbour_Guest"}
                  </strong>
                </div>
              </div>

              <button
                type="button"
                onClick={copyWifi}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-[11px] transition-colors shrink-0 shadow-xs"
              >
                {wifiCopied ? <Check size={12} /> : <Copy size={12} />}
                <span>{wifiCopied ? "Copied" : "Connect"}</span>
              </button>
            </div>
          </div>

          {/* Navigation Pill Bar */}
          <div className="flex items-center justify-around border-b border-stone-100 bg-[#fbfbfa] p-1 text-xs">
            <button
              onClick={() => setActiveTab("hub")}
              className={`flex-1 py-2 text-center font-medium rounded-xl transition-colors ${
                activeTab === "hub" ? "bg-white text-stone-950 font-bold shadow-2xs" : "text-stone-500"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("dining")}
              className={`flex-1 py-2 text-center font-medium rounded-xl transition-colors ${
                activeTab === "dining" ? "bg-white text-stone-950 font-bold shadow-2xs" : "text-stone-500"
              }`}
            >
              Dining
            </button>
            <button
              onClick={() => setActiveTab("deals")}
              className={`flex-1 py-2 text-center font-medium rounded-xl transition-colors ${
                activeTab === "deals" ? "bg-white text-stone-950 font-bold shadow-2xs" : "text-stone-500"
              }`}
            >
              Deals ({deals.length})
            </button>
            <button
              onClick={() => setActiveTab("concierge")}
              className={`flex-1 py-2 text-center font-medium rounded-xl transition-colors ${
                activeTab === "concierge" ? "bg-white text-stone-950 font-bold shadow-2xs" : "text-stone-500"
              }`}
            >
              Chat
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
            
            {/* 1. Overview */}
            {activeTab === "hub" && (
              <div className="space-y-4">
                {/* Hotel Breakfast Times */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <div className="flex items-center justify-between font-bold text-amber-950 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Coffee size={13} className="text-amber-600" />
                      <span>Breakfast & Dining</span>
                    </span>
                    <span className="font-mono text-[10px] text-amber-800">{currentProperty.breakfast?.hours}</span>
                  </div>
                  <p className="text-[11px] text-amber-900">{currentProperty.breakfast?.location} · {currentProperty.breakfast?.type}</p>
                </div>

                {/* Featured In-Room Deal */}
                {deals[0] && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#18271f] to-[#121e17] text-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-stone-950 font-bold text-[10px]">
                        {deals[0].discountBadge || "Exclusive Deal"}
                      </span>
                      <span className="font-bold text-amber-300 font-display text-sm">${deals[0].price}</span>
                    </div>
                    <h3 className="font-bold text-sm text-white">{deals[0].title}</h3>
                    <p className="text-[11px] text-stone-300">{deals[0].subtitle}</p>
                    <button
                      type="button"
                      onClick={() => handleBookDeal(deals[0])}
                      className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors mt-2"
                    >
                      1-Tap Order to Room 508
                    </button>
                  </div>
                )}

                {/* Facilities List */}
                <div className="space-y-2 pt-1">
                  <span className="font-bold text-stone-800 block text-xs">Hotel Facilities & Hours</span>
                  <div className="space-y-1.5">
                    {currentProperty.facilities?.map((f) => (
                      <div key={f.name} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                        <div>
                          <strong className="text-stone-900 block font-semibold">{f.name}</strong>
                          <span className="text-[10px] text-stone-500">{f.floor} · {f.details}</span>
                        </div>
                        <span className="font-mono text-[10px] text-stone-600 font-medium">{f.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Dining Menu */}
            {activeTab === "dining" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">Room Service Menu</h3>
                  <span className="text-[11px] text-stone-400">Delivered in 25 mins</span>
                </div>

                <div className="space-y-2.5">
                  {menu.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white border border-stone-200 shadow-2xs flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <strong className="text-stone-900 text-xs block font-semibold truncate">{item.name}</strong>
                        <p className="text-[10px] text-stone-500 line-clamp-1">{item.description}</p>
                        <span className="font-bold text-stone-900 font-display block text-xs">${item.price}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOrderDining(item)}
                        className="px-3 py-1.5 rounded-xl bg-[#18271f] hover:bg-[#23382c] text-white font-semibold text-[11px] shrink-0"
                      >
                        Order
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Deals & Experiences */}
            {activeTab === "deals" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">In-House Guest Exclusives</h3>
                  <span className="text-[11px] text-stone-400">Charged to Room Folio</span>
                </div>

                <div className="space-y-3">
                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                          {deal.discountBadge || "Special"}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-sm text-stone-900 font-display">${deal.price}</span>
                          {deal.originalPrice && (
                            <span className="text-[10px] line-through text-stone-400">${deal.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <h4 className="font-bold text-stone-900 text-xs">{deal.title}</h4>
                      <p className="text-[11px] text-stone-600">{deal.subtitle}</p>

                      <button
                        type="button"
                        onClick={() => handleBookDeal(deal)}
                        className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] transition-colors"
                      >
                        Book Experience
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Concierge AI Chat */}
            {activeTab === "concierge" && (
              <div className="flex flex-col h-full space-y-3">
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[320px] pr-1">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.sender === "guest" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`p-2.5 rounded-2xl max-w-[82%] text-xs ${
                          msg.sender === "guest"
                            ? "bg-[#18271f] text-white rounded-tr-xs"
                            : "bg-stone-100 text-stone-900 rounded-tl-xs border border-stone-200"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex items-center gap-1.5 pt-2 border-t border-stone-100">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Ask for extra towels, late checkout..."
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-[#18271f] text-white hover:bg-[#23382c]"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Bottom Bar in Phone Frame */}
          <div className="p-3 bg-[#f8faf7] border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-mono">
            <span>AirPal Live Sandbox</span>
            <button
              onClick={() => setLocation("/demo/host")}
              className="text-amber-700 hover:underline font-semibold"
            >
              Go to Host CMS →
            </button>
          </div>

        </div>

        {/* Room Switcher Modal in Demo */}
        {showRoomModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#fffdf9] border border-stone-300 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
              <button
                type="button"
                onClick={() => setShowRoomModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 grid place-items-center text-stone-600"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 font-bold grid place-items-center">
                  <DoorOpen size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">
                    Sandbox Room Key
                  </span>
                  <h3 className="text-lg font-bold text-stone-900">Switch Room</h3>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-stone-500 text-[10px] block">Current Room:</span>
                  <strong className="text-stone-950 text-base font-extrabold">Room {roomNumber}</strong>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Active Key
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">
                  Select Room:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["101", "102", "204", "305", "402", "508"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleSwitchRoom(r)}
                      className={`py-2 px-3 rounded-xl font-mono text-xs font-bold transition-all ${
                        r === roomNumber
                          ? "bg-amber-400 text-stone-950 ring-2 ring-amber-500 shadow-xs"
                          : "bg-white hover:bg-amber-50 text-stone-800 border border-stone-200"
                      }`}
                    >
                      Room {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                  Or enter custom room:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 702 or Penthouse"
                    value={customRoomInput}
                    onChange={(e) => setCustomRoomInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customRoomInput.trim()) {
                        handleSwitchRoom(customRoomInput.trim());
                        setCustomRoomInput("");
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
