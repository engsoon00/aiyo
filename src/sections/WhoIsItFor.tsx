import { Briefcase, Clock, Home, Users } from "lucide-react";

import { Section } from "@/components/Section";

const AUDIENCES = [
  {
    icon: Clock,
    title: "Busy People",
    body: "Plenty of errands and appointments, not much room to think about each one.",
  },
  {
    icon: Home,
    title: "Families",
    body: "Recurring household tasks that come around again every month.",
  },
  {
    icon: Briefcase,
    title: "Professionals",
    body: "Appointments where turning up without the right document costs you the trip.",
  },
  {
    icon: Users,
    title: "Everyone",
    body: "Anyone who'd rather have clear instructions than a one-line reminder.",
  },
];

export function WhoIsItFor() {
  return (
    <Section
      id="who-is-it-for"
      eyebrow="Who is AiYo for"
      title="Built for ordinary errands"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCES.map((item) => (
          <div
            key={item.title}
            className="rounded-[var(--radius)] border border-border bg-card p-5"
          >
            <div className="liquid-glass flex h-9 w-9 items-center justify-center rounded-lg">
              <item.icon className="h-4 w-4 text-foreground/90" />
            </div>
            <h3 className="mt-4 font-general-sans text-base font-semibold">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
