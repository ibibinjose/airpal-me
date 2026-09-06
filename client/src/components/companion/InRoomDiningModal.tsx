import React, { useState } from "react";
import { useAirPal } from "../../contexts/AirPalContext";
import {
  Utensils,
  Plus,
  Minus,
  Trash2,
  X,
  Clock,
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  Flame,
} from "lucide-react";
import { IN_ROOM_DINING_MENU, MenuItem } from "../../../../shared/airpal-data";
import { toast } from "sonner";
import { CompanionSheet } from "./CompanionSheet";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InRoomDiningModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { roomNumber, cart, addToCart, removeFromCart, clearCart, cartTotal, addStaffTicket, menuItems } = useAirPal();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);

  if (!isOpen) return null;

  const categories = ["All", "Starters", "Mains", "Desserts", "Drinks", "Breakfast"];

  const activeItems = menuItems && menuItems.length > 0 ? menuItems : IN_ROOM_DINING_MENU;

  const filteredMenu = activeItems.filter((item) =>
    selectedCategory === "All" ? true : item.category === selectedCategory
  );

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const summary = cart.map((ci) => `${ci.quantity}x ${ci.item.name}`).join(", ");
    addStaffTicket("dining", `In-room dining order ($${cartTotal}): ${summary}`);
    setOrderPlaced(true);
    toast.success("Order Placed with Kitchen", {
      description: `Delivery estimated in 25–35 mins to Room ${roomNumber}.`,
    });
  };

  return (
    <CompanionSheet isOpen={isOpen}>
      <div className="relative flex flex-col h-full min-h-0 bg-[#fffdf9] text-[#16211c] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dde3db] bg-[#f7f5ef]">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-400/20">
              <Utensils size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#16211c]">In-Room Dining</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f8e4c8] text-[#c57a32]">
                  Room {roomNumber}
                </span>
              </div>
              <span className="text-[11px] text-stone-400">
                Served 11:00 AM – 11:00 PM · Est. delivery 30 mins
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setOrderPlaced(false);
              onClose();
            }}
            className="grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#5a6b62]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        {orderPlaced ? (
          <div className="p-8 text-center flex flex-col items-center justify-center flex-1 space-y-4">
            <div className="grid place-items-center w-16 h-16 rounded-full bg-[#dceee4] border border-emerald-400/40 text-[#2d7a55]">
              <CheckCircle size={36} />
            </div>
            <h3 className="text-xl font-bold text-[#16211c]">Order Confirmed!</h3>
            <p className="text-[#5a6b62] text-sm max-w-sm">
              Our kitchen at The Waterfront Grill has received your order for Room {roomNumber}. It will be charged to your room folio upon delivery.
            </p>
            <div className="p-4 rounded-2xl bg-white border border-[#dde3db] w-full max-w-xs text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-stone-400">
                <span>Room Number:</span>
                <span className="text-[#16211c] font-semibold">{roomNumber}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Total Amount:</span>
                <span className="text-[#c57a32] font-semibold">${cartTotal}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Estimated Arrival:</span>
                <span className="text-[#2f7a56] font-semibold">25–35 mins</span>
              </div>
            </div>
            <button
              onClick={() => {
                clearCart();
                setOrderPlaced(false);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-stone-950 font-semibold text-xs hover:bg-amber-300 transition-all"
            >
              Back to Companion
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-amber-400 text-stone-950 font-semibold border-amber-400"
                      : "bg-white border-[#dde3db] text-[#5a6b62] hover:bg-[#eef3ed]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="space-y-3">
              {filteredMenu.map((item) => {
                const inCart = cart.find((ci) => ci.item.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#dde3db] hover:border-[#c9d4cc] transition-all"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-[#16211c]">{item.name}</h4>
                        {item.popular && (
                          <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f8e4c8] text-[#c57a32] border border-amber-500/30">
                            <Flame size={10} /> Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        {item.description}
                      </p>
                      {item.dietary && (
                        <div className="flex gap-1.5 text-[10px] text-stone-400">
                          {item.dietary.map((d) => (
                            <span key={d} className="px-1.5 py-0.5 rounded bg-white font-mono">
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="font-mono font-bold text-[#c57a32] text-sm">
                        ${item.price}
                      </span>

                      {item.available === false ? (
                        <span className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-400 font-mono text-[10px] font-bold border border-stone-200">
                          Sold Out
                        </span>
                      ) : inCart ? (
                        <div className="flex items-center gap-1.5 bg-[#f8e4c8] border border-amber-400/30 rounded-xl p-1 text-xs text-[#c57a32]">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 hover:bg-amber-400/30 rounded-lg text-[#c57a32]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-mono font-bold px-1.5">{inCart.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="p-1 hover:bg-amber-400/30 rounded-lg text-[#c57a32]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#f1f5f0] hover:bg-amber-400 hover:text-stone-950 active:scale-95 text-xs font-semibold text-[#16211c] transition-all border border-[#dde3db]"
                        >
                          <Plus size={12} />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Cart Bar */}
        {!orderPlaced && cart.length > 0 && (
          <div className="p-4 bg-[#16241b] border-t border-[#dde3db] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag size={20} className="text-amber-400" />
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-amber-400 text-stone-950 font-bold text-[10px] grid place-items-center">
                  {cart.reduce((sum, ci) => sum + ci.quantity, 0)}
                </span>
              </div>
              <div>
                <span className="block text-[11px] text-stone-400">Order Subtotal</span>
                <strong className="text-sm font-mono font-bold text-[#c57a32]">
                  ${cartTotal} AUD
                </strong>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 font-semibold text-xs transition-all shadow-md shadow-amber-400/20"
            >
              <span>Charge to Room {roomNumber}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </CompanionSheet>
  );
};
