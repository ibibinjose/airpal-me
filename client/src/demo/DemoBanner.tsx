import React from "react";
import { useLocation } from "wouter";
import {
  ShieldAlert,
  RotateCcw,
  ExternalLink,
  Users,
  ChevronDown,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { DEMO_PERSONAS } from "./demo-data";
import { resetEntireSandbox, getSandboxPersona, setSandboxPersona } from "./demo-sandbox";
import { leaveDemo } from "../lib/app-mode";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

export const DemoBanner: React.FC<{
  currentRoute?: string;
}> = ({ currentRoute }) => {
  const [, setLocation] = useLocation();
  const { switchRole, role } = useAuth();
  const activePersonaRole = getSandboxPersona();

  const handleSwitchPersona = (newRole: "super_admin" | "host_admin" | "staff" | "guest") => {
    setSandboxPersona(newRole);
    switchRole(newRole);
    const target = DEMO_PERSONAS.find((p) => p.role === newRole);
    if (target) {
      setLocation(target.defaultRoute);
      toast.success(`Switched Persona to: ${target.title}`, {
        description: target.description,
      });
    }
  };

  const handleReset = () => {
    if (confirm("Reset the Demo Sandbox to factory defaults? All mock edits will be restored.")) {
      resetEntireSandbox();
      toast.success("Demo Sandbox Reset", {
        description: "All mock properties, deals, menu, and tickets are restored to defaults.",
      });
      window.location.reload();
    }
  };

  const handleExitDemo = () => {
    leaveDemo();
    setLocation("/");
    toast.info("Exited Demo Sandbox", {
      description: "Returned to the live platform.",
    });
  };

  return (
    <div className="w-full bg-[#18261e] text-[#f7f5ef] border-b border-stone-800 text-xs px-3 sm:px-6 py-2 shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Clear Sandbox Warning & Isolation Notice */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>DEMO SANDBOX</span>
          </div>
          <p className="text-[11px] text-stone-300 hidden sm:inline">
            100% Isolated · Zero Access to Real Operations or Customer Data
          </p>
        </div>

        {/* Center / Right: Persona Quick Switcher & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap ml-auto">
          {/* Quick Persona Navigation */}
          <div className="flex items-center gap-1 bg-white/10 rounded-full p-0.5 border border-white/10 text-[11px]">
            {DEMO_PERSONAS.map((p) => {
              const active = role === p.role || activePersonaRole === p.role;
              return (
                <button
                  key={p.role}
                  type="button"
                  onClick={() => handleSwitchPersona(p.role)}
                  className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                    active
                      ? "bg-amber-400 text-stone-950 font-bold shadow-xs"
                      : "text-stone-300 hover:text-white"
                  }`}
                  title={p.description}
                >
                  <span>{p.title.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Reset Sandbox */}
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-[11px] transition-colors"
            title="Reset sandbox state back to pristine demo data"
          >
            <RotateCcw size={11} />
            <span className="hidden md:inline">Reset Sandbox</span>
          </button>

          {/* Exit Demo */}
          <button
            type="button"
            onClick={handleExitDemo}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800/80 hover:bg-red-950/40 text-stone-400 hover:text-red-300 border border-stone-700 text-[11px] transition-colors"
            title="Exit Demo Sandbox and return to public website"
          >
            <span>Exit Demo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
