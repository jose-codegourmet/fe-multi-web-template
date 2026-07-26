import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
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

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
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
    </>
  );
}
