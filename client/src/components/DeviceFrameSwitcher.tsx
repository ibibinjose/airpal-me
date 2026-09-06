import React, { useState } from "react";
import { useAirPal, type QrType } from "../contexts/AirPalContext";
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
  GraduationCap,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { AirPalLogo } from "./BrandLogo";
import { leaveDemo } from "../lib/app-mode";
import { DEMO_USERS } from "@shared/airpal-data";

interface Props {
  activeView: "companion" | "dashboard" | "landing" | "admin" | "auth" | "os" | "campus";
  onViewChange: (view: "companion" | "dashboard" | "landing" | "admin" | "auth" | "os" | "campus") => void;
}

const VIEWS: { id: Props["activeView"]; label: string; icon: React.ReactNode }[] = [
  { id: "os", label: "OS", icon: <Sparkles size={13} /> },
  { id: "companion", label: "Stay", icon: <Smartphone size={13} /> },
  { id: "campus", label: "Campus", icon: <GraduationCap size={13} /> },
  { id: "dashboard", label: "Host", icon: <Hotel size={13} /> },
  { id: "admin", label: "Admin", icon: <ShieldCheck size={13} /> },
];

export const DeviceFrameSwitcher: React.FC<Props> = ({ activeView, onViewChange }) => {
  const { user, role, logout } = useAuth();
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
  const [demoOpen, setDemoOpen] = useState(false);
  const showDemo = activeView === "companion" || activeView === "os" || activeView === "campus";

  return (
    <header className="shrink-0 z-40 w-full border-b border-[#e3e9e1]/90 bg-[#fffdf9]/90 backdrop-blur-xl text-[#16211c]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => onViewChange("landing")}
            className="flex items-center font-bold tracking-tight text-sm"
            aria-label="AirPal.me home"
          >
            <AirPalLogo size={28} compact className="text-sm" />
          </button>

          <nav className="flex items-center rounded-full bg-white/80 p-0.5 border border-[#e3e9e1] text-[11px]">
            {VIEWS.map((view) => (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id)}
                className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full transition-all ${
                  activeView === view.id
                    ? "bg-[#18271f] text-[#fffdf8] font-semibold shadow-sm"
                    : "text-[#5a6b62] hover:text-[#16211c]"
                }`}
              >
                {view.icon}
                <span className="hidden xs:inline sm:inline">{view.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {showDemo && (
            <button
              type="button"
              onClick={() => setDemoOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[11px] ${
                demoOpen ? "bg-[#18271f] text-white border-[#18271f]" : "bg-white border-[#e3e9e1] text-[#5a6b62]"
              }`}
              title="Device, QR and demo modes"
            >
              {demoOpen ? <X size={13} /> : <SlidersHorizontal size={13} />}
              <span className="hidden sm:inline">Demo</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              leaveDemo();
              if (user && DEMO_USERS.some((row) => row.uid === user.uid)) logout();
              onViewChange("landing");
            }}
            className="hidden sm:flex items-center px-2.5 py-1.5 rounded-full bg-white border border-[#e3e9e1] text-[11px] text-[#5a6b62]"
          >
            Exit demo
          </button>
          <button
            onClick={() => onViewChange("auth")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-[#e3e9e1] text-[11px]"
            title="Switch demo role"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
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
          </button>
        </div>
      </div>

      {showDemo && demoOpen && (
        <div className="border-t border-[#e3e9e1] bg-[#f7f8f4]/90">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 flex items-center gap-2 text-[11px] overflow-x-auto no-scrollbar">
            <div className="flex items-center rounded-full bg-white border border-[#e3e9e1] p-0.5">
              {(
                [
                  ["iphone", "iPhone", <Smartphone size={13} key="i" />],
                  ["android", "Android", <Smartphone size={13} className="rotate-90" key="a" />],
                  ["tablet", "Tablet", <Tablet size={13} key="t" />],
                  ["responsive", "Full", <Maximize2 size={13} key="f" />],
                ] as const
              ).map(([mode, label, icon]) => (
                <button
                  key={mode}
                  onClick={() => setDeviceMode(mode)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                    deviceMode === mode ? "bg-amber-400 text-stone-950 font-semibold" : "text-[#7a877f]"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-white border border-[#e3e9e1] rounded-full px-2.5 py-1">
              <QrCode size={13} className="text-amber-500" />
              <select
                aria-label="Simulate QR scan"
                value={`${qrType}:${roomNumber}`}
                onChange={(e) => {
                  const [type, room] = e.target.value.split(":");
                  setQrType(type as QrType);
                  if (type === "room" && room) setRoomNumber(room);
                }}
                className="bg-transparent text-[#3a4a42] outline-none cursor-pointer pr-1"
              >
                {activeView === "campus" ? (
                  <>
                    <option value="room:R12">Room R12</option>
                    <option value="dining:hall">Dining hall</option>
                    <option value="experience:fair">Clubs fair</option>
                    <option value="emergency:safety">Security</option>
                  </>
                ) : (
                  <>
                    <option value="room:508">Room 508</option>
                    <option value="room:204">Room 204</option>
                    <option value="property:lobby">Lobby</option>
                    <option value="dining:grill">Restaurant</option>
                    <option value="experience:kayak">Kayak</option>
                    <option value="emergency:safety">Safety</option>
                  </>
                )}
              </select>
            </div>

            <button
              onClick={() => setWeather(weather === "sunny" ? "rainy" : "sunny")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                weather === "rainy" ? "bg-[#e3f0fa] border-blue-200 text-[#1d6aa5]" : "bg-[#fff4e4] border-amber-200 text-[#c57a32]"
              }`}
            >
              {weather === "sunny" ? <Sun size={13} /> : <CloudRain size={13} />}
              {weather === "sunny" ? "24°" : "Rain"}
            </button>
            <button
              onClick={() => setFamilyMode((v) => !v)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                familyMode ? "bg-[#dceee4] border-emerald-200 text-[#2d7a55] font-semibold" : "bg-white border-[#e3e9e1] text-[#5a6b62]"
              }`}
            >
              <Users size={12} /> Family
            </button>
            <button
              onClick={() => setSeniorMode((v) => !v)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                seniorMode ? "bg-[#ece4f6] border-purple-200 text-[#6b46a5] font-semibold" : "bg-white border-[#e3e9e1] text-[#5a6b62]"
              }`}
            >
              <Eye size={12} /> Senior
            </button>
            <div className="flex items-center gap-1 bg-white border border-[#e3e9e1] rounded-full px-2.5 py-1">
              <Languages size={13} className="text-amber-500" />
              <select aria-label="Language" value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-transparent outline-none">
                <option value="en">EN</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
                <option value="hi">HI</option>
                <option value="ar">AR</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
