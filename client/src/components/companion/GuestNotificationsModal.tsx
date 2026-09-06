import React from "react";
import { useAirPal, GuestNotification } from "../../contexts/AirPalContext";
import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  Utensils,
  Wifi,
  Sparkles,
  X,
  Trash2,
  ChevronRight,
  ShieldCheck,
  BedDouble,
  PhoneCall,
} from "lucide-react";
import { CompanionSheet } from "./CompanionSheet";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenDining?: () => void;
  onOpenStaff?: () => void;
  onOpenWifi?: () => void;
}

export const GuestNotificationsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenDining,
  onOpenStaff,
  onOpenWifi,
}) => {
  const {
    roomNumber,
    property,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    clearAllNotifications,
    staffTickets,
  } = useAirPal();

  if (!isOpen) return null;

  const getIcon = (type: GuestNotification["type"]) => {
    switch (type) {
      case "order":
        return <Utensils size={16} className="text-amber-600" />;
      case "service":
        return <BellRing size={16} className="text-purple-600" />;
      case "wifi":
        return <Wifi size={16} className="text-blue-600" />;
      default:
        return <Sparkles size={16} className="text-emerald-600" />;
    }
  };

  const activeTickets = staffTickets.filter(
    (t) => t.status === "pending" || t.status === "in_progress"
  );

  return (
    <CompanionSheet isOpen={isOpen}>
      <div className="relative flex flex-col h-full min-h-0 bg-[#fffdf9] text-[#16211c] overflow-hidden font-sans">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#dde3db] bg-[#f7f5ef]">
          <div className="flex items-center gap-3">
            <div className="relative grid place-items-center w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 font-bold shadow-sm">
              <Bell size={19} />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold font-mono grid place-items-center border border-white animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#16211c]">Room Activity</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/40">
                  Room {roomNumber}
                </span>
              </div>
              <span className="text-[11px] text-stone-400">
                Live updates from Front Desk & Kitchen
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-[11px] text-stone-400 hover:text-stone-700 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
                title="Clear notifications"
              >
                <Trash2 size={12} />
                <span>Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#5a6b62]"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Active Live Requests Progress Tracker */}
          {activeTickets.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold flex items-center gap-1.5">
                <Clock size={12} className="text-amber-600 animate-spin" />
                Active Staff Requests ({activeTickets.length})
              </span>

              <div className="space-y-2.5">
                {activeTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="p-3.5 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-stone-100 font-mono text-[10px] uppercase font-bold text-stone-700">
                          {ticket.category.replace("_", " ")}
                        </span>
                        <span className="font-mono text-[10px] text-stone-400">
                          {ticket.id}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold uppercase ${
                          ticket.status === "in_progress"
                            ? "bg-blue-100 text-blue-900 border border-blue-300"
                            : "bg-amber-100 text-amber-900 border border-amber-300"
                        }`}
                      >
                        {ticket.status === "in_progress" ? "Dispatched / Staff En Route" : "Logged with Front Desk"}
                      </span>
                    </div>

                    <p className="text-xs text-stone-700 leading-snug font-medium">
                      {ticket.details}
                    </p>

                    {/* Progress Bar */}
                    <div className="pt-1">
                      <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ticket.status === "in_progress"
                              ? "w-2/3 bg-blue-500 animate-pulse"
                              : "w-1/3 bg-amber-400"
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-stone-400 font-mono pt-1">
                        <span>Received</span>
                        <span className={ticket.status === "in_progress" ? "text-blue-700 font-bold" : ""}>
                          In Progress
                        </span>
                        <span>Resolved</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Feed */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold">
              Notifications & Activity Feed
            </span>

            {notifications.length === 0 ? (
              <div className="p-8 text-center text-stone-400 space-y-2 bg-white rounded-2xl border border-[#dde3db]">
                <Bell size={24} className="mx-auto text-stone-300" />
                <p className="text-xs">No notifications yet.</p>
                <span className="text-[10px] text-stone-400">
                  Room orders, staff dispatch notes, and Wi-Fi alerts will appear here.
                </span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      n.read
                        ? "bg-white border-[#dde3db] text-stone-600"
                        : "bg-[#fffef7] border-amber-300/80 shadow-xs text-stone-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200/60 grid place-items-center shrink-0 mt-0.5">
                        {getIcon(n.type)}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <strong className="block text-xs font-bold truncate">
                            {n.title}
                          </strong>
                          <span className="text-[9px] font-mono text-stone-400 shrink-0">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {n.message}
                        </p>
                      </div>

                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Useful Quick Shortcuts */}
          <div className="pt-2 border-t border-[#dde3db] space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-bold">
              Guest Services
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenDining?.();
                }}
                className="p-3 rounded-xl bg-white border border-[#dde3db] hover:border-amber-400 text-left flex items-center justify-between transition-colors group"
              >
                <div>
                  <strong className="block text-xs text-[#16211c]">In-Room Dining</strong>
                  <span className="text-[10px] text-stone-400">Order from menu</span>
                </div>
                <Utensils size={15} className="text-stone-400 group-hover:text-amber-600" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenStaff?.();
                }}
                className="p-3 rounded-xl bg-white border border-[#dde3db] hover:border-amber-400 text-left flex items-center justify-between transition-colors group"
              >
                <div>
                  <strong className="block text-xs text-[#16211c]">Request Staff</strong>
                  <span className="text-[10px] text-stone-400">Towels, checkout, bag</span>
                </div>
                <BellRing size={15} className="text-stone-400 group-hover:text-amber-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </CompanionSheet>
  );
};
