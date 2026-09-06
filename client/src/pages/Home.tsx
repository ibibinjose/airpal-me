import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  GraduationCap,
  Languages,
  MapPin,
  Menu,
  QrCode,
  ScanLine,
  Send,
  Sparkles,
  Star,
  X,
  ShieldCheck,
  Building2,
  Users,
  Utensils,
  Wifi,
  BedDouble,
  Clock,
  ArrowUpRight,
  TrendingUp,
  LogIn,
  Key,
  ShieldAlert,
  ChevronRight,
  DollarSign,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { isDemoMode } from "../lib/app-mode";
import { useAuth } from "../contexts/AuthContext";
import { RealtimeTopBar } from "../components/RealtimeTopBar";
import { UserRole } from "@shared/airpal-data";

const layers = [
  {
    path: "/demo/stay",
    kicker: "01 · In-Room",
    title: "Hotel Room Companion",
    text: "Zero app download. Wi-Fi, dining, amenities, and local curations via desk QR.",
    tone: "peach",
  },
  {
    path: "/demo/campus",
    kicker: "02 · Campus",
    title: "College & Dorm Companion",
    text: "Lecture timetable, Great Hall meals, campus safety escort, and student perks.",
    tone: "aqua",
  },
  {
    path: "/demo/tour/rocks-harbour",
    kicker: "03 · Local",
    title: "Self-Guided Audio Walks",
    text: "Interactive GPS map, curated audio stops, and direct walking navigation.",
    tone: "lilac",
  },
  {
    path: "/demo",
    kicker: "04 · Hub",
    title: "Isolated Sandbox Demo",
    text: "100% simulated sandbox suite to test all roles with zero risk to live hotel data.",
    tone: "peach",
  },
];

interface RoleSpec {
  role: UserRole;
  title: string;
  badge: string;
  badgeColor: string;
  targetUser: string;
  headline: string;
  description: string;
  features: string[];
  testUrl: string;
  testLabel: string;
  email: string;
}

const ROLES_DATA: RoleSpec[] = [
  {
    role: "super_admin",
    title: "Platform Super Admin",
    badge: "Enterprise SaaS Tier",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-300",
    targetUser: "Hotel Group Executives & Platform Operators",
    headline: "Multi-Property Cloud Portfolio Oversight",
    description:
      "Global platform control over onboarded hotels, SaaS tier allocations, cross-property take-rate revenue, and system-wide telemetry.",
    features: [
      "Onboard new hotel properties with custom Wi-Fi & branding in 60 seconds",
      "Enterprise 5% platform commission and subscription revenue reconciliation",
      "Cross-property room inventory and active guest telemetry metrics",
      "Instant impersonation and tenant governance without data leakage",
    ],
    testUrl: "/admin",
    testLabel: "Launch Super Admin Portal",
    email: "admin@airpal.me",
  },
  {
    role: "host_admin",
    title: "Hotel General Manager / Host Admin",
    badge: "Property Executive Tier",
    badgeColor: "bg-amber-100 text-amber-950 border-amber-300",
    targetUser: "General Managers, Resort Directors & Property Owners",
    headline: "Complete In-Room Compendium & Ancillary Revenue Engine",
    description:
      "Full administrative control over guest-facing Wi-Fi credentials, dynamic room service menus, upsell packages, and real-time operational analytics.",
    features: [
      "Live Property Compendium CMS (Wi-Fi password, breakfast, check-out rules)",
      "Dynamic In-Room Dining manager with availability toggles and pricing rules",
      "Ancillary Deals & Upsell Studio (Early check-in, champagne, spa access)",
      "Real-time guest search analytics, query demand signals, and ticket logs",
    ],
    testUrl: "/host",
    testLabel: "Launch Host GM Portal",
    email: "host@airpal.me",
  },
  {
    role: "staff",
    title: "Front Desk & Operations Staff",
    badge: "Operational Staff Tier",
    badgeColor: "bg-blue-100 text-blue-900 border-blue-300",
    targetUser: "Front Desk Receptionists, Concierge & Housekeeping Supervisors",
    headline: "Real-Time Guest Request & Order Dispatch Queue",
    description:
      "Operational staff dashboard designed for rapid ticket fulfillment. Handles towel requests, late check-outs, room service orders, and maintenance dispatches without administrative clutter.",
    features: [
      "Live Staff Inbox with real-time pending request count and sound alerts",
      "1-click ticket status transitions: Pending → In Progress → Resolved",
      "Room service order preparation and dining dispatch tracking",
      "Permission-gated: Read-only for financial rules and compendium settings",
    ],
    testUrl: "/host",
    testLabel: "Launch Staff Operations Queue",
    email: "staff@airpal.me",
  },
  {
    role: "guest",
    title: "Guest In-Room Companion",
    badge: "Zero-Friction Guest Tier",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-300",
    targetUser: "Hotel Guests, Resort Travellers & Campus Residents",
    headline: "Frictionless In-Room Portal with Zero App Downloads",
    description:
      "Guests simply scan their desk QR code. Instant access to high-speed Wi-Fi, in-room dining orders, 24/7 AI concierge, and curated neighborhood audio walks.",
    features: [
      "Zero app store install: Loads in sub-second time in mobile Safari & Chrome",
      "1-tap copy Wi-Fi password and view hotel checkout & breakfast timings",
      "Order room service breakfast, burgers, and drinks straight to room number",
      "24/7 AI Concierge answering local Sydney transit, dining, and stay inquiries",
    ],
    testUrl: "/stay",
    testLabel: "Launch Room 508 Companion",
    email: "Instant QR Login (No credentials required)",
  },
];

