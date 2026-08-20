import { TEMPLATES } from "./templates";
import type { CategoryId, ParsedIntent } from "./types";

/**
 * The understanding layer.
 *
 * This is deliberately a local, deterministic rule engine — no model call, no
 * network, no API key. It exists so the product's UX can be built and judged
 * for real, and so swapping in a hosted model later is a one-file change:
 * anything that satisfies `(text: string) => ParsedIntent` drops straight in.
 *
 * Everything the UI says about this layer is hedged accordingly ("suggested",
 * "best guess") — see §16 on not claiming unavailable capability.
 */

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

const CATEGORY_KEYWORDS: Record<Exclude<CategoryId, "other">, string[]> = {
  finance: ["bank", "branch", "account", "atm", "savings", "loan", "cheque", "check book"],
  delivery: ["parcel", "package", "courier", "post", "postage", "ship", "send this", "deliver", "pickup order", "collect order"],
  health: ["medicine", "pharmacy", "prescription", "drug", "tablet", "panadol", "clinic pickup", "refill"],
  home: ["repair", "leak", "leaking", "plumber", "electrician", "broken", "fix", "aircon", "wiring", "pipe", "technician"],
  payments: ["bill", "electricity", "water bill", "internet bill", "pay", "payment", "invoice", "utility", "top up", "settle"],
  appointments: ["appointment", "doctor", "dentist", "clinic", "hospital", "checkup", "check-up", "consultation", "booking", "book a"],
  government: ["passport", "immigration", "government", "jpj", "police report", "licence", "license", "permit", "tax", "council"],
  documents: ["document", "certificate", "renew", "replace", "lost my", "ic ", "identity card", "birth cert", "copy of"],
};

/** Longer phrases win, so "police report" beats a bare "report". */
function classify(text: string): { category: CategoryId; hit: boolean } {
  const haystack = ` ${text.toLowerCase()} `;
  let best: { category: CategoryId; weight: number } | null = null;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (!haystack.includes(keyword)) continue;
      const weight = keyword.length;
      if (!best || weight > best.weight) {
        best = { category: category as CategoryId, weight };
      }
    }
  }

  return best
    ? { category: best.category, hit: true }
    : { category: "other", hit: false };
}

// ---------------------------------------------------------------------------
// Date & time extraction
// ---------------------------------------------------------------------------

const WEEKDAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/** Named parts of day, mapped to a sensible default hour. */
const DAY_PARTS: { name: string; hour: number; label: string }[] = [
  { name: "morning", hour: 9, label: "Morning" },
  { name: "afternoon", hour: 14, label: "Afternoon" },
  { name: "evening", hour: 19, label: "Evening" },
  { name: "tonight", hour: 20, label: "Tonight" },
  { name: "night", hour: 20, label: "Night" },
  { name: "noon", hour: 12, label: "Noon" },
];

interface TimeHit {
  hour: number;
  minute: number;
  /** True when the user gave a real clock time rather than "morning". */
  exact: boolean;
  label: string;
}

function extractTime(text: string): TimeHit | null {
  const lower = text.toLowerCase();

  // "3pm", "3 pm", "3:30 pm", "10.45am"
  const meridiem = lower.match(/\b(\d{1,2})(?:[:.](\d{2}))?\s*(am|pm)\b/);
  if (meridiem) {
    let hour = parseInt(meridiem[1], 10) % 12;
    if (meridiem[3] === "pm") hour += 12;
    const minute = meridiem[2] ? parseInt(meridiem[2], 10) : 0;
    return { hour, minute, exact: true, label: formatClock(hour, minute) };
  }

  // 24-hour "15:00"
  const iso = lower.match(/\b(\d{1,2}):(\d{2})\b/);
  if (iso) {
    const hour = parseInt(iso[1], 10);
    const minute = parseInt(iso[2], 10);
    if (hour < 24 && minute < 60) {
      return { hour, minute, exact: true, label: formatClock(hour, minute) };
    }
  }

  for (const part of DAY_PARTS) {
    if (lower.includes(part.name)) {
      return { hour: part.hour, minute: 0, exact: false, label: part.label };
    }
  }

  return null;
}

