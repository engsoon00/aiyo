import { SiteFooter } from "@/components/SiteFooter";
import { AiFeatures } from "@/sections/AiFeatures";
import { BeforeAfter } from "@/sections/BeforeAfter";
import { Differentiation } from "@/sections/Differentiation";
import { FinalCta } from "@/sections/FinalCta";
import { Hero } from "@/sections/Hero";
import { HowItWorks } from "@/sections/HowItWorks";
import { Pricing } from "@/sections/Pricing";
import { UseCases } from "@/sections/UseCases";
import { WhatIsAiYo } from "@/sections/WhatIsAiYo";
import { WhoIsItFor } from "@/sections/WhoIsItFor";

/** Section order follows §36. */
export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <WhatIsAiYo />
      <HowItWorks />
      <UseCases />
      <BeforeAfter />
      <Differentiation />
      <AiFeatures />
      <WhoIsItFor />
      <Pricing />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}
