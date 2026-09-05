import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BedDouble,
  Building2,
  Check,
  Compass,
  FileText,
  Heart,
  Landmark,
  MapPin,
  Plane,
  Plus,
  ShieldAlert,
  Sparkles,
  Sun,
  Train,
  Upload,
  Users,
  Wallet,
  CloudRain,
  Camera,
  Search,
  CalendarDays,
} from "lucide-react";
import { useLocation } from "wouter";
import { useAirPal } from "../contexts/AirPalContext";
import { useTravelOs } from "../contexts/TravelOsContext";
import { DeviceStage } from "../components/os/DeviceStage";
import { GuestCompanion } from "./GuestCompanion";
import { CampusCompanion } from "./CampusCompanion";
import { CompanionSheet } from "../components/companion/CompanionSheet";
import { SafetyModal } from "../components/companion/SafetyModal";
import { QrScanSheet } from "../components/os/QrScanSheet";
import { TripQrCard } from "../components/os/TripQrCard";
import { WhatsOnCalendar } from "../components/os/WhatsOnCalendar";
import {
  EXPLORE_DESTINATIONS,
  SEED_COMMUNITIES,
  SEED_KNOWLEDGE,
  SEED_VOICES,
  tripWhen,
  type PartyType,
  type TravelStyle,
  type TripCompanion,
  type TripItemKind,
} from "@shared/travel-os";
import { answerFromKnowledge, buildArrivalBrief, computeHealth, whatToDoNow } from "../lib/travel-os-engine";
import { CAMPUS_KNOWLEDGE } from "@shared/campus";


const KIND_ICON: Record<TripItemKind, React.ReactNode> = {
  before: <FileText size={14} />,
  flight: <Plane size={14} />,
  airport: <Building2 size={14} />,
  transfer: <Train size={14} />,
  hotel: <BedDouble size={14} />,
  experience: <Landmark size={14} />,
  restaurant: <UtensilGlyph />,
  memory: <Heart size={14} />,
  note: <FileText size={14} />,
};

function UtensilGlyph() {
  return <span className="text-[13px] leading-none">🍜</span>;
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
}

