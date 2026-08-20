import { Link } from "react-router-dom";
import { Bell, CalendarClock } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { CATEGORIES } from "@/lib/categories";
import { ROUTES } from "@/lib/config";
import { formatWhen } from "@/lib/datetime";
import { progressOf } from "@/store/ProcessStore";
import type { Process } from "@/lib/types";

export function ProcessCard({ process }: { process: Process }) {
  const meta = CATEGORIES[process.category];
  const when = formatWhen(process.scheduledAt);
  const value = progressOf(process);
  const doneCount = process.steps.filter((s) => s.done).length;

  return (
    <Link
      to={ROUTES.process(process.id)}
      className="block rounded-[var(--radius)] border border-border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-elevated"
    >
      <div className="flex items-start gap-3.5">
        <div className="liquid-glass flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
          <meta.icon className={`h-4 w-4 ${meta.tint}`} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-general-sans text-[15px] font-semibold leading-tight">
            {process.title}
          </h3>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {when ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" />
                {when}
              </span>
            ) : (
              <span>No time set</span>
            )}
            {process.remindAt && (
              <span className="inline-flex items-center gap-1.5">
                <Bell className="h-3.5 w-3.5" />
                Reminder set
              </span>
            )}
          </div>

          {process.steps.length > 0 && (
            <div className="mt-3 flex items-center gap-3">
              <Progress
                value={value}
                className="flex-1"
                label={`${process.title} progress`}
              />
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {doneCount}/{process.steps.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
