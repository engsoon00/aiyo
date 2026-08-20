import { Section } from "@/components/Section";

export function WhatIsAiYo() {
  return (
    <Section
      id="what-is-aiyo"
      centered
      eyebrow="What is AiYo"
      title={
        <>
          A process assistant, not{" "}
          <span className="text-foreground/45">another todo list</span>
        </>
      }
      intro="A todo app stores a sentence you already wrote. AiYo reads that sentence and works out what the errand actually involves — what to bring, where to go, what order to do things in, and when to leave."
    >
      <div className="mx-auto max-w-3xl">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { k: "Understands", v: "what kind of errand you described" },
            { k: "Prepares", v: "the documents and items you'll need" },
            { k: "Guides", v: "you through the steps, one at a time" },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-[var(--radius)] border border-border bg-card p-5"
            >
              <p className="font-general-sans text-lg font-medium">{item.k}</p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {item.v}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
