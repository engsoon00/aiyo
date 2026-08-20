import {
  CalendarCheck,
  FileText,
  ListChecks,
  HeartPulse,
  Landmark,
  Package,
  Receipt,
  Scale,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import type { CategoryId } from "./types";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  /** Tailwind classes for the tinted icon tile. Kept low-saturation on
   *  purpose — the product should read calm, not neon (§35). */
  tint: string;
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  finance: {
    id: "finance",
    label: "Finance",
    icon: Landmark,
    tint: "text-sky-300",
  },
  delivery: {
    id: "delivery",
    label: "Delivery",
    icon: Package,
    tint: "text-amber-300",
  },
  health: {
    id: "health",
    label: "Health",
    icon: HeartPulse,
    tint: "text-rose-300",
  },
  home: { id: "home", label: "Home", icon: Wrench, tint: "text-teal-300" },
  payments: {
    id: "payments",
    label: "Payments",
    icon: Receipt,
    tint: "text-violet-300",
  },
  appointments: {
    id: "appointments",
    label: "Appointments",
    icon: CalendarCheck,
    tint: "text-indigo-300",
  },
  government: {
    id: "government",
    label: "Government",
    icon: Scale,
    tint: "text-emerald-300",
  },
  documents: {
    id: "documents",
    label: "Documents",
    icon: FileText,
    tint: "text-orange-300",
  },
  /** Fallback when nothing matches. Better an honest "Errand" than a
   *  confidently wrong category. */
  other: {
    id: "other",
    label: "Errand",
    icon: ListChecks,
    tint: "text-foreground/70",
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

/** Categories that have templates behind them — "other" is a fallback only. */
export const BROWSABLE_CATEGORIES = CATEGORY_LIST.filter((c) => c.id !== "other");
