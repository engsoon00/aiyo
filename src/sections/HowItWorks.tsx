import { CheckCircle2, ListOrdered, MessageSquareText, Repeat } from "lucide-react";

import { Section } from "@/components/Section";

const STEPS = [
  {
    icon: MessageSquareText,
    title: "Tell AiYo",
    body: "“I need to send a parcel tomorrow.” Type it or say it — however you'd say it out loud.",
  },
  {
    icon: ListOrdered,
    title: "Get a Plan",
    body: "AiYo turns your request into preparation items and practical steps in the right order.",
  },
  {
    icon: CheckCircle2,
    title: "Remember What Matters",
    body: "AiYo helps remember dates, documents, and the things that are easy to forget.",
  },
  {
    icon: Repeat,
    title: "Get It Done",
    body: "Work through the steps, mark it complete, and reuse the same process next time.",
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="How AiYo works"
      title="Four steps, start to finish"
      intro="No setup, no configuration, no learning a new system. Describe the errand and start."
    >
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="relative flex flex-col rounded-[var(--radius)] border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div className="liquid-glass flex h-9 w-9 items-center justify-center rounded-lg">
                <step.icon className="h-4 w-4 text-foreground/90" />
              </div>
              <span
                aria-hidden="true"
                className="font-general-sans text-2xl font-medium text-foreground/15"
              >
                {i + 1}
              </span>
            </div>
            <h3 className="mt-4 font-general-sans text-lg font-medium">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
