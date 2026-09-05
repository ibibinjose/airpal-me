import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type {
  MemoryItem,
  TravelDna,
  TravelDocument,
  TravelMode,
  TravelParty,
  Trip,
  TripCompanion,
  TripItem,
  WalletPass,
} from "@shared/travel-os";
import { DEFAULT_DNA } from "@shared/travel-os";
import { buildTripFromPreferences, evolveDna, parseTravelText } from "../lib/travel-os-engine";
import { loadOsBundle, newId, persistOsBundle } from "../lib/travel-os-store";
import { toast } from "sonner";

interface TravelOsContextType {
  mode: TravelMode;
  setMode: (mode: TravelMode) => void;
  trips: Trip[];
  items: TripItem[];
  activeTrip: Trip | null;
  activeItems: TripItem[];
  setActiveTripId: (id: string) => void;
  dna: TravelDna;
  updateDna: (patch: Partial<TravelDna>) => void;
  wallet: WalletPass[];
  documents: TravelDocument[];
  memories: MemoryItem[];
  addMemory: (title: string, note: string, place?: string) => void;
  ingestDocument: (filename: string, rawText: string) => TravelDocument;
  confirmTransfer: () => void;
  resolveWalkConflict: () => void;
  createTripFromBuilder: (input: {
    destination: string;
    partyType: TravelDna["partyType"];
    interests: string[];
    style: TravelDna["style"];
    startDate: string;
  }) => Trip;
  addWalletPass: (pass: Omit<WalletPass, "id">) => void;
  addCompanion: (name: string, relation: TripCompanion["relation"]) => void;
}

const TravelOsContext = createContext<TravelOsContextType | undefined>(undefined);

