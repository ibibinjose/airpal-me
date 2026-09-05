import type { KnowledgeDoc } from "./travel-os";

export interface CampusClass {
  id: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  date?: string;
  start: string;
  end: string;
  title: string;
  place: string;
  kind: "lecture" | "tutorial" | "lab" | "college";
}

export interface CampusPlace {
  id: string;
  name: string;
  category: "Eat" | "Study" | "Sport" | "Help" | "Social";
  minutes: string;
  why: string;
}

export interface CampusEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  where: string;
  detail: string;
}

export const HARBOUR_COLLEGE = {
  id: "harbour-college",
  name: "Harbour College",
  university: "University of Sydney",
  tagline: "Residential college · City campus companion",
  city: "Sydney",
  address: "1 College Crescent, Camperdown NSW 2050",
  phone: "+61 2 9351 3300",
  security: "+61 2 9351 3333",
  wifi: { network: "HarbourCollege_Eduroam", password: "Use your student ID", speed: "eduroam · 1 Gbps" },
  room: "R12",
  dining: {
    hours: "Breakfast 7:00–9:30 · Lunch 12:00–14:00 · Dinner 17:30–19:30",
    location: "Great Hall",
    notes: "Halal and vegetarian lines marked. Sunday brunch 9:00–11:30.",
  },
  checkIn: "Sunday 14:00 (new residents)",
  library: "Fisher Library 8:00–midnight · College library 24h swipe",
};

export const CAMPUS_CLASSES: CampusClass[] = [
  { id: "cl1", day: "Mon", date: "2026-09-07", start: "09:00", end: "10:00", title: "Intro to Data (DATA1001)", place: "Carslaw LT 175", kind: "lecture" },
  { id: "cl2", day: "Mon", date: "2026-09-07", start: "14:00", end: "16:00", title: "DATA1001 tutorial", place: "John Woolley S325", kind: "tutorial" },
  { id: "cl3", day: "Tue", date: "2026-09-08", start: "11:00", end: "13:00", title: "Australian Studies", place: "Quadrangle History Seminar", kind: "lecture" },
  { id: "cl4", day: "Wed", date: "2026-09-09", start: "10:00", end: "12:00", title: "Academic English", place: "College tutorial room 3", kind: "college" },
  { id: "cl5", day: "Thu", date: "2026-09-10", start: "09:00", end: "11:00", title: "DATA1001 lab", place: "PNR Learning Hub", kind: "lab" },
  { id: "cl6", day: "Fri", date: "2026-09-11", start: "13:00", end: "14:00", title: "College house meeting", place: "Senior Common Room", kind: "college" },
];

export const CAMPUS_PLACES: CampusPlace[] = [
  { id: "p1", name: "Great Hall dining", category: "Eat", minutes: "1 min", why: "Included meals. Halal / veg clearly signed." },
  { id: "p2", name: "Courtyard café", category: "Eat", minutes: "4 min", why: "Better coffee than the hall. Student price." },
  { id: "p3", name: "Fisher Library", category: "Study", minutes: "8 min walk", why: "Quiet floors 4–6. 24h in exam period." },
  { id: "p4", name: "College library", category: "Study", minutes: "on site", why: "Swipe 24h. Good for group work." },
  { id: "p5", name: "Sydney Uni Sport & Fitness", category: "Sport", minutes: "6 min", why: "Pool and gym on student membership." },
  { id: "p6", name: "International Student Centre", category: "Help", minutes: "7 min", why: "VISA, OSHC, and enrolment questions." },
  { id: "p7", name: "Campus security (24h)", category: "Help", minutes: "phone / escort", why: "Night escort from Fisher back to college." },
  { id: "p8", name: "Manning Bar", category: "Social", minutes: "5 min", why: "Cheap student nights. ID required." },
];

export const CAMPUS_EVENTS: CampusEvent[] = [
  { id: "ce1", date: "2026-09-06", time: "09:30", title: "College brunch", where: "Great Hall", detail: "Sunday brunch · visitors welcome with a resident" },
  { id: "ce2", date: "2026-09-06", time: "14:00", title: "Clubs & societies fair", where: "Front lawn", detail: "Malayali, Indian, hiking, debating, football" },
  { id: "ce3", date: "2026-09-08", time: "17:00", title: "International student welcome", where: "Wentworth Building", detail: "OSHC, TFN, transport, and city safety briefing" },
  { id: "ce4", date: "2026-09-10", time: "18:30", title: "Malayali Sydney meet-up", where: "College common room", detail: "Onam leftover sadhya + new-student intros" },
  { id: "ce5", date: "2026-09-12", time: "12:00", title: "Onam sadhya (city)", where: "Pendle Hill Community Hall", detail: "Same event as the city community calendar" },
];

