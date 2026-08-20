export type CategoryId =
  | "finance"
  | "delivery"
  | "health"
  | "home"
  | "payments"
  | "appointments"
  | "government"
  | "documents"
  | "other";

export interface PrepItem {
  id: string;
  label: string;
  /** Optional nudge shown under the item, e.g. "Physical card, not a photo". */
  hint?: string;
  done: boolean;
}

export interface Step {
  id: string;
  label: string;
  done: boolean;
}

export type ProcessStatus = "upcoming" | "active" | "completed";

export interface Process {
  id: string;
  title: string;
  category: CategoryId;
  /** ISO string, or null when the user hasn't committed to a time yet. */
  scheduledAt: string | null;
  /** ISO string. Defaults to one hour before `scheduledAt`. */
  remindAt: string | null;
  preparation: PrepItem[];
  steps: Step[];
  /** What the user originally typed — kept so History can show provenance. */
  sourceText?: string;
  templateId?: string;
  createdAt: string;
  completedAt: string | null;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  /** Prompt shown on the landing page use-case card. */
  example: string;
  preparation: { label: string; hint?: string }[];
  steps: string[];
}

/** What the (currently local, rule-based) understanding layer returns. */
export interface ParsedIntent {
  title: string;
  category: CategoryId;
  /** Human-facing label, e.g. "Tomorrow" or "Fri, 22 Aug". */
  dateLabel: string | null;
  /** Human-facing label, e.g. "10:00 AM" or "Morning". */
  timeLabel: string | null;
  scheduledAt: string | null;
  templateId: string | null;
  /** 0–1. Drives whether the UI says "suggested" or "best guess". */
  confidence: number;
}
