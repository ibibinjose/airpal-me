import React, { useState, useEffect } from "react";
import { useAirPal } from "../contexts/AirPalContext";
import { useAuth } from "../contexts/AuthContext";
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
  Tag,
  Trash2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Coffee,
  Car,
  Compass,
  Save,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { DealItem, MenuItem, PropertyInfo } from "@shared/airpal-data";
import { nanoid } from "nanoid";

export const HostDashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, role, userProperties, isSuperAdmin } = useAuth();
  const {
    property,
    updateProperty,
    setPropertyId,
    staffTickets,
    updateTicketStatus,
    deals,
    addDeal,
    updateDeal,
    removeDeal,
    menuItems,
    addMenuItem,
    updateMenuItem,
    removeMenuItem,
    places,
    addPlace,
    removePlace,
  } = useAirPal();

  const [activeSection, setActiveSection] = useState<
    "overview" | "inbox" | "deals" | "menu" | "knowledge" | "qr-kit" | "analytics"
  >("overview");

  const [ticketFilter, setTicketFilter] = useState<"all" | "pending" | "in_progress" | "resolved">("all");
  const [qrRoomInput, setQrRoomInput] = useState<string>("508");
  const [qrTypeSelection, setQrTypeSelection] = useState<"room" | "lobby" | "restaurant" | "emergency">("room");

  // Compendium CMS form state
  const [compName, setCompName] = useState(property.name);
  const [compTagline, setCompTagline] = useState(property.tagline);
  const [compAddress, setCompAddress] = useState(property.address);
  const [compPhone, setCompPhone] = useState(property.phone);
  const [compWhatsapp, setCompWhatsapp] = useState(property.whatsapp);
  const [compWifiSsid, setCompWifiSsid] = useState(property.wifi.network);
  const [compWifiPass, setCompWifiPass] = useState(property.wifi.password);
  const [compWifiSpeed, setCompWifiSpeed] = useState(property.wifi.speed);
  const [compCheckIn, setCompCheckIn] = useState(property.checkIn);
  const [compCheckOut, setCompCheckOut] = useState(property.checkOut);
  const [compBreakfastHours, setCompBreakfastHours] = useState(property.breakfast.hours);
  const [compBreakfastLocation, setCompBreakfastLocation] = useState(property.breakfast.location);
  const [compBreakfastPrice, setCompBreakfastPrice] = useState(property.breakfast.price);

  useEffect(() => {
    setCompName(property.name);
    setCompTagline(property.tagline);
    setCompAddress(property.address);
    setCompPhone(property.phone);
    setCompWhatsapp(property.whatsapp);
    setCompWifiSsid(property.wifi.network);
    setCompWifiPass(property.wifi.password);
    setCompWifiSpeed(property.wifi.speed);
    setCompCheckIn(property.checkIn);
    setCompCheckOut(property.checkOut);
    setCompBreakfastHours(property.breakfast.hours);
    setCompBreakfastLocation(property.breakfast.location);
    setCompBreakfastPrice(property.breakfast.price);
  }, [property]);

  // Deal Modal state
  const [showDealModal, setShowDealModal] = useState(false);
  const [dealTitle, setDealTitle] = useState("");
  const [dealSubtitle, setDealSubtitle] = useState("");
  const [dealPrice, setDealPrice] = useState(45);
  const [dealOriginalPrice, setDealOriginalPrice] = useState(65);
  const [dealBadge, setDealBadge] = useState("Special Deal");
  const [dealCategory, setDealCategory] = useState<"stay" | "dining" | "transport" | "wellness">("stay");
  const [dealIcon, setDealIcon] = useState("Sparkles");

  // Menu Item Modal state
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [menuCategory, setMenuCategory] = useState<MenuItem["category"]>("Mains");
  const [menuPrice, setMenuPrice] = useState(24);
  const [menuDesc, setMenuDesc] = useState("");
  const [menuDietary, setMenuDietary] = useState("GF");

  const pendingCount = staffTickets.filter((t) => t.status === "pending").length;

  const filteredTickets = staffTickets.filter((t) => {
    if (ticketFilter === "all") return true;
    return t.status === ticketFilter;
  });

  const handleSaveCompendium = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: PropertyInfo = {
      ...property,
      name: compName,
      tagline: compTagline,
      address: compAddress,
      phone: compPhone,
      whatsapp: compWhatsapp,
      wifi: {
        network: compWifiSsid,
        password: compWifiPass,
        speed: compWifiSpeed,
      },
      checkIn: compCheckIn,
      checkOut: compCheckOut,
      breakfast: {
        ...property.breakfast,
        hours: compBreakfastHours,
        location: compBreakfastLocation,
        price: compBreakfastPrice,
      },
    };
    await updateProperty(updated);
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle.trim()) return;
    const newDeal: DealItem = {
      id: `deal_${nanoid(6)}`,
      propertyId: property.id,
      title: dealTitle,
      subtitle: dealSubtitle,
      price: Number(dealPrice),
      originalPrice: Number(dealOriginalPrice),
      discountBadge: dealBadge,
      badge: dealBadge,
      category: dealCategory,
      iconName: dealIcon,
      active: true,
      soldCount: 0,
      inventoryLimit: 20,
    };
    await addDeal(newDeal);
    setShowDealModal(false);
    setDealTitle("");
    setDealSubtitle("");
  };

  const handleCreateMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) return;
    const newItem: MenuItem = {
      id: `m_${nanoid(6)}`,
      propertyId: property.id,
      name: menuName,
      category: menuCategory,
      price: Number(menuPrice),
      description: menuDesc,
      dietary: menuDietary ? menuDietary.split(",").map((s) => s.trim()) : [],
      popular: true,
      available: true,
    };
    await addMenuItem(newItem);
    setShowMenuModal(false);
    setMenuName("");
    setMenuDesc("");
  };

  return (
    <div className="min-h-[calc(100vh-45px)] bg-[#f4f6f1] text-[#16211c] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#dde3db] bg-[#fffdf9] p-4 flex flex-col justify-between">
        <div className="space-y-5">
          {/* Property Selector Card */}
          <div className="p-3 rounded-2xl bg-white border border-[#dde3db] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="grid place-items-center w-9 h-9 rounded-xl bg-amber-400 text-stone-950 font-bold text-sm shadow">
                {property.name.charAt(0)}
              </div>
              <div className="overflow-hidden flex-1">
                <strong className="block text-xs font-bold text-[#16211c] truncate">
                  {property.name}
                </strong>
                <span className="text-[10px] text-[#c57a32] font-mono block truncate">
                  {property.city} · {property.roomsCount || 84} Rooms
                </span>
              </div>
            </div>

            {/* Switch Property if multiple */}
            {userProperties.length > 1 && (
              <select
                value={property.id}
                onChange={(e) => setPropertyId(e.target.value)}
                className="w-full py-1.5 px-2 rounded-lg bg-[#f4f7f2] border border-[#dde3db] text-[11px] font-semibold text-[#16211c] outline-none"
              >
                {userProperties.map((p) => (
                  <option key={p.id} value={p.id}>
                    Switch to: {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <span className="block px-3 text-[10px] font-mono tracking-wider uppercase text-stone-400 mb-2">
              Hotel Business Tools
            </span>

            {[
              { id: "overview", label: "Overview & Health", icon: LayoutDashboard },
              {
                id: "inbox",
                label: "Live Staff Inbox",
                icon: BellRing,
                badge: pendingCount > 0 ? `${pendingCount} new` : undefined,
              },
              { id: "deals", label: "Deals & Offers Studio", icon: Sparkles, badge: `${deals.length} active` },
              { id: "menu", label: "In-Room Dining CMS", icon: Utensils },
              { id: "knowledge", label: "Property Compendium", icon: BedDouble },
              { id: "qr-kit", label: "Dynamic QR Kit", icon: QrCode },
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
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-[10px] font-bold">
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
          {isSuperAdmin && (
            <button
              onClick={() => setLocation("/admin")}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold border border-purple-200 transition-all text-xs"
            >
              <ShieldCheck size={13} className="text-purple-700" />
              <span>Platform Super Admin</span>
            </button>
          )}

          <button
            onClick={() => setLocation(`/g/${property.id}`)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-[#eef3ed] text-[#c57a32] font-semibold border border-amber-400/30 transition-all text-xs"
          >
            <ExternalLink size={13} />
            <span>Open Guest Companion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Operational Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#dde3db]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold">
                Host Operating System · {property.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#dceee4] text-[#2f7a56] text-[10px] font-mono font-bold border border-emerald-500/30">
                Live & Synced
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#16211c] tracking-tight">
              {activeSection === "overview" && "Property Operations & Health"}
              {activeSection === "inbox" && "Live Guest Requests & Escalations"}
              {activeSection === "deals" && "Deals, Offers & Upsell Studio"}
              {activeSection === "menu" && "In-Room Dining Menu Manager"}
              {activeSection === "knowledge" && "Property Compendium & Wi-Fi CMS"}
              {activeSection === "qr-kit" && "Dynamic QR Deployment Studio"}
              {activeSection === "analytics" && "Guest Demand & Search Intelligence"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {activeSection === "deals" && (
              <button
                onClick={() => setShowDealModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
              >
                <Plus size={14} />
                <span>Create New Deal</span>
              </button>
            )}

            {activeSection === "menu" && (
              <button
                onClick={() => setShowMenuModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
              >
                <Plus size={14} />
                <span>Add New Dish</span>
              </button>
            )}

            <button
              onClick={() => setActiveSection("inbox")}
              className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all"
            >
              <BellRing size={14} />
              <span>Inbox ({pendingCount})</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: OVERVIEW */}
        {activeSection === "overview" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>Active Deals & Upsells</span>
                  <Sparkles size={16} className="text-amber-500" />
                </span>
                <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#16211c]">
                  {deals.filter((d) => d.active !== false).length}
                </strong>
                <span className="text-[11px] text-[#2d7a55] font-mono">Live on guest app</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>Dining Menu Items</span>
                  <Utensils size={16} className="text-blue-500" />
                </span>
                <strong className="block text-2xl sm:text-3xl font-bold font-mono text-[#16211c]">
                  {menuItems.length}
                </strong>
                <span className="text-[11px] text-stone-500 font-mono">Available for order</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>Pending Staff Tickets</span>
                  <BellRing size={16} className="text-red-500" />
                </span>
                <strong className="block text-2xl sm:text-3xl font-bold font-mono text-red-600">
                  {pendingCount}
                </strong>
                <span className="text-[11px] text-stone-500 font-mono">Requires attention</span>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#dde3db] space-y-1">
                <span className="text-xs text-stone-400 flex items-center justify-between">
                  <span>Wi-Fi Network</span>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </span>
                <strong className="block text-base sm:text-lg font-bold font-mono text-emerald-800 truncate">
                  {property.wifi.network}
                </strong>
                <span className="text-[11px] text-stone-500 font-mono">{property.wifi.speed}</span>
              </div>
            </div>

            {/* Quick Action Hub */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setActiveSection("deals")}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200/70 space-y-2 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Deals & Offers</span>
                  <Sparkles size={16} className="text-amber-600" />
                </div>
                <h3 className="font-bold text-base text-[#16211c]">Boost In-Stay Revenue</h3>
                <p className="text-xs text-[#5a6b62]">
                  Create late checkout deals, breakfast bundles, or spa treatments with custom prices.
                </p>
              </div>

              <div
                onClick={() => setActiveSection("knowledge")}
                className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-200/70 space-y-2 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Compendium CMS</span>
                  <BedDouble size={16} className="text-blue-600" />
                </div>
                <h3 className="font-bold text-base text-[#16211c]">Update Wi-Fi & House Info</h3>
                <p className="text-xs text-[#5a6b62]">
                  Change passwords, check-in rules, and emergency guidelines without reprinting signs.
                </p>
              </div>

              <div
                onClick={() => setActiveSection("menu")}
                className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/70 space-y-2 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Dining Menu</span>
                  <Utensils size={16} className="text-emerald-600" />
                </div>
                <h3 className="font-bold text-base text-[#16211c]">Manage In-Room Orders</h3>
                <p className="text-xs text-[#5a6b62]">
                  Update dish prices, 86 out-of-stock items, and add specialty chef specials.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: LIVE STAFF INBOX */}
        {activeSection === "inbox" && (
          <div className="space-y-4 animate-in fade-in">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {(["all", "pending", "in_progress", "resolved"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTicketFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    ticketFilter === filter
                      ? "bg-amber-400 text-stone-950 shadow-sm"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-[#dde3db]"
                  }`}
                >
                  {filter.replace("_", " ")}
                </button>
              ))}
            </div>

            {/* Tickets List */}
            <div className="space-y-3">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#dde3db] text-xs text-stone-400">
                  No tickets found in this view.
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-2xl bg-white border border-[#dde3db] space-y-3 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-[#16211c]">
                            Room {ticket.roomNumber}
                          </strong>
                          <span className="text-xs text-stone-500">· {ticket.guestName}</span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[10px] font-bold uppercase">
                            {ticket.category.replace("_", " ")}
                          </span>
                          {ticket.urgency === "urgent" && (
                            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-800 font-mono text-[10px] font-bold">
                              Urgent
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#3a4a42] pt-1">{ticket.details}</p>
                        <span className="text-[10px] font-mono text-stone-400">
                          Received {ticket.createdAt}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                          ticket.status === "resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : ticket.status === "in_progress"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ticket.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                      {ticket.status !== "in_progress" && ticket.status !== "resolved" && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, "in_progress")}
                          className="px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs transition-all"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {ticket.status !== "resolved" && (
                        <button
                          onClick={() => updateTicketStatus(ticket.id, "resolved")}
                          className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-all"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* SECTION 3: DEALS & OFFERS STUDIO */}
        {activeSection === "deals" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div>
                <strong className="block text-xs font-bold text-amber-950">
                  Guest Revenue & Upsell Engine
                </strong>
                <p className="text-[11px] text-amber-800">
                  Deals created here appear immediately on your guests’ phones in the AirPal companion.
                </p>
              </div>
              <button
                onClick={() => setShowDealModal(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
              >
                + New Deal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className={`p-4 rounded-2xl bg-white border transition-all space-y-3 flex flex-col justify-between ${
                    deal.active !== false ? "border-[#dde3db] shadow-sm" : "border-stone-200 opacity-60 bg-stone-50"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                        {deal.discountBadge || deal.badge || "Special Deal"}
                      </span>
                      <span className="text-xs font-mono font-bold text-stone-400 capitalize">
                        {deal.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-[#16211c]">{deal.title}</h4>
                      <p className="text-xs text-[#5a6b62] line-clamp-2 pt-1">{deal.subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-stone-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold font-mono text-[#16211c]">${deal.price}</span>
                      {deal.originalPrice && (
                        <span className="text-xs font-mono text-stone-400 line-through">
                          ${deal.originalPrice}
                        </span>
                      )}
                      <span className="text-[11px] text-stone-500">AUD</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <button
                        onClick={() => updateDeal({ ...deal, active: !deal.active })}
                        className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                      >
                        {deal.active !== false ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
                          </span>
                        ) : (
                          <span className="text-stone-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-stone-400" /> Paused
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => removeDeal(deal.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors"
                        title="Delete Deal"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: IN-ROOM DINING CMS */}
        {activeSection === "menu" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <strong className="block text-xs font-bold text-emerald-950">
                  Digital Dining & Room Service Menu
                </strong>
                <p className="text-[11px] text-emerald-800">
                  Manage categories, dish descriptions, dietary tags, and prices in real-time.
                </p>
              </div>
              <button
                onClick={() => setShowMenuModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-stone-950 shadow"
              >
                + Add Dish
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-[#dde3db] flex items-start justify-between gap-3 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="font-bold text-sm text-[#16211c]">{item.name}</strong>
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono text-[10px] font-bold">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#5a6b62] line-clamp-2">{item.description}</p>
                    {item.dietary && item.dietary.length > 0 && (
                      <div className="flex gap-1 pt-1">
                        {item.dietary.map((d, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 font-mono text-[9px] font-semibold"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right space-y-2 shrink-0">
                    <span className="block text-base font-mono font-bold text-[#16211c]">
                      ${item.price}
                    </span>
                    <button
                      onClick={() => removeMenuItem(item.id)}
                      className="text-stone-400 hover:text-red-600 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: PROPERTY COMPENDIUM & WI-FI CMS */}
        {activeSection === "knowledge" && (
          <form onSubmit={handleSaveCompendium} className="space-y-6 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
              <div>
                <strong className="block text-xs font-bold text-blue-950">
                  Property Compendium & Live Knowledge Base
                </strong>
                <p className="text-[11px] text-blue-800">
                  Updates here immediately sync to your guests’ phones and the "Ask AirPal" AI companion.
                </p>
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
              >
                <Save size={14} />
                <span>Save Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Wi-Fi Settings */}
              <div className="p-5 rounded-2xl bg-white border border-[#dde3db] space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 font-mono">
                  Wi-Fi Credentials
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={compWifiSsid}
                    onChange={(e) => setCompWifiSsid(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Password</label>
                  <input
                    type="text"
                    value={compWifiPass}
                    onChange={(e) => setCompWifiPass(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Advertised Speed</label>
                  <input
                    type="text"
                    value={compWifiSpeed}
                    onChange={(e) => setCompWifiSpeed(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                  />
                </div>
              </div>

              {/* Check-In / Check-Out */}
              <div className="p-5 rounded-2xl bg-white border border-[#dde3db] space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 font-mono">
                  Stay Policies
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#3a4a42]">Check-In Time</label>
                    <input
                      type="text"
                      value={compCheckIn}
                      onChange={(e) => setCompCheckIn(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[#3a4a42]">Check-Out Time</label>
                    <input
                      type="text"
                      value={compCheckOut}
                      onChange={(e) => setCompCheckOut(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Front Desk Phone</label>
                  <input
                    type="text"
                    value={compPhone}
                    onChange={(e) => setCompPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none font-mono"
                  />
                </div>
              </div>

              {/* Breakfast Settings */}
              <div className="p-5 rounded-2xl bg-white border border-[#dde3db] space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 font-mono">
                  Breakfast Compendium
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Operating Hours</label>
                  <input
                    type="text"
                    value={compBreakfastHours}
                    onChange={(e) => setCompBreakfastHours(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Dining Location</label>
                  <input
                    type="text"
                    value={compBreakfastLocation}
                    onChange={(e) => setCompBreakfastLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Standard Pricing</label>
                  <input
                    type="text"
                    value={compBreakfastPrice}
                    onChange={(e) => setCompBreakfastPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="p-5 rounded-2xl bg-white border border-[#dde3db] space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 font-mono">
                  Property Identity
                </h3>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Display Name</label>
                  <input
                    type="text"
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Tagline</label>
                  <input
                    type="text"
                    value={compTagline}
                    onChange={(e) => setCompTagline(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3a4a42]">Street Address</label>
                  <input
                    type="text"
                    value={compAddress}
                    onChange={(e) => setCompAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-xs text-stone-950 shadow"
              >
                <Save size={14} />
                <span>Save & Publish Changes</span>
              </button>
            </div>
          </form>
        )}

        {/* SECTION 6: DYNAMIC QR DEPLOYMENT STUDIO */}
        {activeSection === "qr-kit" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-transparent border border-[#dde3db] space-y-2">
              <h3 className="font-bold text-lg text-[#16211c]">Dynamic QR Deployment Studio</h3>
              <p className="text-xs text-[#5a6b62] max-w-2xl leading-relaxed">
                The printed QR code points to your live digital environment. Whenever you update Wi-Fi, menus, or deals in this dashboard, the guest’s companion reflects it immediately without reprinting.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* QR Customizer */}
              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <h4 className="font-bold text-sm text-[#16211c]">Generate Code</h4>

                <div>
                  <label className="block text-xs font-semibold text-[#5a6b62] mb-1.5">QR Target Type</label>
                  <select
                    value={qrTypeSelection}
                    onChange={(e) => setQrTypeSelection(e.target.value as any)}
                    className="w-full rounded-xl bg-[#f1f5f0] border border-[#dde3db] p-2.5 text-xs text-[#16211c] outline-none"
                  >
                    <option value="room">In-Room Desk Stand (Specific Room)</option>
                    <option value="lobby">Lobby Reception Stand (Property Wide)</option>
                    <option value="restaurant">Dining Table QR (In-Room Dining)</option>
                    <option value="emergency">Emergency Signage</option>
                  </select>
                </div>

                {qrTypeSelection === "room" && (
                  <div>
                    <label className="block text-xs font-semibold text-[#5a6b62] mb-1.5">Room Number</label>
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
                  <span className="block font-mono text-[10px] text-amber-600 uppercase">Target URL</span>
                  <span className="font-mono text-xs text-[#16211c] break-all">
                    https://airpal.me/g/{property.id}?type={qrTypeSelection}&room={qrRoomInput}
                  </span>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      toast.success("Print Template Ready", {
                        description: `High-res PDF generated for Room ${qrRoomInput}.`,
                      });
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-all shadow"
                  >
                    <Download size={14} />
                    <span>Download PDF Kit</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2.5 rounded-xl bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#3a4a42] border border-[#dde3db] transition-all"
                  >
                    <Printer size={15} />
                  </button>
                </div>
              </div>

              {/* Physical Stand Mockup Preview */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-[#1d3025] to-[#24382d] border border-[#dde3db] flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                  Physical Stand Mockup · Premium Oak Finish
                </span>

                <div className="w-64 p-6 rounded-2xl bg-[#fdfbf7] text-stone-950 shadow-2xl border border-stone-200 flex flex-col items-center space-y-3">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <img src="/logo-mark.png" alt="" className="w-5 h-5 object-contain rounded-md" />
                    <span>AirPal<span className="text-[#0050d8]">.me</span></span>
                  </div>

                  <div className="w-36 h-36 border-4 border-stone-950 rounded-2xl p-2.5 flex items-center justify-center bg-white shadow-inner">
                    <QrCode size={110} strokeWidth={1.5} className="text-stone-950" />
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[11px] font-mono uppercase font-bold tracking-wider text-amber-800">
                      {qrTypeSelection === "room" ? `Room ${qrRoomInput}` : property.name}
                    </span>
                    <strong className="block text-sm font-bold tracking-tight">
                      One Scan. Your Entire Stay.
                    </strong>
                    <span className="block text-[10px] text-stone-600 leading-snug">
                      Wi-Fi · In-Room Dining · Deals · Ask AirPal
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

        {/* SECTION 7: GUEST DEMAND & SEARCH INTELLIGENCE */}
        {activeSection === "analytics" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <h3 className="font-bold text-base text-[#16211c]">Top Guest Inquiries & Searches</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { query: "Where can I get good Indian food nearby?", count: 142, category: "Dining" },
                    { query: "Can I get late checkout until 4 PM?", count: 118, category: "Upsell" },
                    { query: "What time does breakfast finish?", count: 94, category: "Compendium" },
                    { query: "How do I get to the Opera House?", count: 87, category: "Local" },
                    { query: "Extra towels and feather pillows", count: 64, category: "Housekeeping" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#f8faf7]">
                      <div>
                        <span className="text-[#16211c] font-medium">{row.query}</span>
                        <span className="block text-[10px] text-stone-400 font-mono">{row.category}</span>
                      </div>
                      <span className="font-bold text-amber-700 font-mono">{row.count} queries</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#dde3db] space-y-4">
                <h3 className="font-bold text-base text-[#16211c]">Peak Guest Scan Hours</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { time: "2:00 PM – 4:00 PM (Check-in Rush)", activity: "Wi-Fi, Room service, Air Conditioning" },
                    { time: "6:00 PM – 7:30 PM (Dinner & Sunset)", activity: "Dining menu, Rooftop bars, Sunset cruise deal" },
                    { time: "8:00 AM – 9:30 AM (Breakfast Rush)", activity: "Breakfast times, Luggage storage, Late checkout" },
                  ].map((row, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#f8faf7] space-y-1">
                      <strong className="block text-[#c57a32]">{row.time}</strong>
                      <span className="text-[11px] text-[#5a6b62]">{row.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 1: CREATE DEAL */}
        {showDealModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#dde3db] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#dde3db]">
                <h3 className="font-bold text-sm text-[#16211c]">Publish New Deal or Upsell</h3>
                <button onClick={() => setShowDealModal(false)} className="text-stone-400 hover:text-stone-700 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateDeal} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Deal Title</label>
                  <input
                    type="text"
                    required
                    value={dealTitle}
                    onChange={(e) => setDealTitle(e.target.value)}
                    placeholder="e.g. VIP Guaranteed 4 PM Late Check-out"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Subtitle / Offer Description</label>
                  <input
                    type="text"
                    value={dealSubtitle}
                    onChange={(e) => setDealSubtitle(e.target.value)}
                    placeholder="Keep your room and shower before your evening flight."
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Special Price ($ AUD)</label>
                    <input
                      type="number"
                      required
                      value={dealPrice}
                      onChange={(e) => setDealPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Normal / Original Price ($)</label>
                    <input
                      type="number"
                      value={dealOriginalPrice}
                      onChange={(e) => setDealOriginalPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Promo Badge</label>
                    <input
                      type="text"
                      value={dealBadge}
                      onChange={(e) => setDealBadge(e.target.value)}
                      placeholder="Save $20, Best Seller, 30% Off"
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Category</label>
                    <select
                      value={dealCategory}
                      onChange={(e) => setDealCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    >
                      <option value="stay">Stay / Room Upgrade</option>
                      <option value="dining">Dining & Breakfast</option>
                      <option value="transport">Transport & Chauffeur</option>
                      <option value="wellness">Spa & Wellness</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDealModal(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-stone-950 shadow"
                  >
                    Publish Deal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: ADD DISH */}
        {showMenuModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-[#dde3db] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#dde3db]">
                <h3 className="font-bold text-sm text-[#16211c]">Add In-Room Dining Dish</h3>
                <button onClick={() => setShowMenuModal(false)} className="text-stone-400 hover:text-stone-700 font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateMenuItem} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={menuName}
                    onChange={(e) => setMenuName(e.target.value)}
                    placeholder="e.g. Truffle Mushroom Gnocchi"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Category</label>
                    <select
                      value={menuCategory}
                      onChange={(e) => setMenuCategory(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Mains">Mains</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Late Night">Late Night</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700">Price ($ AUD)</label>
                    <input
                      type="number"
                      required
                      value={menuPrice}
                      onChange={(e) => setMenuPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Description</label>
                  <textarea
                    rows={2}
                    value={menuDesc}
                    onChange={(e) => setMenuDesc(e.target.value)}
                    placeholder="Pan-seared potato gnocchi with forest mushrooms and aged parmesan..."
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-stone-700">Dietary Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={menuDietary}
                    onChange={(e) => setMenuDietary(e.target.value)}
                    placeholder="GF, Vegan, Halal, V"
                    className="w-full p-2.5 rounded-xl bg-[#f8faf7] border border-[#dde3db] outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMenuModal(false)}
                    className="px-4 py-2 rounded-xl bg-stone-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 font-bold text-stone-950 shadow"
                  >
                    Save to Menu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
