import { cn } from "@/lib/utils";

interface ProgressProps {
  /** 0–1. */
  value: number;
  className?: string;
  label?: string;
}

export function Progress({ value, className, label }: ProgressProps) {
  const pct = Math.round(Math.min(Math.max(value, 0), 1) * 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Progress"}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-foreground/10",
        className
      )}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-amber-300 via-purple-400 to-indigo-400 transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
