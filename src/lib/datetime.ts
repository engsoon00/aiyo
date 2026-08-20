const DAY_MS = 86_400_000;

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Whole days from today to `date`, ignoring time of day. */
export function dayOffset(date: Date, now = new Date()): number {
  return Math.round(
    (startOfDay(date).getTime() - startOfDay(now).getTime()) / DAY_MS
  );
}

/** "Today" / "Tomorrow" / "Yesterday" / "Fri, 22 Aug". */
export function formatDateLabel(input: string | Date, now = new Date()): string {
  const date = typeof input === "string" ? new Date(input) : input;
  const offset = dayOffset(date, now);

  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  if (offset === -1) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

/** "10:00 AM" */
export function formatTime(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "Tomorrow · 10:00 AM" — the product's canonical when-line. */
export function formatWhen(
  iso: string | null,
  now = new Date()
): string | null {
  if (!iso) return null;
  return `${formatDateLabel(iso, now)} · ${formatTime(iso)}`;
}

/** Groups history entries under "August 20" style headings. */
export function formatDayHeading(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
  });
}

/** Default reminder: one hour ahead of the appointment. */
export function defaultReminder(scheduledAt: string | null): string | null {
  if (!scheduledAt) return null;
  return new Date(new Date(scheduledAt).getTime() - 60 * 60 * 1000).toISOString();
}

export function isPast(iso: string | null, now = new Date()): boolean {
  return Boolean(iso) && new Date(iso as string).getTime() < now.getTime();
}
