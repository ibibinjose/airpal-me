import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserRole } from "@shared/airpal-data";
import { useLocation } from "wouter";
import { ShieldAlert, Lock, ArrowRight, ArrowLeft, LogIn, Sparkles, UserCheck } from "lucide-react";
import { RealtimeTopBar } from "./RealtimeTopBar";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  resourceName?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  resourceName = "Hospitality Administration",
}) => {
  const { user, role, logout } = useAuth();
  const [, setLocation] = useLocation();

  // 1. Not Authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f7f5ef] via-[#f4f6f1] to-[#eaede6] text-[#16211c] flex flex-col font-sans">
        <RealtimeTopBar className="sticky top-0 z-40 border-b border-[#dde3db]" />
        
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-[#dde3db] shadow-xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 grid place-items-center mx-auto shadow-inner">
              <Lock size={26} />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Authentication Required
              </span>
              <h1 className="text-2xl font-bold font-display text-stone-900">
                Sign In to Access {resourceName}
              </h1>
              <p className="text-xs text-stone-500 leading-relaxed">
                This secure hospitality operating system area requires an active business account with {allowedRoles.map((r) => r.replace("_", " ")).join(" or ")} privileges.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setLocation("/auth")}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#18271f] hover:bg-[#23382c] text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <LogIn size={15} />
                <span>Sign In to Real Account</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => setLocation("/demo")}
                className="w-full py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-semibold text-xs border border-amber-200 transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles size={14} className="text-amber-600" />
                <span>Test in Isolated Sandbox Demo</span>
              </button>

              <button
                type="button"
                onClick={() => setLocation("/")}
                className="text-xs text-stone-400 hover:text-stone-700 inline-flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={12} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated but Role Insufficient
  const hasAccess = allowedRoles.includes(role);
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f7f5ef] via-[#f4f6f1] to-[#eaede6] text-[#16211c] flex flex-col font-sans">
        <RealtimeTopBar className="sticky top-0 z-40 border-b border-[#dde3db]" />
        
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-red-200 shadow-xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-200 text-red-700 grid place-items-center mx-auto shadow-inner">
              <ShieldAlert size={26} />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Access Restricted
              </span>
              <h1 className="text-2xl font-bold font-display text-stone-900">
                Insufficient Role Permissions
              </h1>
              <p className="text-xs text-stone-500 leading-relaxed">
                You are currently signed in as <strong className="text-stone-800">{user.displayName}</strong> with the <strong className="text-stone-800 font-mono">[{role}]</strong> role.
              </p>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 font-mono">
                Required Role: {allowedRoles.map((r) => r.replace("_", " ")).join(", ")}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setLocation("/auth");
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                Sign In with Different Credentials
              </button>

              <button
                type="button"
                onClick={() => setLocation(role === "host_admin" ? "/host" : "/")}
                className="w-full py-2.5 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition-colors"
              >
                Return to My Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized Access Granted
  return <>{children}</>;
};