export const TravelOsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initial = loadOsBundle();
  const [mode, setMode] = useState<TravelMode>("travel");
  const [trips, setTrips] = useState<Trip[]>(initial.trips);
  const [items, setItems] = useState<TripItem[]>(initial.items);
  const [activeTripId, setActiveTripId] = useState(initial.activeTripId);
  const [dna, setDna] = useState<TravelDna>(initial.dna);
  const [wallet, setWallet] = useState<WalletPass[]>(initial.wallet);
  const [documents, setDocuments] = useState<TravelDocument[]>(initial.documents);
  const [memories, setMemories] = useState<MemoryItem[]>(initial.memories);

  const activeTrip = trips.find((t) => t.id === activeTripId) || trips[0] || null;
  const activeItems = useMemo(
    () => items.filter((i) => i.tripId === (activeTrip?.id || "")).sort((a, b) => a.startAt.localeCompare(b.startAt)),
    [items, activeTrip?.id],
  );

  useEffect(() => {
    persistOsBundle({ trips, items, dna, wallet, documents, memories, activeTripId });
  }, [trips, items, dna, wallet, documents, memories, activeTripId]);

  const updateDna = useCallback((patch: Partial<TravelDna>) => {
    setDna((prev) => evolveDna(prev, patch));
  }, []);

  const addMemory = useCallback((title: string, note: string, place?: string) => {
    if (!activeTrip) return;
    const memory: MemoryItem = {
      id: newId("mem"),
      tripId: activeTrip.id,
      title,
      note,
      place,
      createdAt: new Date().toISOString(),
    };
    setMemories((prev) => [memory, ...prev]);
    toast.success("Saved to Memory Mode", { description: title });
  }, [activeTrip]);

  const ingestDocument = useCallback((filename: string, rawText: string) => {
    const parsed = parseTravelText(rawText);
    const doc: TravelDocument = {
      id: newId("doc"),
      filename,
      rawText,
      parsedKind: parsed.kind,
      extracted: Object.fromEntries(Object.entries(parsed).filter(([k]) => k !== "kind")) as Record<string, string>,
      createdAt: new Date().toISOString(),
    };

    if (parsed.kind === "flight" && activeTrip) {
      const itemId = newId("ti");
      doc.linkedItemId = itemId;
      setItems((prev) => {
        const existing = prev.find((i) => i.tripId === activeTrip.id && i.kind === "flight");
        const nextItem: TripItem = {
          id: existing?.id || itemId,
          tripId: activeTrip.id,
          kind: "flight",
          title: parsed.from && parsed.to ? `${parsed.from} → ${parsed.to}` : "Flight confirmed from email",
          subtitle: [parsed.flight, parsed.date, parsed.time].filter(Boolean).join(" · "),
          startAt: existing?.startAt || new Date().toISOString(),
          status: "confirmed",
          confirmation: parsed.flight,
        };
        if (existing) return prev.map((i) => (i.id === existing.id ? { ...i, ...nextItem, id: existing.id } : i));
        return [...prev, nextItem];
      });
      setWallet((prev) => [
        {
          id: newId("w"),
          kind: "boarding_pass",
          title: doc.extracted.flight ? `${doc.extracted.flight} boarding pass` : filename,
          details: `${parsed.from || ""} ${parsed.to ? "→ " + parsed.to : ""} ${parsed.date} ${parsed.time}`.trim(),
          code: parsed.flight,
          tripId: activeTrip.id,
        },
        ...prev,
      ]);
      toast.success("Flight extracted", { description: "Timeline and wallet updated from the email." });
    } else if (parsed.kind === "hotel" && activeTrip) {
      toast.success("Hotel confirmation read", { description: parsed.checkIn || "Check-in details stored." });
    } else if (parsed.kind === "restaurant" && activeTrip) {
      toast.success("Reservation read", { description: "Added to the travel wallet." });
      setWallet((prev) => [
        { id: newId("w"), kind: "reservation", title: filename, details: rawText.slice(0, 140), tripId: activeTrip.id },
        ...prev,
      ]);
    } else {
      toast.message("Document stored", { description: "Could not auto-file it as a flight or hotel. It's in Documents." });
    }

    setDocuments((prev) => [doc, ...prev]);
    return doc;
  }, [activeTrip]);

  const confirmTransfer = useCallback(() => {
    if (!activeTrip) return;
    setItems((prev) =>
      prev.map((item) =>
        item.tripId === activeTrip.id && item.kind === "transfer"
          ? { ...item, status: "confirmed", title: "Airport Link to Circular Quay", subtitle: "Opal · ~18 min · booked in wallet" }
          : item,
      ),
    );
    setWallet((prev) => [
      {
        id: newId("w"),
        kind: "transfer",
        title: "Airport Link",
        details: "SYD T3 → Circular Quay · Opal",
        tripId: activeTrip.id,
      },
      ...prev.filter((p) => p.kind !== "transfer"),
    ]);
    toast.success("Transfer added", { description: "Trip health will lift — train is confirmed." });
  }, [activeTrip]);

  const resolveWalkConflict = useCallback(() => {
    if (!activeTrip) return;
    setItems((prev) =>
      prev.map((item) =>
        item.tripId === activeTrip.id && item.status === "conflict"
          ? { ...item, status: "planned", startAt: item.startAt.replace("T20:30", "T18:45"), notes: "Moved before dinner so both fit." }
          : item,
      ),
    );
    toast.success("Conflict cleared", { description: "Harbour walk moved to 18:45, dinner stays 19:30." });
  }, [activeTrip]);

  const createTripFromBuilder = useCallback((input: Parameters<TravelOsContextType["createTripFromBuilder"]>[0]) => {
    const built = buildTripFromPreferences(input);
    const trip: Trip = { ...built.trip, id: newId("trip") };
    const nextItems: TripItem[] = built.items.map((item) => ({ ...item, id: newId("ti"), tripId: trip.id }));
    setTrips((prev) => [trip, ...prev]);
    setItems((prev) => [...nextItems, ...prev]);
    setActiveTripId(trip.id);
    setMode("travel");
    updateDna({
      partyType: input.partyType,
      interests: input.interests,
      style: input.style,
      familyFriendly: input.partyType === "family",
    });
    toast.success(`${trip.title} is on your timeline`, { description: `${nextItems.length} stops sequenced from your travel DNA.` });
    return trip;
  }, [updateDna]);

  const addWalletPass = useCallback((pass: Omit<WalletPass, "id">) => {
    setWallet((prev) => [{ ...pass, id: newId("w") }, ...prev]);
  }, []);

  const addCompanion = useCallback((name: string, relation: TripCompanion["relation"]) => {
    if (!activeTrip || !name.trim()) return;
    const party: TravelParty =
      relation === "family" ? "family" : relation === "colleague" ? "colleagues" : relation === "mate" ? "mates" : activeTrip.party;
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === activeTrip.id
          ? {
              ...trip,
              party,
              companions: [...(trip.companions || []), { id: newId("c"), name: name.trim(), relation }],
            }
          : trip,
      ),
    );
    toast.success(`${name.trim()} added`, { description: `On this trip as ${relation}.` });
  }, [activeTrip]);

  return (
    <TravelOsContext.Provider
      value={{
        mode,
        setMode,
        trips,
        items,
        activeTrip,
        activeItems,
        setActiveTripId,
        dna,
        updateDna,
        wallet,
        documents,
        memories,
        addMemory,
        ingestDocument,
        confirmTransfer,
        resolveWalkConflict,
        createTripFromBuilder,
        addWalletPass,
        addCompanion,
      }}
    >
      {children}
    </TravelOsContext.Provider>
  );
};

export function useTravelOs() {
  const ctx = useContext(TravelOsContext);
  if (!ctx) throw new Error("useTravelOs must be used within TravelOsProvider");
  return ctx;
}