function GuestPreview() {
  const [tab, setTab] = useState<"Stay" | "Dining" | "Ask">("Stay");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="phone-shell">
      <div className="phone-notch" />
      <div className="phone-screen">
        <div className="phone-topbar">
          <span className="mini-logo flex items-center gap-1.5 font-bold">
            <img src="/logo-mark.png" alt="" className="mini-mark w-5 h-5 rounded" /> AirPal OS
          </span>
          <div className="topbar-actions flex items-center gap-2 text-xs">
            <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">ROOM 402</span>
            <Bell size={14} className="text-stone-500" />
          </div>
        </div>
        <div className="phone-content p-4 space-y-3">
          <div className="guest-greeting flex items-center justify-between text-xs text-stone-500">
            <span>The Sydney Grand</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Wi-Fi Synced
            </span>
          </div>

          {tab === "Stay" && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1b2b22] to-[#2a4536] text-white space-y-2 shadow-sm">
                <span className="text-[9px] font-mono uppercase tracking-widest text-amber-300 font-bold">FAST CONNECT</span>
                <h4 className="font-bold text-sm leading-snug">Hotel High-Speed Fibre</h4>
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-mono text-stone-300">Pass: welcomeguest2026</span>
                  <button
                    onClick={() => toast.success("Wi-Fi copied to clipboard")}
                    className="px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-[10px] font-semibold text-white"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-[#dde3db] space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">BREAKFAST</span>
                  <strong className="block text-[#16211c] text-xs">7:00 – 10:30 AM</strong>
                  <span className="text-[10px] text-stone-500">Atrium Level 1</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#dde3db] space-y-1">
                  <span className="text-[10px] text-stone-400 font-mono">CHECK-OUT</span>
                  <strong className="block text-[#16211c] text-xs">10:00 AM</strong>
                  <span className="text-[10px] text-amber-700 font-semibold">Late checkout ($35)</span>
                </div>
              </div>
            </div>
          )}

          {tab === "Dining" && (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-white border border-[#dde3db] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#16211c]">Artisan Wagyu Burger</div>
                  <div className="text-[10px] text-stone-500">Brioche, aged cheddar, truffle fries</div>
                </div>
                <button
                  onClick={() => toast.success("Added to Room 402 tab")}
                  className="px-2.5 py-1 rounded-lg bg-[#18271f] text-white font-bold text-[11px]"
                >
                  $26
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#dde3db] flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-[#16211c]">Sydney Coast Flat White</div>
                  <div className="text-[10px] text-stone-500">Oat milk, double espresso roast</div>
                </div>
                <button
                  onClick={() => toast.success("Added to Room 402 tab")}
                  className="px-2.5 py-1 rounded-lg bg-[#18271f] text-white font-bold text-[11px]"
                >
                  $6
                </button>
              </div>
            </div>
          )}

          {tab === "Ask" && (
            <div className="space-y-2">
              <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-xs text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
                  <Sparkles size={13} /> AirPal Concierge AI
                </div>
                <p className="text-[11px] leading-relaxed">
                  {sent
                    ? "The Rocks ferry departs Circular Quay Wharf 4 in 12 minutes. Opera House sunset walk starts right outside!"
                    : "Ask me anything about your room Wi-Fi, pool towels, late checkout, or local coffee spots."}
                </p>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && message.trim() && (setSent(true), setMessage(""))}
                  placeholder="Ask a question..."
                  className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#dde3db] text-xs outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => message.trim() && (setSent(true), setMessage(""))}
                  className="p-2 rounded-xl bg-[#18271f] text-white"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="guest-tabs mt-auto border-t border-[#dde3db] bg-white p-2 flex justify-around">
          {[
            { id: "Stay", label: "Compendium", icon: BedDouble },
            { id: "Dining", label: "Room Dining", icon: Utensils },
            { id: "Ask", label: "AI Concierge", icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold py-1 px-3 rounded-lg transition-colors ${
                  tab === item.id ? "text-amber-700 bg-amber-50 font-bold" : "text-stone-400 hover:text-stone-700"
                }`}
                onClick={() => setTab(item.id as any)}
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, role, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>("host_admin");

  // Dynamic Hotel ROI Calculator State
  const [rooms, setRooms] = useState(85);
  const [occupancy, setOccupancy] = useState(78);
  const [avgSpend, setAvgSpend] = useState(38);

  const monthlyUpsellRevenue = Math.round(rooms * (occupancy / 100) * 30 * (avgSpend * 0.22));
  const frontDeskHoursSaved = Math.round(rooms * 1.6);
  const annualLift = Math.round(monthlyUpsellRevenue * 12);

  const chartData = useMemo(() => {
    return [0.72, 0.85, 0.94, 1.05, 1.15, 1.28, 1.42].map((m, i) => ({
      label: `W${i + 1}`,
      value: Math.max(40, Math.round(rooms * 0.7 * m * (avgSpend / 30))),
    }));
  }, [rooms, avgSpend]);
  const chartMax = Math.max(...chartData.map((d) => d.value), 1);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const copyCreds = (email: string) => {
    navigator.clipboard.writeText(`${email} / password`);
    toast.success("Credentials copied!", {
      description: `Copied ${email} (Password: password)`,
    });
  };

  const activeRoleSpec = ROLES_DATA.find((r) => r.role === selectedRoleTab) || ROLES_DATA[1];

  return (
    <main className={`site-shell ${isDemoMode() ? "has-app-chrome" : ""}`}>
      {/* Sticky Realtime Sydney Time & Weather Bar */}
      <RealtimeTopBar className="sticky top-0 z-50 border-b border-[#dde3db] bg-[#fffdf9]/95 backdrop-blur-md" />

      {/* Main Luxury Navigation Bar */}
      <nav className="nav-wrap relative z-40">
        <button className="brand" onClick={() => scrollTo("top")}>
          <span className="brand-mark shadow-sm">
            <img src="/logo-mark.png" alt="" />
          </span>
          <div className="flex flex-col items-start leading-none">
            <span className="font-bold text-lg text-[#16211c]">
              AirPal<span className="brand-dot text-amber-600">.</span>me
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#718079]">
              Cloud OS v2.4
            </span>
          </div>
        </button>

        <div className={`nav-links ${mobileOpen ? "open" : ""}`}>
          <button onClick={() => scrollTo("roles")}>Roles & RBAC</button>
          <button onClick={() => scrollTo("calculator")}>ROI Calculator</button>
          <button onClick={() => scrollTo("product")}>Hospitality Layers</button>
          <button onClick={() => scrollTo("walks")}>Walks</button>

          {/* Active User Session or Sign In */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <button
                onClick={() => setLocation(role === "super_admin" ? "/admin" : "/host")}
                className="px-3 py-1.5 rounded-full bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{user.displayName}</span>
                <span className="text-[10px] font-mono uppercase opacity-70">
                  ({role === "super_admin" ? "Super" : role === "host_admin" ? "GM" : "Staff"})
                </span>
              </button>
              <button
                onClick={() => {
                  logout();
                  toast.success("Signed out successfully");
                }}
                className="text-stone-400 hover:text-stone-800 text-xs transition-colors"
                title="Sign Out"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setLocation("/auth")}
              className="flex items-center gap-1.5 text-stone-700 hover:text-stone-950 font-semibold text-xs"
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}

          {/* Sandbox Demo shortcut - distinct and segregated */}
          <button
            onClick={() => setLocation("/demo")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-300 transition-colors"
          >
            <Sparkles size={13} className="text-amber-600" />
            <span>Sandbox Demo</span>
          </button>

          <button className="nav-cta" onClick={() => setLocation("/auth")}>
            <span>Host Portal</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <button className="mobile-toggle" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Hero Section */}
      <section id="top" className="hero-section">
        <div className="hero-grid">
          <div className="hero-copy space-y-6">
            <div className="eyebrow-pill shadow-xs">
              <span className="pulse-dot" /> ENTERPRISE IN-ROOM HOSPITALITY OS
            </div>

            <h1 className="leading-[0.98] font-display">
              The in-room companion
              <br />
              that drives <em>guest spend.</em>
            </h1>

            <p className="hero-lede">
              Zero app downloads. One room QR connects guests to lightning-fast Wi-Fi, digital room service, 24/7 AI concierge, and curated city walks. GMs unlock automated operations and direct ancillary revenue.
            </p>

            <div className="hero-actions">
              <button className="button-primary" onClick={() => setLocation("/auth")}>
                <span>Access Host & Admin Portal</span>
                <ArrowRight size={16} />
              </button>

              <button
                className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-stone-50 text-amber-950 font-bold text-xs border border-amber-300 shadow-sm transition-transform active:scale-95"
                onClick={() => setLocation("/demo")}
              >
                <Sparkles size={15} className="text-amber-600" />
                <span>Launch Interactive Demo Sandbox</span>
              </button>

              <button className="button-quiet" onClick={() => setLocation("/scan")}>
                <QrCode size={16} />
                <span>Scan Room QR</span>
              </button>
            </div>

            <div className="hero-proof pt-2">
              <div className="avatar-stack">
                <span className="avatar av-1">S</span>
                <span className="avatar av-2">H</span>
                <span className="avatar av-3">G</span>
                <span className="avatar av-4">+</span>
              </div>
              <div className="space-y-0.5">
                <div className="stars">
                  ★★★★★ <b>4.9 / 5</b>
                </div>
                <span className="text-stone-500 text-xs">
                  Powering boutique hotels, luxury resorts, and college residences
                </span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-orbit orbit-a" />
            <div className="hero-orbit orbit-b" />
            <div className="hero-note note-a shadow-md">
              <ScanLine size={15} className="text-amber-600" />
              <span>
                Zero App Downloads.
                <br />
                <b>Instant Camera QR.</b>
              </span>
            </div>
            <div className="hero-note note-b shadow-md">
              <DollarSign size={15} className="text-emerald-600" />
              <span>
                +$3,400 / Month
                <br />
                <b>Average Room Upsell.</b>
              </span>
            </div>
            <GuestPreview />
          </div>
        </div>
      </section>

      {/* NEW: Role-Based Access Control Architecture Section */}
      <section id="roles" className="platform-section section-pad bg-white/70 border-y border-[#dde3db]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="section-heading text-center max-w-2xl mx-auto space-y-3">
            <span className="eyebrow">ENTERPRISE RBAC ARCHITECTURE</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-[#16211c]">
              Four distinct roles.
              <br />
              <em>One seamless operating system.</em>
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              AirPal enforces rigorous Role-Based Access Control (RBAC). Every participant — from platform executives to front desk staff and room guests — has tailored interfaces, isolated permissions, and zero data friction.
            </p>
          </div>

          {/* Role Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#f0f3ed] rounded-2xl max-w-3xl mx-auto border border-[#dde3db]">
            {ROLES_DATA.map((item) => (
              <button
                key={item.role}
                onClick={() => setSelectedRoleTab(item.role)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedRoleTab === item.role
                    ? "bg-stone-900 text-white shadow"
                    : "text-stone-600 hover:text-stone-900 hover:bg-white/50"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          {/* Active Role Feature Detail Card */}
          <div className="bg-[#fffdf9] border border-[#dde3db] rounded-3xl p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase border ${activeRoleSpec.badgeColor}`}>
                  {activeRoleSpec.badge}
                </span>
                <span className="text-xs text-stone-400 font-mono">
                  {activeRoleSpec.targetUser}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
                  {activeRoleSpec.headline}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  {activeRoleSpec.description}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {activeRoleSpec.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 grid place-items-center shrink-0 mt-0.5 font-bold">
                      ✓
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setLocation(activeRoleSpec.testUrl)}
                  className="px-6 py-3 rounded-2xl bg-[#18271f] hover:bg-[#284236] text-white font-bold text-xs shadow transition-transform active:scale-95 flex items-center gap-2"
                >
                  <span>{activeRoleSpec.testLabel}</span>
                  <ArrowRight size={14} />
                </button>

                {activeRoleSpec.role !== "guest" && (
                  <button
                    onClick={() => copyCreds(activeRoleSpec.email)}
                    className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs transition-colors flex items-center gap-2 border border-stone-200"
                  >
                    <Copy size={13} className="text-stone-500" />
                    <span>Copy Login: {activeRoleSpec.email}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick RBAC Inspection Card */}
            <div className="lg:col-span-5 bg-[#f5f8f3] border border-[#d9e0d6] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#dde3db]">
                <span className="text-[11px] font-mono font-bold uppercase text-stone-500">
                  Security Access Guard
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                  Enforced in Route
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Route URI</span>
                  <span className="font-mono font-bold text-stone-900">{activeRoleSpec.testUrl}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">RBAC Token Key</span>
                  <span className="font-mono text-purple-700 font-bold">{activeRoleSpec.role}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-200/60">
                  <span className="text-stone-500">Demo Contamination</span>
                  <span className="font-mono text-emerald-700 font-bold">Zero (Guaranteed)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-stone-500">Real Firestore Sync</span>
                  <span className="font-mono text-blue-700 font-bold">Active for live ops</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-[10px] font-mono text-stone-400 uppercase">Evaluation Credentials</span>
                <div className="font-mono font-bold text-xs text-stone-900">
                  {activeRoleSpec.email}
                </div>
                {activeRoleSpec.role !== "guest" && (
                  <div className="text-[11px] font-mono text-stone-500">
                    Password: <code className="text-amber-700 font-bold">password</code>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick-Glance Credentials Cheat Sheet for Evaluators */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200/60 text-amber-900 grid place-items-center shrink-0">
                <Key size={18} />
              </div>
              <div className="space-y-0.5">
                <strong className="block text-xs font-bold text-amber-950">
                  Ready to test real Role-Based Access?
                </strong>
                <p className="text-[11px] text-amber-900/80">
                  Pre-configured real accounts are ready to sign in at <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">/auth</code>. Password for all is <strong className="font-mono">password</strong>.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLocation("/auth")}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors shadow"
              >
                Go to Sign In Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Hotel Ancillary Revenue & Staff ROI Calculator */}
      <section id="calculator" className="calculator-section section-pad">
        <div className="calculator-card shadow-xl">
          <div className="calculator-copy space-y-6">
            <div>
              <span className="eyebrow">INTERACTIVE ROI CALCULATOR</span>
              <h2 className="leading-tight font-display">
                Front desk quieter.
                <br />
                <em>Ancillary revenue unlocked.</em>
              </h2>
            </div>
            <p>
              Digitizing Wi-Fi lookups, late check-outs, and in-room dining directly through AirPal increases guest order velocity while reducing repetitive front desk call volume by over 60%.
            </p>

            {/* Slider 1: Rooms */}
            <div className="calculator-control space-y-1">
              <div className="control-label flex justify-between text-xs">
                <span className="text-stone-600 font-medium">Managed Rooms or Keys</span>
                <strong className="font-mono text-base font-bold text-stone-900">{rooms} Rooms</strong>
              </div>
              <input
                aria-label="Rooms or keys"
                type="range"
                min="10"
                max="350"
                step="5"
                value={rooms}
                style={{ "--range": `${((rooms - 10) / 340) * 100}%` } as CSSProperties}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full"
              />
              <div className="range-labels flex justify-between text-[10px] text-stone-400 font-mono">
                <span>10 Keys</span>
                <span>350 Keys</span>
              </div>
            </div>

            {/* Slider 2: Occupancy */}
            <div className="calculator-control space-y-1">
              <div className="control-label flex justify-between text-xs">
                <span className="text-stone-600 font-medium">Average Monthly Occupancy</span>
                <strong className="font-mono text-base font-bold text-stone-900">{occupancy}%</strong>
              </div>
              <input
                aria-label="Occupancy rate"
                type="range"
                min="50"
                max="95"
                step="1"
                value={occupancy}
                style={{ "--range": `${((occupancy - 50) / 45) * 100}%` } as CSSProperties}
                onChange={(e) => setOccupancy(Number(e.target.value))}
                className="w-full"
              />
              <div className="range-labels flex justify-between text-[10px] text-stone-400 font-mono">
                <span>50%</span>
                <span>95%</span>
              </div>
            </div>

            {/* Slider 3: Ancillary Spend */}
            <div className="calculator-control space-y-1">
              <div className="control-label flex justify-between text-xs">
                <span className="text-stone-600 font-medium">Target Ancillary Spend / Room</span>
                <strong className="font-mono text-base font-bold text-stone-900">${avgSpend} / Stay</strong>
              </div>
              <input
                aria-label="Target spend"
                type="range"
                min="15"
                max="80"
                step="1"
                value={avgSpend}
                style={{ "--range": `${((avgSpend - 15) / 65) * 100}%` } as CSSProperties}
                onChange={(e) => setAvgSpend(Number(e.target.value))}
                className="w-full"
              />
              <div className="range-labels flex justify-between text-[10px] text-stone-400 font-mono">
                <span>$15</span>
                <span>$80</span>
              </div>
            </div>
          </div>

          <div className="calculator-results space-y-6">
            <div className="result-heading">
              <span>PROJECTED BUSINESS PERFORMANCE LIFT</span>
            </div>

            <div className="metric-row">
              <div>
                <strong className="text-stone-900 font-mono font-bold">
                  {frontDeskHoursSaved}
                  <small className="text-stone-500 text-sm"> hrs</small>
                </strong>
                <small className="text-stone-500 block">front desk time saved / month</small>
              </div>
              <div>
                <strong className="text-emerald-700 font-mono font-bold">
                  ${monthlyUpsellRevenue.toLocaleString()}+
                </strong>
                <small className="text-stone-500 block">new in-room dining & upsells / month</small>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-800">
                Annual Bottom-Line Profit Boost
              </span>
              <div className="text-3xl font-mono font-bold text-emerald-950">
                +${annualLift.toLocaleString()} AUD
              </div>
              <p className="text-[11px] text-emerald-800/80">
                Direct ancillary revenue generated across {rooms} keys without additional front desk headcount.
              </p>
            </div>

            <div className="mini-chart">
              <div className="chart-label flex justify-between text-xs pb-1">
                <span>Illustrative Weekly Revenue Lift</span>
                <b className="font-mono">In-Room Dining + Late Check-out</b>
              </div>
              <div className="bars">
                {chartData.map((point) => (
                  <i key={point.label} style={{ height: `${Math.max(12, (point.value / chartMax) * 100)}%` }} />
                ))}
              </div>
            </div>

            <button
              className="w-full py-3.5 px-4 rounded-2xl bg-[#18271f] hover:bg-[#284236] text-white font-bold text-xs transition-colors shadow flex items-center justify-center gap-2"
              onClick={() => setLocation("/start")}
            >
              <span>Onboard Your Property Now</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Hospitality Layers Overview */}
      <section id="product" className="platform-section section-pad">
        <div className="section-heading">
          <div>
            <span className="eyebrow">THE OPERATING SYSTEM</span>
            <h2 className="font-display">
              Stay, campus, walk,
              <br />
              <em>same unified companion.</em>
            </h2>
          </div>
          <p>
            Scan a room desk, a college gate, or an audio walk placard. AirPal powers the in-room companion behind it — Wi-Fi credentials, dining menus, calendar sync, and live concierge.
          </p>
        </div>
        <div className="feature-grid home-layer-grid">
          {layers.map((layer) => (
            <button key={layer.path} className={`feature-card ${layer.tone}`} onClick={() => setLocation(layer.path)}>
              <div className="feature-top">
                <span className="feature-number">{layer.kicker}</span>
              </div>
              <h3 className="font-bold text-lg">{layer.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{layer.text}</p>
              <span className="feature-link flex items-center gap-1 text-xs font-bold text-stone-900 mt-2">
                Open Sample <ArrowRight size={14} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Walks & Audio Story Section */}
      <section id="walks" className="story-section section-pad">
        <div className="story-copy" style={{ order: 0 }}>
          <span className="eyebrow">LOCAL EXPERIENCES</span>
          <h2 className="font-display">
            A shareable walk
            <br />
            <em>for guests who explore.</em>
          </h2>
          <p>
            Hotels and local guides create audio walking tours directly on their property profile. Guests step out the lobby doors and listen to curated stops with turn-by-turn directions.
          </p>
          <div className="check-list">
            <div>
              <span>
                <Check size={13} />
              </span>
              <p>
                <b>Self-guided, no app download</b>
                <small>Interactive map, voice at each stop, and instant walking directions.</small>
              </p>
            </div>
            <div>
              <span>
                <Check size={13} />
              </span>
              <p>
                <b>Calendar sync you already trust</b>
                <small>Syncs to Apple Calendar, Google Calendar, and Outlook.</small>
              </p>
            </div>
            <div>
              <span>
                <Check size={13} />
              </span>
              <p>
                <b>Curated by the property</b>
                <small>Local spots recommended by the hotel concierge, not an ad algorithm.</small>
              </p>
            </div>
          </div>
          <div className="hero-actions" style={{ marginTop: 8 }}>
            <button className="text-button" onClick={() => setLocation("/tour/rocks-harbour")}>
              <span>The Rocks Harbour Walk</span>
              <ArrowRight size={15} />
            </button>
            <button className="text-button" onClick={() => setLocation("/u/nisha-sydney")}>
              <span>Local Concierge Profile</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="story-art">
          <div className="story-photo home-walk-photo" />
          <div className="story-stamp shadow-md">
            <QrCode size={22} className="text-stone-950" />
            <span>
              SCAN ONCE
              <br />
              <b>WALK ANYTIME</b>
            </span>
          </div>
          <div className="story-caption">
            <span>02</span>
            <span>
              SYDNEY GRAND · NISHA · HARBOUR COLLEGE
              <br />
              PUBLIC PAGES, SAME OPERATING SYSTEM
            </span>
          </div>
        </div>
      </section>

      {/* Segregation Architecture Notice */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="p-6 rounded-3xl bg-white border border-[#dde3db] shadow-md flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 grid place-items-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-stone-900">
                Enterprise Production vs Sandbox Demo Isolation
              </h4>
              <p className="text-xs text-stone-500 max-w-xl leading-relaxed">
                AirPal keeps the Sandbox Demo (<code className="font-mono text-amber-800 bg-amber-50 px-1 py-0.5 rounded">/demo</code>) completely sandboxed from live properties. Demo changes run in isolated memory and never contaminate real Firestore tenant records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocation("/demo")}
              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs border border-amber-300 transition-colors"
            >
              Open Sandbox Demo
            </button>
            <button
              onClick={() => setLocation("/auth")}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors shadow"
            >
              Production Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="final-cta section-pad">
        <div className="final-inner space-y-4">
          <span className="eyebrow text-amber-300">ONE QR CODE</span>
          <h2 className="font-display">
            Ready to elevate your
            <br />
            <em>in-room guest experience?</em>
          </h2>
          <p className="text-stone-300 max-w-lg mx-auto text-sm leading-relaxed">
            Deploy your hotel compendium and in-room dining menus in minutes. Print your room QR codes once — update pricing and Wi-Fi anytime.
          </p>

          <div className="hero-actions" style={{ justifyContent: "center" }}>
            <button className="button-primary light shadow-lg" onClick={() => setLocation("/start")}>
              <span>Register Your Property Free</span>
              <ArrowRight size={16} />
            </button>
            <button className="button-quiet text-white hover:text-amber-300" onClick={() => setLocation("/demo")}>
              <Sparkles size={15} />
              <span>Explore Demo Sandbox</span>
            </button>
          </div>

          <div className="final-note text-xs text-stone-400 flex items-center justify-center gap-1.5 pt-2">
            <GraduationCap size={14} /> Built for boutique hotels, luxury resorts & residences
          </div>
        </div>
        <div className="final-orb orb-one" />
        <div className="final-orb orb-two" />
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand space-y-2">
          <button className="brand inverse" onClick={() => scrollTo("top")}>
            <span className="brand-mark">
              <img src="/logo-mark.png" alt="" />
            </span>
            <span className="font-bold text-lg">
              AirPal<span className="brand-dot text-amber-400">.</span>me
            </span>
          </button>
          <p className="text-xs text-stone-400">The traveller’s and hotelier’s in-room operating system.</p>
        </div>

        <div className="footer-links">
          <div>
            <b>Operating Roles</b>
            <button onClick={() => setLocation("/admin")}>Platform Super Admin</button>
            <button onClick={() => setLocation("/host")}>Hotel GM Operations</button>
            <button onClick={() => setLocation("/stay")}>Guest Room Companion</button>
            <button onClick={() => setLocation("/auth")}>Enterprise Sign In</button>
          </div>
          <div>
            <b>Interactive Hub</b>
            <button onClick={() => setLocation("/demo")}>Sandbox Demo</button>
            <button onClick={() => setLocation("/demo/host")}>Host GM Demo</button>
            <button onClick={() => setLocation("/demo/stay")}>Guest Room Demo</button>
            <button onClick={() => setLocation("/demo/admin")}>Super Admin Demo</button>
          </div>
          <div>
            <b>Property Tools</b>
            <button onClick={() => setLocation("/start")}>Register Hotel</button>
            <button onClick={() => setLocation("/scan")}>Scan QR Code</button>
            <button onClick={() => setLocation("/tour/rocks-harbour")}>Audio Walks</button>
            <button onClick={() => setLocation("/u/harbour-hotel")}>Sample Compendium</button>
          </div>
        </div>

        <div className="footer-bottom flex flex-wrap items-center justify-between text-xs text-stone-400 pt-6 border-t border-stone-800">
          <span>© 2026 AirPal.me · Enterprise Hospitality Cloud OS</span>
          <span>Role-Based Access Control · Firestore Protected · Zero Demo Contamination</span>
        </div>
      </footer>
    </main>
  );
}
