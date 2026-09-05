import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Trip, TripItem } from "@shared/travel-os";
import {
  collectWhatsOn,
  datesWithEvents,
  eventsOnDate,
  tripSpansOnDate,
  type WhatsOnKind,
} from "../../lib/whats-on";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const KIND_DOT: Record<WhatsOnKind, string> = {
  trip: "bg-[#18271f]",
  stop: "bg-amber-400",
  community: "bg-[#2d7a55]",
  hotel: "bg-[#c57a32]",
  campus: "bg-[#1d6aa5]",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toKey(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

interface Props {
  trips: Trip[];
  items: TripItem[];
  onSelectTrip?: (tripId: string) => void;
}

export function WhatsOnCalendar({ trips, items, onSelectTrip }: Props) {
  const today = "2026-09-06";
  const initial = new Date(`${today}T00:00:00`);
  const [cursor, setCursor] = useState({ year: initial.getFullYear(), month: initial.getMonth() });
  const [selected, setSelected] = useState(today);

  const all = useMemo(() => collectWhatsOn(trips, items), [trips, items]);
  const marked = useMemo(() => datesWithEvents(all), [all]);
  const dayEvents = eventsOnDate(all, selected);
  const spanning = tripSpansOnDate(trips, selected);

  const first = new Date(cursor.year, cursor.month, 1);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = first.toLocaleDateString([], { month: "long", year: "numeric" });
  const selectedLabel = new Date(`${selected}T00:00:00`).toLocaleDateString([], {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <section className="ap-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="ap-kicker">Calendar</span>
          <h2 className="ap-display text-lg leading-tight">{monthLabel}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }))
            }
            className="grid place-items-center w-8 h-8 rounded-lg border border-[#dde3db]"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setCursor({ year: initial.getFullYear(), month: initial.getMonth() })}
            className="text-[10px] font-semibold px-2"
          >
            Today
          </button>
          <button
            onClick={() =>
              setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }))
            }
            className="grid place-items-center w-8 h-8 rounded-lg border border-[#dde3db]"
            aria-label="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-[9px] font-mono uppercase text-[#7a877f] py-1">
            {d}
          </div>
        ))}
        {cells.map((day, index) => {
          if (!day) return <div key={`e-${index}`} />;
          const key = toKey(cursor.year, cursor.month, day);
          const has = marked.has(key);
          const inTrip = tripSpansOnDate(trips, key).length > 0;
          const isSelected = key === selected;
          const isToday = key === today;
          return (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`relative h-9 rounded-lg text-[11px] ${
                isSelected
                  ? "bg-[#18271f] text-white font-semibold"
                  : inTrip
                    ? "bg-[#e7f0ec] text-[#16211c]"
                    : "text-[#16211c]"
              } ${isToday && !isSelected ? "ring-1 ring-amber-400" : ""}`}
            >
              {day}
              {has && (
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? "bg-amber-300" : "bg-amber-500"}`} />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 text-[9px] text-[#7a877f]">
        <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-[#18271f] inline-block" /> Trip</span>
        <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Stop</span>
        <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-[#2d7a55] inline-block" /> Community</span>
        <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-[#c57a32] inline-block" /> Hotel</span>
        <span className="inline-flex items-center gap-1"><i className="w-2 h-2 rounded-full bg-[#1d6aa5] inline-block" /> Campus</span>
      </div>

      <div>
        <h3 className="text-xs font-bold mb-1.5">What’s on · {selectedLabel}</h3>
        {spanning.length > 0 && (
          <p className="text-[11px] text-[#5a6b62] mb-2">
            In trip: {spanning.map((t) => t.title).join(" · ")}
          </p>
        )}
        {dayEvents.length === 0 ? (
          <p className="text-xs text-[#7a877f]">Nothing scheduled. A good day to wander or rest.</p>
        ) : (
          <div className="space-y-1.5">
            {dayEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => event.tripId && onSelectTrip?.(event.tripId)}
                className="w-full text-left rounded-xl border border-[#dde3db] px-2.5 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${KIND_DOT[event.kind]}`} />
                  <span className="text-[10px] font-mono text-[#c57a32] w-14 shrink-0">{event.time}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate">{event.title}</div>
                    <div className="text-[10px] text-[#7a877f] truncate">{event.detail}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
