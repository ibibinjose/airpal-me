import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import {
  ShieldCheck,
  Building,
  KeyRound,
  UserCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Hotel,
} from "lucide-react";
import { DEMO_USERS } from "@shared/airpal-data";
import { isDemoMode } from "../lib/app-mode";

export const AuthPage: React.FC = () => {
  const { login, register, switchRole, role, user } = useAuth();
  const [, setLocation] = useLocation();

  const demo = isDemoMode();
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
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) return;
    if (email.includes("admin")) {
      setLocation("/admin");
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
    if (ok) setLocation("/host");
  };

  return (
    <div className="min-h-[calc(100vh-45px)] bg-[#f4f6f1] flex flex-col justify-center items-center py-10 px-4">
      <div className="w-full max-w-xl space-y-6">
        {/* Header Branding */}
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
            Hosts sign in here. Guests never create an account — they scan the QR on the desk.
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="bg-white rounded-3xl border border-[#dde3db] shadow-xl overflow-hidden">
          <div className={`grid ${demo ? "grid-cols-3" : "grid-cols-2"} border-b border-[#dde3db] text-xs font-bold text-center`}>
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
            {demo && (
              <button
                onClick={() => setTab("roles")}
                className={`py-3.5 transition-all ${
                  tab === "roles"
                    ? "border-b-2 border-amber-500 text-stone-900 bg-amber-50/40"
                    : "text-stone-500 hover:text-stone-800"
                }`}
              >
                Demo roles
              </button>
            )}
          </div>

          <div className="p-6 sm:p-8">
            {/* TAB 1: LOGIN */}
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
                      placeholder="host@harbourhotel.com.au"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500 transition-colors"
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

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-stone-400">
                    New property?{" "}
                    <button type="button" onClick={() => setLocation("/start")} className="text-amber-700 font-bold hover:underline">
                      Start here
                    </button>
                  </span>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER PROPERTY */}
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
                      placeholder="Marcus Sterling"
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

            {/* TAB 3: 1-CLICK DEMO ROLES */}
            {tab === "roles" && (
              <div className="space-y-3">
                <p className="text-xs text-[#5a6b62] pb-1">
                  Click any role below to test full capabilities without typing credentials:
                </p>

                {DEMO_USERS.map((demo) => {
                  const isCurrent = user?.role === demo.role;
                  return (
                    <div
                      key={demo.uid}
                      onClick={() => {
                        switchRole(demo.role, demo.propertyIds?.[0]);
                        if (demo.role === "super_admin") setLocation("/admin");
                        else if (demo.role === "guest") setLocation("/stay");
                        else setLocation("/host");
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? "bg-amber-50 border-amber-400 shadow-sm"
                          : "bg-white hover:bg-[#f6f9f5] border-[#dde3db]"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#16211c]">
                            {demo.displayName}
                          </span>
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
                            {demo.role.replace("_", " ")}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-400 block">{demo.email}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isCurrent && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                            <CheckCircle2 size={14} /> Active
                          </span>
                        )}
                        <ArrowRight size={14} className="text-stone-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Current Active Persona Footer */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#dde3db] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-stone-500">Currently active as:</span>
            <strong className="text-[#16211c]">{user?.displayName || "Guest"}</strong>
          </div>
          <span className="text-stone-400 font-mono text-[11px] capitalize">
            Role: {role.replace("_", " ")}
          </span>
        </div>
      </div>
    </div>
  );
};
