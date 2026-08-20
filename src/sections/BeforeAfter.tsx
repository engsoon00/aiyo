import { ArrowDown, ArrowRight, Bell, Check } from "lucide-react";

import { Section } from "@/components/Section";
import { CATEGORIES } from "@/lib/categories";
import { templateById } from "@/lib/templates";

const bank = templateById("bank-visit")!;

export function BeforeAfter() {
  const meta = CATEGORIES[bank.category];

  return (
    <Section
      id="before-after"
      centered
      eyebrow="Before / After"
      title="From a simple sentence to a complete plan."
    >
      <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1.35fr]">
        {/* Before */}
        <div className="rounded-[var(--radius)] border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
            You type
          </p>
          <p className="mt-4 font-general-sans text-xl leading-8 text-foreground/90">
            &ldquo;I need to go to the bank tomorrow.&rdquo;
          </p>
        </div>

        <div className="flex justify-center text-foreground/30" aria-hidden="true">
          <ArrowRight className="hidden h-6 w-6 lg:block" />
          <ArrowDown className="h-6 w-6 lg:hidden" />
        </div>

        {/* After */}
        <div className="rounded-[var(--radius)] border border-border bg-card p-6 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
            AiYo gives you
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="liquid-glass flex h-9 w-9 items-center justify-center rounded-lg">
              <meta.icon className={`h-4 w-4 ${meta.tint}`} />
            </div>
            <div>
              <h3 className="font-general-sans text-lg font-semibold leading-tight">
                Bank Visit
              </h3>
              <p className="text-sm text-muted-foreground">Tomorrow · 10:00 AM</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
                Preparation
              </h4>
              <ul className="mt-3 flex flex-col gap-2">
                {bank.preparation.map((item) => (
                  <li key={item.label} className="flex items-center gap-2.5 text-sm">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-success/20">
                      <Check className="h-3 w-3 text-success" strokeWidth={3} />
                    </span>
                    <span className="text-foreground/85">{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/45">
                Steps
              </h4>
              <ol className="mt-3 flex flex-col gap-2">
                {bank.steps.slice(0, 5).map((step, i) => (
                  <li key={step} className="flex gap-2.5 text-sm">
                    <span className="w-3.5 shrink-0 text-right tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="text-foreground/85">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-2.5 rounded-lg border border-border bg-elevated p-3.5">
            <Bell className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <div>
              <p className="text-sm font-medium">Tomorrow at 9:00 AM</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Remember your ID and bank card.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
