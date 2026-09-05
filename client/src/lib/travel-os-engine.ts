import type {
  ArrivalBrief,
  HealthCheck,
  KnowledgeDoc,
  TravelDna,
  TravelDocument,
  Trip,
  TripItem,
} from "@shared/travel-os";

export interface HealthReport {
  score: number;
  checks: HealthCheck[];
}

export function computeHealth(trip: Trip, items: TripItem[], rainDay: string | null): HealthReport {
  const tripItems = items.filter((item) => item.tripId === trip.id);
  const has = (kind: TripItem["kind"], status?: TripItem["status"]) =>
    tripItems.some((item) => item.kind === kind && (!status || item.status === status));

  const checks: HealthCheck[] = [];

  checks.push({
    id: "flight",
    ok: has("flight", "confirmed") || has("flight", "done"),
    label: "Flight confirmed",
    detail: has("flight", "confirmed") || has("flight", "done")
      ? tripItems.find((i) => i.kind === "flight")?.title || "Flight is on the timeline"
      : "No confirmed flight on this trip",
    fix: "Upload a flight email or add QF/JQ details in the wallet",
  });

  checks.push({
    id: "hotel",
    ok: has("hotel", "confirmed") || has("hotel", "done"),
    label: "Hotel confirmed",
    detail: has("hotel", "confirmed") || has("hotel", "done")
      ? tripItems.find((i) => i.kind === "hotel")?.title || "Hotel is confirmed"
      : "No hotel check-in on the timeline",
    fix: "Paste a hotel confirmation or scan the property QR",
  });

  const transfer = tripItems.find((i) => i.kind === "transfer");
  checks.push({
    id: "transfer",
    ok: Boolean(transfer && transfer.status !== "missing"),
    label: "Airport transfer",
    detail: transfer?.status === "missing"
      ? "Airport transfer is missing — train is recommended"
      : transfer
        ? transfer.title
        : "No transfer planned from the airport",
    fix: "Add Airport Link or a $65 chauffeur to the wallet",
  });

  const outdoor = tripItems.filter((i) => i.weatherSensitive && i.status !== "done");
  const rainHit = Boolean(rainDay && outdoor.some((i) => i.startAt.slice(0, 10) === rainDay));
  checks.push({
    id: "rain",
    ok: !rainHit,
    label: rainHit ? `Rain expected ${rainDay}` : "Weather looks workable",
    detail: rainHit
      ? `${outdoor.filter((i) => i.startAt.slice(0, 10) === rainDay).map((i) => i.title).join(", ")} should move indoors`
      : "No outdoor stop sits on a rain window",
    fix: "Swap gardens/harbour walks for MCA, QVB, or the hotel cellar",
  });

  const sorted = [...tripItems].sort((a, b) => a.startAt.localeCompare(b.startAt));
  let conflict = false;
  let conflictLabel = "";
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (a.endAt && a.endAt > b.startAt && a.startAt.slice(0, 10) === b.startAt.slice(0, 10)) {
      conflict = true;
      conflictLabel = `${a.title} overlaps ${b.title}`;
      break;
    }
    if (a.status === "conflict" || b.status === "conflict") {
      conflict = true;
      conflictLabel = a.status === "conflict" ? a.notes || a.title : b.notes || b.title;
      break;
    }
  }
  checks.push({
    id: "conflict",
    ok: !conflict,
    label: conflict ? "Schedule conflict" : "No reservation conflicts",
    detail: conflict ? conflictLabel : "Stops are sequenced without overlap",
    fix: "Move the harbour walk to 18:45 or keep dinner and skip the walk",
  });

  const failed = checks.filter((c) => !c.ok).length;
  const score = Math.max(40, 100 - failed * 14);
  return { score, checks };
}

export function buildArrivalBrief(trip: Trip, items: TripItem[]): ArrivalBrief {
  const flight = items.find((i) => i.tripId === trip.id && i.kind === "flight");
  const hotel = items.find((i) => i.tripId === trip.id && i.kind === "hotel");
  const dinner = items.find((i) => i.tripId === trip.id && i.kind === "restaurant");
  const walk = items.find((i) => i.tripId === trip.id && i.kind === "experience");

  return {
    headline: `Tomorrow you arrive in ${trip.city}.`,
    weather: "22°C sunny on arrival afternoon. Showers likely day 2 from 2pm.",
    airport: flight?.location || "Sydney Airport · follow T3 bags",
    transport: "Airport Link train is the reliable option (18 min to Circular Quay). Chauffeur $65 if you land with kids and bags.",
    hotel: hotel
      ? `${hotel.title} · ${hotel.subtitle || "check-in from 3pm"}`
      : "Check-in from 3:00 PM",
    evening: dinner && walk
      ? `Harbour sunset first (move the walk to 18:45), then ${dinner.title} at 19:30.`
      : dinner
        ? dinner.title
        : "Harbour sunset + seafood if you have energy.",
  };
}