function TravelOsInner() {
  const { deviceMode, weather, familyMode, setFamilyMode, guestName, setPropertyId, setRoomNumber, setQrType } = useAirPal();
  const os = useTravelOs();
  const [, setLocation] = useLocation();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [nowOpen, setNowOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [scanOpen, setScanOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [askQ, setAskQ] = useState("");
  const [askA, setAskA] = useState<{ title: string; body: string } | null>(null);
  const [docText, setDocText] = useState("");
  const [memoryNote, setMemoryNote] = useState("");
  const [query, setQuery] = useState("");
  const [whenChip, setWhenChip] = useState<"all" | "past" | "present" | "future">("all");
  const [partyChip, setPartyChip] = useState<"all" | "family" | "mates" | "colleagues">("all");
  const [tagChip, setTagChip] = useState("all");
  const [mateName, setMateName] = useState("");
  const [mateRel, setMateRel] = useState<TripCompanion["relation"]>("family");

  const trip = os.activeTrip;
  const health = useMemo(
    () => (trip ? computeHealth(trip, os.items, "2026-09-16") : { score: 0, checks: [] }),
    [trip, os.items],
  );
  const brief = useMemo(() => (trip ? buildArrivalBrief(trip, os.items) : null), [trip, os.items]);
  const nowOptions = useMemo(
    () => (trip ? whatToDoNow(new Date(), trip, os.items, os.dna, weather === "rainy") : []),
    [trip, os.items, os.dna, weather],
  );

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    os.trips.forEach((item) => (item.tags || []).forEach((tag) => tags.add(tag)));
    os.items.forEach((item) => (item.tags || []).forEach((tag) => tags.add(tag)));
    return Array.from(tags);
  }, [os.trips, os.items]);

  const filteredTrips = useMemo(() => {
    const q = query.trim().toLowerCase();
    return os.trips.filter((item) => {
      if (whenChip !== "all" && tripWhen(item) !== whenChip) return false;
      if (partyChip !== "all" && item.party !== partyChip) return false;
      const tripTags = [...(item.tags || []), ...os.items.filter((i) => i.tripId === item.id).flatMap((i) => i.tags || [])];
      if (tagChip !== "all" && !tripTags.includes(tagChip)) return false;
      if (!q) return true;
      const hay = `${item.title} ${item.city} ${item.party} ${(item.companions || []).map((c) => c.name).join(" ")} ${tripTags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [os.trips, os.items, query, whenChip, partyChip, tagChip]);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("trip");
    if (id) os.setActiveTripId(id);
  }, [os.setActiveTripId]);

  const visibleItems = os.activeItems.filter((item) => {
    if (tagChip !== "all" && !(item.tags || []).includes(tagChip) && !(trip?.tags || []).includes(tagChip)) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${item.title} ${item.subtitle || ""} ${(item.tags || []).join(" ")}`.toLowerCase().includes(q);
  });

  const content = (
    <div className="relative h-full min-h-0 flex flex-col overflow-hidden bg-[#f9f8f4] text-[#16211c]">
      <header className="shrink-0 px-4 pt-3 pb-2 border-b border-[#dde3db] bg-[#fffdf9]">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#c57a32]">Travel OS</span>
            <h1 className="text-lg font-bold truncate">{trip?.title || "Your journey"}</h1>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCalOpen(true)}
              className="grid place-items-center w-9 h-9 rounded-xl bg-white border border-[#dde3db] text-[#16211c]"
              aria-label="Open calendar"
            >
              <CalendarDays size={16} />
            </button>
            <button
              onClick={() => setScanOpen(true)}
              className="grid place-items-center w-9 h-9 rounded-xl bg-[#18271f] text-[#fffdf8]"
              aria-label="Scan QR code"
            >
              <Camera size={16} />
            </button>
            <button
              onClick={() => setNowOpen(true)}
              className="px-3 py-2 rounded-xl bg-amber-400 text-stone-950 text-[11px] font-bold"
            >
              Do now
            </button>
          </div>
        </div>
        <label className="mt-2 flex items-center gap-2 rounded-xl border border-[#dde3db] bg-white px-2.5 py-1.5">
          <Search size={14} className="text-[#7a877f]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search trips, people, tags…"
            className="w-full bg-transparent text-xs outline-none"
          />
        </label>
        <div className="mt-2 flex gap-1 overflow-x-auto no-scrollbar">
          {(["all", "past", "present", "future"] as const).map((chip) => (
            <button
              key={chip}
              onClick={() => setWhenChip(chip)}
              className={`px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap border capitalize ${
                whenChip === chip ? "bg-[#18271f] text-[#fffdf8] border-[#18271f]" : "bg-white border-[#dde3db] text-[#5a6b62]"
              }`}
            >
              {chip === "all" ? "All times" : chip === "present" ? "Now" : chip === "future" ? "Next" : "Past"}
            </button>
          ))}
        </div>
        <div className="mt-1.5 flex gap-1 overflow-x-auto no-scrollbar">
          {(["all", "family", "mates", "colleagues"] as const).map((chip) => (
            <button
              key={chip}
              onClick={() => setPartyChip(chip)}
              className={`px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap border capitalize ${
                partyChip === chip ? "bg-amber-400 border-amber-400 text-stone-950 font-semibold" : "bg-white border-[#dde3db] text-[#5a6b62]"
              }`}
            >
              {chip === "all" ? "Everyone" : chip}
            </button>
          ))}
        </div>
        {allTags.length > 0 && (
          <div className="mt-1.5 flex gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setTagChip("all")}
              className={`px-2.5 py-1 rounded-full text-[10px] border ${tagChip === "all" ? "bg-[#e7f0ec] border-[#cfe6da] font-semibold" : "bg-white border-[#dde3db] text-[#5a6b62]"}`}
            >
              All tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setTagChip(tag)}
                className={`px-2.5 py-1 rounded-full text-[10px] border ${tagChip === tag ? "bg-[#e7f0ec] border-[#cfe6da] font-semibold" : "bg-white border-[#dde3db] text-[#5a6b62]"}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
        <div className="mt-2 flex gap-1 overflow-x-auto no-scrollbar">
          {filteredTrips.map((item) => (
            <button
              key={item.id}
              onClick={() => os.setActiveTripId(item.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap border ${
                item.id === trip?.id ? "bg-amber-400 border-amber-400 text-stone-950 font-semibold" : "bg-white border-[#dde3db] text-[#5a6b62]"
              }`}
            >
              {item.city} · {tripWhen(item)} · {item.party}
            </button>
          ))}
          {filteredTrips.length === 0 && <span className="text-[10px] text-[#7a877f]">No trips match those filters.</span>}
        </div>
      </header>

      {os.mode === "stay" ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          {trip?.propertyId === "harbour-college" ? <CampusCompanion bare /> : <GuestCompanion bare />}
        </div>
      ) : (
      <div className="guest-scroll flex-1 px-4 py-3 space-y-3">
        {os.mode === "travel" && trip && (
          <>
            <WhatsOnCalendar trips={os.trips} items={os.items} onSelectTrip={os.setActiveTripId} />
            <section className="rounded-2xl bg-white border border-[#dde3db] p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#7a877f]">Trip health</span>
                  <div className="text-2xl font-bold">{health.score}%</div>
                </div>
                <div className={`text-xs font-semibold ${health.score >= 80 ? "text-[#2d7a55]" : "text-[#c57a32]"}`}>
                  {health.checks.filter((c) => !c.ok).length} to fix
                </div>
              </div>
              <div className="mt-2 space-y-1.5">
                {health.checks.map((check) => (
                  <div key={check.id} className="flex items-start gap-2 text-xs">
                    {check.ok ? <Check size={14} className="text-[#2d7a55] mt-0.5" /> : <AlertTriangle size={14} className="text-[#c57a32] mt-0.5" />}
                    <div>
                      <div className="font-medium">{check.label}</div>
                      <div className="text-[#5a6b62]">{check.detail}</div>
                      {!check.ok && check.id === "transfer" && (
                        <button onClick={os.confirmTransfer} className="mt-1 text-[#c57a32] font-semibold">
                          Book Airport Link
                        </button>
                      )}
                      {!check.ok && check.id === "conflict" && (
                        <button onClick={os.resolveWalkConflict} className="mt-1 text-[#c57a32] font-semibold">
                          Move harbour walk to 18:45
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {brief && trip.status !== "completed" && (
              <section className="rounded-2xl bg-gradient-to-br from-[#fff4e4] to-[#eef6f0] border border-[#f0d4a8] p-3.5 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#c57a32]">Arrival brief</span>
                <h2 className="text-base font-bold">{brief.headline}</h2>
                <p className="text-xs text-[#5a6b62]"><Sun size={12} className="inline mr-1" />{brief.weather}</p>
                <p className="text-xs"><strong>Airport:</strong> {brief.airport}</p>
                <p className="text-xs"><strong>Transport:</strong> {brief.transport}</p>
                <p className="text-xs"><strong>Hotel:</strong> {brief.hotel}</p>
                <p className="text-xs"><strong>First evening:</strong> {brief.evening}</p>
              </section>
            )}

            {trip && (
              <section className="rounded-2xl bg-white border border-[#dde3db] p-3 space-y-2">
                <div className="text-[10px] font-mono uppercase text-[#c57a32]">Travelling with</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 rounded-full bg-[#18271f] text-white text-[10px]">You · {guestName}</span>
                  {(trip.companions || []).map((person) => (
                    <span key={person.id} className="px-2 py-1 rounded-full bg-[#f8e4c8] text-[#c57a32] text-[10px]">
                      {person.name} · {person.relation}
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input
                    value={mateName}
                    onChange={(e) => setMateName(e.target.value)}
                    placeholder="Add family, mate or colleague"
                    className="flex-1 rounded-xl border border-[#dde3db] px-2 py-1.5 text-xs"
                  />
                  <select
                    value={mateRel}
                    onChange={(e) => setMateRel(e.target.value as TripCompanion["relation"])}
                    className="rounded-xl border border-[#dde3db] text-[10px] px-1"
                  >
                    <option value="family">Family</option>
                    <option value="mate">Mate</option>
                    <option value="colleague">Colleague</option>
                    <option value="partner">Partner</option>
                  </select>
                  <button
                    onClick={() => {
                      os.addCompanion(mateName, mateRel);
                      setMateName("");
                    }}
                    className="px-2 rounded-xl bg-[#18271f] text-white text-xs"
                  >
                    Add
                  </button>
                </div>
              </section>
            )}

            {trip && <TripQrCard trip={trip} />}

            <section>
              <h2 className="text-sm font-bold mb-2">My journey</h2>
              <div className="relative border-l-2 border-amber-400/40 ml-3 space-y-2.5 pl-4">
                {visibleItems.map((item) => (
                  <div key={item.id} className="relative">
                    <div className={`absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${item.status === "missing" || item.status === "conflict" ? "bg-[#c57a32]" : item.status === "done" ? "bg-[#2d7a55]" : "bg-amber-400"}`} />
                    <article className="rounded-2xl bg-white border border-[#dde3db] p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[#c57a32]">{KIND_ICON[item.kind]}</span>
                          <div className="min-w-0">
                            <div className="text-[10px] font-mono text-[#c57a32]">{formatDay(item.startAt)} · {formatWhen(item.startAt)}</div>
                            <h3 className="text-sm font-semibold leading-snug">{item.title}</h3>
                            {item.subtitle && <p className="text-[11px] text-[#5a6b62]">{item.subtitle}</p>}
                            {!!item.tags?.length && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {item.tags.map((tag) => (
                                  <button key={tag} onClick={() => setTagChip(tag)} className="text-[9px] text-[#7a877f]">#{tag}</button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono uppercase text-[#7a877f]">{item.status}</span>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-2">
              <button onClick={() => setDocsOpen(true)} className="rounded-2xl bg-white border border-[#dde3db] p-3 text-left text-xs font-semibold">
                <Upload size={16} className="mb-1 text-[#c57a32]" />
                Travel documents
              </button>
              <button onClick={() => setAskOpen(true)} className="rounded-2xl bg-white border border-[#dde3db] p-3 text-left text-xs font-semibold">
                <Sparkles size={16} className="mb-1 text-[#c57a32]" />
                Ask from knowledge
              </button>
              <button onClick={() => setSafetyOpen(true)} className="rounded-2xl bg-white border border-[#dde3db] p-3 text-left text-xs font-semibold">
                <ShieldAlert size={16} className="mb-1 text-[#b42318]" />
                Emergency
              </button>
              <button onClick={() => setBuilderOpen(true)} className="rounded-2xl bg-white border border-[#dde3db] p-3 text-left text-xs font-semibold">
                <Plus size={16} className="mb-1 text-[#c57a32]" />
                New trip
              </button>
            </section>
          </>
        )}

        {os.mode === "explore" && (
          <>
            <button onClick={() => setBuilderOpen(true)} className="w-full rounded-2xl bg-[#18271f] text-[#fffdf8] p-4 text-left">
              <span className="text-[10px] font-mono uppercase text-amber-300">AI trip builder</span>
              <div className="text-lg font-bold">Build from who you are, not a destination search.</div>
            </button>
            {EXPLORE_DESTINATIONS.map((d) => (
              <article key={d.id} className="rounded-2xl bg-white border border-[#dde3db] p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{d.name}</h3>
                    <p className="text-xs text-[#5a6b62]">{d.blurb}</p>
                  </div>
                  <button
                    onClick={() => {
                      os.createTripFromBuilder({
                        destination: d.name,
                        partyType: os.dna.partyType,
                        interests: os.dna.interests,
                        style: os.dna.style,
                        startDate: "2026-10-03",
                      });
                    }}
                    className="text-[11px] font-semibold text-[#c57a32]"
                  >
                    Plan
                  </button>
                </div>
              </article>
            ))}
            <h2 className="text-sm font-bold pt-1">Local voices</h2>
            {SEED_VOICES.map((v) => (
              <article key={v.id} className="rounded-2xl bg-white border border-[#dde3db] p-3">
                <span className="text-[10px] font-mono uppercase text-[#c57a32]">{v.label}</span>
                <h3 className="text-sm font-semibold">{v.place}</h3>
                <p className="text-xs text-[#5a6b62]">{v.why}</p>
              </article>
            ))}
          </>
        )}

        {os.mode === "memory" && (
          <>
            <section className="rounded-2xl bg-white border border-[#dde3db] p-3.5">
              <span className="text-[10px] font-mono uppercase text-[#c57a32]">AirPal passport</span>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div><strong>🇦🇺 Australia</strong><div className="text-xs text-[#5a6b62]">Sydney · Melbourne</div></div>
                <div><strong>Places</strong><div className="text-xs text-[#5a6b62]">{os.wallet.length + os.memories.length} saved</div></div>
              </div>
            </section>
            <section className="rounded-2xl bg-white border border-[#dde3db] p-3.5 space-y-2">
              <h2 className="text-sm font-bold">Travel DNA · {guestName}</h2>
              <p className="text-xs text-[#5a6b62]">
                {os.dna.partyType} · {os.dna.style} · {os.dna.budgetBand} · {os.dna.interests.join(", ")}
                {os.dna.cuisines.length ? ` · ${os.dna.cuisines.join(", ")} food` : ""}
                {os.dna.walkingPreferred ? " · walking routes" : ""}
                {os.dna.familyFriendly ? " · family friendly" : ""}
              </p>
              <button
                onClick={() => {
                  setFamilyMode((v) => !v);
                  os.updateDna({ familyFriendly: !os.dna.familyFriendly, partyType: !os.dna.familyFriendly ? "family" : os.dna.partyType });
                }}
                className="text-[11px] font-semibold text-[#c57a32]"
              >
                {familyMode || os.dna.familyFriendly ? "Family mode on" : "Turn on family mode"}
              </button>
            </section>
            <section className="rounded-2xl bg-white border border-[#dde3db] p-3.5">
              <h2 className="text-sm font-bold mb-2">Wallet</h2>
              <div className="space-y-2">
                {os.wallet.map((pass) => (
                  <div key={pass.id} className="flex items-start gap-2 text-xs">
                    <Wallet size={14} className="text-[#c57a32] mt-0.5" />
                    <div>
                      <div className="font-semibold">{pass.title}</div>
                      <div className="text-[#5a6b62]">{pass.details}</div>
                      {pass.code && <div className="font-mono text-[10px]">{pass.code}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <h2 className="text-sm font-bold">Memories</h2>
            {os.memories.map((m) => (
              <article key={m.id} className="rounded-2xl bg-white border border-[#dde3db] p-3">
                <h3 className="text-sm font-semibold">{m.title}</h3>
                <p className="text-xs text-[#5a6b62]">{m.note}</p>
              </article>
            ))}
            <div className="flex gap-2">
              <input
                value={memoryNote}
                onChange={(e) => setMemoryNote(e.target.value)}
                placeholder="Add a memory from today"
                className="flex-1 rounded-xl border border-[#dde3db] px-3 py-2 text-sm"
              />
              <button
                onClick={() => {
                  if (!memoryNote.trim()) return;
                  os.addMemory(memoryNote.slice(0, 40), memoryNote);
                  setMemoryNote("");
                }}
                className="px-3 rounded-xl bg-[#18271f] text-white text-xs font-semibold"
              >
                Save
              </button>
            </div>
            <h2 className="text-sm font-bold">Communities in {trip?.city || "Sydney"}</h2>
            {SEED_COMMUNITIES.map((c) => (
              <article key={c.id} className="rounded-2xl bg-white border border-[#dde3db] p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{c.name}</h3>
                  <span className="text-[10px] text-[#7a877f]"><Users size={10} className="inline" /> {c.members}</span>
                </div>
                {c.events.map((e) => (
                  <p key={e.id} className="text-xs text-[#5a6b62]">{e.title} · {e.when}</p>
                ))}
                {c.foodPicks.map((f) => (
                  <p key={f.name} className="text-xs"><strong>{f.name}</strong> — {f.why}</p>
                ))}
              </article>
            ))}
          </>
        )}
      </div>
      )}

      <nav className="shrink-0 border-t border-[#dde3db] bg-[#fffdf9] px-2 py-2 flex items-center justify-around text-[10px] text-[#7a877f]">
        {([
          ["explore", "Explore", Compass],
          ["travel", "Travel", MapPin],
          ["stay", "Stay", BedDouble],
          ["memory", "Memory", Heart],
        ] as const).map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => os.setMode(id)}
            className={`flex flex-col items-center gap-0.5 ${os.mode === id ? "text-[#c57a32] font-bold" : ""}`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <CompanionSheet isOpen={nowOpen}>
        <div className="h-full min-h-0 flex flex-col bg-[#fffdf9]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#dde3db]">
            <h2 className="font-bold">What should I do now?</h2>
            <button onClick={() => setNowOpen(false)} className="text-xs font-semibold">Close</button>
          </div>
          <div className="guest-scroll flex-1 p-4 space-y-3">
            <p className="text-xs text-[#5a6b62]">
              {weather === "rainy" ? <CloudRain size={12} className="inline" /> : <Sun size={12} className="inline" />}{" "}
              Using time, weather, opening hours, {os.dna.budgetBand} budget, and {os.dna.partyType} DNA.
            </p>
            {nowOptions.map((opt, i) => (
              <article key={opt.id} className="rounded-2xl border border-[#dde3db] p-3">
                <div className="text-[10px] font-mono text-[#c57a32]">{i + 1} · {opt.minutes} min · {opt.cost}</div>
                <h3 className="font-semibold text-sm">{opt.title}</h3>
                <p className="text-xs text-[#5a6b62]">{opt.why}</p>
              </article>
            ))}
          </div>
        </div>
      </CompanionSheet>

      <CompanionSheet isOpen={builderOpen}>
        <TripBuilderPanel onClose={() => setBuilderOpen(false)} />
      </CompanionSheet>

      <CompanionSheet isOpen={docsOpen}>
        <div className="h-full min-h-0 flex flex-col bg-[#fffdf9]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#dde3db]">
            <h2 className="font-bold">Travel documents</h2>
            <button onClick={() => setDocsOpen(false)} className="text-xs font-semibold">Close</button>
          </div>
          <div className="guest-scroll flex-1 p-4 space-y-3">
            <p className="text-xs text-[#5a6b62]">Paste a flight or hotel email. AirPal files it onto the timeline and wallet.</p>
            <textarea
              value={docText}
              onChange={(e) => setDocText(e.target.value)}
              rows={7}
              className="w-full rounded-2xl border border-[#dde3db] p-3 text-xs font-mono"
              placeholder={"Flight QF431 MEL → SYD\n15 Sep 2026 14:30\nBooking confirmed"}
            />
            <button
              onClick={() => {
                if (!docText.trim()) return;
                os.ingestDocument("pasted-email.txt", docText);
                setDocText("");
              }}
              className="w-full py-2.5 rounded-xl bg-amber-400 text-stone-950 text-xs font-bold"
            >
              Extract into trip
            </button>
            {os.documents.map((d) => (
              <article key={d.id} className="rounded-2xl bg-white border border-[#dde3db] p-3 text-xs">
                <div className="font-semibold">{d.filename} · {d.parsedKind}</div>
                <div className="text-[#5a6b62]">{Object.entries(d.extracted).map(([k, v]) => `${k}: ${v}`).join(" · ")}</div>
              </article>
            ))}
          </div>
        </div>
      </CompanionSheet>

      <CompanionSheet isOpen={askOpen}>
        <div className="h-full min-h-0 flex flex-col bg-[#fffdf9]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#dde3db]">
            <h2 className="font-bold">Knowledge concierge</h2>
            <button onClick={() => setAskOpen(false)} className="text-xs font-semibold">Close</button>
          </div>
          <div className="guest-scroll flex-1 p-4 space-y-3">
            <p className="text-xs text-[#5a6b62]">Answers only from hotel, destination, and emergency knowledge — not invented.</p>
            <input
              value={askQ}
              onChange={(e) => setAskQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setAskA(answerFromKnowledge(askQ, [...SEED_KNOWLEDGE, ...CAMPUS_KNOWLEDGE]));
              }}
              placeholder="Where is breakfast?"
              className="w-full rounded-xl border border-[#dde3db] px-3 py-2 text-sm"
            />
            <button
              onClick={() => setAskA(answerFromKnowledge(askQ, [...SEED_KNOWLEDGE, ...CAMPUS_KNOWLEDGE]))}
              className="w-full py-2 rounded-xl bg-[#18271f] text-white text-xs font-semibold"
            >
              Ask
            </button>
            {askA ? (
              <article className="rounded-2xl bg-[#e7f4ec] border border-[#cfe6da] p-3">
                <div className="text-[10px] font-mono uppercase text-[#2d7a55]">Verified knowledge</div>
                <h3 className="font-semibold text-sm">{askA.title}</h3>
                <p className="text-xs text-[#3a4a42] mt-1">{askA.body}</p>
              </article>
            ) : askQ && askA === null ? null : null}
          </div>
        </div>
      </CompanionSheet>

      <CompanionSheet isOpen={calOpen}>
        <div className="h-full min-h-0 flex flex-col bg-[#fffdf9]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#dde3db]">
            <h2 className="font-bold">What’s on</h2>
            <button onClick={() => setCalOpen(false)} className="text-xs font-semibold">Close</button>
          </div>
          <div className="guest-scroll flex-1 p-3">
            <WhatsOnCalendar trips={os.trips} items={os.items} onSelectTrip={(id) => { os.setActiveTripId(id); setCalOpen(false); }} />
          </div>
        </div>
      </CompanionSheet>
      <QrScanSheet
        isOpen={scanOpen}
        onClose={() => setScanOpen(false)}
        onResult={(intent) => {
          if (intent.kind === "trip") {
            os.setActiveTripId(intent.tripId);
            os.setMode("travel");
          } else if (intent.kind === "share") {
            setLocation(`/trip/${intent.tripId}`);
          } else if (intent.kind === "stay") {
            setPropertyId(intent.propertyId);
            if (intent.room) setRoomNumber(intent.room);
            if (intent.type === "room" || intent.type === "property" || intent.type === "dining" || intent.type === "experience" || intent.type === "emergency") {
              setQrType(intent.type);
            }
            os.setMode("stay");
            setLocation(`/g/${intent.propertyId}${intent.room ? `?type=room&room=${intent.room}` : ""}`);
          } else if (intent.kind === "campus") {
            if (intent.room) setRoomNumber(intent.room);
            if (intent.type === "room" || intent.type === "dining" || intent.type === "experience" || intent.type === "emergency") {
              setQrType(intent.type);
            }
            setLocation(`/c/${intent.campusId}${intent.room ? `?type=room&room=${intent.room}` : ""}`);
          }
        }}
      />
      <SafetyModal isOpen={safetyOpen} onClose={() => setSafetyOpen(false)} />
    </div>
  );

  return <DeviceStage mode={deviceMode}>{content}</DeviceStage>;
}

function TripBuilderPanel({ onClose }: { onClose: () => void }) {
  const os = useTravelOs();
  const [party, setParty] = useState<PartyType>(os.dna.partyType);
  const [interests, setInterests] = useState<string[]>(os.dna.interests);
  const [style, setStyle] = useState<TravelStyle>(os.dna.style);
  const [destination, setDestination] = useState("Sydney");
  const [startDate, setStartDate] = useState("2026-10-03");

  const toggle = (value: string) =>
    setInterests((prev) => (prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]));

  return (
    <div className="h-full min-h-0 flex flex-col bg-[#fffdf9]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#dde3db]">
        <h2 className="font-bold">AI trip builder</h2>
        <button onClick={onClose} className="text-xs font-semibold">Close</button>
      </div>
      <div className="guest-scroll flex-1 p-4 space-y-4 text-sm">
        <div>
          <div className="text-xs font-semibold mb-2">Who are you travelling with?</div>
          <div className="grid grid-cols-2 gap-1.5">
            {(["solo", "couple", "family", "business", "friends"] as PartyType[]).map((p) => (
              <button key={p} onClick={() => setParty(p)} className={`py-2 rounded-xl border capitalize ${party === p ? "bg-amber-400 border-amber-400 font-semibold" : "bg-white border-[#dde3db]"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold mb-2">What do you enjoy?</div>
          <div className="flex flex-wrap gap-1.5">
            {["Food", "Culture", "Nature", "Shopping", "Adventure", "Nightlife", "Hidden places"].map((i) => (
              <button key={i} onClick={() => toggle(i)} className={`px-3 py-1.5 rounded-xl border text-xs ${interests.includes(i) ? "bg-amber-400 border-amber-400 font-semibold" : "bg-white border-[#dde3db]"}`}>
                {i}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold mb-2">Travel style</div>
          <div className="grid grid-cols-3 gap-1.5">
            {(["budget", "comfortable", "luxury"] as TravelStyle[]).map((s) => (
              <button key={s} onClick={() => setStyle(s)} className={`py-2 rounded-xl border capitalize text-xs ${style === s ? "bg-amber-400 border-amber-400 font-semibold" : "bg-white border-[#dde3db]"}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <label className="block text-xs font-semibold">
          Destination
          <input value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-1 w-full rounded-xl border border-[#dde3db] px-3 py-2 font-normal" />
        </label>
        <label className="block text-xs font-semibold">
          Start date
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 w-full rounded-xl border border-[#dde3db] px-3 py-2 font-normal" />
        </label>
        <button
          onClick={() => {
            os.createTripFromBuilder({ destination, partyType: party, interests, style, startDate });
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-[#18271f] text-[#fffdf8] text-sm font-bold"
        >
          Build this trip
        </button>
      </div>
    </div>
  );
}

export const TravelOs: React.FC = () => <TravelOsInner />;
