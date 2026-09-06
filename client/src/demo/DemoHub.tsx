import React from "react";
import { useLocation } from "wouter";
import {
  Building2,
  ShieldCheck,
  QrCode,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Hotel,
  Smartphone,
  Compass,
  GraduationCap,
  Users,
  TrendingUp,
  Lock,
  ExternalLink,
} from "lucide-react";
import { DEMO_PERSONAS, DEMO_PROPERTIES } from "./demo-data";
import { resetEntireSandbox, setSandboxPersona } from "./demo-sandbox";
import { enterDemo } from "../lib/app-mode";
import { useAuth } from "../contexts/AuthContext";
import { DemoBanner } from "./DemoBanner";
import { RealtimeTopBar } from "../components/RealtimeTopBar";
import { toast } from "sonner";

export const DemoHub: React.FC = () => {
  const [, setLocation] = useLocation();
  const { switchRole } = useAuth();

  const handleLaunchPersona = (p: (typeof DEMO_PERSONAS)[0]) => {
    enterDemo();
    setSandboxPersona(p.role);
    switchRole(p.role);
    setLocation(p.defaultRoute);
    toast.success(`Launched ${p.title}`, {
      description: `Exploring as ${p.displayName}`,
    });
  };

  const handleReset = () => {
    if (confirm("Reset the demo sandbox back to initial defaults?")) {
      resetEntireSandbox();
      toast.success("Sandbox Restored", {
        description: "All demo records have been reset to factory defaults.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-[#16211c] flex flex-col font-sans">
      {/* Realtime Local Time and Live Weather */}
      <RealtimeTopBar className="sticky top-0 z-40 border-b border-[#dde3db]" />
      
      {/* Sandbox Isolation Header Banner */}
      <DemoBanner currentRoute="/demo" />

      {/* Main Sandbox Showcase */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18271f] text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles size={14} className="text-amber-400" />
            <span>Interactive Business Demo Environment</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight text-[#16211c] leading-tight">
            Explore AirPal in Action. <br />
            <span className="text-stone-500 font-normal">
              100% Isolated Sandbox. Zero Risk.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Experience how the platform operates across all hospitality personas—from platform owners and hotel general managers to front-desk staff and in-house guests. All data modified here is completely sandboxed.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <span>No real accounts needed</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              <Lock size={13} className="text-blue-600" />
              <span>Isolated from production databases</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <RotateCcw size={13} className="text-amber-600" />
              <span>1-click sandbox reset</span>
            </div>
          </div>
        </div>

        {/* 4 Interactive Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_PERSONAS.map((persona) => {
            const isSuper = persona.role === "super_admin";
            const isHost = persona.role === "host_admin";
            const isStaff = persona.role === "staff";
            const isGuest = persona.role === "guest";

            const Icon = isSuper
              ? ShieldCheck
              : isHost
              ? Hotel
              : isStaff
              ? Users
              : Smartphone;

            return (
              <div
                key={persona.role}
                className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-[#dde3db] shadow-xs hover:shadow-md hover:border-amber-400/50 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#f4f6f1] text-[#18271f] grid place-items-center group-hover:bg-amber-400 group-hover:text-stone-950 transition-colors">
                        <Icon size={20} />
                      </div>
                      <div>
                        <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider block">
                          Role: {persona.role.replace("_", " ")}
                        </span>
                        <h2 className="text-lg font-bold text-[#16211c] group-hover:text-amber-700 transition-colors">
                          {persona.title}
                        </h2>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full border ${persona.badgeColor}`}>
                      Sandbox
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {persona.description}
                  </p>

                  <div className="p-3 rounded-2xl bg-[#f8faf7] border border-[#e8eee6] text-[11px] space-y-1 font-mono text-stone-600">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Demo User:</span>
                      <strong className="text-stone-800">{persona.displayName.split(" (")[0]}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Mock Email:</span>
                      <span>{persona.email}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => handleLaunchPersona(persona)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#18271f] hover:bg-[#22382c] text-white font-medium text-xs transition-colors shadow-xs"
                  >
                    <span>Launch {persona.title.split(" ")[0]} Experience</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Real-Life Workflow Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1d2f25] to-[#14221a] text-[#f7f5ef] space-y-6 shadow-xl border border-stone-800">
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
              Real-World Architecture
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              How AirPal Works in Daily Hotel Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-300 grid place-items-center font-bold">
                1
              </div>
              <strong className="text-white block font-semibold text-sm">Host Signs Up & Customizes</strong>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Hotel adds property info, Wi-Fi credentials, dining menus, and seasonal packages. The platform generates unique room QR codes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-400/20 text-emerald-300 grid place-items-center font-bold">
                2
              </div>
              <strong className="text-white block font-semibold text-sm">Guest Scans Room QR</strong>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                No app installation or account signup. Guests instantly get Wi-Fi, order room service, and browse hotel packages directly on their phone.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-purple-400/20 text-purple-300 grid place-items-center font-bold">
                3
              </div>
              <strong className="text-white block font-semibold text-sm">Staff Dispatches & Revenue Grows</strong>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Requests flow straight into the staff ticket queue. Ancillary sales and deals generate automated commissions and lift room yield.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2 text-stone-300">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Tested with 3 demo properties: Grand Harbour, The Rocks Boutique, Snowy Peak.</span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              <RotateCcw size={13} />
              <span>Reset Sandbox Records</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
