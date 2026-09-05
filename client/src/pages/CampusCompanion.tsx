import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CloudRain,
  GraduationCap,
  MapPin,
  PhoneCall,
  QrCode,
  ShieldAlert,
  Sparkles,
  Sun,
  Utensils,
  Wifi,
  Send,
  X,
  Copy,
  Check,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { useAirPal } from "../contexts/AirPalContext";
import { DeviceStage } from "../components/os/DeviceStage";
import { CompanionSheet } from "../components/companion/CompanionSheet";
import { makeQrDataUrl, campusQrPayload } from "../lib/qr";
import { answerFromKnowledge } from "../lib/travel-os-engine";
import { SEED_COMMUNITIES } from "@shared/travel-os";
import {
  CAMPUS_CLASSES,
  CAMPUS_EMERGENCY,
  CAMPUS_EVENTS,
  CAMPUS_KNOWLEDGE,
  CAMPUS_PLACES,
  CAMPUS_TODAY,
  HARBOUR_COLLEGE,
  classesOnDate,
  eventsOnDate,
  nextCampusClass,
  whatToDoOnCampus,
  type CampusPlace,
} from "@shared/campus";

type Tab = "today" | "timetable" | "campus" | "help";

const KIND_TONE: Record<string, string> = {
  lecture: "bg-[#ece4f6] text-[#6b46a5]",
  tutorial: "bg-[#e3f0fa] text-[#1d6aa5]",
  lab: "bg-[#dceee4] text-[#2d7a55]",
  college: "bg-[#f8e4c8] text-[#c57a32]",
};

