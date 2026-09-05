import React from "react";
import { useAirPal, DeviceMode, QrType } from "../contexts/AirPalContext";
import {
  Smartphone,
  Tablet,
  Maximize2,
  Sun,
  CloudRain,
  Users,
  Eye,
  Languages,
  QrCode,
  Hotel,
  Sparkles,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Props {
  activeView: "companion" | "dashboard" | "landing" | "admin" | "auth";
  onViewChange: (view: "companion" | "dashboard" | "landing" | "admin" | "auth") => void;
}

export const DeviceFrameSwitcher: React.FC<Props> = ({ activeView, onViewChange }) => {
  const { user, role } = useAuth();
  const {
    deviceMode,
    setDeviceMode,
    roomNumber,
    setRoomNumber,
    qrType,
    setQrType,
    weather,
    setWeather,
    familyMode,
    setFamilyMode,
    seniorMode,
    setSeniorMode,
    language,
    setLanguage,
  } = useAirPal();

  return (
    <header className="shrink-0 z-40 w-full border-b border-[#dde3db] bg-[#fffdf9]/95 backdrop-blur-md px-3 py-2 text-[#16211c] transition-all">
      <div className="max-w-7xl mx-auto flex flex-col gap-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left: Brand & Main Navigation Toggle */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div
            onClick={() => onViewChange("landing")}
            className="flex items-center gap-1.5 font-bold tracking-tight text-sm cursor-pointer"
          >
            <span className="grid place-items-center w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 text-stone-900 text-xs shadow-sm shadow-amber-500/20">
              ✦
            </span>
            <span>airpal<span className="text-amber-400">.me</span></span>
          </div>

          <nav className="flex items-center rounded-lg bg-white p-0.5 border border-[#dde3db] text-[11px]">
            <button
              onClick={() => onViewChange("companion")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeView === "companion"
                  ? "bg-amber-400 text-stone-950 font-semibold shadow"
                  : "text-[#5a6b62] hover:text-[#16211c]"
              }`}
            >
              <Smartphone size={13} />
              <span>Guest Companion</span>
            </button>
            <button
              onClick={() => onViewChange("dashboard")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeView === "dashboard"
                  ? "bg-amber-400 text-stone-950 font-semibold shadow"
                  : "text-[#5a6b62] hover:text-[#16211c]"
              }`}
            >
              <Hotel size={13} />
              <span>Host Business CMS</span>
            </button>
            <button
              onClick={() => onViewChange("admin")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeView === "admin"
                  ? "bg-purple-600 text-white font-semibold shadow"
                  : "text-purple-800 hover:text-purple-950 hover:bg-purple-50"
              }`}
            >
              <ShieldCheck size={13} />
              <span>Super Admin</span>
            </button>
          </nav>
        </div>

        {/* Right: Active Role Persona & Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewChange("auth")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-stone-50 border border-[#dde3db] text-[11px] text-[#16211c] transition-all"
            title="Click to Switch Demo Role or Login"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                role === "super_admin"
                  ? "bg-purple-500"
                  : role === "host_admin"
                  ? "bg-amber-500"
                  : role === "staff"
                  ? "bg-blue-500"
                  : "bg-emerald-500"
              }`}
            />
            <span className="font-semibold">{user?.displayName?.split(" ")[0] || "Guest"}</span>
            <span className="text-[10px] text-stone-400 font-mono capitalize">({role.replace("_", " ")})</span>
          </button>
        </div>

        </div>
        {activeView === "companion" && (
          <div className="flex items-center gap-2 text-[11px] overflow-x-auto no-scrollbar pb-0.5 whitespace-nowrap">
            {/* Device Viewport Selector */}
            <div className="flex items-center rounded-lg bg-white border border-[#dde3db] p-0.5">
              <button
                onClick={() => setDeviceMode("iphone")}
                title="iPhone 16 Pro Frame"
                className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                  deviceMode === "iphone" ? "bg-amber-400 text-stone-950 font-semibold" : "text-[#7a877f] hover:text-[#16211c]"
                }`}
              >
                <Smartphone size={13} />
                <span>iPhone</span>
              </button>
              <button
                onClick={() => setDeviceMode("android")}
                title="Galaxy S25 Android Frame"
                className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                  deviceMode === "android" ? "bg-amber-400 text-stone-950 font-semibold" : "text-[#7a877f] hover:text-[#16211c]"
                }`}
              >
                <Smartphone size={13} className="rotate-90" />
                <span>Android</span>
              </button>
              <button
                onClick={() => setDeviceMode("tablet")}
                title="iPad / Tablet Frame"
                className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                  deviceMode === "tablet" ? "bg-amber-400 text-stone-950 font-semibold" : "text-[#7a877f] hover:text-[#16211c]"
                }`}
              >
                <Tablet size={13} />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => setDeviceMode("responsive")}
                title="Full Responsive View"
                className={`flex items-center gap-1 px-2 py-1 rounded transition-all ${
                  deviceMode === "responsive" ? "bg-amber-400 text-stone-950 font-semibold" : "text-[#7a877f] hover:text-[#16211c]"
                }`}
              >
                <Maximize2 size={13} />
                <span>Full Page</span>
              </button>
            </div>

            {/* Simulated Scan Selector */}
            <div className="flex items-center gap-1 bg-white border border-[#dde3db] rounded-lg px-2 py-1">
              <QrCode size={13} className="text-amber-400" />
              <select
                aria-label="Simulate QR scan"
                value={`${qrType}:${roomNumber}`}
                onChange={(e) => {
                  const [type, room] = e.target.value.split(":");
                  setQrType(type as QrType);
                  if (type === "room" && room) setRoomNumber(room);
                }}
                className="bg-transparent text-[#3a4a42] outline-none cursor-pointer pr-1 text-[11px]"
              >
                <option value="room:508" className="bg-white text-[#16211c]">QR: Room 508 (Harbour Suite)</option>
                <option value="room:204" className="bg-white text-[#16211c]">QR: Room 204 (City Deluxe)</option>
                <option value="property:lobby" className="bg-white text-[#16211c]">QR: Reception Lobby</option>
                <option value="dining:grill" className="bg-white text-[#16211c]">QR: Waterfront Grill Menu</option>
                <option value="experience:kayak" className="bg-white text-[#16211c]">QR: Sunset Kayak Tour</option>
                <option value="emergency:safety" className="bg-white text-[#16211c]">QR: Emergency & Safety</option>
              </select>
            </div>

            {/* Weather Simulator (Sunny vs Rainy) */}
            <button
              onClick={() => setWeather(weather === "sunny" ? "rainy" : "sunny")}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] transition-all ${
                weather === "rainy"
                  ? "bg-[#e3f0fa] border-blue-400/40 text-[#1d6aa5] font-medium"
                  : "bg-[#fff4e4] border-amber-400/30 text-[#c57a32]"
              }`}
              title="Click to simulate live weather change (affects AI itinerary and recommendations)"
            >
              {weather === "sunny" ? <Sun size={13} className="text-amber-400" /> : <CloudRain size={13} className="text-[#1d6aa5]" />}
              <span>{weather === "sunny" ? "Sunny 24°C" : "Rain Alert 18°C"}</span>
            </button>

            {/* Accessibility & Inclusive Modes */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFamilyMode((v) => !v)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] transition-all ${
                  familyMode
                    ? "bg-[#dceee4] border-emerald-400/40 text-[#2d7a55] font-semibold"
                    : "bg-white border-[#dde3db] text-[#5a6b62] hover:text-[#16211c]"
                }`}
                title="Family Mode: Stroller routes & child-friendly activities"
              >
                <Users size={12} />
                <span>Family</span>
              </button>

              <button
                onClick={() => setSeniorMode((v) => !v)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] transition-all ${
                  seniorMode
                    ? "bg-[#ece4f6] border-purple-400/40 text-[#6b46a5] font-semibold"
                    : "bg-white border-[#dde3db] text-[#5a6b62] hover:text-[#16211c]"
                }`}
                title="Senior Mode: Larger typography, high contrast & 1-tap dial buttons"
              >
                <Eye size={12} />
                <span>Senior</span>
              </button>
            </div>

            {/* Multilingual Selector */}
            <div className="flex items-center gap-1 bg-white border border-[#dde3db] rounded-lg px-2 py-1">
              <Languages size={13} className="text-amber-400" />
              <select
                aria-label="Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-[#3a4a42] outline-none cursor-pointer text-[11px]"
              >
                <option value="en" className="bg-white text-[#16211c]">English</option>
                <option value="zh" className="bg-white text-[#16211c]">中文 (Mandarin)</option>
                <option value="ja" className="bg-white text-[#16211c]">日本語 (Japanese)</option>
                <option value="es" className="bg-white text-[#16211c]">Español</option>
                <option value="fr" className="bg-white text-[#16211c]">Français</option>
                <option value="de" className="bg-white text-[#16211c]">Deutsch</option>
                <option value="hi" className="bg-white text-[#16211c]">हिन्दी (Hindi)</option>
                <option value="ar" className="bg-white text-[#16211c]">العربية (Arabic)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
