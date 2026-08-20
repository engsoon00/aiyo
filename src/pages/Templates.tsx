import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutTemplate, Search } from "lucide-react";

import { AppLayout, PageHeading } from "@/components/app/AppLayout";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BROWSABLE_CATEGORIES, CATEGORIES } from "@/lib/categories";
import { ROUTES } from "@/lib/config";
import { TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/lib/types";

export default function Templates() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId | "all">("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      const matchesCategory = category === "all" || t.category === category;
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.example.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <AppLayout>
      <PageHeading
        title="Templates"
        subtitle="Ready-made processes for things people do all the time."
      />

      <div className="mt-6 flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates"
            aria-label="Search templates"
            className="pl-10"
          />
        </div>

        <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
          <FilterChip
            active={category === "all"}
            onClick={() => setCategory("all")}
          >
            All
          </FilterChip>
          {BROWSABLE_CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              active={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              <c.icon className={cn("h-3.5 w-3.5", c.tint)} />
              {c.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {results.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {results.map((template) => {
              const meta = CATEGORIES[template.category];
              return (
                <article
                  key={template.id}
                  className="flex flex-col rounded-[var(--radius)] border border-border bg-card p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="liquid-glass flex h-9 w-9 items-center justify-center rounded-lg">
                      <meta.icon className={cn("h-4 w-4", meta.tint)} />
                    </div>
                    <div>
                      <h2 className="font-general-sans text-base font-semibold leading-tight">
                        {template.title}
                      </h2>
                      <p className="text-xs text-muted-foreground">{meta.label}</p>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {template.description}
                  </p>

                  <p className="mt-3 text-xs text-muted-foreground">
                    {template.steps.length} steps ·{" "}
                    {template.preparation.length} preparation items
                  </p>

                  <div className="mt-auto pt-5">
                    <Button variant="outline" className="w-full" asChild>
                      <Link
                        to={`${ROUTES.create}?q=${encodeURIComponent(template.example)}`}
                      >
                        Use Template
                      </Link>
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={LayoutTemplate}
            title="Find a ready-made process"
            body="No template matches that search. Try a different word, or clear the filter to see everything."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        )}
      </div>
    </AppLayout>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-colors",
        active
          ? "border-foreground/35 bg-foreground/10 text-foreground"
          : "border-border text-foreground/75 hover:border-foreground/25 hover:bg-foreground/5"
      )}
    >
      {children}
    </button>
  );
}
