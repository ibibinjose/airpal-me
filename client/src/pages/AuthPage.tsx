import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  Hotel,
} from "lucide-react";
import { isDemoMode } from "../lib/app-mode";
import { isBootstrapAdminEmail } from "../lib/bootstrap-admin";
import { DemoEntryPanel } from "../components/DemoEntryPanel";

export const AuthPage: React.FC = () => {
  const { login, register, role, user, isHostAdmin, isSuperAdmin } = useAuth();
  const [, setLocation] = useLocation();

  const demo = isDemoMode();
  // Demo tab: in demo mode, or after signing in as Platform Admin / host (never conflate with live admin).
  const showDemoTab = demo || Boolean(user && (isHostAdmin || isSuperAdmin));
  const [tab, setTab] = useState<"login" | "register" | "roles">(demo ? "roles" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const profile = await login(email, password);
    setLoading(false);
    if (!profile) return;
    // Real Platform Admin (e.g. bibin.inc@gmail.com via bootstrap) lands on /admin.
    if (profile.role === "super_admin") {
      setLocation("/admin");
    } else if (profile.role === "guest") {
      setLocation("/stay");
    } else {
      setLocation("/host");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !propertyName || !password) return;
    setLoading(true);
    const ok = await register(email, name, "host_admin", propertyName, { password });
    setLoading(false);
    if (!ok) return;
    if (isBootstrapAdminEmail(email)) {
      setLocation("/admin");
    } else {
      setLocation("/host");
    }
  };

  return (
    <div className="min-h-[calc(100vh-45px)] bg-[#f4f6f1] flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <img src="/logo.jpg" alt="AirPal.me" className="mx-auto h-28 w-28 object-contain" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300/40 text-xs font-semibold">
            <Sparkles size={13} className="text-amber-600" />
            <span>AirPal Identity & Business Suite</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#16211c]">
            Hospitality Operating System
          </h1>
          <p className="text-xs text-[#5a6b62] max-w-sm mx-auto">
            Hosts and Platform Admin sign in here. Guests never create an account — they scan the QR on the desk.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#dde3db] shadow-xl overflow-hidden">
          <div className={`grid ${showDemoTab ? "grid-cols-3" : "grid-cols-2"} border-b border-[#dde3db] text-xs font-bold text-center`}>
            <button
              onClick={() => setTab("login")}
              className={`py-3.5 transition-all ${
                tab === "login"
                  ? "border-b-2 border-amber-500 text-stone-900 bg-amber-50/40"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab("register")}
              className={`py-3.5 transition-all ${
                tab === "register"
                  ? "border-b-2 border-amber-500 text-stone-900 bg-amber-50/40"
                  : "text-stone-500 hover:text-stone-800"
              }`}
            >
              Register Hotel
            </button>
            {showDemoTab && (
              <button
                onClick={() => setTab("roles")}
                className={`py-3.5 transition-all ${
                  tab === "roles"
                    ? "border-b-2 border-amber-500 text-stone-900 bg-amber-50/40"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Demo
              </button>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {tab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Business Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@yourhotel.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500 transition-colors"
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500 transition-colors"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 transition-all shadow active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={14} />
                </button>

                <div className="pt-2 text-center space-y-1">
                  <span className="text-[11px] text-stone-400 block">
                    New property?{" "}
                    <button type="button" onClick={() => setLocation("/start")} className="text-amber-700 font-bold hover:underline">
                      Start here
                    </button>
                  </span>
                  {!showDemoTab && (
                    <span className="text-[11px] text-stone-400 block">
                      Want the sample hotel first?{" "}
                      <button type="button" onClick={() => setLocation("/demo")} className="text-amber-700 font-bold hover:underline">
                        Open Harbour Hotel demo
                      </button>
                    </span>
                  )}
                </div>
              </form>
            )}

            {tab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Your Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Hotel / Rental Name</label>
                  <div className="relative">
                    <Hotel size={15} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      required
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      placeholder="Boutique Palms Resort"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Business Email</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@boutiquepalms.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Password</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-3 text-stone-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 transition-all shadow flex items-center justify-center gap-2"
                >
                  <span>Create property & QR</span>
                  <ArrowRight size={14} />
                </button>
                <p className="text-[11px] text-stone-400 text-center">
                  Prefer the guided setup?{" "}
                  <button type="button" onClick={() => setLocation("/start")} className="text-amber-700 font-bold hover:underline">
                    Start here
                  </button>
                </p>
              </form>
            )}

            {tab === "roles" && showDemoTab && (
              <DemoEntryPanel />
            )}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#dde3db] text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-stone-500 shrink-0">Currently active as:</span>
            <strong className="text-[#16211c] truncate">{user?.displayName || "Signed out"}</strong>
          </div>
          <span className="text-stone-400 font-mono text-[11px] capitalize shrink-0">
            {user ? `Role: ${role.replace("_", " ")}` : "Live sign-in"}
          </span>
        </div>
      </div>
    </div>
  );
};
