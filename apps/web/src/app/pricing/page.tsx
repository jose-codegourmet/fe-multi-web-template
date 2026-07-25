import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
import { pricingPlansQueryKey } from "@/hooks/use-pricing-plans/query";
import { fetchPricingPlans } from "@/hooks/use-pricing-plans/server";
import { PricingComparisonSection } from "@/sections/pricing/comparison/PricingComparisonSection";
import { PricingFaqSection } from "@/sections/pricing/faq/PricingFaqSection";
import { PricingFinalCtaSection } from "@/sections/pricing/final-cta/PricingFinalCtaSection";
import { PricingHeroSection } from "@/sections/pricing/hero/PricingHeroSection";
import { PricingPlansSection } from "@/sections/pricing/plans/PricingPlansSection";

export const metadata: Metadata = {
  title: PAGE_SEO.pricing.title,
  description: PAGE_SEO.pricing.description,
};

export default async function PricingPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: pricingPlansQueryKey.list(),
    queryFn: fetchPricingPlans,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PricingHeroSection />
      <PricingPlansSection />
      <PricingComparisonSection />
      <PricingFaqSection />
      <PricingFinalCtaSection />
    </HydrationBoundary>
  );
}
