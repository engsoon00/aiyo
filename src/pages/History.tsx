import { useNavigate } from "react-router-dom";
import { Check, Clock3, LayoutTemplate, RotateCcw } from "lucide-react";

import { AppLayout, PageHeading } from "@/components/app/AppLayout";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { ROUTES } from "@/lib/config";
import { formatDayHeading, formatTime } from "@/lib/datetime";
import { useProcesses } from "@/store/ProcessStore";
import type { Process } from "@/lib/types";

export default function History() {
  const navigate = useNavigate();
  const { completed, useAgain } = useProcesses();

  // Grouped by completion day — a library of finished processes, not a log.
  const groups = completed.reduce<Record<string, Process[]>>((acc, process) => {
    const key = formatDayHeading(process.completedAt as string);
    (acc[key] ??= []).push(process);
    return acc;
  }, {});

  return (
    <AppLayout>
      <PageHeading
        title="History"
        subtitle="Everything you've finished — ready to run again."
      />

      <div className="mt-6">
        {completed.length === 0 ? (
          <EmptyState
            icon={Clock3}
            title="No completed processes yet"
            body="Your completed processes will appear here, so you can run the same one again without starting over."
          />
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(groups).map(([day, items]) => (
              <section key={day}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
                  {day}
                </h2>

                <ul className="mt-3 flex flex-col gap-3">
                  {items.map((process) => {
                    const meta = CATEGORIES[process.category];
                    return (
                      <li
                        key={process.id}
                        className="flex flex-col gap-4 rounded-[var(--radius)] border border-border bg-card p-4 sm:flex-row sm:items-center"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3.5">
                          <div className="relative shrink-0">
                            <div className="liquid-glass flex h-10 w-10 items-center justify-center rounded-lg">
                              <meta.icon className={`h-4 w-4 ${meta.tint}`} />
                            </div>
                            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-success text-[hsl(260_87%_6%)]">
                              <Check className="h-2.5 w-2.5" strokeWidth={4} />
                            </span>
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-general-sans text-[15px] font-semibold leading-tight">
                              {process.title}
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Completed · {formatTime(process.completedAt as string)}
                              {" · "}
                              {process.steps.length} steps
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const clone = useAgain(process.id);
                              if (clone) navigate(ROUTES.process(clone.id));
                            }}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Use Again
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(ROUTES.templates)}
                            title="Browse the template library"
                          >
                            <LayoutTemplate className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Templates</span>
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
