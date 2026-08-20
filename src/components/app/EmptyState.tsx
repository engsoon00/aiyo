import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}

/** §26 — never "No data". Say what belongs here and how to get some. */
export function EmptyState({ icon: Icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius)] border border-dashed border-border px-6 py-12 text-center">
      <div className="liquid-glass flex h-11 w-11 items-center justify-center rounded-xl">
        <Icon className="h-5 w-5 text-foreground/80" />
      </div>
      <h3 className="mt-4 font-general-sans text-lg font-medium">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {body}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
