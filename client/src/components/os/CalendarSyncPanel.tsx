import React, { useMemo, useState } from "react";
import { CalendarPlus, Check, Download, Mail, Smartphone } from "lucide-react";
import { toast } from "sonner";
import type { WhatsOnEvent } from "../../lib/whats-on";
import {
  preferredCalendarTarget,
  syncCalendar,
  whatsOnToCalendarEvents,
  type CalendarTarget,
} from "../../lib/calendar-sync";

interface Props {
  events: WhatsOnEvent[];
  filename?: string;
  compact?: boolean;
}

const TARGETS: { id: CalendarTarget; label: string; hint: string; icon: React.ReactNode }[] = [
  { id: "apple", label: "iPhone", hint: "Apple Calendar", icon: <Smartphone size={15} /> },
  { id: "google", label: "Google", hint: "Gmail & Android", icon: <Mail size={15} /> },
  { id: "outlook", label: "Outlook", hint: "Outlook & 365", icon: <CalendarPlus size={15} /> },
  { id: "ics", label: ".ics", hint: "Any calendar", icon: <Download size={15} /> },
];

export function CalendarSyncPanel({ events, filename = "airpal.ics", compact = false }: Props) {
  const calEvents = useMemo(() => whatsOnToCalendarEvents(events), [events]);
  const [busy, setBusy] = useState<CalendarTarget | null>(null);
  const preferred = preferredCalendarTarget();

  const run = async (target: CalendarTarget) => {
    if (!calEvents.length || busy) return;
    setBusy(target);
    try {
      const result = await syncCalendar(target, calEvents, filename);
      if (result.ok) toast.success("Calendar sync", { description: result.message });
      else toast.message("Nothing to add", { description: result.message });
    } catch {
      toast.error("Could not open calendar");
    } finally {
      setBusy(null);
    }
  };

  if (!calEvents.length) return null;

  return (
    <div className={compact ? "space-y-2" : "ap-card p-3.5 space-y-2.5"}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="ap-kicker">Sync calendar</p>
          <p className="text-[11px] text-[#5a6b62]">
            {calEvents.length} event{calEvents.length === 1 ? "" : "s"} · iPhone, Android, Outlook, Gmail
          </p>
        </div>
        <button
          onClick={() => run(preferred)}
          className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#18271f] text-[#fffdf8] text-[11px] font-semibold"
        >
          <CalendarPlus size={12} /> Add all
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {TARGETS.map((target) => (
          <button
            key={target.id}
            onClick={() => run(target.id)}
            disabled={busy !== null}
            className={`flex flex-col items-center gap-1 rounded-2xl border px-1.5 py-2.5 text-center ${
              preferred === target.id ? "border-amber-400 bg-[#fff8ee]" : "border-[#e3e9e1] bg-white"
            }`}
          >
            <span className="text-[#c57a32]">{busy === target.id ? <Check size={15} /> : target.icon}</span>
            <span className="text-[10px] font-semibold leading-tight">{target.label}</span>
            <span className="text-[8px] text-[#7a877f] leading-tight">{target.hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
