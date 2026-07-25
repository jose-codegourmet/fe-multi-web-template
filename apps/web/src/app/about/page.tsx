import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
import { CommunityCommitmentSection } from "@/sections/about/community-commitment/CommunityCommitmentSection";
import { AboutFinalCtaSection } from "@/sections/about/final-cta/AboutFinalCtaSection";
import { AboutHeroSection } from "@/sections/about/hero/AboutHeroSection";
import { MissionVisionSection } from "@/sections/about/mission-vision/MissionVisionSection";
import { OriginStorySection } from "@/sections/about/origin-story/OriginStorySection";
import { TeamSection } from "@/sections/about/team/TeamSection";
import { ValuesSection } from "@/sections/about/values/ValuesSection";

export const metadata: Metadata = {
  title: PAGE_SEO.about.title,
  description: PAGE_SEO.about.description,
};

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <OriginStorySection />
      <MissionVisionSection />
      <ValuesSection />
      <TeamSection />
      <CommunityCommitmentSection />
      <AboutFinalCtaSection />
    </>
  );
}
