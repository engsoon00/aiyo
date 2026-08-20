import { GetStartedDialog } from "@/components/GetStartedDialog";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="section-y">
      <div className="mx-auto w-full max-w-content px-5 md:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 text-center md:px-12 md:py-20">
          {/* Same blurred mass as the hero, at a quarter of the intensity. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[280px] w-[min(700px,110%)] -translate-x-1/2 -translate-y-1/2 bg-purple-500/10 blur-[90px]"
          />

          <div className="relative">
            <h2 className="font-general-sans text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em]">
              Ready to <span className="text-gradient-brand">get things done</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-7 text-hero-sub/85 md:text-base">
              Tell AiYo what you need to do and start with a clearer plan.
            </p>

            <div className="mt-8 flex justify-center">
              <GetStartedDialog>
                <Button variant="heroPrimary" size="lg" className="px-8">
                  Get Started
                </Button>
              </GetStartedDialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