function formatClock(hour: number, minute: number): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

interface DateHit {
  date: Date;
  label: string;
}

function extractDate(text: string, now: Date): DateHit | null {
  const lower = text.toLowerCase();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const shift = (days: number, label: string): DateHit => {
    const date = new Date(base);
    date.setDate(date.getDate() + days);
    return { date, label };
  };

  if (/\bday after tomorrow\b/.test(lower)) return shift(2, "In 2 days");
  if (/\btomorrow\b|\btmr\b|\btmrw\b/.test(lower)) return shift(1, "Tomorrow");
  if (/\btoday\b|\btonight\b|\bthis (morning|afternoon|evening)\b/.test(lower)) {
    return shift(0, "Today");
  }

  const inDays = lower.match(/\bin (\d{1,2}) days?\b/);
  if (inDays) {
    const n = parseInt(inDays[1], 10);
    return shift(n, `In ${n} day${n === 1 ? "" : "s"}`);
  }

  // "next monday" / "on friday" / bare "friday"
  for (let i = 0; i < WEEKDAYS.length; i++) {
    const name = WEEKDAYS[i];
    if (!new RegExp(`\\b${name}\\b`).test(lower)) continue;

    // "next Monday" and a bare "Monday" both mean the next Monday to occur —
    // treating "next" as skip-a-week surprises more people than it helps.
    let delta = (i - base.getDay() + 7) % 7;
    if (delta === 0) delta = 7; // said on a Monday, "Monday" means the next one

    const date = new Date(base);
    date.setDate(date.getDate() + delta);
    return {
      date,
      label: date.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
    };
  }

  if (/\bnext week\b/.test(lower)) return shift(7, "Next week");

  return null;
}

// ---------------------------------------------------------------------------
// Title
// ---------------------------------------------------------------------------

const NOISE = [
  /^\s*(i\s+)?(need|have|want|got)\s+to\s+/i,
  /^\s*(i\s+)?(need|have)\s+a\s+/i,
  /^\s*(please\s+)?(remind me to|remember to|help me)\s+/i,
  /^\s*(i'?m\s+)?going\s+to\s+/i,
  /^\s*my\s+/i,
];

const TRAILING_TIME =
  /\s*\b(today|tonight|tomorrow|tmr|tmrw|next week|this (morning|afternoon|evening)|(next )?(sunday|monday|tuesday|wednesday|thursday|friday|saturday)|in \d{1,2} days?|at \d{1,2}([:.]\d{2})?\s*(am|pm)?|\d{1,2}[:.]\d{2}|morning|afternoon|evening|noon|night)\b/gi;

function toTitle(text: string): string {
  let cleaned = text.trim();
  for (const pattern of NOISE) cleaned = cleaned.replace(pattern, "");
  cleaned = cleaned
    .replace(TRAILING_TIME, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/[.,;]+\s*$/, "")
    .trim();

  if (!cleaned) return "New process";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function parseIntent(text: string, now = new Date()): ParsedIntent {
  const { category, hit } = classify(text);
  const dateHit = extractDate(text, now);
  const timeHit = extractTime(text);

  let scheduledAt: string | null = null;
  if (dateHit) {
    const when = new Date(dateHit.date);
    when.setHours(timeHit?.hour ?? 10, timeHit?.minute ?? 0, 0, 0);
    scheduledAt = when.toISOString();
  }

  const template = TEMPLATES.find((t) => t.category === category) ?? null;

  // Confidence is honest bookkeeping, not decoration: it drives whether the UI
  // presents the template as a suggestion or as a fallback.
  let confidence = hit ? 0.6 : 0.25;
  if (dateHit) confidence += 0.2;
  if (timeHit?.exact) confidence += 0.15;

  return {
    title: template && hit ? template.title : toTitle(text),
    category,
    dateLabel: dateHit?.label ?? null,
    timeLabel: timeHit?.label ?? null,
    scheduledAt,
    templateId: hit ? (template?.id ?? null) : null,
    confidence: Math.min(confidence, 0.95),
  };
}
