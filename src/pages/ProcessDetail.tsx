import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bell, Check, CheckCircle2, RotateCcw, Trash2 } from "lucide-react";

import { AppLayout, StickyActions } from "@/components/app/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CATEGORIES } from "@/lib/categories";
import { ROUTES } from "@/lib/config";
import { formatWhen } from "@/lib/datetime";
import { cn } from "@/lib/utils";
import {
  currentStepIndex,
  progressOf,
  useProcesses,
} from "@/store/ProcessStore";

export default function ProcessDetail() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { byId, toggleStep, togglePrep, complete, reopen, remove } = useProcesses();

  const process = byId(id);
  if (!process) return <Navigate to={ROUTES.app} replace />;

  const meta = CATEGORIES[process.category];
  const when = formatWhen(process.scheduledAt);
  const current = currentStepIndex(process);
  const isDone = Boolean(process.completedAt);
  const prepOutstanding = process.preparation.filter((p) => !p.done);

  return (
    <AppLayout>
      <Link
        to={ROUTES.app}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      <header className="mt-4 flex items-start gap-4">
        <div className="liquid-glass flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
          <meta.icon className={`h-5 w-5 ${meta.tint}`} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-general-sans text-2xl font-medium tracking-[-0.02em] md:text-3xl">
              {process.title}
            </h1>
            {isDone && (
              <Badge variant="success">
                <Check className="h-3 w-3" strokeWidth={3} />
                Completed
              </Badge>
            )}
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {when ?? "No time set"}
          </p>
        </div>
      </header>

      <div className="mt-6 flex items-center gap-3">
        <Progress value={progressOf(process)} label="Process progress" />
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {Math.round(progressOf(process) * 100)}%
        </span>
      </div>

      {/* Preparation is deliberately separated from execution (§22): these are
          things to gather before leaving, not steps to perform. */}
      {process.preparation.length > 0 && (
        <section className="mt-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
              Preparation
            </h2>
            <span className="text-xs text-muted-foreground">
              {process.preparation.length - prepOutstanding.length} of{" "}
              {process.preparation.length} ready
            </span>
          </div>

          <ul className="mt-3 flex flex-col gap-2">
            {process.preparation.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => togglePrep(process.id, item.id)}
                  aria-pressed={item.done}
                  className="flex w-full items-start gap-3 rounded-[var(--radius)] border border-border bg-card p-3.5 text-left transition-colors hover:border-foreground/20"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                      item.done
                        ? "border-success bg-success/20 text-success"
                        : "border-foreground/25"
                    )}
                  >
                    {item.done && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-[15px] leading-6",
                        item.done && "text-muted-foreground line-through"
                      )}
                    >
                      {item.label}
                    </span>
                    {item.hint && (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.hint}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Steps */}
      {process.steps.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
            Steps
          </h2>

          <ol className="mt-3 flex flex-col gap-2">
            {process.steps.map((step, i) => {
              const isCurrent = !isDone && i === current;
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    onClick={() => toggleStep(process.id, step.id)}
                    aria-pressed={step.done}
                    aria-current={isCurrent ? "step" : undefined}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-[var(--radius)] border p-3.5 text-left transition-colors",
                      isCurrent
                        ? "border-foreground/30 bg-elevated"
                        : "border-border bg-card hover:border-foreground/20"
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold tabular-nums transition-colors",
                        step.done
                          ? "border-success bg-success/20 text-success"
                          : isCurrent
                            ? "border-foreground/50 text-foreground"
                            : "border-foreground/20 text-muted-foreground"
                      )}
                    >
                      {step.done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-[15px] leading-6",
                          step.done && "text-muted-foreground line-through"
                        )}
                      >
                        {step.label}
                      </span>
                      {/* Emphasis doesn't rely on colour alone (§31). */}
                      {isCurrent && (
                        <span className="mt-1 inline-block text-xs font-medium text-foreground/70">
                          You are here
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* Reminder — contextual, not just the task name (§25). */}
      {process.remindAt && (
        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
            Reminder
          </h2>
          <div className="mt-3 flex items-start gap-3 rounded-[var(--radius)] border border-border bg-card p-4">
            <Bell className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <div>
              <p className="text-sm font-medium">{formatWhen(process.remindAt)}</p>
              {prepOutstanding.length > 0 ? (
                <>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Remember to bring:
                  </p>
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {prepOutstanding.map((item) => (
                      <li key={item.id} className="text-sm text-foreground/80">
                        • {item.label}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  Everything on your preparation list is ready.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <StickyActions>
        {isDone ? (
          <Button variant="outline" size="lg" className="lg:flex-1" onClick={() => reopen(process.id)}>
            <RotateCcw className="h-4 w-4" />
            Reopen Process
          </Button>
        ) : (
          <Button
            variant="heroPrimary"
            size="lg"
            className="lg:flex-1"
            onClick={() => complete(process.id)}
          >
            <CheckCircle2 className="h-4 w-4" />
            Complete Process
          </Button>
        )}

        <Button
          variant="ghost"
          size="lg"
          onClick={() => {
            remove(process.id);
            navigate(ROUTES.app);
          }}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </StickyActions>
    </AppLayout>
  );
}
