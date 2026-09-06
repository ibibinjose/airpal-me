import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  User,
  Hotel,
  Eye,
  EyeOff,
  QrCode,
  TrendingUp,
  Star,
} from "lucide-react";
import { RealtimeTopBar } from "../components/RealtimeTopBar";
import { isDemoMode } from "../lib/app-mode";
import { isBootstrapAdminEmail } from "../lib/bootstrap-admin";
import { DemoEntryPanel } from "../components/DemoEntryPanel";

export const AuthPage: React.FC = () => {
  const { login, register, role, user, isHostAdmin, isSuperAdmin, logout } = useAuth();
  const [, setLocation] = useLocation();

  const demo = isDemoMode();
  // Demo tab: in demo mode, or after signing in as Platform Admin / host (never conflate with live admin).
  const showDemoTab = demo || Boolean(user && (isHostAdmin || isSuperAdmin));
  const [tab, setTab] = useState<"login" | "register" | "roles">(demo ? "roles" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-b from-[#f7f5ef] via-[#f4f6f1] to-[#eaede6] text-[#16211c] flex flex-col">
      <RealtimeTopBar className="sticky top-0 z-40 border-b border-[#dde3db] shadow-2xs" />

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* LEFT COLUMN: BRAND STORY */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1d2f25] via-[#16241c] to-[#0f1a14] text-[#f7f5ef] shadow-2xl border border-stone-800 relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-semibold tracking-wide">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>AirPal Hospitality OS</span>
                </div>
                <span className="font-mono text-[11px] text-stone-400">v2.4 Release</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white leading-tight">
                  One Scan. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-200">
                    Your Entire Stay.
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Hosts and Platform Admin sign in here. Guests never create an account — they scan the QR on the desk.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="grid place-items-center w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 shrink-0">
                    <QrCode size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-semibold text-white block">Frictionless Guest Journey</strong>
                    <p className="text-[11px] text-stone-300">
                      Guests scan in-room QR stands. Immediate Wi-Fi, dining menus, and local picks.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="grid place-items-center w-8 h-8 rounded-xl bg-emerald-400/20 text-emerald-300 shrink-0">
                    <TrendingUp size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-semibold text-white block">+$42 Avg Revenue Per Stay</strong>
                    <p className="text-[11px] text-stone-300">
                      Direct folio upsells for late checkouts, breakfast buffets, and curated experiences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="grid place-items-center w-8 h-8 rounded-xl bg-blue-400/20 text-blue-300 shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-xs font-semibold text-white block">24/7 AI Staff Grounding</strong>
                    <p className="text-[11px] text-stone-300">
                      Answers hotel questions accurately from your approved property compendium.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="currentColor" />
                ))}
                <span className="text-[11px] font-mono text-stone-300 pl-1">4.9/5 Hotelier Rating</span>
              </div>
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "AirPal resolved 78% of our routine front desk questions and generated over $14,000 in late checkout revenue in the first quarter."
              </p>
              <div className="text-[11px] text-stone-400 font-mono">
                — Marcus Sterling, Harbour Hotel Sydney
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: AUTH */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-[#fffdf9] rounded-3xl border border-[#dde3db] p-6 sm:p-8 shadow-xl relative">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <img src="/logo.jpg" alt="AirPal.me" className="h-9 w-9 rounded-xl object-contain border border-[#dde3db] shadow-sm" />
                  <div>
                    <strong className="block text-sm font-bold text-[#16211c]">
                      airpal<span className="text-amber-600">.me</span>
                    </strong>
                    <span className="text-[10px] text-stone-400 font-mono">Management Portal</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setLocation("/stay")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f4f7f2] hover:bg-[#ebf0e8] text-[#24382c] border border-[#dde3db] text-xs font-medium transition-all"
                >
                  <span>Guest Preview</span>
                  <ArrowRight size={13} className="text-amber-600" />
                </button>
              </div>

              <div
                className={`p-1 rounded-2xl bg-[#f0f4ee] border border-[#dde3db] grid ${
                  showDemoTab ? "grid-cols-3" : "grid-cols-2"
                } text-xs font-semibold`}
              >
                <button
                  type="button"
                  onClick={() => setTab("login")}
                  className={`py-2 px-3 rounded-xl transition-all text-center ${
                    tab === "login"
                      ? "bg-white text-[#16211c] font-bold shadow-sm"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setTab("register")}
                  className={`py-2 px-3 rounded-xl transition-all text-center ${
                    tab === "register"
                      ? "bg-white text-[#16211c] font-bold shadow-sm"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  Register Hotel
                </button>
                {showDemoTab && (
                  <button
                    type="button"
                    onClick={() => setTab("roles")}
                    className={`py-2 px-3 rounded-xl transition-all text-center ${
                      tab === "roles"
                        ? "bg-white text-[#16211c] font-bold shadow-sm"
                        : "text-stone-500 hover:text-stone-900"
                    }`}
                  >
                    Demo
                  </button>
                )}
              </div>

              {tab === "login" && (
                <form onSubmit={handleLogin} className="space-y-4 animate-in fade-in">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#3a4a42]">Business Work Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@yourhotel.com"
                        className="w-full pl-10 pr-3.5 py-3 rounded-2xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner"
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#3a4a42]">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[11px] text-stone-400 hover:text-stone-600 flex items-center gap-1"
                      >
                        {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{showPassword ? "Hide" : "Show"}</span>
                      </button>
                    </div>
                    <div className="relative">
                      <Lock size={16} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500 focus:bg-white transition-all shadow-inner font-mono"
                        autoComplete="current-password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 transition-all shadow-md shadow-amber-400/20 active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span>Authenticating...</span>
                    ) : (
                      <>
                        <span>Sign In to Operating System</span>
                        <ArrowRight size={14} />
                      </>
                    )}
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
                <form onSubmit={handleRegister} className="space-y-3.5 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#3a4a42]">Full Name</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-3.5 text-stone-400" />
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
                      <label className="text-xs font-semibold text-[#3a4a42]">Hotel / Property Name</label>
                      <div className="relative">
                        <Hotel size={15} className="absolute left-3.5 top-3.5 text-stone-400" />
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
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#3a4a42]">Business Work Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-3.5 text-stone-400" />
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
                    <label className="text-xs font-semibold text-[#3a4a42]">Create Secure Password</label>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-3.5 text-stone-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 transition-all shadow-md shadow-amber-400/20 active:scale-[0.99] flex items-center justify-center gap-2"
                  >
                    <span>Launch Hotel & Generate Room QR</span>
                    <ArrowRight size={14} />
                  </button>

                  <p className="text-[11px] text-stone-400 text-center">
                    Need a full guided onboarding experience?{" "}
                    <button
                      type="button"
                      onClick={() => setLocation("/start")}
                      className="text-amber-800 font-bold hover:underline"
                    >
                      Start wizard here
                    </button>
                  </p>
                </form>
              )}

              {tab === "roles" && showDemoTab && <DemoEntryPanel />}
            </div>

            <div className="pt-4 mt-6 border-t border-[#dde3db] flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
                <span className="text-stone-500">Active session:</span>
                <strong className="text-[#16211c] font-semibold">{user?.displayName || "Signed out"}</strong>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
                  {user ? role.replace("_", " ") : "Live sign-in"}
                </span>
                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setLocation("/auth");
                    }}
                    className="text-[11px] text-stone-400 hover:text-red-600 transition-colors"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
