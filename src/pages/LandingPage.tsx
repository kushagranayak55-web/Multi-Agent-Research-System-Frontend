import { AgentShowcase } from "@/features/landing/AgentShowcase";
import { CtaSection } from "@/features/landing/CtaSection";
import { Hero } from "@/features/landing/Hero";
import { HowItWorks } from "@/features/landing/HowItWorks";
import { WhyMultiAgent } from "@/features/landing/WhyMultiAgent";

export function LandingPage() {
  return (
    <>
      <Hero />
      <AgentShowcase />
      <HowItWorks />
      <WhyMultiAgent />
      <CtaSection />
    </>
  );
}
