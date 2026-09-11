import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
import { blogPostsQueryKey } from "@/hooks/use-blog-posts/query";
import { fetchBlogPosts } from "@/hooks/use-blog-posts/server";
import { pricingPlansQueryKey } from "@/hooks/use-pricing-plans/query";
import { fetchPricingPlans } from "@/hooks/use-pricing-plans/server";
import { testimonialsQueryKey } from "@/hooks/use-testimonials/query";
import { fetchTestimonials } from "@/hooks/use-testimonials/server";
import { AnnouncementSection } from "@/sections/home/announcement/AnnouncementSection";
import { BlogPreviewSection } from "@/sections/home/blog-preview/BlogPreviewSection";
import { CompatibilityFeaturesSection } from "@/sections/home/compatibility-features/CompatibilityFeaturesSection";
import { FinalCtaSection } from "@/sections/home/final-cta/FinalCtaSection";
import { HeroSection } from "@/sections/home/hero/HeroSection";
import { HowItWorksSection } from "@/sections/home/how-it-works/HowItWorksSection";
import { PricingPreviewSection } from "@/sections/home/pricing-preview/PricingPreviewSection";
import { ProductPreviewSection } from "@/sections/home/product-preview/ProductPreviewSection";
import { SafetySection } from "@/sections/home/safety/SafetySection";
import { SocialProofSection } from "@/sections/home/social-proof/SocialProofSection";
import { TestimonialsSection } from "@/sections/home/testimonials/TestimonialsSection";
import { UseCasesSection } from "@/sections/home/use-cases/UseCasesSection";

export const metadata: Metadata = {
  title: PAGE_SEO.home.title,
  description: PAGE_SEO.home.description,
};

export const revalidate = 60;

export default async function HomePage() {
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: blogPostsQueryKey.list(),
      queryFn: fetchBlogPosts,
    }),
    queryClient.prefetchQuery({
      queryKey: pricingPlansQueryKey.list(),
      queryFn: fetchPricingPlans,
    }),
    queryClient.prefetchQuery({
      queryKey: testimonialsQueryKey.list(),
      queryFn: fetchTestimonials,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AnnouncementSection />
      <HeroSection />
      <SocialProofSection />
      <HowItWorksSection />
      <CompatibilityFeaturesSection />
      <ProductPreviewSection />
      <SafetySection />
      <UseCasesSection />
      <TestimonialsSection />
      <PricingPreviewSection />
      <BlogPreviewSection />
      <FinalCtaSection />
    </HydrationBoundary>
  );
}
