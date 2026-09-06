import React from "react";
import { useLocation } from "wouter";
import { ArrowRight, Sparkles } from "lucide-react";
import { DEMO_USERS, UserRole } from "@shared/airpal-data";
import { enterDemo, stashLiveSession } from "../lib/app-mode";
import { useAuth } from "../contexts/AuthContext";

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  host_admin: "Hotel Host",
  staff: "Staff",
  guest: "Guest",
};

function demoPathForRole(role: UserRole): string {
  if (role === "super_admin") return "/demo/admin";
  if (role === "guest") return "/demo/stay";
  return "/demo/host";
}

/**
 * Secondary sales/sample entry into the Harbour Hotel demo.
 * Stashes the live Platform Admin / host session so leaving demo restores it.
 */
export const DemoEntryPanel: React.FC<{ compact?: boolean; className?: string }> = ({
  compact = false,
  className = "",
}) => {
  const { switchRole, user, activePropertyId } = useAuth();
  const [, setLocation] = useLocation();

  const enterAs = (role: UserRole, propertyId?: string) => {
    const isDemoPersona = user && DEMO_USERS.some((row) => row.uid === user.uid);
    if (user && !isDemoPersona) {
      stashLiveSession(JSON.stringify(user), activePropertyId);
    }
    enterDemo();
    switchRole(role, propertyId || "harbour-hotel");
    setLocation(demoPathForRole(role));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {!compact && (
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200 text-[10px] font-semibold">
            <Sparkles size={12} />
            Sample only · Harbour Hotel
          </div>
          <p className="text-sm text-[#5a6b62]">
            Show partners the sample Harbour Hotel experience. This does not change your live property.
          </p>
        </div>
      )}
      {compact && (
        <p className="text-xs text-[#5a6b62]">
          Show partners the sample — opens Harbour Hotel demo without changing your live property.
        </p>
      )}

      <div className="space-y-2">
        {DEMO_USERS.map((demo) => {
          const label = ROLE_LABELS[demo.role];
          const isCurrent = user?.uid === demo.uid;
          return (
            <button
              key={demo.uid}
              type="button"
              onClick={() => enterAs(demo.role, demo.propertyIds?.[0])}
              className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between ${
                isCurrent
                  ? "bg-amber-50 border-amber-400 shadow-sm"
                  : "bg-white hover:bg-[#f6f9f5] border-[#dde3db]"
              }`}
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-[#16211c]">Enter sample as {label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      demo.role === "super_admin"
                        ? "bg-purple-100 text-purple-800"
                        : demo.role === "host_admin"
                          ? "bg-amber-100 text-amber-800"
                          : demo.role === "staff"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                <span className="text-[11px] text-stone-400 block truncate">{demo.email}</span>
              </div>
              <ArrowRight size={14} className="text-stone-400 shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
