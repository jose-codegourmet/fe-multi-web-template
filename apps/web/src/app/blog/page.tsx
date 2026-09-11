import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PAGE_SEO } from "@/constants/seo";
import { blogPostsQueryKey } from "@/hooks/use-blog-posts/query";
import { fetchBlogPosts } from "@/hooks/use-blog-posts/server";
import { ArticleListSection } from "@/sections/blog/article-list/ArticleListSection";
import { FeaturedArticleSection } from "@/sections/blog/featured-article/FeaturedArticleSection";
import { BlogFiltersSection } from "@/sections/blog/filters/BlogFiltersSection";
import { BlogHeroSection } from "@/sections/blog/hero/BlogHeroSection";
import { BlogNewsletterSection } from "@/sections/blog/newsletter/BlogNewsletterSection";

export const metadata: Metadata = {
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
};

export const revalidate = 60;

export default async function BlogPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: blogPostsQueryKey.list(),
    queryFn: fetchBlogPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogHeroSection />
      <FeaturedArticleSection />
      <Suspense>
        <BlogFiltersSection />
        <ArticleListSection />
      </Suspense>
      <BlogNewsletterSection />
    </HydrationBoundary>
  );
}
