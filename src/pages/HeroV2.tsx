import {
  CalendarCheck,
  ChevronDown,
  FileText,
  Landmark,
  Package,
  Receipt,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const NAV_ITEMS = [
  { label: "Features", hasDropdown: true },
  { label: "Use Cases", hasDropdown: false },
  { label: "Pricing", hasDropdown: false },
  { label: "Learn", hasDropdown: true },
] as const;

/**
 * The marquee carries the everyday processes AiYo handles rather than customer
 * logos — see the note in the handoff about why.
 */
const USE_CASES: { label: string; icon: LucideIcon }[] = [
  { label: "Bank visit", icon: Landmark },
  { label: "Send parcel", icon: Package },
  { label: "Pay bills", icon: Receipt },
  { label: "Book appointment", icon: CalendarCheck },
  { label: "Renew documents", icon: FileText },
  { label: "Home repair", icon: Wrench },
];

function UseCaseChip({ label, icon: Icon }: { label: string; icon: LucideIcon }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <div className="liquid-glass flex h-6 w-6 items-center justify-center rounded-lg">
        <Icon className="h-3 w-3 text-foreground/90" strokeWidth={2.25} />
      </div>
      <span className="text-base font-semibold text-foreground">{label}</span>
    </div>
  );
}

/** The "Say it. Done." AiYo hero, kept for comparison at /hero-v2. */
export default function HeroV2() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <BackgroundVideo />

      <div className="relative z-10">
        <section className="relative flex min-h-screen flex-col overflow-visible">
          {/* Soft blurred mass sitting behind the hero copy. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[527px] w-[984px] -translate-x-1/2 -translate-y-1/2 bg-gray-950 opacity-90 blur-[82px]"
          />

          {/* ---------------------------------------------------------------
              Navbar
          --------------------------------------------------------------- */}
          <header className="relative z-10">
            <nav className="flex w-full flex-row items-center justify-between px-8 py-5">
              <a href="/" className="flex items-center">
                <img src={logo} alt="AiYo" className="h-8 w-auto" />
              </a>

              <div className="hidden items-center gap-8 md:flex">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    className="flex items-center gap-1 text-sm text-foreground/90 transition-colors duration-200 hover:text-foreground"
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    )}
                  </button>
                ))}
              </div>

              <Button variant="heroSecondary" className="rounded-full px-4 py-2">
                Get Started
              </Button>
            </nav>

            <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          </header>

          {/* ---------------------------------------------------------------
              Hero content
          --------------------------------------------------------------- */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="font-general-sans text-[220px] font-normal leading-[1.02] tracking-[-0.024em]">
                <span className="text-foreground">Say it. </span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)",
                  }}
                >
                  Done.
                </span>
              </h1>

              <p className="mt-[9px] max-w-md text-lg leading-8 text-hero-sub opacity-80">
                From a sentence to a plan
                <br />
                with prep, steps and reminders.
              </p>

              <Button
                variant="heroSecondary"
                className="mt-[25px] px-[29px] py-[24px]"
              >
                Start with a Sentence
              </Button>
            </div>
          </div>

          {/* ---------------------------------------------------------------
              Use-case marquee
          --------------------------------------------------------------- */}
          <div className="relative z-10 w-full px-8 pb-10">
            <div className="mx-auto flex max-w-5xl items-center gap-12">
              <p className="w-[150px] shrink-0 text-sm leading-6 text-foreground/50">
                Works for the
                <br />
                things you actually do
              </p>

              <div className="relative flex-1 overflow-hidden">
                <div className="flex w-max animate-marquee">
                  {[0, 1].map((group) => (
                    <div key={group} className="flex shrink-0 gap-16 pr-16">
                      {USE_CASES.map((useCase) => (
                        <UseCaseChip
                          key={`${group}-${useCase.label}`}
                          {...useCase}
                        />
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
