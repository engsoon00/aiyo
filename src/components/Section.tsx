import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Centres the heading block. Defaults to left-aligned. */
  centered?: boolean;
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  centered,
}: SectionProps) {
  return (
    <section id={id} className={cn("section-y scroll-mt-20", className)}>
      <div className="mx-auto w-full max-w-content px-5 md:px-8">
        {(eyebrow || title || intro) && (
          <div className={cn("max-w-2xl", centered && "mx-auto text-center")}>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground/45">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 font-general-sans text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-[1.12] tracking-[-0.02em]">
                {title}
              </h2>
            )}
            {intro && (
              <p className="mt-4 text-[15px] leading-7 text-hero-sub/85 md:text-base">
                {intro}
              </p>
            )}
          </div>
        )}
        <div className={cn(eyebrow || title || intro ? "mt-10 md:mt-14" : "")}>
          {children}
        </div>
      </div>
    </section>
  );
}
