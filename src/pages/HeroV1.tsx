import { ChevronDown } from "lucide-react";

import { BackgroundVideo } from "@/components/BackgroundVideo";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const NAV_ITEMS = [
  { label: "Features", hasDropdown: true },
  { label: "Solutions", hasDropdown: false },
  { label: "Plans", hasDropdown: false },
  { label: "Learning", hasDropdown: true },
] as const;

const BRANDS = ["Vortex", "Nimbus", "Prysma", "Cirrus", "Kynder", "Halcyn"];

function BrandLogo({ name }: { name: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <div className="liquid-glass flex h-6 w-6 items-center justify-center rounded-lg">
        <span className="text-[11px] font-semibold leading-none text-foreground/90">
          {name.charAt(0)}
        </span>
      </div>
      <span className="text-base font-semibold text-foreground">{name}</span>
    </div>
  );
}

/** The original "Power AI" hero, kept for comparison at /hero-v1. */
export default function HeroV1() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <BackgroundVideo />

      <div className="relative z-10">
        <section className="relative flex min-h-screen flex-col overflow-visible">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[527px] w-[984px] -translate-x-1/2 -translate-y-1/2 bg-gray-950 opacity-90 blur-[82px]"
          />

          <header className="relative z-10">
            <nav className="flex w-full flex-row items-center justify-between px-8 py-5">
              <a href="/" className="flex items-center">
                <img src={logo} alt="Logo" className="h-8 w-auto" />
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
                Sign Up
              </Button>
            </nav>

            <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          </header>

          <div className="relative z-10 flex flex-1 items-center justify-center px-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="font-general-sans text-[220px] font-normal leading-[1.02] tracking-[-0.024em]">
                <span className="text-foreground">Power </span>
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(to left, #6366f1, #a855f7, #fcd34d)",
                  }}
                >
                  AI
                </span>
              </h1>

              <p className="mt-[9px] max-w-md text-lg leading-8 text-hero-sub opacity-80">
                The most powerful AI ever deployed
                <br />
                in talent acquisition
              </p>

              <Button
                variant="heroSecondary"
                className="mt-[25px] px-[29px] py-[24px]"
              >
                Schedule a Consult
              </Button>
            </div>
          </div>

          <div className="relative z-10 w-full px-8 pb-10">
            <div className="mx-auto flex max-w-5xl items-center gap-12">
              <p className="w-[150px] shrink-0 text-sm leading-6 text-foreground/50">
                Relied on by brands
                <br />
                across the globe
              </p>

              <div className="relative flex-1 overflow-hidden">
                <div className="flex w-max animate-marquee">
                  {[0, 1].map((group) => (
                    <div key={group} className="flex shrink-0 gap-16 pr-16">
                      {BRANDS.map((name) => (
                        <BrandLogo key={`${group}-${name}`} name={name} />
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
