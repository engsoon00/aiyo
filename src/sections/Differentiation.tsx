import { Check, Minus } from "lucide-react";

import { Section } from "@/components/Section";

const AIYO_ADDS = [
  "What to bring",
  "Where to go",
  "Steps to follow",
  "When to go",
  "What to remember",
];

export function Differentiation() {
  return (
    <Section
      id="different"
      eyebrow="Why AiYo is different"
      title="More than a checklist."
      intro={
        <>
          A todo tells you <span className="text-foreground">what</span> to do.
          AiYo helps you understand <span className="text-foreground">how</span>{" "}
          to get it done.
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius)] border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
            A todo app
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-border p-4">
            <span className="h-4 w-4 shrink-0 rounded-[5px] border border-foreground/25" />
            <span className="text-[15px] text-foreground/85">Go to bank</span>
          </div>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <Minus className="h-4 w-4 shrink-0" />
            That&rsquo;s the whole feature.
          </p>
        </div>

        <div className="rounded-[var(--radius)] border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground/40">
            AiYo
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-border p-4">
            <span className="h-4 w-4 shrink-0 rounded-[5px] border border-foreground/25" />
            <span className="text-[15px] text-foreground/85">Go to bank</span>
          </div>
          <ul className="mt-4 flex flex-col gap-2.5">
            {AIYO_ADDS.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-success/20">
                  <Check className="h-3 w-3 text-success" strokeWidth={3} />
                </span>
                <span className="text-foreground/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
