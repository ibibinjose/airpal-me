import React, { useState } from "react";
import { useAirPal } from "../contexts/AirPalContext";
import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  QrCode,
  BellRing,
  BarChart3,
  Settings2,
  Users,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Printer,
  Download,
  Utensils,
  Wrench,
  Shirt,
  HelpCircle,
  ShieldCheck,
  Building,
  Check,
  AlertCircle,
  BedDouble,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export const HostDashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const { property, staffTickets, updateTicketStatus, places, experiences, upsells } = useAirPal();
  const [activeSection, setActiveSection] = useState<"overview" | "inbox" | "qr-kit" | "knowledge" | "analytics">("overview");
  const [ticketFilter, setTicketFilter] = useState<"all" | "pending" | "in_progress" | "resolved">("all");
  const [qrRoomInput, setQrRoomInput] = useState<string>("508");
  const [qrTypeSelection, setQrTypeSelection] = useState<"room" | "lobby" | "restaurant" | "emergency">("room");

  const pendingCount = staffTickets.filter((t) => t.status === "pending").length;
  const inProgressCount = staffTickets.filter((t) => t.status === "in_progress").length;

  const filteredTickets = staffTickets.filter((t) => {
    if (ticketFilter === "all") return true;
    return t.status === ticketFilter;
  });

  // Top guest questions intelligence (Section 34 of spec)
  const topGuestQuestions = [
    { query: "Where can I get good Indian food nearby?", count: 142, category: "Dining", trend: "+28%" },
    { query: "Can I get late checkout until 4 PM?", count: 118, category: "Upsell", trend: "+35%" },
    { query: "What time does breakfast finish?", count: 94, category: "Compendium", trend: "-5%" },
    { query: "How do I get to the Opera House?", count: 87, category: "Destination", trend: "+12%" },
    { query: "Extra towels and feather pillows", count: 64, category: "Housekeeping", trend: "+8%" },
    { query: "Air conditioning temperature control", count: 32, category: "Maintenance", trend: "-14%" },
  ];

  return (
    <div className="min-h-[calc(100vh-45px)] bg-[#f4f6f1] text-[#16211c] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#dde3db] bg-[#fffdf9] p-4 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Property Identity Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-[#dde3db]">
            <div className="grid place-items-center w-10 h-10 rounded-xl bg-amber-400 text-stone-950 font-bold text-base shadow">
              H
            </div>
            <div className="overflow-hidden">
              <strong className="block text-sm font-bold text-[#16211c] truncate">
                {property.name}
              </strong>
              <span className="text-[11px] text-[#c57a32] font-mono">
                The Rocks · 84 Rooms
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <span className="block px-3 text-[10px] font-mono tracking-wider uppercase text-stone-400 mb-2">
              Hotel Workspace
            </span>

            {[
              { id: "overview", label: "Overview & Health", icon: LayoutDashboard },
              {
                id: "inbox",
                label: "Live Staff Inbox",
                icon: BellRing,
                badge: pendingCount > 0 ? `${pendingCount} new` : undefined,
              },
              { id: "qr-kit", label: "Dynamic QR Kit", icon: QrCode },
              { id: "knowledge", label: "Property Compendium", icon: BedDouble },
              { id: "analytics", label: "Guest Intelligence", icon: BarChart3 },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    activeSection === item.id
                      ? "bg-amber-400 text-stone-950 font-bold shadow-sm"
                      : "text-[#5a6b62] hover:bg-[#f3f6f1] hover:text-[#16211c]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-[#16211c] font-mono text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-[#dde3db] space-y-2 text-xs">
          <button
            onClick={() => setLocation("/stay")}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-[#eef3ed] text-[#c57a32] font-semibold border border-amber-400/30 transition-all text-xs"
          >
            <ExternalLink size={13} />
            <span>Preview Guest App</span>
          </button>
          <div className="p-2.5 rounded-xl bg-white text-[11px] text-stone-400 flex items-center justify-between">
            <span>AirPal PMS Sync</span>
            <span className="flex items-center gap-1 text-[#2d7a55] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Operational Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#dde3db]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                Staff Operating Console
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#dceee4] text-[#2f7a56] text-[10px] font-mono border border-emerald-500/30">
                Front Desk Duty Active
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#16211c] tracking-tight">
              {activeSection === "overview" && "Property Operations & Health"}
              {activeSection === "inbox" && "Live Guest Requests & Escalations"}
              {activeSection === "qr-kit" && "Dynamic QR Deployment Studio"}
              {activeSection === "knowledge" && "Property Knowledge Base & CMS"}
              {activeSection === "analytics" && "Guest Demand & Search Intelligence"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                toast.success("Sync with Property PMS Completed", {
                  description: "84 rooms, 142 check-ins today synced.",
                });
              }}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#eef3ed] border border-[#dde3db] text-xs font-semibold text-[#3a4a42] transition-all"
            >
              Sync PMS
            </button>
            <button
              onClick={() => setActiveSection("inbox")}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 text-xs font-bold transition-all shadow"
            >
              <BellRing size={14} />
              <span>Inbox ({pendingCount})</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: OVERVIEW */}
        {activeSection === "overview" && (
          <div className="space-y-6 animate-in fade-in">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>QR Scans Today</span>
                  <QrCode size={16} className="text-amber-400" />
                </span>
                <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#16211c]">
                  348
                </strong>
                <span className="text-[11px] text-[#2d7a55] font-mono">
                  +34% vs last week
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>AI Handled Inquiries</span>
                  <Sparkles size={16} className="text-[#2d7a55]" />
                </span>
                <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#16211c]">
                  86.4%
                </strong>
                <span className="text-[11px] text-stone-400 font-mono">
                  128 staff hours saved/mo
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>Upsell Revenue</span>
                  <DollarSign size={16} className="text-amber-400" />
                </span>
                <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#c57a32]">
                  $3,840
                </strong>
                <span className="text-[11px] text-[#2d7a55] font-mono">
                  Late checkouts & breakfast
                </span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>Pending Escalations</span>
                  <BellRing size={16} className="text-red-400" />
                </span>
                <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#b42318]">
                  {pendingCount}
                </strong>
                <span className="text-[11px] text-[#c57a32] font-mono">
                  Avg response: 4.2 mins
                </span>
              </div>
            </div>

            {/* Live Request Preview & Demand Intelligence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Urgent Guest Escalations */}
              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#16211c] flex items-center gap-2">
                    <BellRing size={18} className="text-amber-400" />
                    <span>Live Staff Escalations</span>
                  </h3>
                  <button
                    onClick={() => setActiveSection("inbox")}
                    className="text-xs text-amber-400 hover:text-[#c57a32] font-semibold flex items-center gap-1"
                  >
                    <span>View All ({staffTickets.length})</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {staffTickets.slice(0, 3).map((ticket) => (
                    <div
                      key={ticket.id}
                      className="p-3.5 rounded-2xl bg-white border border-[#dde3db] flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-lg bg-[#f8e4c8] text-[#c57a32] font-mono font-bold text-xs">
                            Room {ticket.roomNumber}
                          </span>
                          <span className="text-xs font-semibold text-[#16211c]">
                            {ticket.guestName}
                          </span>
                          {ticket.urgency === "urgent" && (
                            <span className="px-1.5 py-0.5 rounded bg-[#fadad6] text-[#b42318] text-[10px] font-mono uppercase">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#5a6b62] leading-snug">
                          {ticket.details}
                        </p>
                        <span className="text-[10px] font-mono text-stone-500">
                          {ticket.createdAt} · Category: {ticket.category}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                            ticket.status === "resolved"
                              ? "bg-[#dceee4] text-[#2f7a56]"
                              : ticket.status === "in_progress"
                              ? "bg-[#f8e4c8] text-[#c57a32]"
                              : "bg-[#fadad6] text-[#b42318]"
                          }`}
                        >
                          {ticket.status.replace("_", " ")}
                        </span>
                        {ticket.status !== "resolved" && (
                          <button
                            onClick={() => updateTicketStatus(ticket.id, "resolved")}
                            className="px-2.5 py-1 rounded-lg bg-[#dceee4] hover:bg-emerald-500 text-[#2f7a56] hover:text-stone-950 font-semibold text-[11px] transition-all"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guest Demand Intelligence (Section 34) */}
              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#16211c] flex items-center gap-2">
                    <Sparkles size={18} className="text-[#2d7a55]" />
                    <span>What Guests are Asking For</span>
                  </h3>
                  <span className="text-[11px] font-mono text-stone-400">Past 7 Days</span>
                </div>

                <div className="space-y-2">
                  {topGuestQuestions.slice(0, 5).map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-[#e8ece4] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <strong className="block text-[#3a4a42] font-medium truncate max-w-[280px]">
                          “{q.query}”
                        </strong>
                        <span className="text-[10px] text-stone-400 font-mono">
                          Category: {q.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-right">
                        <div>
                          <strong className="block text-[#c57a32] font-mono">{q.count} times</strong>
                          <span className="text-[10px] text-[#2d7a55] font-mono">{q.trend}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: LIVE STAFF INBOX */}
        {activeSection === "inbox" && (
          <div className="space-y-5 animate-in fade-in">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 text-xs">
              {[
                { id: "all", label: `All Requests (${staffTickets.length})` },
                { id: "pending", label: `Pending Attention (${pendingCount})` },
                { id: "in_progress", label: `In Progress (${inProgressCount})` },
                { id: "resolved", label: "Resolved" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTicketFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    ticketFilter === f.id
                      ? "bg-amber-400 text-stone-950 font-bold border-amber-400"
                      : "bg-white border-[#dde3db] text-[#5a6b62] hover:bg-[#eef3ed]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Tickets List */}
            <div className="space-y-3">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-3 hover:border-amber-400/30 transition-all"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-xl bg-[#f8e4c8] text-[#c57a32] font-mono font-bold text-sm">
                          Room {ticket.roomNumber}
                        </span>
                        <h4 className="font-bold text-base text-[#16211c]">
                          {ticket.guestName}
                        </h4>
                        <span className="text-xs font-mono text-stone-400">
                          · {ticket.category.toUpperCase()}
                        </span>
                        {ticket.urgency === "urgent" && (
                          <span className="px-2 py-0.5 rounded-md bg-[#fadad6] text-[#b42318] font-mono text-xs font-bold border border-red-500/30">
                            Urgent Request
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#3a4a42] leading-relaxed pt-1">
                        {ticket.details}
                      </p>
                      <span className="text-[11px] font-mono text-stone-500">
                        Received {ticket.createdAt} via AirPal Companion
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-mono uppercase font-bold ${
                          ticket.status === "resolved"
                            ? "bg-[#dceee4] text-[#2f7a56] border border-emerald-500/30"
                            : ticket.status === "in_progress"
                            ? "bg-[#f8e4c8] text-[#c57a32] border border-amber-500/30"
                            : "bg-[#fadad6] text-[#b42318] border border-red-500/30"
                        }`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#e8ece4] text-xs">
                    <span className="text-stone-400">
                      Assigned to: Front Desk Duty Manager
                    </span>

                    <div className="flex items-center gap-2">
                      {ticket.status !== "in_progress" && ticket.status !== "resolved" && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, "in_progress")}
                          className="px-3 py-1.5 rounded-xl bg-[#f8e4c8] hover:bg-amber-400 text-[#c57a32] hover:text-stone-950 font-semibold transition-all"
                        >
                          Mark In Progress
                        </button>
                      )}

                      {ticket.status !== "resolved" && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, "resolved")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold transition-all"
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: DYNAMIC QR DEPLOYMENT STUDIO (Section 7 & 39 of spec) */}
        {activeSection === "qr-kit" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-transparent border border-[#dde3db] space-y-2">
              <h3 className="font-bold text-lg text-[#16211c]">
                Dynamic QR Deployment Studio
              </h3>
              <p className="text-xs text-[#5a6b62] max-w-2xl leading-relaxed">
                The QR points to the intelligent AirPal environment. When you update menus, Wi-Fi passwords, policies, or event timings, the printed QR code never needs to be replaced.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* QR Customizer */}
              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <h4 className="font-bold text-sm text-[#16211c]">Generate Code</h4>

                <div>
                  <label className="block text-xs font-semibold text-[#5a6b62] mb-1.5">
                    QR Target Type
                  </label>
                  <select
                    value={qrTypeSelection}
                    onChange={(e) => setQrTypeSelection(e.target.value as any)}
                    className="w-full rounded-xl bg-[#f1f5f0] border border-[#dde3db] p-2.5 text-xs text-[#16211c] outline-none"
                  >
                    <option value="room" className="bg-stone-900">In-Room Desk Stand (Specific Room)</option>
                    <option value="lobby" className="bg-stone-900">Lobby Reception Stand (Property Wide)</option>
                    <option value="restaurant" className="bg-stone-900">Dining Table QR (Waterfront Grill)</option>
                    <option value="emergency" className="bg-stone-900">Emergency & Evacuation Signage</option>
                  </select>
                </div>

                {qrTypeSelection === "room" && (
                  <div>
                    <label className="block text-xs font-semibold text-[#5a6b62] mb-1.5">
                      Room Number
                    </label>
                    <input
                      type="text"
                      value={qrRoomInput}
                      onChange={(e) => setQrRoomInput(e.target.value)}
                      placeholder="e.g. 508"
                      className="w-full rounded-xl bg-[#f1f5f0] border border-[#dde3db] p-2.5 text-xs text-[#16211c] outline-none"
                    />
                  </div>
                )}

                <div className="p-3 rounded-xl bg-white border border-[#e8ece4] space-y-1 text-xs text-[#5a6b62]">
                  <span className="block font-mono text-[10px] text-amber-400 uppercase">Target URL Destination</span>
                  <span className="font-mono text-xs text-[#16211c] break-all">
                    https://airpal.me/g/{property.id}?type={qrTypeSelection}&room={qrRoomInput}
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      toast.success("Print Template Downloaded", {
                        description: `High-res PDF generated for Room ${qrRoomInput} Wooden Stand (1200 DPI).`,
                      });
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-all shadow"
                  >
                    <Download size={14} />
                    <span>Download PDF Kit</span>
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="p-2.5 rounded-xl bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#3a4a42] border border-[#dde3db] transition-all"
                  >
                    <Printer size={15} />
                  </button>
                </div>
              </div>

              {/* Physical Mockup Preview (Section 40) */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-[#1d3025] to-[#24382d] border border-[#dde3db] flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                  Physical Stand Mockup · Premium Oak Finish
                </span>

                <div className="w-64 p-6 rounded-2xl bg-[#fdfbf7] text-stone-950 shadow-2xl border border-stone-200 flex flex-col items-center space-y-3">
                  <div className="flex items-center gap-1 font-bold text-xs">
                    <span className="text-amber-600">✦</span>
                    <span>airpal<span className="text-amber-600">.me</span></span>
                  </div>

                  <div className="w-36 h-36 border-4 border-stone-950 rounded-2xl p-2.5 flex items-center justify-center bg-white shadow-inner">
                    <QrCode size={110} strokeWidth={1.5} className="text-stone-950" />
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[11px] font-mono uppercase font-bold tracking-wider text-amber-800">
                      {qrTypeSelection === "room" ? `Room ${qrRoomInput}` : "Harbour Hotel"}
                    </span>
                    <strong className="block text-sm font-bold tracking-tight">
                      One Scan. Your Entire Stay.
                    </strong>
                    <span className="block text-[10px] text-stone-600 leading-snug">
                      Wi-Fi · In-Room Dining · Things To Do · Ask AirPal
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-400 max-w-sm">
                  Ready for wooden room stands, acrylic bedside displays, elevator cards, and keycard sleeves.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: PROPERTY COMPENDIUM & KNOWLEDGE BASE */}
        {activeSection === "knowledge" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
              <h3 className="font-bold text-base text-[#16211c]">
                Live Hotel Knowledge Base
              </h3>
              <p className="text-xs text-[#5a6b62]">
                AirPal AI answers guest questions strictly from this approved property data, preventing hallucination.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-[#dde3db] space-y-2">
                  <strong className="block text-[#c57a32] font-semibold">Wi-Fi Configuration</strong>
                  <div className="space-y-1 text-[#5a6b62] font-mono text-[11px]">
                    <div>SSID: {property.wifi.network}</div>
                    <div>Password: {property.wifi.password}</div>
                    <div>Speed: {property.wifi.speed}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#dde3db] space-y-2">
                  <strong className="block text-[#c57a32] font-semibold">Breakfast Operating Hours</strong>
                  <div className="space-y-1 text-[#5a6b62] text-[11px]">
                    <div>Hours: {property.breakfast.hours}</div>
                    <div>Venue: {property.breakfast.location}</div>
                    <div>Pricing: {property.breakfast.price}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#dde3db] space-y-2">
                  <strong className="block text-[#c57a32] font-semibold">Check-in / Check-out Policies</strong>
                  <div className="space-y-1 text-[#5a6b62] text-[11px]">
                    <div>Check-in: {property.checkIn}</div>
                    <div>Check-out: {property.checkOut}</div>
                    <div>Late check-out fee: $45 AUD until 4:00 PM</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#dde3db] space-y-2">
                  <strong className="block text-[#c57a32] font-semibold">Emergency Contacts</strong>
                  <div className="space-y-1 text-[#5a6b62] text-[11px]">
                    <div>Direct Duty Line: {property.phone}</div>
                    <div>Assembly Point: First Fleet Park (George St)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 5: ANALYTICS & SEARCH INTELLIGENCE */}
        {activeSection === "analytics" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <h3 className="font-bold text-base text-[#16211c]">
                  Top Inquiring Guest Nationalities
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { country: "Australia & Domestic", pct: "42%", scans: "146 scans" },
                    { country: "United States", pct: "24%", scans: "84 scans" },
                    { country: "United Kingdom", pct: "16%", scans: "56 scans" },
                    { country: "Japan & China", pct: "12%", scans: "42 scans" },
                    { country: "Europe (FR/DE/ES)", pct: "6%", scans: "20 scans" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white">
                      <span className="text-[#3a4a42]">{row.country}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-stone-400 font-mono">{row.scans}</span>
                        <strong className="text-[#c57a32] font-mono">{row.pct}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <h3 className="font-bold text-base text-[#16211c]">
                  Peak Guest Scan Hours
                </h3>
                <div className="space-y-2 text-xs">
                  {[
                    { time: "2:00 PM – 4:00 PM (Check-in Rush)", activity: "Wi-Fi, Room service, Air Conditioning" },
                    { time: "6:00 PM – 7:30 PM (Dinner & Sunset)", activity: "What should I do now?, Rooftop bars, Indian food" },
                    { time: "8:00 AM – 9:30 AM (Breakfast Rush)", activity: "Breakfast times, Luggage storage, Check-out" },
                    { time: "10:30 PM – 12:00 AM (Late Night)", activity: "Late room dining, Late check-out requests" },
                  ].map((row, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white space-y-1">
                      <strong className="block text-[#c57a32]">{row.time}</strong>
                      <span className="text-[11px] text-[#5a6b62]">{row.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