export interface NowOption {
  id: string;
  title: string;
  cost: string;
  minutes: number;
  why: string;
  indoor: boolean;
}

export function whatToDoNow(
  now: Date,
  trip: Trip,
  items: TripItem[],
  dna: TravelDna,
  rainy: boolean,
): NowOption[] {
  const hour = now.getHours();
  const next = items
    .filter((i) => i.tripId === trip.id && new Date(i.startAt) > now)
    .sort((a, b) => a.startAt.localeCompare(b.startAt))[0];

  const minutesToNext = next ? Math.max(30, Math.round((new Date(next.startAt).getTime() - now.getTime()) / 60000)) : 180;
  const windowHours = Math.min(4, Math.max(1, Math.round(minutesToNext / 60)));

  const pool: NowOption[] = [
    { id: "n1", title: "Sydney Harbour Walk", cost: "Free", minutes: 45, why: "Best light on the sails. Stroller-ok along the promenade.", indoor: false },
    { id: "n2", title: "The Rocks Food Trail", cost: "$$", minutes: 90, why: dna.cuisines.includes("Indian") ? "Ends near Spice Room if you want a proper dinner." : "Laneway snacks without leaving The Rocks.", indoor: false },
    { id: "n3", title: "Museum of Contemporary Art + coffee", cost: "$", minutes: 75, why: "Covered, 5 minutes from the hotel, kids last 40 minutes happily.", indoor: true },
    { id: "n4", title: "Suez Canal hidden sandstone cut", cost: "Free", minutes: 20, why: "Local hidden gem directly behind the hotel.", indoor: false },
    { id: "n5", title: "Hotel cellar tasting", cost: "$$", minutes: 40, why: "Warm, downstairs, no taxi. Good if rain is close.", indoor: true },
    { id: "n6", title: "Edition Coffee Roasters", cost: "$", minutes: 35, why: "Sydney local pick. Walking route, medium budget.", indoor: true },
  ];

  let options = rainy ? pool.filter((o) => o.indoor) : pool;
  if (dna.familyFriendly) options = options.filter((o) => o.minutes <= 90);
  if (dna.budgetBand === "$") options = options.filter((o) => o.cost !== "$$$");
  if (hour >= 18) options = options.filter((o) => o.id !== "n6");

  return options.filter((o) => o.minutes <= windowHours * 60 + 20).slice(0, 3).map((o) => ({
    ...o,
    why: next ? `${o.why} You have about ${minutesToNext} minutes before ${next.title}.` : o.why,
  }));
}

export function answerFromKnowledge(question: string, docs: KnowledgeDoc[]): { title: string; body: string } | null {
  const q = question.toLowerCase();
  const scored = docs
    .map((doc) => {
      const hay = `${doc.title} ${doc.body} ${doc.tags.join(" ")}`.toLowerCase();
      const hits = q.split(/\s+/).filter((w) => w.length > 3 && hay.includes(w)).length;
      const tagHit = doc.tags.some((t) => q.includes(t)) ? 2 : 0;
      return { doc, score: hits + tagHit };
    })
    .sort((a, b) => b.score - a.score);
  if (!scored[0] || scored[0].score < 1) return null;
  return { title: scored[0].doc.title, body: scored[0].doc.body };
}

