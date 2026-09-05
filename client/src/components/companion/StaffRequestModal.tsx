import React, { useState } from "react";
import { useAirPal } from "../../contexts/AirPalContext";
import {
  BellRing,
  Wrench,
  Sparkles,
  Clock,
  Shirt,
  PhoneCall,
  X,
  CheckCircle,
  AlertCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffRequestModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { roomNumber, guestName, addStaffTicket, staffTickets, seniorMode } = useAirPal();
  const [category, setCategory] = useState<"housekeeping" | "maintenance" | "reception" | "late_checkout">("housekeeping");
  const [details, setDetails] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    addStaffTicket(category, details.trim(), isUrgent ? "urgent" : "normal");
    setDetails("");
    onClose();
  };

  const myRoomTickets = staffTickets.filter((t) => t.roomNumber === roomNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#15241c]/50 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col w-full max-w-lg max-h-[92vh] rounded-3xl bg-[#121c16] border border-amber-400/20 text-[#16211c] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dde3db] bg-[#16241b]">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-bold shadow-md shadow-amber-400/20">
              <BellRing size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
                Staff Escalation Layer
              </span>
              <h3 className="text-lg font-bold text-[#16211c]">Contact Hotel Team</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close request modal"
            className="grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#5a6b62]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Active room indicator */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#dde3db] text-xs">
            <div>
              <span className="block text-stone-400 text-[11px]">Requesting for:</span>
              <strong className="text-[#16211c] font-semibold">Room {roomNumber} · {guestName}</strong>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#dceee4] text-[#2f7a56] text-[11px] font-mono border border-emerald-500/30">
              Direct to Front Desk
            </span>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-[#5a6b62] mb-2">
              Request Category
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: "housekeeping", label: "Housekeeping", desc: "Towels, pillows, toiletries", icon: Shirt },
                { id: "maintenance", label: "Maintenance", desc: "A/C, plumbing, lighting", icon: Wrench },
                { id: "reception", label: "Front Desk Concierge", desc: "Luggage, printing, keys", icon: Sparkles },
                { id: "late_checkout", label: "Late Check-out", desc: "Departure time request", icon: Clock },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id as any)}
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                      category === c.id
                        ? "bg-amber-400 text-stone-950 font-semibold border-amber-400 shadow-sm"
                        : "bg-white border-[#dde3db] text-[#5a6b62] hover:bg-[#eef3ed]"
                    }`}
                  >
                    <Icon size={16} className={`mt-0.5 flex-shrink-0 ${category === c.id ? "text-stone-950" : "text-amber-400"}`} />
                    <div>
                      <strong className="block leading-tight">{c.label}</strong>
                      <span className={`text-[10px] block mt-0.5 ${category === c.id ? "text-stone-800" : "text-stone-400"}`}>
                        {c.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#5a6b62] mb-1.5">
                What can our team do for you?
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                required
                placeholder="e.g. Please bring two extra hypoallergenic pillows and fresh bath towels..."
                className="w-full rounded-2xl bg-[#f1f5f0] border border-[#dde3db] p-3.5 text-sm text-[#16211c] placeholder-[#8a958c] outline-none focus:border-amber-400/60"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-[#5a6b62] cursor-pointer">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="rounded border-stone-600 accent-amber-400"
              />
              <span>Urgent request (requires immediate attention)</span>
            </label>

            <button
              type="submit"
              disabled={!details.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-bold text-sm transition-all shadow-md shadow-amber-400/20 active:scale-98"
            >
              <Send size={15} />
              <span>Submit Request to Staff</span>
            </button>
          </form>

          {/* Recent tickets in this room */}
          {myRoomTickets.length > 0 && (
            <div className="pt-3 border-t border-[#dde3db]">
              <span className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-2">
                Recent Requests for Room {roomNumber}
              </span>
              <div className="space-y-2">
                {myRoomTickets.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#dde3db] text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="block font-medium text-[#16211c] capitalize">
                        {t.category.replace("_", " ")}
                      </span>
                      <p className="text-[11px] text-[#5a6b62] truncate max-w-[220px]">
                        {t.details}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                        t.status === "resolved"
                          ? "bg-[#dceee4] text-[#2f7a56] border border-emerald-500/30"
                          : t.status === "in_progress"
                          ? "bg-[#f8e4c8] text-[#c57a32] border border-amber-500/30"
                          : "bg-[#e3f0fa] text-[#1d6aa5] border border-blue-500/30"
                      }`}
                    >
                      {t.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
