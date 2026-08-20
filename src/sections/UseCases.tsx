import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { Section } from "@/components/Section";
import { CATEGORIES } from "@/lib/categories";
import { ROUTES } from "@/lib/config";
import { TEMPLATES } from "@/lib/templates";

/**
 * Cards are generated from the same TEMPLATES the app runs on, so the counts
 * shown here ("6 steps · 3 to prepare") are always the real counts. "Try
 * Example" hands the example sentence to Create Task via the query string.
 */
export function UseCases() {
  return (
    <Section
      id="use-cases"
      eyebrow="Use cases"
      title="What can AiYo help you with?"
      intro="Real errands, not abstract categories. Each one comes with a preparation list and steps that already know how the process usually goes."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((template) => {
          const meta = CATEGORIES[template.category];
          return (
            <article
              key={template.id}
              className="group flex flex-col rounded-[var(--radius)] border border-border bg-card p-5 transition-colors hover:border-foreground/20 hover:bg-elevated"
            >
              <div className="flex items-center gap-3">
                <div className="liquid-glass flex h-9 w-9 items-center justify-center rounded-lg">
                  <meta.icon className={`h-4 w-4 ${meta.tint}`} />
                </div>
                <div>
                  <h3 className="font-general-sans text-base font-semibold leading-tight">
                    {template.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{meta.label}</p>
                </div>
              </div>

              <p className="mt-4 text-[15px] leading-6 text-foreground/85">
                &ldquo;{template.example}&rdquo;
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {template.description}
              </p>

              <div className="mt-auto pt-5">
                <p className="text-xs text-muted-foreground">
                  {template.steps.length} steps ·{" "}
                  {template.preparation.length} things to prepare
                </p>
                <Link
                  to={`${ROUTES.create}?q=${encodeURIComponent(template.example)}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/90 transition-colors hover:text-foreground"
                >
                  Try Example
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