export function parseTravelText(raw: string): TravelDocument["extracted"] & { kind: TravelDocument["parsedKind"] } {
  const text = raw.replace(/\s+/g, " ");
  const flight = text.match(/\b([A-Z]{2}\s?\d{2,4})\b/);
  const route = text.match(/\b([A-Z]{3})\s*(?:→|-|to)\s*([A-Z]{3})\b/i);
  const hotel = text.match(/check[- ]?in[^.]{0,40}/i);
  const rest = text.match(/reservation|table for\s+\d+|restaurant/i);
  const when = text.match(/\b(\d{1,2}\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\s*\d{0,4})/i);
  const time = text.match(/\b(\d{1,2}:\d{2}\s*(?:AM|PM)?)\b/i);

  if (flight || route) {
    return {
      kind: "flight",
      flight: flight?.[1]?.replace(/\s+/g, "") || "",
      from: route?.[1]?.toUpperCase() || "",
      to: route?.[2]?.toUpperCase() || "",
      date: when?.[1] || "",
      time: time?.[1] || "",
    };
  }
  if (hotel) {
    return { kind: "hotel", checkIn: hotel[0], date: when?.[1] || "", time: time?.[1] || "" };
  }
  if (rest) {
    return { kind: "restaurant", note: rest[0], date: when?.[1] || "", time: time?.[1] || "" };
  }
  return { kind: "unknown" };
}

export function buildTripFromPreferences(input: {
  destination: string;
  partyType: TravelDna["partyType"];
  interests: string[];
  style: TravelDna["style"];
  startDate: string;
}): { trip: Omit<Trip, "id">; items: Omit<TripItem, "id" | "tripId">[] } {
  const start = input.startDate || "2026-10-03";
  const day = (offset: number, hour: number, minute = 0) => {
    const d = new Date(`${start}T00:00:00+10:00`);
    d.setDate(d.getDate() + offset);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  const luxury = input.style === "luxury";
  const family = input.partyType === "family";
  const food = input.interests.includes("Food");
  const culture = input.interests.includes("Culture") || input.interests.includes("Hidden places");
  const nature = input.interests.includes("Nature") || input.interests.includes("Adventure");

  const items: Omit<TripItem, "id" | "tripId">[] = [
    { kind: "flight", title: `Inbound to ${input.destination}`, startAt: day(0, 14, 30), status: "planned", subtitle: "Add your flight email to confirm" },
    { kind: "airport", title: `${input.destination} Airport`, startAt: day(0, 16, 0), status: "planned" },
    { kind: "transfer", title: "Airport transfer", startAt: day(0, 16, 20), status: "missing", notes: family ? "Train if light bags, chauffeur if travelling with children." : "Train is usually fastest." },
    { kind: "hotel", title: `Check-in · ${input.destination}`, startAt: day(0, 16, 0), status: "planned", subtitle: luxury ? "Request a harbour-view upgrade" : "Standard room" },
  ];

  if (nature) {
    items.push({
      kind: "experience",
      title: family ? "Foreshore playground + short harbour loop" : "Harbour Bridge viewpoint walk",
      startAt: day(0, 18, 0),
      status: "planned",
      cost: "Free",
      weatherSensitive: true,
    });
  }
  if (food) {
    items.push({
      kind: "restaurant",
      title: family ? "Early dinner · Spice Room" : "Dinner · local pick",
      startAt: day(0, 19, 30),
      status: "planned",
      cost: luxury ? "$$$" : "$$",
    });
  }
  if (culture) {
    items.push({
      kind: "experience",
      title: "Museum of Contemporary Art",
      startAt: day(1, 10, 30),
      status: "planned",
      cost: "Free",
    });
  }

  const party =
    input.partyType === "family"
      ? "family"
      : input.partyType === "friends"
        ? "mates"
        : input.partyType === "business"
          ? "colleagues"
          : input.partyType === "couple"
            ? "couple"
            : "solo";

  return {
    trip: {
      title: `${input.destination} with ${party === "solo" ? "yourself" : party}`,
      destination: input.destination,
      city: input.destination,
      country: input.destination === "Tokyo" ? "Japan" : "Australia",
      countryCode: input.destination === "Tokyo" ? "JP" : "AU",
      startDate: start,
      endDate: new Date(new Date(start).getTime() + 3 * 86400000).toISOString().slice(0, 10),
      status: "planning",
      party,
      companions: [],
      tags: [...input.interests.map((i) => i.toLowerCase()), party],
    },
    items,
  };
}

export function evolveDna(dna: TravelDna, signal: Partial<TravelDna>): TravelDna {
  const interests = Array.from(new Set([...(dna.interests || []), ...(signal.interests || [])]));
  const cuisines = Array.from(new Set([...(dna.cuisines || []), ...(signal.cuisines || [])]));
  return {
    ...dna,
    ...signal,
    interests,
    cuisines,
    familyFriendly: signal.familyFriendly ?? dna.familyFriendly,
    walkingPreferred: signal.walkingPreferred ?? dna.walkingPreferred,
  };
}
