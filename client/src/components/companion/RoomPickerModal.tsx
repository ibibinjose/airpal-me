import React, { useState } from "react";
import { useAirPal } from "../../contexts/AirPalContext";
import { DoorOpen, Key, Check, X, BedDouble, Sparkles, ArrowRight, User } from "lucide-react";
import { toast } from "sonner";
import { CompanionSheet } from "./CompanionSheet";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RoomPickerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { roomNumber, setRoomNumber, guestName, setGuestName, property, addNotification } = useAirPal();
  const [customRoom, setCustomRoom] = useState("");
  const [nameInput, setNameInput] = useState(guestName || "Guest");

  if (!isOpen) return null;

  // Flatten available room numbers from roomTypes or generate defaults
  const roomTypes = property.roomTypes || [];
  const currentRoomType = roomTypes.find((rt) =>
    rt.roomNumbers?.includes(roomNumber)
  );

  const handleSelectRoom = (newRoom: string) => {
    if (!newRoom.trim()) return;
    const cleaned = newRoom.trim();
    setRoomNumber(cleaned);

    // Synchronize URL query parameter without full reload
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("room", cleaned);
      window.history.replaceState({}, "", url.toString());
    } catch {
      // ignore
    }

    addNotification({
      title: `Active Key: Room ${cleaned}`,
      message: `Your companion is now bound to Room ${cleaned}. Staff tickets and dining will be dispatched to this room.`,
      type: "info",
    });

    toast.success(`Switched to Room ${cleaned}`, {
      description: `In-room companion & billing folio updated for ${property.name}.`,
    });

    onClose();
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setGuestName(nameInput.trim());
    }
    if (customRoom.trim()) {
      handleSelectRoom(customRoom.trim());
    } else {
      onClose();
    }
  };

  return (
    <CompanionSheet isOpen={isOpen} variant="card">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#fffdf9] border border-[#dde3db] p-6 text-[#16211c] shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#5a6b62]"
          title="Close"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-400/20">
            <DoorOpen size={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-600 font-bold">
              Guest Room Key
            </span>
            <h3 className="text-xl font-bold text-[#16211c]">Room Assignment</h3>
          </div>
        </div>

        {/* Current Active Room Display Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-semibold flex items-center gap-1.5">
              <Key size={13} /> Active Room
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-0.5">
            <div>
              <span className="text-2xl font-black font-mono tracking-tight text-[#16211c]">
                Room {roomNumber}
              </span>
              <p className="text-xs text-stone-600">
                {currentRoomType ? currentRoomType.name : "Sanctuary Stay"}
              </p>
            </div>
            <span className="text-[11px] font-mono text-stone-500">
              {property.destination}
            </span>
          </div>
        </div>

        {/* Quick Room Selector Chips */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#3a4a42] flex items-center justify-between">
            <span>Quick Select Room</span>
            <span className="text-[10px] font-normal text-stone-400">1-tap switch</span>
          </label>

          {roomTypes.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {roomTypes.map((rt) => {
                const numbers = rt.roomNumbers && rt.roomNumbers.length > 0
                  ? rt.roomNumbers
                  : [101, 102, 201, 204].map(String);
                return (
                  <div key={rt.id} className="p-2.5 rounded-xl bg-white border border-[#dde3db] space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-stone-800 flex items-center gap-1">
                        <BedDouble size={12} className="text-amber-600" />
                        {rt.name}
                      </span>
                      <span className="font-mono text-[10px] text-stone-400">
                        {rt.bedConfig}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {numbers.map((r) => {
                        const isCurrent = r === roomNumber;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => handleSelectRoom(r)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                              isCurrent
                                ? "bg-amber-400 text-stone-950 ring-2 ring-amber-500 shadow-xs"
                                : "bg-[#f4f7f2] hover:bg-amber-100 text-[#16211c] border border-stone-200"
                            }`}
                          >
                            {isCurrent && <Check size={11} className="inline mr-1" />}
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {["101", "102", "204", "305", "508"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleSelectRoom(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    r === roomNumber
                      ? "bg-amber-400 text-stone-950 ring-2 ring-amber-500"
                      : "bg-[#f4f7f2] hover:bg-amber-100 text-[#16211c] border border-stone-200"
                  }`}
                >
                  Room {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Enter Custom Room & Guest Name Form */}
        <form onSubmit={handleSaveAll} className="space-y-3 pt-2 border-t border-stone-100">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                Custom Room #
              </label>
              <input
                type="text"
                placeholder="e.g. 204 or Penthouse"
                value={customRoom}
                onChange={(e) => setCustomRoom(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#dde3db] text-xs font-mono text-[#16211c] focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                Guest Name
              </label>
              <input
                type="text"
                placeholder="Guest name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#dde3db] text-xs text-[#16211c] focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow transition-all active:scale-95"
            >
              <span>Save & Bind Room</span>
              <ArrowRight size={13} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#f1f5f0] hover:bg-[#e7eee8] text-stone-700 font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </CompanionSheet>
  );
};
