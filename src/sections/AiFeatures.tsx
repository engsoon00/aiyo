import {
  CalendarClock,
  LayoutTemplate,
  Mic,
  ListOrdered,
  ScanText,
  Sparkles,
} from "lucide-react";

import { Section } from "@/components/Section";
import { Badge } from "@/components/ui/badge";

/**
 * `live: false` is not decoration — those two genuinely are not implemented,
 * and §16 is explicit about not claiming otherwise. The four marked live are
 * the ones parseIntent actually does today.
 */
const FEATURES = [
  {
    icon: CalendarClock,
    title: "Smart Date & Time",
    body: "Understands “tomorrow morning”, “Friday at 3 PM” and “next Monday”, and turns them into a real date and time.",
    live: true,
  },
  {
    icon: Sparkles,
    title: "Task Understanding",
    body: "Works out what kind of process you described — a bank visit, a parcel, a bill — from how you phrased it.",
    live: true,
  },
  {
    icon: LayoutTemplate,
    title: "Template Matching",
    body: "Suggests an existing process template so you start from something proven instead of a blank page.",
    live: true,
  },
  {
    icon: ListOrdered,
    title: "Smart Steps",
    body: "Turns a one-line request into practical steps and a preparation list you can actually follow.",
    live: true,
  },
  {
    icon: Mic,
    title: "Voice Input",
    body: "Say what you need to do instead of typing it out.",
    live: false,
  },
  {
    icon: ScanText,
    title: "Document Understanding",
    body: "Photograph a bill or a letter and let AiYo pull out the details that matter.",
    live: false,
  },
];

export function AiFeatures() {
  return (
    <Section
      id="ai-features"
      eyebrow="AI features"
      title="Assistance where it helps"
      intro="AiYo works inside the task, not in a chat window. Everything below is either working today or clearly marked as not yet."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col rounded-[var(--radius)] border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="liquid-glass flex h-9 w-9 items-center justify-center rounded-lg">
                <feature.icon className="h-4 w-4 text-foreground/90" />
              </div>
              {!feature.live && <Badge variant="soon">Coming soon</Badge>}
            </div>
            <h3 className="mt-4 font-general-sans text-base font-semibold">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
