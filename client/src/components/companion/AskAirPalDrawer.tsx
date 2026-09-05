import React, { useState, useRef, useEffect } from "react";
import { useAirPal } from "../../contexts/AirPalContext";
import {
  Sparkles,
  Send,
  X,
  ArrowRight,
  MapPin,
  Clock,
  Utensils,
  Wrench,
  HelpCircle,
  Compass,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { saveConversation } from "../../lib/airpal-backend";

interface Message {
  id: string;
  sender: "guest" | "airpal";
  text: string;
  time: string;
  actionButtons?: {
    label: string;
    action: () => void;
    icon?: string;
  }[];
  category?: "hotel" | "recommendation" | "escalation" | "plan";
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenTripMode: () => void;
  onOpenDining: () => void;
  onOpenStaffRequest: () => void;
}

export const AskAirPalDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenTripMode,
  onOpenDining,
  onOpenStaffRequest,
}) => {
  const { property, roomNumber, addStaffTicket, purchaseUpsell, seniorMode, trackEvent } = useAirPal();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-init",
      sender: "airpal",
      text: `Hello! I'm AirPal, your personal companion at ${property.name}. I know your room, hotel amenities, and the best secret spots in Sydney. How can I help you right now?`,
      time: "Just now",
      actionButtons: [
        {
          label: "Where can I get good Indian food?",
          action: () => handleSend("Where can I get good Indian food within walking distance?"),
        },
        {
          label: "What time is breakfast?",
          action: () => handleSend("What time does breakfast finish?"),
        },
        {
          label: "Can I get late checkout?",
          action: () => handleSend("Can I get late checkout?"),
        },
        {
          label: "4-hour budget Sydney plan",
          action: () => handleSend("I have 4 hours and don't want to spend much money."),
        },
      ],
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const guestMsg: Message = {
      id: `g-${Date.now()}`,
      sender: "guest",
      text: query,
      time: "Just now",
    };

    setMessages((prev) => [...prev, guestMsg]);
    if (!textToSend) setInput("");

    // Simulate AirPal Intent Engine
    setTimeout(() => {
      processIntent(query);
    }, 450);
  };

  const processIntent = (query: string) => {
    const q = query.toLowerCase();
    let replyText = "";
    let actionButtons: Message["actionButtons"] = [];
    let category: Message["category"] = "recommendation";

    if (q.includes("indian") || q.includes("curry") || q.includes("biryani")) {
      category = "recommendation";
      replyText = `For phenomenal Indian within walking distance, I recommend The Spice Room (Circular Quay, 6 min walk) for authentic tandoori and Dum Biryani overlooking the wharf, or Foreign Return in Surry Hills (short 8 min light rail) for progressive regional Indian.`;
      actionButtons = [
        {
          label: "View Walking Route (6 min)",
          action: () => {
            toast.success("Walking Route Started", { description: "Navigating to The Spice Room at Circular Quay." });
          },
        },
        {
          label: "Reserve Table via AirPal",
          action: () => {
            toast.success("Table Reserved", { description: "Table for 2 requested at The Spice Room." });
          },
        },
      ];
    } else if (q.includes("breakfast") || q.includes("morning food")) {
      category = "hotel";
      replyText = `Breakfast is served ${property.breakfast.hours} at the ${property.breakfast.location}. It features our artisan buffet with Sonoma pastries, organic eggs made to order, and Single O barista coffee for ${property.breakfast.price}.`;
      actionButtons = [
        {
          label: "Add Breakfast to Room Folio ($22)",
          action: () => purchaseUpsell("up_breakfast"),
        },
        {
          label: "View In-Room Breakfast Menu",
          action: () => {
            onClose();
            onOpenDining();
          },
        },
      ];
    } else if (q.includes("late check") || q.includes("checkout") || q.includes("check out")) {
      category = "hotel";
      replyText = `Standard check-out is 10:00 AM. Since your flight or day plans might be later, you can keep Room ${roomNumber} until 4:00 PM for $45, or store your bags with the concierge for free all day.`;
      actionButtons = [
        {
          label: "Confirm Late Check-out until 4 PM ($45)",
          action: () => {
            purchaseUpsell("up_late_checkout");
            addStaffTicket("late_checkout", `Guest in Room ${roomNumber} added late checkout till 4 PM`);
          },
        },
        {
          label: "Book Free Luggage Storage",
          action: () => {
            addStaffTicket("reception", `Luggage storage requested for post-checkout.`);
            toast.success("Luggage Tag Prepared", { description: "Front desk alerted to hold bags complimentary." });
          },
        },
      ];
    } else if (q.includes("4 hour") || q.includes("four hour") || q.includes("cheap") || q.includes("budget") || q.includes("plan")) {
      category = "plan";
      replyText = `Here is a curated 4-hour Sydney itinerary under $15:\n\n1. Stroll The Rocks historic sandstone laneways right behind the hotel (Free)\n2. Sydney Harbour Bridge viewpoint via Cumberland stairs (Free)\n3. Walk down to Circular Quay and Opera House forecourt (Free)\n4. Explore Royal Botanic Garden lush shaded paths (Free)\n5. Flat white coffee at Edition Roasters ($5.50)`;
      actionButtons = [
        {
          label: "Start 4-Hour Walking Route",
          action: () => {
            toast.success("Route Loaded", { description: "Turn-by-turn map loaded for Rocks & Opera House." });
          },
        },
        {
          label: "Open Full Trip Planner",
          action: () => {
            onClose();
            onOpenTripMode();
          },
        },
      ];
    } else if (q.includes("conditioner") || q.includes("ac") || q.includes("broken") || q.includes("fix") || q.includes("cold") || q.includes("hot") || q.includes("leak")) {
      category = "escalation";
      replyText = `I am so sorry to hear that. I have immediately raised an urgent maintenance ticket for Room ${roomNumber} so our engineering team can inspect and rectify this right away.`;
      addStaffTicket("maintenance", `Guest reported room AC issue: "${query}"`, "urgent");
      actionButtons = [
        {
          label: "Call Front Desk Directly",
          action: () => {
            window.location.href = `tel:${property.phone}`;
          },
        },
        {
          label: "Track Request Status",
          action: () => {
            onClose();
            onOpenStaffRequest();
          },
        },
      ];
    } else if (q.includes("kid") || q.includes("child") || q.includes("family")) {
      category = "recommendation";
      replyText = `Sydney is brilliant with kids! Within 10 minutes: 1) Sydney Cove maritime playground, 2) The Rocks Discovery Museum (free hands-on archaeological dig), and 3) Circular Quay ferries to Manly or Taronga Zoo.`;
      actionButtons = [
        {
          label: "Switch to Family Mode",
          action: () => {
            toast.success("Family Mode Activated", { description: "Stroller-friendly and child activities highlighted." });
          },
        },
        {
          label: "Book Ferry / Zoo Passes",
          action: () => {
            toast.success("Tickets Ready", { description: "Zoo & ferry combo pass available at concierge desk." });
          },
        },
      ];
    } else if (q.includes("opera house")) {
      category = "recommendation";
      replyText = `The Sydney Opera House is just a gorgeous 11-minute harbourside stroll from our lobby. Walk through First Fleet Park and along Circular Quay East promenade. Best photo spot is the northern boardwalk at sunset.`;
      actionButtons = [
        {
          label: "Start Harbourside Route",
          action: () => toast.success("Route Started", { description: "11 min scenic walk to Opera House sails." }),
        },
        {
          label: "Book Backstage Tour ($45)",
          action: () => toast.success("Tour Added", { description: "Behind the scenes tour pass reserved." }),
        },
      ];
    } else {
      category = "recommendation";
      replyText = `I understand you're asking about "${query}". I can look up specific venues, organise hotel amenities for Room ${roomNumber}, or escalate directly to our concierge team.`;
      actionButtons = [
        {
          label: "Ask Front Desk Concierge",
          action: () => {
            addStaffTicket("reception", `Guest question: "${query}"`);
          },
        },
        {
          label: "Explore Curated Local Guide",
          action: () => onClose(),
        },
      ];
    }

    const replyMsg: Message = {
      id: `a-${Date.now()}`,
      sender: "airpal",
      text: replyText,
      time: "Just now",
      actionButtons,
      category,
    };

    setMessages((prev) => [...prev, replyMsg]);
    trackEvent("ai_question", { category: category || "recommendation" });
    void saveConversation({
      propertyId: property.id,
      roomNumber,
      question: query,
      answer: replyText,
      escalated: category === "escalation",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#15241c]/45 backdrop-blur-md animate-in fade-in">
      <div className="relative flex flex-col w-full max-w-lg h-[92vh] max-h-[720px] rounded-3xl bg-[#fffdf9] border border-amber-400/20 text-[#16211c] shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#dde3db] bg-[#f7f5ef]">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 font-bold shadow-md shadow-amber-400/20">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#16211c]">Ask AirPal</h3>
                <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#dceee4] text-[#2f7a56] border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Room {roomNumber} Connected
                </span>
              </div>
              <span className="text-[11px] text-[#5a6b62]">
                Understands intent · Hotel approved knowledge
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#5a6b62]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "guest" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed text-sm ${
                  m.sender === "guest"
                    ? "bg-amber-400 text-stone-950 font-medium rounded-br-sm shadow"
                    : "bg-[#f7faf6] border border-[#dde3db] text-[#16211c] rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {/* Actionable buttons */}
                {m.actionButtons && m.actionButtons.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#dde3db] flex flex-col gap-1.5">
                    {m.actionButtons.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={btn.action}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-[#f8ead4] hover:bg-amber-400 text-[#c57a32] hover:text-stone-950 text-xs font-semibold transition-all border border-amber-400/30 active:scale-98"
                      >
                        <span className="text-left">{btn.label}</span>
                        <ArrowRight size={13} className="flex-shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-stone-500 font-mono mt-1 px-1">
                {m.sender === "guest" ? "You" : "AirPal AI"} · {m.time}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset quick suggestion chips */}
        <div className="px-4 py-2 border-t border-[#e8ece4] bg-[#f4f1ea] flex gap-2 overflow-x-auto no-scrollbar text-[11px]">
          <button
            onClick={() => handleSend("Where can I get good Indian food within walking distance?")}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-[#eef3ed] border border-[#dde3db] text-[#5a6b62] whitespace-nowrap"
          >
            🍛 Indian Food
          </button>
          <button
            onClick={() => handleSend("Can I get late checkout?")}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-[#eef3ed] border border-[#dde3db] text-[#5a6b62] whitespace-nowrap"
          >
            ⏰ Late Checkout
          </button>
          <button
            onClick={() => handleSend("My air conditioner isn't working.")}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-[#eef3ed] border border-[#dde3db] text-[#5a6b62] whitespace-nowrap"
          >
            🔧 A/C Maintenance
          </button>
          <button
            onClick={() => handleSend("What can I do with my kids this afternoon?")}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-[#eef3ed] border border-[#dde3db] text-[#5a6b62] whitespace-nowrap"
          >
            🧸 Kids & Family
          </button>
          <button
            onClick={() => handleSend("How do I get to the Opera House?")}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-[#eef3ed] border border-[#dde3db] text-[#5a6b62] whitespace-nowrap"
          >
            🏛️ Opera House
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#f7f5ef] border-t border-[#dde3db] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask anything... (food, late checkout, places, repair)"
            className="flex-1 bg-[#f1f5f0] border border-[#dde3db] rounded-2xl px-4 py-2.5 text-sm text-[#16211c] placeholder-[#8a958c] outline-none focus:border-amber-400/60"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="grid place-items-center w-10 h-10 rounded-2xl bg-amber-400 hover:bg-amber-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 transition-all font-bold"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
