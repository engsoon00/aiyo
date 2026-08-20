import { Check } from "lucide-react";

import { GetStartedDialog } from "@/components/GetStartedDialog";
import { Section } from "@/components/Section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * No pricing existed in the repo before this, so this section is new and
 * deliberately configurable — edit PLANS and nothing else changes.
 *
 * No billing is wired up, because none exists in the project (§17). "AiYo Plus"
 * is a Coming Soon card, not a checkout. No discounts, no user counts, no
 * testimonials — none of those are real.
 */
const PLANS = [
  {
    name: "Free",
    price: "RM0",
    cadence: "",
    tagline: "For getting started.",
    features: [
      "Basic task and process creation",
      "Basic templates",
      "Basic reminders",
      "Limited AI assistance",
    ],
    cta: "getStarted" as const,
    highlighted: false,
  },
  {
    name: "AiYo Plus",
    price: "RM9.90",
    cadence: "/ month",
    tagline: "For users who need more.",
    features: [
      "More AI-assisted processes",
      "More saved templates",
      "More recurring processes",
      "Advanced process generation",
      "Priority access to new features",
    ],
    cta: "soon" as const,
    highlighted: true,
  },
];

export function Pricing() {
  return (
    <Section
      id="pricing"
      centered
      eyebrow="Pricing"
      title="Start free. Upgrade when you need more."
      intro="No card needed to begin. AiYo Plus arrives when there's enough in it to be worth paying for."
    >
      <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-[var(--radius)] border bg-card p-6 text-left ${
              plan.highlighted ? "border-foreground/20" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-general-sans text-lg font-semibold">
                {plan.name}
              </h3>
              {plan.cta === "soon" && <Badge variant="soon">Coming soon</Badge>}
            </div>

            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="font-general-sans text-4xl font-medium tracking-[-0.02em]">
                {plan.price}
              </span>
              {plan.cadence && (
                <span className="text-sm text-muted-foreground">
                  {plan.cadence}
                </span>
              )}
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {plan.tagline}
            </p>

            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-foreground/10">
                    <Check className="h-3 w-3 text-foreground/70" strokeWidth={3} />
                  </span>
                  <span className="leading-6 text-foreground/85">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              {plan.cta === "getStarted" ? (
                <GetStartedDialog>
                  <Button variant="heroPrimary" size="lg" className="w-full">
                    Get Started
                  </Button>
                </GetStartedDialog>
              ) : (
                <Button variant="outline" size="lg" className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
