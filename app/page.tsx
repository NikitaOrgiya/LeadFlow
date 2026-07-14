import { SiteShell } from "@/components/layout/site-shell";
import { LandingStateProvider } from "@/components/landing/landing-state";
import { Hero } from "@/components/landing/hero";
import { Services } from "@/components/landing/services";
import { Benefits } from "@/components/landing/benefits";
import { Process } from "@/components/landing/process";
import { Calculator } from "@/components/landing/calculator";
import { Faq } from "@/components/landing/faq";
import { LeadForm } from "@/components/landing/lead-form";

export default function HomePage() {
  return (
    <SiteShell>
      <LandingStateProvider>
        <Hero />
        <Services />
        <Benefits />
        <Process />
        <Calculator />
        <Faq />
        <LeadForm />
      </LandingStateProvider>
    </SiteShell>
  );
}
