import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
import { NotFoundHeroSection } from "@/sections/not-found/hero/NotFoundHeroSection";

export const metadata: Metadata = {
  title: PAGE_SEO.notFound.title,
  description: PAGE_SEO.notFound.description,
};

export default function NotFoundPage() {
  return <NotFoundHeroSection />;
}
