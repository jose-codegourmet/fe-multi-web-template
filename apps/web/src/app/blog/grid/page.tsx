import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
import { ArticleGridSection } from "@/sections/blog/article-grid/ArticleGridSection";
import { BlogFiltersSection } from "@/sections/blog/filters/BlogFiltersSection";
import { BlogHeroSection } from "@/sections/blog/hero/BlogHeroSection";
import { BlogNewsletterSection } from "@/sections/blog/newsletter/BlogNewsletterSection";

export const metadata: Metadata = {
  title: PAGE_SEO.blogGrid.title,
  description: PAGE_SEO.blogGrid.description,
};

export const dynamic = "force-dynamic";

export default function BlogGridPage() {
  return (
    <>
      <BlogHeroSection />
      <BlogFiltersSection />
      <ArticleGridSection />
      <BlogNewsletterSection />
    </>
  );
}
