import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
import { PricingComparisonSection } from "@/sections/pricing/comparison/PricingComparisonSection";
import { PricingFaqSection } from "@/sections/pricing/faq/PricingFaqSection";
import { PricingFinalCtaSection } from "@/sections/pricing/final-cta/PricingFinalCtaSection";
import { PricingHeroSection } from "@/sections/pricing/hero/PricingHeroSection";
import { PricingPlansSection } from "@/sections/pricing/plans/PricingPlansSection";

export const metadata: Metadata = {
  title: PAGE_SEO.pricing.title,
  description: PAGE_SEO.pricing.description,
};

export default function PricingPage() {
  return (
    <>
      <PricingHeroSection />
      <PricingPlansSection />
      <PricingComparisonSection />
      <PricingFaqSection />
      <PricingFinalCtaSection />
    </>
  );
}
