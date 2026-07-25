import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
import { ArticleListSection } from "@/sections/blog/article-list/ArticleListSection";
import { FeaturedArticleSection } from "@/sections/blog/featured-article/FeaturedArticleSection";
import { BlogFiltersSection } from "@/sections/blog/filters/BlogFiltersSection";
import { BlogHeroSection } from "@/sections/blog/hero/BlogHeroSection";
import { BlogNewsletterSection } from "@/sections/blog/newsletter/BlogNewsletterSection";

export const metadata: Metadata = {
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
};

export default function BlogPage() {
  return (
    <>
      <BlogHeroSection />
      <FeaturedArticleSection />
      <BlogFiltersSection />
      <ArticleListSection />
      <BlogNewsletterSection />
    </>
  );
}