export const CampusCompanion: React.FC<{ bare?: boolean }> = ({ bare = false }) => {
  const { deviceMode, weather, seniorMode, qrType, roomNumber, guestName } = useAirPal();
  const [tab, setTab] = useState<Tab>("today");
  const [wifiOpen, setWifiOpen] = useState(false);
  const [diningOpen, setDiningOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [nowOpen, setNowOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [placeCategory, setPlaceCategory] = useState<"All" | CampusPlace["category"]>("All");
  const [askQ, setAskQ] = useState("");
  const [askA, setAskA] = useState<{ title: string; body: string } | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [qrSrc, setQrSrc] = useState("");

  const room = roomNumber && roomNumber !== "508" ? roomNumber : HARBOUR_COLLEGE.room;
  const today = CAMPUS_TODAY;
  const hour = new Date().getHours();
  const hhmm = `${String(hour).padStart(2, "0")}:${String(new Date().getMinutes()).padStart(2, "0")}`;
  const nowLabel = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const nowOptions = useMemo(() => whatToDoOnCampus(today, hour), [today, hour]);
  const todayClasses = classesOnDate(today);
  const todayEvents = eventsOnDate(today);
  const next = nextCampusClass(today, hhmm);
  const cityEvents = SEED_COMMUNITIES.flatMap((g) =>
    g.events.filter((e) => e.date >= today && e.date <= "2026-09-20").map((e) => ({ ...e, group: g.name })),
  );
  const filteredPlaces = CAMPUS_PLACES.filter((p) => placeCategory === "All" || p.category === placeCategory);
  const payload = campusQrPayload(HARBOUR_COLLEGE.id, room);

  useEffect(() => {
    void makeQrDataUrl(payload).then(setQrSrc);
  }, [payload]);

  useEffect(() => {
    if (qrType === "dining") setDiningOpen(true);
    if (qrType === "emergency") setTab("help");
    if (qrType === "experience") setNowOpen(true);
    const params = new URLSearchParams(window.location.search);
    const open = params.get("open");
    const tabParam = params.get("tab");
    if (tabParam === "today" || tabParam === "timetable" || tabParam === "campus" || tabParam === "help") setTab(tabParam);
    if (open === "ask") {
      setAskOpen(true);
      const q = params.get("q");
      if (q) {
        setAskQ(q);
        setAskA(answerFromKnowledge(q, CAMPUS_KNOWLEDGE));
      }
    }
    if (open === "dining") setDiningOpen(true);
    if (open === "wifi") setWifiOpen(true);
    if (open === "help") setTab("help");
  }, [qrType]);

  const runAsk = (q: string) => {
    const query = q.trim();
    if (!query) return;
    setAskQ(query);
    const hit = answerFromKnowledge(query, CAMPUS_KNOWLEDGE);
    setAskA(hit);
    if (!hit) toast.message("I don't have that on file", { description: "Try Wi-Fi, dining, library, OSHC, or security." });
  };

  const copyWifi = async () => {
    await navigator.clipboard.writeText("Use your student UniKey on eduroam");
    setCopied(true);
    toast.success("eduroam hint copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div className={`relative h-full min-h-0 flex flex-col overflow-hidden bg-[#f9f8f4] text-[#16211c] ${seniorMode ? "text-base" : "text-sm"}`}>
      <div className="guest-scroll flex-1 px-5 pt-5 pb-16 space-y-5">
        {tab === "today" && (
          <>
            <section>
              <div className="flex items-center justify-between gap-2">
                <p className="ap-kicker">Welcome, {guestName}</p>
                <span className="flex items-center gap-1 text-[11px] text-[#7a877f]">
                  {weather === "rainy" ? <CloudRain size={12} className="text-[#1d6aa5]" /> : <Sun size={12} className="text-[#c57a32]" />}
                  {weather === "rainy" ? "18°" : "24°"} · {room}
                </span>
              </div>
              <h1 className={`ap-display leading-[1.05] mt-1 ${seniorMode ? "text-[34px]" : "text-[28px]"}`}>{HARBOUR_COLLEGE.name}</h1>
              <p className="text-xs text-[#7a877f] mt-1">{HARBOUR_COLLEGE.university}</p>
            </section>

            <section className="grid grid-cols-4 gap-2">
              {[
                { label: "Wi-Fi", icon: Wifi, tone: "bg-[#f8e4c8] text-[#c57a32]", onClick: () => setWifiOpen(true) },
                { label: "Dining", icon: Utensils, tone: "bg-[#dceee4] text-[#2d7a55]", onClick: () => setDiningOpen(true) },
                { label: "Tutor", icon: PhoneCall, tone: "bg-[#ece4f6] text-[#6b46a5]", onClick: () => window.open(`tel:${HARBOUR_COLLEGE.phone}`) },
                { label: "Help", icon: ShieldAlert, tone: "bg-[#fadad6] text-[#b42318]", onClick: () => setTab("help") },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className="flex flex-col items-center justify-center min-w-0 py-3 rounded-2xl ap-card active:scale-95"
                  >
                    <div className={`grid place-items-center w-10 h-10 rounded-2xl mb-1.5 ${action.tone}`}>
                      <Icon size={17} />
                    </div>
                    <span className="text-[11px] font-medium">{action.label}</span>
                  </button>
                );
              })}
            </section>

            <section className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#e5f3ea] via-[#fff8ee] to-[#fde9c8] p-5">
              <p className="ap-kicker">Sunday · {nowLabel}</p>
              <h2 className={`ap-display leading-tight mt-1 ${seniorMode ? "text-2xl" : "text-[22px]"}`}>What should I do now?</h2>
              <p className="text-xs text-[#5a6b62] mt-2 mb-4 leading-relaxed">
                Brunch, clubs fair, then the city — three options from the gate.
              </p>
              <button
                onClick={() => setNowOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#18271f] text-[#fffdf8] font-semibold text-sm"
              >
                See options <ArrowRight size={15} />
              </button>
            </section>

            {next && (
              <section className="ap-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase text-[#c57a32]">Next class</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${KIND_TONE[next.kind]}`}>{next.kind}</span>
                </div>
                <h3 className="font-bold text-sm">{next.title}</h3>
                <p className="text-xs text-[#5a6b62]">
                  {next.day} {next.start}–{next.end} · {next.place}
                </p>
              </section>
            )}

            <section className="space-y-2">
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <CalendarDays size={14} className="text-[#c57a32]" /> Today · Sunday 6 Sep
              </h3>
              {todayEvents.length === 0 && todayClasses.length === 0 ? (
                <p className="text-xs text-[#7a877f]">No classes today. Events are on the lawn and in the hall.</p>
              ) : null}
              {todayEvents.map((event) => (
                <div key={event.id} className="ap-card px-3.5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#c57a32] w-12 shrink-0">{event.time}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold">{event.title}</div>
                      <div className="text-[10px] text-[#7a877f]">{event.where} · {event.detail}</div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="ap-card p-4 flex items-center gap-3">
              {qrSrc ? (
                <img src={qrSrc} alt="Campus QR" className="w-20 h-20 rounded-xl border border-[#dde3db]" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-[#f3f6f1]" />
              )}
              <div className="min-w-0">
                <span className="text-[10px] font-mono uppercase text-[#c57a32]">College QR · Room {room}</span>
                <p className="text-xs text-[#5a6b62] leading-relaxed">
                  Stick this on the door. Mates scan it to open the same campus companion — timetable, dining, help.
                </p>
                <button onClick={() => setQrOpen(true)} className="mt-1 text-[11px] font-semibold text-[#2d7a55] inline-flex items-center gap-1">
                  <QrCode size={12} /> Full QR
                </button>
              </div>
            </section>
          </>
        )}

        {tab === "timetable" && (
          <section className="space-y-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#c57a32]">Week of 7 Sep</span>
              <h2 className="font-bold text-lg">Timetable</h2>
              <p className="text-xs text-[#5a6b62]">DATA1001, Australian Studies, Academic English, house meeting.</p>
            </div>
            {CAMPUS_CLASSES.map((row) => (
              <article key={row.id} className="ap-card p-3.5 flex gap-3">
                <div className="w-12 shrink-0">
                  <div className="text-[11px] font-bold">{row.day}</div>
                  <div className="text-[10px] font-mono text-[#7a877f]">{row.start}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold truncate">{row.title}</h3>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${KIND_TONE[row.kind]}`}>{row.kind}</span>
                  </div>
                  <p className="text-[11px] text-[#5a6b62]">{row.end} · {row.place}</p>
                </div>
              </article>
            ))}
            <div className="rounded-2xl bg-[#e7f4ec] border border-[#cfe6da] p-3 text-xs text-[#254137]">
              <Clock size={14} className="inline mr-1" />
              Next week the same slots repeat. House meeting is Friday — attendance is expected.
            </div>
          </section>
        )}

        {tab === "campus" && (
          <section className="space-y-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#c57a32]">From the college gate</span>
              <h2 className="font-bold text-lg">Campus & city</h2>
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {(["All", "Eat", "Study", "Sport", "Help", "Social"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPlaceCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-[11px] border shrink-0 ${
                    placeCategory === cat ? "bg-amber-400 border-amber-400 text-stone-950 font-semibold" : "bg-white border-[#dde3db] text-[#5a6b62]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {filteredPlaces.map((place) => (
              <article key={place.id} className="ap-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold">{place.name}</h3>
                  <span className="text-[10px] font-mono text-[#c57a32] shrink-0">{place.minutes}</span>
                </div>
                <p className="text-[11px] text-[#5a6b62] mt-0.5">{place.why}</p>
                <span className="inline-block mt-1 text-[9px] uppercase font-mono text-[#7a877f]">{place.category}</span>
              </article>
            ))}
            <div>
              <h3 className="text-xs font-bold mb-2 flex items-center gap-1.5">
                <MapPin size={13} className="text-[#2d7a55]" /> City this fortnight
              </h3>
              {cityEvents.map((event) => (
                <div key={event.id} className="rounded-xl border border-[#dde3db] bg-white px-3 py-2 mb-1.5">
                  <div className="text-xs font-semibold">{event.title}</div>
                  <div className="text-[10px] text-[#7a877f]">
                    {event.date.slice(8)} Sep · {event.time || event.when} · {event.where} · {event.group}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "help" && (
          <section className="space-y-3">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#b42318]">Safety first</span>
              <h2 className="font-bold text-lg">Help & emergency</h2>
              <p className="text-xs text-[#5a6b62]">Night escort from Fisher is real. City emergency is still 000.</p>
            </div>
            {CAMPUS_EMERGENCY.map((row) => (
              <a
                key={row.phone}
                href={`tel:${row.phone}`}
                className="flex items-center justify-between rounded-2xl bg-white border border-[#dde3db] p-3 active:scale-98"
              >
                <div>
                  <div className="text-xs font-semibold">{row.name}</div>
                  <div className="text-[11px] font-mono text-[#c57a32]">{row.phone}</div>
                </div>
                <PhoneCall size={16} className="text-[#2d7a55]" />
              </a>
            ))}
            <div className="rounded-2xl bg-[#fff8ee] border border-[#f0d4a8] p-3 text-xs text-[#5a6b62]">
              {HARBOUR_COLLEGE.dining.hours}
              <br />
              {HARBOUR_COLLEGE.library}
            </div>
          </section>
        )}
      </div>

      <nav className="ap-tabbar shrink-0 z-30 py-2 px-3 pb-[max(0.7rem,env(safe-area-inset-bottom))] flex items-center justify-around text-[10px] text-[#7a877f]">
        <button onClick={() => setTab("today")} className={`flex flex-col items-center gap-1 min-w-[52px] ${tab === "today" ? "text-[#18271f] font-semibold" : ""}`}>
          <span className={`grid place-items-center w-10 h-8 rounded-full ${tab === "today" ? "bg-amber-400/90 text-stone-950" : ""}`}><GraduationCap size={17} /></span>
          Today
        </button>
        <button onClick={() => setTab("timetable")} className={`flex flex-col items-center gap-1 min-w-[52px] ${tab === "timetable" ? "text-[#18271f] font-semibold" : ""}`}>
          <span className={`grid place-items-center w-10 h-8 rounded-full ${tab === "timetable" ? "bg-amber-400/90 text-stone-950" : ""}`}><BookOpen size={17} /></span>
          Classes
        </button>
        <button onClick={() => setAskOpen(true)} className="flex flex-col items-center gap-1 min-w-[52px] -mt-3">
          <span className="grid place-items-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-[#24180d] shadow-[0_10px_20px_#e8a84a44]">
            <Sparkles size={20} />
          </span>
          <span className="font-semibold text-[#18271f]">Ask</span>
        </button>
        <button onClick={() => setTab("campus")} className={`flex flex-col items-center gap-1 min-w-[52px] ${tab === "campus" ? "text-[#18271f] font-semibold" : ""}`}>
          <span className={`grid place-items-center w-10 h-8 rounded-full ${tab === "campus" ? "bg-amber-400/90 text-stone-950" : ""}`}><MapPin size={17} /></span>
          Campus
        </button>
        <button onClick={() => setTab("help")} className={`flex flex-col items-center gap-1 min-w-[52px] ${tab === "help" ? "text-[#18271f] font-semibold" : ""}`}>
          <span className={`grid place-items-center w-10 h-8 rounded-full ${tab === "help" ? "bg-amber-400/90 text-stone-950" : ""}`}><ShieldAlert size={17} /></span>
          Help
        </button>
      </nav>

      <CompanionSheet isOpen={wifiOpen} variant="card">
        <div className="relative w-full max-w-sm rounded-3xl bg-[#fffdf9] border border-[#dde3db] p-6 shadow-2xl">
          <button onClick={() => setWifiOpen(false)} className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0]" aria-label="Close Wi-Fi">
            <X size={16} />
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="grid place-items-center w-12 h-12 rounded-2xl bg-amber-400 text-stone-950">
              <Wifi size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#c57a32]">eduroam</span>
              <h3 className="text-lg font-bold">College Wi-Fi</h3>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-[#dde3db] p-3.5 mb-2">
            <span className="block text-[11px] text-stone-400">Network</span>
            <strong className="font-mono text-sm">{HARBOUR_COLLEGE.wifi.network}</strong>
          </div>
          <div className="rounded-2xl bg-white border border-[#dde3db] p-3.5 flex items-center justify-between">
            <div>
              <span className="block text-[11px] text-stone-400">Login</span>
              <strong className="text-sm">{HARBOUR_COLLEGE.wifi.password}</strong>
            </div>
            <button onClick={copyWifi} className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 text-stone-950 text-xs font-semibold">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-[11px] text-[#5a6b62]">{HARBOUR_COLLEGE.wifi.speed}. Visitors ask reception for a 24h guest token.</p>
        </div>
      </CompanionSheet>

      <CompanionSheet isOpen={diningOpen} variant="card">
        <div className="relative w-full max-w-sm rounded-3xl bg-[#fffdf9] border border-[#dde3db] p-6 shadow-2xl">
          <button onClick={() => setDiningOpen(false)} className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0]" aria-label="Close dining">
            <X size={16} />
          </button>
          <span className="text-[10px] font-mono uppercase text-[#2d7a55]">Included meals</span>
          <h3 className="text-lg font-bold mb-2">Great Hall dining</h3>
          <p className="text-sm text-[#3a4a42] mb-2">{HARBOUR_COLLEGE.dining.hours}</p>
          <p className="text-xs text-[#5a6b62]">{HARBOUR_COLLEGE.dining.notes}</p>
        </div>
      </CompanionSheet>

      <CompanionSheet isOpen={nowOpen}>
        <div className="h-full min-h-0 flex flex-col bg-[#fffdf9]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#dde3db]">
            <h2 className="font-bold">What should I do now</h2>
            <button onClick={() => setNowOpen(false)} className="text-xs font-semibold">Close</button>
          </div>
          <div className="guest-scroll flex-1 p-3 space-y-2">
            {nowOptions.map((opt, i) => (
              <article key={opt.title} className="rounded-2xl bg-white border border-[#dde3db] p-3.5">
                <span className="text-[10px] font-mono text-[#c57a32]">Option {i + 1} · {opt.minutes}</span>
                <h3 className="font-bold text-sm">{opt.title}</h3>
                <p className="text-xs text-[#5a6b62]">{opt.detail}</p>
                <p className="text-[11px] text-[#7a877f] mt-1">{opt.why}</p>
              </article>
            ))}
          </div>
        </div>
      </CompanionSheet>

      <CompanionSheet isOpen={askOpen}>
        <div className="h-full min-h-0 flex flex-col bg-[#fffdf9]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#dde3db]">
            <h2 className="font-bold">Ask AirPal</h2>
            <button onClick={() => setAskOpen(false)} className="text-xs font-semibold">Close</button>
          </div>
          <div className="guest-scroll flex-1 p-3 space-y-2">
            <p className="text-xs text-[#5a6b62]">Wi-Fi, dining, library, OSHC, night escort, Opal, room R12.</p>
            <div className="flex flex-wrap gap-1.5">
              {["Wi-Fi password", "What time is dinner?", "Night escort", "OSHC help", "How do I get to Redfern?"].map((q) => (
                <button key={q} onClick={() => runAsk(q)} className="px-2.5 py-1 rounded-full bg-white border border-[#dde3db] text-[11px]">
                  {q}
                </button>
              ))}
            </div>
            {askA ? (
              <article className="rounded-2xl bg-[#e7f4ec] border border-[#cfe6da] p-3">
                <div className="text-[10px] font-mono uppercase text-[#2d7a55]">Campus knowledge</div>
                <h3 className="font-semibold text-sm">{askA.title}</h3>
                <p className="text-xs text-[#3a4a42] mt-1">{askA.body}</p>
              </article>
            ) : askQ && askA === null ? (
              <p className="text-xs text-[#7a877f]">No tagged answer for “{askQ}”.</p>
            ) : null}
          </div>
          <form
            className="shrink-0 p-3 border-t border-[#dde3db] flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              runAsk(askQ);
            }}
          >
            <input
              value={askQ}
              onChange={(e) => setAskQ(e.target.value)}
              placeholder="Ask about campus…"
              className="flex-1 rounded-xl border border-[#dde3db] px-3 py-2 text-sm bg-white"
            />
            <button type="submit" className="grid place-items-center w-10 h-10 rounded-xl bg-[#18271f] text-white" aria-label="Send">
              <Send size={16} />
            </button>
          </form>
        </div>
      </CompanionSheet>

      <CompanionSheet isOpen={qrOpen} variant="card">
        <div className="relative w-full max-w-sm rounded-3xl bg-[#fffdf9] border border-[#dde3db] p-6 text-center shadow-2xl">
          <button onClick={() => setQrOpen(false)} className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0]" aria-label="Close QR">
            <X size={16} />
          </button>
          <h3 className="font-bold mb-1">Room {room} QR</h3>
          <p className="text-xs text-[#5a6b62] mb-3">Scan to open the Harbour College companion.</p>
          {qrSrc && <img src={qrSrc} alt="Campus QR" className="mx-auto w-48 h-48 rounded-2xl border border-[#dde3db]" />}
          <p className="mt-2 text-[10px] font-mono text-[#7a877f] break-all">{payload}</p>
        </div>
      </CompanionSheet>
    </div>
  );

  if (bare) return content;
  return <DeviceStage mode={deviceMode}>{content}</DeviceStage>;
};
