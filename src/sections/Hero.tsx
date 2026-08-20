import { ArrowRight } from "lucide-react";

import { BackgroundVideo } from "@/components/BackgroundVideo";
import { GetStartedDialog } from "@/components/GetStartedDialog";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { TEMPLATES } from "@/lib/templates";

/** The marquee carries the processes AiYo handles — not invented customer logos. */
const MARQUEE = TEMPLATES.map((t) => ({
  label: t.title,
  icon: CATEGORIES[t.category].icon,
}));

export function Hero() {
  return (
    <div className="relative w-full overflow-hidden bg-background">
      <BackgroundVideo />

      <div className="relative z-10">
        <section className="relative flex min-h-[100svh] flex-col overflow-visible">
          {/* Soft blurred mass keeping the copy legible over bright frames.
              Sized in vw so it still covers the headline on narrow screens. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[527px] w-[min(984px,120vw)] -translate-x-1/2 -translate-y-1/2 bg-gray-950 opacity-90 blur-[82px]"
          />

          <SiteHeader />

          <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-16 md:px-8">
            <div className="flex max-w-4xl flex-col items-center text-center">
              <h1 className="font-general-sans text-[clamp(2.25rem,6.4vw,5rem)] font-normal leading-[1.06] tracking-[-0.024em]">
                <span className="text-foreground">Tell AiYo what you need to </span>
                <span className="text-gradient-brand">get done</span>
                <span className="text-foreground">.</span>
              </h1>

              <p className="mt-5 max-w-xl text-[15px] leading-7 text-hero-sub opacity-85 md:text-lg md:leading-8">
                AiYo turns everyday errands into simple steps, preparation lists,
                and reminders — so you know exactly what to do next.
              </p>

              <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                <GetStartedDialog>
                  <Button variant="heroPrimary" size="lg" className="px-7">
                    Get Started
                  </Button>
                </GetStartedDialog>

                <Button
                  variant="heroSecondary"
                  size="lg"
                  className="px-7"
                  asChild
                >
                  <a href="#how-it-works">
                    See How It Works
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative z-10 w-full px-5 pb-10 md:px-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 sm:flex-row sm:items-center sm:gap-12">
              <p className="shrink-0 text-sm leading-6 text-foreground/50 sm:w-[150px]">
                Works for the
                <br className="hidden sm:block" />{" "}
                things you actually do
              </p>

              <div className="relative flex-1 overflow-hidden">
                <div className="flex w-max animate-marquee">
                  {[0, 1].map((group) => (
                    <div key={group} className="flex shrink-0 gap-10 pr-10 md:gap-16 md:pr-16">
                      {MARQUEE.map(({ label, icon: Icon }) => (
                        <div
                          key={`${group}-${label}`}
                          className="flex shrink-0 items-center gap-3"
                        >
                          <div className="liquid-glass flex h-6 w-6 items-center justify-center rounded-lg">
                            <Icon
                              className="h-3 w-3 text-foreground/90"
                              strokeWidth={2.25}
                            />
                          </div>
                          <span className="whitespace-nowrap text-base font-semibold text-foreground">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
