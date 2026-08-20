import { Link, useNavigate } from "react-router-dom";
import { CalendarPlus, Sparkles } from "lucide-react";

import { AppLayout } from "@/components/app/AppLayout";
import { EmptyState } from "@/components/app/EmptyState";
import { ProcessCard } from "@/components/app/ProcessCard";
import { TaskInput } from "@/components/app/TaskInput";
import { Button } from "@/components/ui/button";
import { BROWSABLE_CATEGORIES } from "@/lib/categories";
import { ROUTES } from "@/lib/config";
import { TEMPLATES } from "@/lib/templates";
import { useProcesses } from "@/store/ProcessStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const { upcoming, active, completed } = useProcesses();

  const start = (text: string) =>
    navigate(`${ROUTES.create}?q=${encodeURIComponent(text)}`);

  const hasAnything = upcoming.length + active.length > 0;

  return (
    <AppLayout>
      <section>
        <h1 className="font-general-sans text-2xl font-medium tracking-[-0.02em] md:text-3xl">
          What do you need to get done?
        </h1>
        <div className="mt-5">
          <TaskInput onSubmit={start} />
        </div>

        {/* Quick categories — one tap to a template-backed starting point. */}
        <div className="mt-4 flex flex-wrap gap-2">
          {BROWSABLE_CATEGORIES.map((category) => {
            const template = TEMPLATES.find((t) => t.category === category.id);
            if (!template) return null;
            return (
              <Link
                key={category.id}
                to={`${ROUTES.create}?q=${encodeURIComponent(template.example)}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-sm text-foreground/85 transition-colors hover:border-foreground/25 hover:bg-foreground/5"
              >
                <category.icon className={`h-3.5 w-3.5 ${category.tint}`} />
                {category.label}
              </Link>
            );
          })}
        </div>
      </section>

      {active.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
            In progress
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {active.map((p) => (
              <ProcessCard key={p.id} process={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
          Upcoming
        </h2>
        <div className="mt-3">
          {upcoming.length > 0 ? (
            <div className="flex flex-col gap-3">
              {upcoming.map((p) => (
                <ProcessCard key={p.id} process={p} />
              ))}
            </div>
          ) : hasAnything ? (
            <p className="text-sm text-muted-foreground">
              Nothing scheduled — everything you have on is in progress.
            </p>
          ) : (
            <EmptyState
              icon={CalendarPlus}
              title="Nothing planned yet"
              body="Tell AiYo what you need to get done and I'll turn it into a simple plan."
              action={
                <Button variant="heroPrimary" asChild>
                  <Link to={ROUTES.create}>Create Your First Task</Link>
                </Button>
              }
            />
          )}
        </div>
      </section>

      {completed.length > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
              Recently completed
            </h2>
            <Link
              to={ROUTES.history}
              className="text-sm text-foreground/70 transition-colors hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <div className="mt-3 flex flex-col gap-3">
            {completed.slice(0, 2).map((p) => (
              <ProcessCard key={p.id} process={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
            Suggested templates
          </h2>
          <Link
            to={ROUTES.templates}
            className="text-sm text-foreground/70 transition-colors hover:text-foreground"
          >
            Browse all
          </Link>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {TEMPLATES.slice(0, 4).map((template) => (
            <Link
              key={template.id}
              to={`${ROUTES.create}?q=${encodeURIComponent(template.example)}`}
              className="flex items-start gap-3 rounded-[var(--radius)] border border-border bg-card p-4 transition-colors hover:border-foreground/20 hover:bg-elevated"
            >
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" />
              <div>
                <p className="text-[15px] font-medium leading-tight">
                  {template.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {template.steps.length} steps ·{" "}
                  {template.preparation.length} to prepare
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
