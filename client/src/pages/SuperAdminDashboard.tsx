import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "wouter";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { RealtimeTopBar } from "../components/RealtimeTopBar";
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
  Percent,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { PropertyInfo, DealItem } from "@shared/airpal-data";
import { loadAllProperties, saveProperty, loadPropertyDeals } from "../lib/airpal-backend";
import { toast } from "sonner";
import { nanoid } from "nanoid";

export const SuperAdminDashboard: React.FC = () => {
  const { user, role, setActivePropertyId, switchRole, logout } = useAuth();
  const [, setLocation] = useLocation();

  const [properties, setProperties] = useState<PropertyInfo[]>(() => loadAllProperties());
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // New property form state
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("Sydney");
  const [newAddress, setNewAddress] = useState("");
  const [newRooms, setNewRooms] = useState(30);
  const [newOwnerEmail, setNewOwnerEmail] = useState("");
  const [newPlan, setNewPlan] = useState<"Starter" | "Professional" | "Enterprise">("Professional");

  const totalRooms = properties.reduce((sum, p) => sum + (p.roomsCount || 20), 0);
  const totalRevenue = properties.reduce((sum, p) => sum + (p.monthlyRevenue || 12000), 0);
  const totalPlatformFee = Math.round(totalRevenue * 0.05); // 5% platform take-rate

  const filtered = properties.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const propId = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProp: PropertyInfo = {
      id: propId,
      name: newName,
      tagline: "Boutique Living & Memorable Experiences",
      destination: newCity,
      city: newCity,
      country: "Australia",
      address: newAddress || `${newCity} Waterfront Promenade`,
      phone: "+61 2 9555 1234",
      whatsapp: "+61 488 555 678",
      roomsCount: Number(newRooms),
      status: "active",
      ownerEmail: newOwnerEmail || `gm@${propId}.com.au`,
      monthlyRevenue: Number(newRooms) * 350,
      plan: newPlan,
      wifi: {
        network: `${newName.replace(/\s+/g, "")}_Guest`,
        password: "welcomeguest2026",
        speed: "250 Mbps High-Speed Fibre",
      },
      checkIn: "2:00 PM",
      checkOut: "10:00 AM",
      breakfast: {
        hours: "7:00 AM – 10:30 AM",
        location: "Atrium Lounge",
        type: "Artisan Breakfast Buffet",
        price: "$22",
      },
      facilities: [
        { name: "Rooftop Pool", hours: "6:00 AM – 9:00 PM", floor: "Level 5", details: "Panoramic vistas", icon: "Waves" },
        { name: "Luggage Vault", hours: "24/7 Front Desk", floor: "Lobby", details: "Complimentary holding", icon: "Luggage" },
      ],
    };

    await saveProperty(newProp);
    setProperties(loadAllProperties());
    setShowAddModal(false);
    setNewName("");
    setNewAddress("");
    setNewOwnerEmail("");
    toast.success("New Property Onboarded!", {
      description: `${newProp.name} (${newProp.roomsCount} rooms) added to AirPal Cloud.`,
    });
  };

  const handleOpenHostAdmin = (propId: string) => {
    setActivePropertyId(propId);
    switchRole("host_admin", propId);
    setLocation("/host");
  };

  const handleViewGuestApp = (propId: string) => {
    setActivePropertyId(propId);
    setLocation(`/g/${propId}`);
  };

  return (
    <ProtectedRoute allowedRoles={["super_admin"]} resourceName="Platform Super Admin Portal">
      <div className="min-h-screen bg-[#f3f5f0] text-[#16211c] flex flex-col font-sans">
        <RealtimeTopBar className="sticky top-0 z-40 border-b border-[#dde3db]" />

        {/* Super Admin Session Strip */}
        <div className="bg-stone-900 text-white px-4 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-stone-300">
              Signed in as <strong className="text-white">{user?.displayName || user?.email}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold uppercase border border-purple-500/30">
              Role: Super Admin
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocation("/host")}
              className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Host Operations</span>
              <ArrowUpRight size={13} />
            </button>
            <button
              onClick={() => setLocation("/")}
              className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={13} />
              <span>Public Home</span>
            </button>
            <button
              onClick={() => {
                logout();
                setLocation("/auth");
              }}
              className="px-3 py-1 rounded-lg bg-red-950/70 hover:bg-red-900/70 text-red-200 text-xs transition-colors flex items-center gap-1.5 border border-red-800/40"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Banner */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#dde3db]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-mono font-bold uppercase border border-purple-300/40 flex items-center gap-1">
                  <ShieldCheck size={12} className="text-purple-700" />
                  Platform Super Admin Control
                </span>
                <span className="text-xs text-stone-400 font-mono">AirPal Cloud OS v2.4</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#16211c]">
                Global Hospitality Network
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 transition-all shadow active:scale-95"
              >
                <Plus size={15} />
                <span>Onboard New Hotel</span>
              </button>
            </div>
          </div>

      {/* Global Platform KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
          <span className="text-xs text-stone-400 flex items-center justify-between">
            <span>Onboarded Properties</span>
            <Building2 size={16} className="text-amber-500" />
          </span>
          <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#16211c]">
            {properties.length}
          </strong>
          <span className="text-[11px] text-[#2d7a55] font-mono">100% operational</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
          <span className="text-xs text-stone-400 flex items-center justify-between">
            <span>Managed Guest Rooms</span>
            <BedDouble size={16} className="text-blue-500" />
          </span>
          <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#16211c]">
            {totalRooms}
          </strong>
          <span className="text-[11px] text-stone-500 font-mono">Across Australia</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
          <span className="text-xs text-stone-400 flex items-center justify-between">
            <span>Monthly Platform GMV</span>
            <DollarSign size={16} className="text-emerald-500" />
          </span>
          <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#16211c]">
            ${totalRevenue.toLocaleString()} AUD
          </strong>
          <span className="text-[11px] text-[#2d7a55] font-mono">+18.4% this month</span>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
          <span className="text-xs text-stone-400 flex items-center justify-between">
            <span>Platform Take-Rate (5%)</span>
            <Percent size={16} className="text-purple-500" />
          </span>
          <strong className="block text-2xl sm:text-3xl font-bold font-mono text-purple-900">
            ${totalPlatformFee.toLocaleString()} AUD
          </strong>
          <span className="text-[11px] text-purple-700 font-mono">Net platform revenue</span>
        </div>
      </div>

      {/* Property Directory */}
      <div className="bg-white rounded-3xl border border-[#dde3db] overflow-hidden shadow-sm space-y-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
          <div>
            <h2 className="text-base font-bold text-[#16211c]">Hospitality Property Directory</h2>
            <p className="text-xs text-[#5a6b62]">
              View, inspect, or manage any hotel’s business portal and guest companion.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-3 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search hotels, cities..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#dde3db] text-[11px] font-mono uppercase text-stone-400">
                <th className="py-3 px-3">Property</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Rooms</th>
                <th className="py-3 px-3">SaaS Plan</th>
                <th className="py-3 px-3">Monthly GMV</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef2ec]">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-[#fbfcf9] transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-[#16211c]">{prop.name}</div>
                    <div className="text-[11px] text-stone-400 font-mono">{prop.id}</div>
                  </td>
                  <td className="py-3.5 px-3 text-stone-600">
                    <div>{prop.city}</div>
                    <div className="text-[11px] text-stone-400">{prop.address}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-stone-800">
                    {prop.roomsCount || 20} rooms
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 font-mono text-[10px] font-semibold border border-stone-200">
                      {prop.plan || "Professional"}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-700">
                    ${(prop.monthlyRevenue || 14000).toLocaleString()} AUD
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleOpenHostAdmin(prop.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs transition-all"
                      >
                        Host CMS
                      </button>
                      <button
                        onClick={() => handleViewGuestApp(prop.id)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-all"
                        title="Preview Guest Companion"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard Hotel Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-[#dde3db] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#dde3db]">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-amber-600" />
                <h3 className="font-bold text-base text-[#16211c]">Onboard New Hotel / Resort</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#3a4a42]">Hotel Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Sydney Harbour Grand Suites"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">City / Destination</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Sydney, Byron Bay, Melbourne"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Number of Rooms</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={newRooms}
                    onChange={(e) => setNewRooms(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#3a4a42]">Address</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="100 Ocean Parade, Bondi, NSW 2026"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">General Manager Email</label>
                  <input
                    type="email"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    placeholder="gm@hotel.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none focus:border-amber-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Subscription Tier</label>
                  <select
                    value={newPlan}
                    onChange={(e) => setNewPlan(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                  >
                    <option value="Starter">Starter ($199/mo)</option>
                    <option value="Professional">Professional ($499/mo)</option>
                    <option value="Enterprise">Enterprise ($1,299/mo)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
                >
                  Complete Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </div>
    </ProtectedRoute>
  );
};
