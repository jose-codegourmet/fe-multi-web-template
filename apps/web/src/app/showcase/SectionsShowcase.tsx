import type { ReactNode } from "react";
import { fetchBlogPosts } from "@/hooks/use-blog-posts/server";
import { CommunityCommitmentSection } from "@/sections/about/community-commitment/CommunityCommitmentSection";
import { AboutFinalCtaSection } from "@/sections/about/final-cta/AboutFinalCtaSection";
import { AboutHeroSection } from "@/sections/about/hero/AboutHeroSection";
import { MissionVisionSection } from "@/sections/about/mission-vision/MissionVisionSection";
import { OriginStorySection } from "@/sections/about/origin-story/OriginStorySection";
import { TeamSection } from "@/sections/about/team/TeamSection";
import { ValuesSection } from "@/sections/about/values/ValuesSection";
import { ArticleBodySection } from "@/sections/blog/article-body/ArticleBodySection";
import { ArticleGridSection } from "@/sections/blog/article-grid/ArticleGridSection";
import { ArticleHeaderSection } from "@/sections/blog/article-header/ArticleHeaderSection";
import { ArticleListSection } from "@/sections/blog/article-list/ArticleListSection";
import { FeaturedArticleSection } from "@/sections/blog/featured-article/FeaturedArticleSection";
import { BlogFiltersSection } from "@/sections/blog/filters/BlogFiltersSection";
import { BlogHeroSection } from "@/sections/blog/hero/BlogHeroSection";
import { BlogNewsletterSection } from "@/sections/blog/newsletter/BlogNewsletterSection";
import { RelatedPostsSection } from "@/sections/blog/related-posts/RelatedPostsSection";
import { ContactFormSection } from "@/sections/contact/contact-form/ContactFormSection";
import { ContactOptionsSection } from "@/sections/contact/contact-options/ContactOptionsSection";
import { ContactFaqPreviewSection } from "@/sections/contact/faq-preview/ContactFaqPreviewSection";
import { ContactFinalCtaSection } from "@/sections/contact/final-cta/ContactFinalCtaSection";
import { ContactHeroSection } from "@/sections/contact/hero/ContactHeroSection";
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
import { NotFoundHeroSection } from "@/sections/not-found/hero/NotFoundHeroSection";
import { OtpVerifySection } from "@/sections/otp/OtpVerifySection";
import { PricingComparisonSection } from "@/sections/pricing/comparison/PricingComparisonSection";
import { PricingFaqSection } from "@/sections/pricing/faq/PricingFaqSection";
import { PricingFinalCtaSection } from "@/sections/pricing/final-cta/PricingFinalCtaSection";
import { PricingHeroSection } from "@/sections/pricing/hero/PricingHeroSection";
import { PricingPlansSection } from "@/sections/pricing/plans/PricingPlansSection";

function SectionPreview({
  path,
  label,
  children,
}: {
  path: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/60 px-4 py-2.5">
        <span className="font-mono text-[0.7rem] text-muted-foreground">@/{path}</span>
        <span className="text-xs font-medium text-foreground">{label}</span>
      </div>
      <div className="overflow-hidden">{children}</div>
    </div>
  );
}

function SectionGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <div className="space-y-10">{children}</div>
    </div>
  );
}

