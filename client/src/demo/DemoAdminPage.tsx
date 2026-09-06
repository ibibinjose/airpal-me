import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  ShieldAlert,
  Building2,
  DollarSign,
  TrendingUp,
  BedDouble,
  Users,
  Plus,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Sparkles,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { PropertyInfo } from "@shared/airpal-data";
import { getSandboxProperties, saveSandboxProperty, resetEntireSandbox } from "./demo-sandbox";
import { DemoBanner } from "./DemoBanner";
import { RealtimeTopBar } from "../components/RealtimeTopBar";
import { toast } from "sonner";

export const DemoAdminPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [properties, setProperties] = useState<PropertyInfo[]>(() => getSandboxProperties());
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New property form state
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("Sydney");
  const [newAddress, setNewAddress] = useState("");
  const [newRooms, setNewRooms] = useState(40);
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newPlan, setNewPlan] = useState<"Starter" | "Professional" | "Enterprise">("Professional");

  const totalRooms = properties.reduce((sum, p) => sum + (p.roomsCount || 20), 0);
  const totalRevenue = properties.reduce((sum, p) => sum + (p.monthlyRevenue || 12000), 0);
  const totalPlatformFee = Math.round(totalRevenue * 0.05);

  const filtered = properties.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const propId = `demo-${newName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const newProp: PropertyInfo = {
      id: propId,
      name: newName.trim(),
      kind: "hotel",
      tagline: "Your guest companion",
      destination: `${newCity} City Center`,
      city: newCity,
      country: "Australia",
      address: newAddress || `${newCity}, Australia`,
      phone: "+61 2 9250 1000",
      whatsapp: "+61 400 123 456",
      roomsCount: Number(newRooms) || 30,
      status: "active",
      ownerEmail: newOwnerEmail.trim() || `host@${propId}.com`,
      monthlyRevenue: 15000,
      plan: newPlan,
      wifi: {
        network: `${newName.replace(/\s+/g, "")}_Guest`,
        password: "WelcomeToAirPal2026",
        speed: "1 Gbps Fiber",
      },
      checkIn: "2:00 PM",
      checkOut: "10:00 AM",
      breakfast: {
        hours: "7:00 AM – 10:30 AM",
        location: "Main Dining Hall",
        type: "Artisan Buffet",
        price: "Included",
      },
      facilities: [
        { name: "Concierge Desk", hours: "24 Hours", floor: "Lobby", details: "On-demand guest support", icon: "BellRing" },
      ],
    };

    saveSandboxProperty(newProp);
    setProperties(getSandboxProperties());
    setShowAddModal(false);
    setNewName("");
    setNewAddress("");
    setNewOwnerEmail("");
    toast.success(`Demo Hotel Added: ${newProp.name}`, {
      description: "Added to your sandboxed demo database.",
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-[#16211c] flex flex-col font-sans">
      <RealtimeTopBar className="sticky top-0 z-40 border-b border-[#dde3db]" />
      <DemoBanner currentRoute="/demo/admin" />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-xs font-semibold">
              <ShieldCheck size={14} className="text-purple-700" />
              <span>Platform Super Admin · Demo Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#16211c]">
              Hotel Network & Platform Governance
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              Manage onboarded hotels, review 5% platform take-rate, and simulate instant hotel onboarding.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#18271f] hover:bg-[#23382c] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus size={15} />
              <span>Onboard Demo Hotel</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-[#dde3db] shadow-xs">
            <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block">Network Hotels</span>
            <div className="flex items-baseline justify-between pt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#16211c] font-display">{properties.length}</span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">100% Active</span>
            </div>
            <span className="text-[11px] text-stone-400 mt-2 block">{totalRooms} guest rooms deployed</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#dde3db] shadow-xs">
            <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block">Gross Guest Spend</span>
            <div className="flex items-baseline justify-between pt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#16211c] font-display">
                ${totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">+18.4%</span>
            </div>
            <span className="text-[11px] text-stone-400 mt-2 block">Monthly ancillary & dining spend</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#dde3db] shadow-xs">
            <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block">AirPal Platform Fee (5%)</span>
            <div className="flex items-baseline justify-between pt-2">
              <span className="text-2xl sm:text-3xl font-bold text-purple-900 font-display">
                ${totalPlatformFee.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">SaaS Revenue</span>
            </div>
            <span className="text-[11px] text-stone-400 mt-2 block">Automated monthly payout take-rate</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#dde3db] shadow-xs">
            <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider block">Scan Engagement</span>
            <div className="flex items-baseline justify-between pt-2">
              <span className="text-2xl sm:text-3xl font-bold text-[#16211c] font-display">94.2%</span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Optimal</span>
            </div>
            <span className="text-[11px] text-stone-400 mt-2 block">Zero guest app installs required</span>
          </div>
        </div>

        {/* Hotel Directory */}
        <div className="bg-white rounded-3xl border border-[#dde3db] shadow-xs overflow-hidden">
          <div className="p-5 border-b border-[#dde3db] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#16211c]">Demo Property Portfolio</h2>
              <p className="text-xs text-stone-500">All properties below are sandboxed and simulated for stakeholders.</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hotel, city..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf7] text-stone-500 font-mono border-b border-[#dde3db]">
                <tr>
                  <th className="px-5 py-3">Property Name</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Rooms</th>
                  <th className="px-5 py-3">Subscription</th>
                  <th className="px-5 py-3">Monthly Spend</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dde3db]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#f8faf7]/80 transition-colors">
                    <td className="px-5 py-4 font-semibold text-stone-900">
                      <div className="flex items-center gap-2">
                        <Building2 size={15} className="text-purple-600 shrink-0" />
                        <div>
                          <span>{p.name}</span>
                          <span className="text-[10px] text-stone-400 font-mono block">{p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-stone-600">{p.city}, Australia</td>
                    <td className="px-5 py-4 font-mono">{p.roomsCount || 20}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[10px] border border-stone-200">
                        {p.plan || "Starter"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono font-semibold text-stone-900">
                      ${(p.monthlyRevenue || 12000).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setLocation("/demo/host")}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-purple-100 text-stone-700 hover:text-purple-900 font-medium text-[11px] transition-colors"
                      >
                        <span>Open Host CMS</span>
                        <ExternalLink size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Onboard Hotel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">Onboard Demo Hotel (60-Sec Wizard)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Hotel or Resort Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Parkview Suites Sydney"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">City</label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Rooms Count</label>
                  <input
                    type="number"
                    value={newRooms}
                    onChange={(e) => setNewRooms(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">Owner / GM Email</label>
                <input
                  type="email"
                  value={newOwnerEmail}
                  onChange={(e) => setNewOwnerEmail(e.target.value)}
                  placeholder="gm@hotel.com"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700">SaaS Plan Tier</label>
                <select
                  value={newPlan}
                  onChange={(e) => setNewPlan(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs bg-white focus:outline-none"
                >
                  <option value="Starter">Starter ($99/mo)</option>
                  <option value="Professional">Professional ($249/mo)</option>
                  <option value="Enterprise">Enterprise ($499/mo)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold shadow-xs"
                >
                  Deploy to Demo Sandbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