export const CAMPUS_KNOWLEDGE: KnowledgeDoc[] = [
  { id: "ck-wifi", layer: "campus", title: "Wi-Fi", tags: ["wifi", "eduroam", "internet", "password", "unikey"], body: "Use eduroam with your UniKey as the password. Network HarbourCollege_Eduroam. Visitors can ask reception for a 24h guest token." },
  { id: "ck-dining", layer: "campus", title: "Dining hall", tags: ["food", "dinner", "breakfast", "halal", "brunch"], body: "Great Hall: breakfast 7:00–9:30, lunch 12:00–14:00, dinner 17:30–19:30. Sunday brunch 9:00–11:30. Halal and vegetarian lines are signed." },
  { id: "ck-library", layer: "campus", title: "Library", tags: ["library", "study", "fisher"], body: "College library is 24h with your swipe. Fisher Library is an 8 minute walk, open 8:00 to midnight." },
  { id: "ck-security", layer: "campus", title: "Campus security", tags: ["security", "night", "escort", "emergency"], body: "Campus security 24h on +61 2 9351 3333. Night escort from Fisher to college. City emergency is 000." },
  { id: "ck-oshc", layer: "campus", title: "International students", tags: ["visa", "oshc", "tfn", "international"], body: "International Student Centre in Wentworth can help with OSHC, TFN, and enrolment. Welcome session 8 Sep 17:00." },
  { id: "ck-transport", layer: "campus", title: "Getting around", tags: ["bus", "train", "opal", "airport", "redfern"], body: "College gate to Redfern station is 12 minutes on foot. Opal student concession applies. Airport: train to Central then T8, or college shuttle on move-in Sundays." },
  { id: "ck-room", layer: "campus", title: "Room R12", tags: ["room", "key", "laundry"], body: "Room R12 is on the river wing, first floor. Swipe for the building, then your room key. Laundry is in the basement, free for residents, $2 dryer." },
];

export const CAMPUS_EMERGENCY = [
  { name: "Emergency (Police / Fire / Ambulance)", phone: "000" },
  { name: "Campus security (24h escort)", phone: "+61 2 9351 3333" },
  { name: "College duty tutor", phone: "+61 2 9351 3300" },
  { name: "University Health Service", phone: "+61 2 9351 3484" },
  { name: "Lifeline", phone: "13 11 14" },
];

/** Demo “today” for the college companion (Sunday of orientation week). */
export const CAMPUS_TODAY = "2026-09-06";

export function classesOnDate(date: string) {
  return CAMPUS_CLASSES.filter((row) => row.date === date);
}

export function eventsOnDate(date: string) {
  return CAMPUS_EVENTS.filter((row) => row.date === date);
}

export function nextCampusClass(date: string, hhmm: string) {
  const laterToday = CAMPUS_CLASSES.filter((row) => row.date === date && row.start > hhmm).sort((a, b) =>
    a.start.localeCompare(b.start),
  );
  if (laterToday[0]) return laterToday[0];
  const upcoming = CAMPUS_CLASSES.filter((row) => (row.date || "") > date).sort((a, b) =>
    `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`),
  );
  return upcoming[0] ?? null;
}

export interface CampusNowOption {
  title: string;
  detail: string;
  minutes: string;
  why: string;
}

export function whatToDoOnCampus(date = CAMPUS_TODAY, hour = new Date().getHours()): CampusNowOption[] {
  const hhmm = `${String(hour).padStart(2, "0")}:00`;
  const next = nextCampusClass(date, hhmm);
  const options: CampusNowOption[] = [];

  const brunch = CAMPUS_EVENTS.find((e) => e.date === date && /brunch/i.test(e.title));
  const fair = CAMPUS_EVENTS.find((e) => e.date === date && /fair|welcome|meet/i.test(e.title));
  const todayEvent = eventsOnDate(date)[0];

  if (brunch && hour < 12) {
    options.push({ title: brunch.title, detail: `${brunch.time} · ${brunch.where}`, minutes: "1 min", why: brunch.detail });
  }
  if (fair && hour >= 11 && hour < 18) {
    options.push({ title: fair.title, detail: `${fair.time} · ${fair.where}`, minutes: "2 min", why: fair.detail });
  }
  if (hour >= 12 && hour < 14) {
    options.push({
      title: "Lunch in Great Hall",
      detail: HARBOUR_COLLEGE.dining.location,
      minutes: "1 min",
      why: "Included. Halal and vegetarian lines are signed.",
    });
  }
  if (hour >= 17 && hour < 20) {
    options.push({
      title: "Dinner in Great Hall",
      detail: "17:30–19:30",
      minutes: "1 min",
      why: HARBOUR_COLLEGE.dining.notes,
    });
  }
  if (next) {
    options.push({
      title: next.title,
      detail: `${next.day} ${next.start}–${next.end} · ${next.place}`,
      minutes: next.date === date ? "today" : next.day,
      why: `${next.kind} · swipe in a few minutes early.`,
    });
  }
  if (todayEvent && !options.some((o) => o.title === todayEvent.title)) {
    options.push({
      title: todayEvent.title,
      detail: `${todayEvent.time} · ${todayEvent.where}`,
      minutes: "on campus",
      why: todayEvent.detail,
    });
  }
  options.push({
    title: "College library",
    detail: "24h swipe · river wing",
    minutes: "on site",
    why: "Quiet enough for DATA1001. Group tables near the back.",
  });
  options.push({
    title: "Courtyard café",
    detail: "Student price coffee",
    minutes: "4 min",
    why: "Better coffee than the hall. Easy place to meet people from your house.",
  });
  options.push({
    title: "Redfern station",
    detail: "Opal student concession",
    minutes: "12 min walk",
    why: "City, Harris Park food, and the airport train all start here.",
  });

  const seen = new Set<string>();
  return options.filter((row) => {
    if (seen.has(row.title)) return false;
    seen.add(row.title);
    return true;
  }).slice(0, 3);
}