async function SectionsShowcase() {
  const demoPost = (await fetchBlogPosts())[0];

  if (!demoPost) {
    return null;
  }

  return (
    <div className="space-y-16">
      <SectionGroup title="Home">
        <SectionPreview path="sections/home/announcement" label="Announcement">
          <AnnouncementSection />
        </SectionPreview>
        <SectionPreview path="sections/home/hero" label="Hero">
          <HeroSection />
        </SectionPreview>
        <SectionPreview path="sections/home/social-proof" label="Social Proof">
          <SocialProofSection />
        </SectionPreview>
        <SectionPreview path="sections/home/how-it-works" label="How It Works">
          <HowItWorksSection />
        </SectionPreview>
        <SectionPreview path="sections/home/compatibility-features" label="Compatibility Features">
          <CompatibilityFeaturesSection />
        </SectionPreview>
        <SectionPreview path="sections/home/product-preview" label="Product Preview">
          <ProductPreviewSection />
        </SectionPreview>
        <SectionPreview path="sections/home/safety" label="Safety">
          <SafetySection />
        </SectionPreview>
        <SectionPreview path="sections/home/use-cases" label="Use Cases">
          <UseCasesSection />
        </SectionPreview>
        <SectionPreview path="sections/home/testimonials" label="Testimonials">
          <TestimonialsSection />
        </SectionPreview>
        <SectionPreview path="sections/home/pricing-preview" label="Pricing Preview">
          <PricingPreviewSection />
        </SectionPreview>
        <SectionPreview path="sections/home/blog-preview" label="Blog Preview">
          <BlogPreviewSection />
        </SectionPreview>
        <SectionPreview path="sections/home/final-cta" label="Final CTA">
          <FinalCtaSection />
        </SectionPreview>
      </SectionGroup>

      <SectionGroup title="About">
        <SectionPreview path="sections/about/hero" label="Hero">
          <AboutHeroSection />
        </SectionPreview>
        <SectionPreview path="sections/about/mission-vision" label="Mission & Vision">
          <MissionVisionSection />
        </SectionPreview>
        <SectionPreview path="sections/about/origin-story" label="Origin Story">
          <OriginStorySection />
        </SectionPreview>
        <SectionPreview path="sections/about/values" label="Values">
          <ValuesSection />
        </SectionPreview>
        <SectionPreview path="sections/about/team" label="Team">
          <TeamSection />
        </SectionPreview>
        <SectionPreview path="sections/about/community-commitment" label="Community Commitment">
          <CommunityCommitmentSection />
        </SectionPreview>
        <SectionPreview path="sections/about/final-cta" label="Final CTA">
          <AboutFinalCtaSection />
        </SectionPreview>
      </SectionGroup>

      <SectionGroup title="Pricing">
        <SectionPreview path="sections/pricing/hero" label="Hero">
          <PricingHeroSection />
        </SectionPreview>
        <SectionPreview path="sections/pricing/plans" label="Plans">
          <PricingPlansSection />
        </SectionPreview>
        <SectionPreview path="sections/pricing/comparison" label="Comparison">
          <PricingComparisonSection />
        </SectionPreview>
        <SectionPreview path="sections/pricing/faq" label="FAQ">
          <PricingFaqSection />
        </SectionPreview>
        <SectionPreview path="sections/pricing/final-cta" label="Final CTA">
          <PricingFinalCtaSection />
        </SectionPreview>
      </SectionGroup>

      <SectionGroup title="Blog">
        <SectionPreview path="sections/blog/hero" label="Hero">
          <BlogHeroSection />
        </SectionPreview>
        <SectionPreview path="sections/blog/featured-article" label="Featured Article">
          <FeaturedArticleSection />
        </SectionPreview>
        <SectionPreview path="sections/blog/article-list" label="Article List">
          <ArticleListSection />
        </SectionPreview>
        <SectionPreview path="sections/blog/article-grid" label="Article Grid">
          <ArticleGridSection />
        </SectionPreview>
        <SectionPreview path="sections/blog/filters" label="Filters">
          <BlogFiltersSection />
        </SectionPreview>
        <SectionPreview path="sections/blog/newsletter" label="Newsletter">
          <BlogNewsletterSection />
        </SectionPreview>
        <SectionPreview path="sections/blog/related-posts" label="Related Posts">
          <RelatedPostsSection currentSlug={demoPost.slug} />
        </SectionPreview>
        <SectionPreview path="sections/blog/article-header" label="Article Header">
          <ArticleHeaderSection post={demoPost} />
        </SectionPreview>
        <SectionPreview path="sections/blog/article-body" label="Article Body">
          <ArticleBodySection post={demoPost} />
        </SectionPreview>
      </SectionGroup>

      <SectionGroup title="Contact">
        <SectionPreview path="sections/contact/hero" label="Hero">
          <ContactHeroSection />
        </SectionPreview>
        <SectionPreview path="sections/contact/contact-form" label="Contact Form">
          <ContactFormSection />
        </SectionPreview>
        <SectionPreview path="sections/contact/contact-options" label="Contact Options">
          <ContactOptionsSection />
        </SectionPreview>
        <SectionPreview path="sections/contact/faq-preview" label="FAQ Preview">
          <ContactFaqPreviewSection />
        </SectionPreview>
        <SectionPreview path="sections/contact/final-cta" label="Final CTA">
          <ContactFinalCtaSection />
        </SectionPreview>
      </SectionGroup>

      <SectionGroup title="Not Found">
        <SectionPreview path="sections/not-found/hero" label="Hero">
          <NotFoundHeroSection />
        </SectionPreview>
      </SectionGroup>

      <SectionGroup title="OTP">
        <SectionPreview path="sections/otp" label="OTP Verify">
          <OtpVerifySection />
        </SectionPreview>
      </SectionGroup>
    </div>
  );
}

export { SectionsShowcase };
