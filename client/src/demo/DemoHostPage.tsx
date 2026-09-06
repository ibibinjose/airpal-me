import React, { useState } from "react";
import { useLocation } from "wouter";
import {
  LayoutDashboard,
  QrCode,
  BellRing,
  Utensils,
  Tag,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit3,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Sparkles,
  TrendingUp,
  DollarSign,
  Coffee,
  Check,
  RotateCcw,
  Hotel,
} from "lucide-react";
import { DealItem, MenuItem, PropertyInfo, StaffTicket } from "@shared/airpal-data";
import {
  getSandboxProperties,
  getSandboxDeals,
  saveSandboxDeal,
  deleteSandboxDeal,
  toggleSandboxDealActive,
  getSandboxMenu,
  saveSandboxMenuItem,
  deleteSandboxMenuItem,
  getSandboxTickets,
  updateSandboxTicketStatus,
  addSandboxTicket,
  getSandboxActivePropertyId,
  setSandboxActivePropertyId,
} from "./demo-sandbox";
import { DemoBanner } from "./DemoBanner";
import { RealtimeTopBar } from "../components/RealtimeTopBar";
import { makeQrDataUrl, stayQrPayload } from "../lib/qr";
import { toast } from "sonner";
import { nanoid } from "nanoid";

export const DemoHostPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"deals" | "menu" | "tickets" | "qr" | "compendium">("deals");

  const properties = getSandboxProperties();
  const [activePropertyId, setActivePropId] = useState<string>(getSandboxActivePropertyId());

  const currentProperty = properties.find((p) => p.id === activePropertyId) || properties[0];

  // Deals state
  const [deals, setDeals] = useState<DealItem[]>(() => getSandboxDeals(currentProperty.id));
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealItem | null>(null);
  const [dealTitle, setDealTitle] = useState("");
  const [dealDesc, setDealDesc] = useState("");
  const [dealPrice, setDealPrice] = useState<number>(50);
  const [dealOrigPrice, setDealOrigPrice] = useState<number>(75);
  const [dealBadge, setDealBadge] = useState("Save 30%");

  // Menu state
  const [menu, setMenu] = useState<MenuItem[]>(() => getSandboxMenu(currentProperty.id));
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [menuDesc, setMenuDesc] = useState("");
  const [menuPrice, setMenuPrice] = useState<number>(24);
  const [menuCategory, setMenuCategory] = useState<"Starters" | "Mains" | "Desserts" | "Drinks" | "Breakfast" | "Late Night">("Mains");

  // Tickets state
  const [tickets, setTickets] = useState<StaffTicket[]>(() => getSandboxTickets(currentProperty.id));

  // QR state
  const [roomNum, setRoomNum] = useState("508");
  const [qrUrl, setQrUrl] = useState("");
  React.useEffect(() => {
    makeQrDataUrl(stayQrPayload(currentProperty.id, roomNum)).then(setQrUrl);
  }, [currentProperty.id, roomNum]);

  const handlePropertyChange = (newId: string) => {
    setActivePropId(newId);
    setSandboxActivePropertyId(newId);
    setDeals(getSandboxDeals(newId));
    setMenu(getSandboxMenu(newId));
    setTickets(getSandboxTickets(newId));
  };

  // Deal handlers
  const handleSaveDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle.trim()) return;

    const deal: DealItem = {
      id: editingDeal ? editingDeal.id : `deal-demo-${nanoid(5)}`,
      propertyId: currentProperty.id,
      title: dealTitle.trim(),
      subtitle: dealDesc.trim(),
      price: Number(dealPrice) || 0,
      originalPrice: Number(dealOrigPrice) || 0,
      badge: dealBadge.trim() || "Special",
      discountBadge: dealBadge.trim() || "Special",
      iconName: "Sparkles",
      category: "stay",
      active: true,
    };

    saveSandboxDeal(deal);
    setDeals(getSandboxDeals(currentProperty.id));
    setDealModalOpen(false);
    setEditingDeal(null);
    setDealTitle("");
    setDealDesc("");
    toast.success("Deal Saved to Demo Sandbox");
  };

  const handleToggleDeal = (dealId: string) => {
    toggleSandboxDealActive(dealId);
    setDeals(getSandboxDeals(currentProperty.id));
  };

  const handleDeleteDeal = (dealId: string) => {
    deleteSandboxDeal(dealId);
    setDeals(getSandboxDeals(currentProperty.id));
    toast.info("Deal Deleted from Demo Sandbox");
  };

  // Menu handlers
  const handleSaveMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) return;

    const item: MenuItem = {
      id: `menu-demo-${nanoid(5)}`,
      propertyId: currentProperty.id,
      name: menuName.trim(),
      description: menuDesc.trim(),
      price: Number(menuPrice) || 0,
      category: menuCategory,
      dietary: ["Chef Special"],
      available: true,
    };

    saveSandboxMenuItem(item);
    setMenu(getSandboxMenu(currentProperty.id));
    setMenuModalOpen(false);
    setMenuName("");
    setMenuDesc("");
    toast.success("Dish Added to In-Room Dining Menu");
  };

  const handleDeleteMenu = (itemId: string) => {
    deleteSandboxMenuItem(itemId);
    setMenu(getSandboxMenu(currentProperty.id));
    toast.info("Dish removed from sandbox menu");
  };

  // Ticket status handler
  const handleTicketStatus = (ticketId: string, status: "pending" | "in_progress" | "resolved") => {
    updateSandboxTicketStatus(ticketId, status);
    setTickets(getSandboxTickets(currentProperty.id));
    toast.success(`Ticket status updated: ${status.replace("_", " ")}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f8f4] text-[#16211c] flex flex-col font-sans">
      <RealtimeTopBar className="sticky top-0 z-40 border-b border-[#dde3db]" />
      <DemoBanner currentRoute="/demo/host" />

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        
        {/* Top Property Switcher & Kicker */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold">
              <Hotel size={14} className="text-amber-700" />
              <span>Host & Business Admin · Demo Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-[#16211c]">
              {currentProperty.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              {currentProperty.destination} · {currentProperty.roomsCount} Rooms · Sandboxed Operation
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={currentProperty.id}
              onChange={(e) => handlePropertyChange(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium text-stone-800 shadow-2xs focus:outline-none"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  🏨 {p.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setLocation("/demo/stay")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#18271f] hover:bg-[#23382c] text-white text-xs font-medium shadow-xs transition-colors"
            >
              <span>Test Room Companion</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200 text-xs">
          <button
            onClick={() => setActiveTab("deals")}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-semibold transition-colors ${
              activeTab === "deals"
                ? "bg-white text-amber-700 border-t-2 border-amber-600 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Tag size={14} />
            <span>Deals & Upsells Studio ({deals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("menu")}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-semibold transition-colors ${
              activeTab === "menu"
                ? "bg-white text-amber-700 border-t-2 border-amber-600 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Utensils size={14} />
            <span>In-Room Dining Menu ({menu.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("tickets")}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-semibold transition-colors ${
              activeTab === "tickets"
                ? "bg-white text-amber-700 border-t-2 border-amber-600 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <BellRing size={14} />
            <span>Staff Requests Queue ({tickets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("qr")}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-t-xl font-semibold transition-colors ${
              activeTab === "qr"
                ? "bg-white text-amber-700 border-t-2 border-amber-600 shadow-xs"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <QrCode size={14} />
            <span>In-Room QR Stand</span>
          </button>
        </div>

        {/* Tab 1: Deals & Offers Studio */}
        {activeTab === "deals" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900">Active Deals & Flash Packages</h2>
                <p className="text-xs text-stone-500">Live guest room upsells displayed on in-house mobile companion.</p>
              </div>

              <button
                onClick={() => {
                  setEditingDeal(null);
                  setDealTitle("");
                  setDealDesc("");
                  setDealPrice(60);
                  setDealOrigPrice(90);
                  setDealBadge("Save 30%");
                  setDealModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
              >
                <Plus size={14} />
                <span>Add Deal / Upsell</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="p-5 rounded-3xl bg-white border border-[#dde3db] shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-200">
                        {deal.discountBadge || "Special Offer"}
                      </span>
                      <button
                        onClick={() => handleToggleDeal(deal.id)}
                        className="text-stone-400 hover:text-stone-700"
                        title="Toggle active status"
                      >
                        {deal.active ? (
                          <ToggleRight size={22} className="text-emerald-600" />
                        ) : (
                          <ToggleLeft size={22} className="text-stone-400" />
                        )}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-stone-900">{deal.title}</h3>
                    <p className="text-xs text-stone-600 line-clamp-2">{deal.subtitle}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-stone-900 font-display">${deal.price}</span>
                      {deal.originalPrice ? (
                        <span className="text-xs line-through text-stone-400">${deal.originalPrice}</span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteDeal(deal.id)}
                        className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete deal"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: In-Room Dining Menu */}
        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900">In-Room Dining Menu CMS</h2>
                <p className="text-xs text-stone-500">Dishes, prices, and dietary callouts served to rooms.</p>
              </div>

              <button
                onClick={() => setMenuModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs"
              >
                <Plus size={14} />
                <span>Add Menu Item</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#dde3db] shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8faf7] text-stone-500 font-mono border-b border-[#dde3db]">
                  <tr>
                    <th className="px-5 py-3">Dish / Beverage</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Dietary</th>
                    <th className="px-5 py-3">Price</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dde3db]">
                  {menu.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f8faf7]/80">
                      <td className="px-5 py-4">
                        <strong className="text-stone-900 block font-semibold">{item.name}</strong>
                        <span className="text-[11px] text-stone-500">{item.description}</span>
                      </td>
                      <td className="px-5 py-4 font-mono text-stone-600">{item.category}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.dietary?.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] text-stone-600">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-bold text-stone-900 font-display">${item.price}</td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDeleteMenu(item.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Staff Request Queue */}
        {activeTab === "tickets" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-stone-900">Front Desk & Concierge Request Dispatch</h2>
              <p className="text-xs text-stone-500">Live guest room requests submitted via the in-room companion.</p>
            </div>

            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-white border border-[#dde3db] shadow-xs flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-800 grid place-items-center font-bold text-xs font-mono">
                      {t.roomNumber}
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 text-xs capitalize">
                        {t.category.replace("_", " ")} Request
                      </h4>
                      <p className="text-[11px] text-stone-500">{t.details}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                      t.status === "resolved"
                        ? "bg-emerald-100 text-emerald-800"
                        : t.status === "in_progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {t.status.replace("_", " ")}
                    </span>

                    {t.status !== "resolved" && (
                      <button
                        onClick={() => handleTicketStatus(t.id, "resolved")}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-medium"
                      >
                        Mark Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: In-Room QR Stand */}
        {activeTab === "qr" && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dde3db] shadow-xs max-w-xl mx-auto space-y-6 text-center">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-stone-900">Room Desk QR Simulator</h2>
              <p className="text-xs text-stone-500">
                Guests scan this printed QR stand to unlock Wi-Fi, dining, and deals without installing any app.
              </p>
            </div>

            <div className="inline-block p-4 rounded-3xl bg-stone-50 border border-stone-200 shadow-inner">
              {qrUrl ? <img src={qrUrl} alt="Room QR" className="w-48 h-48 mx-auto rounded-xl" /> : null}
              <span className="font-mono text-xs font-bold text-stone-700 mt-2 block">Room {roomNum}</span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <input
                type="text"
                value={roomNum}
                onChange={(e) => setRoomNum(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl border border-stone-200 text-center font-mono text-xs font-bold"
                placeholder="508"
              />
              <button
                onClick={() => setLocation("/demo/stay")}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs"
              >
                Simulate Room Scan
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Add Deal Modal */}
      {dealModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <h3 className="text-base font-bold text-stone-900">Add Deal / Experience Upsell</h3>
            <form onSubmit={handleSaveDeal} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700">Deal Title</label>
                <input
                  type="text"
                  required
                  value={dealTitle}
                  onChange={(e) => setDealTitle(e.target.value)}
                  placeholder="e.g. Sunset Harbour Cruise Pass"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={dealDesc}
                  onChange={(e) => setDealDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700">Discounted Price ($)</label>
                  <input
                    type="number"
                    value={dealPrice}
                    onChange={(e) => setDealPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700">Original Price ($)</label>
                  <input
                    type="number"
                    value={dealOrigPrice}
                    onChange={(e) => setDealOrigPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700">Badge</label>
                <input
                  type="text"
                  value={dealBadge}
                  onChange={(e) => setDealBadge(e.target.value)}
                  placeholder="Save 25%"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDealModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  Save to Demo Sandbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Menu Modal */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <h3 className="text-base font-bold text-stone-900">Add Dish to Dining Menu</h3>
            <form onSubmit={handleSaveMenu} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700">Dish Name</label>
                <input
                  type="text"
                  required
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="e.g. Truffle Wagyu Burger"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={menuDesc}
                  onChange={(e) => setMenuDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700">Price ($)</label>
                  <input
                    type="number"
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700">Category</label>
                  <select
                    value={menuCategory}
                    onChange={(e) => setMenuCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none"
                  >
                    <option value="Mains">Mains</option>
                    <option value="Starters">Starters</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Late Night">Late Night</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="px-3 py-2 rounded-xl border border-stone-200 text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold"
                >
                  Add Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
