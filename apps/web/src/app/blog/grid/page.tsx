import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PAGE_SEO } from "@/constants/seo";
import { blogPostsQueryKey } from "@/hooks/use-blog-posts/query";
import { fetchBlogPosts } from "@/hooks/use-blog-posts/server";
import { ArticleGridSection } from "@/sections/blog/article-grid/ArticleGridSection";
import { BlogFiltersSection } from "@/sections/blog/filters/BlogFiltersSection";
import { BlogHeroSection } from "@/sections/blog/hero/BlogHeroSection";
import { BlogNewsletterSection } from "@/sections/blog/newsletter/BlogNewsletterSection";

export const metadata: Metadata = {
  title: PAGE_SEO.blogGrid.title,
  description: PAGE_SEO.blogGrid.description,
};

export const dynamic = "force-dynamic";

export default async function BlogGridPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: blogPostsQueryKey.list(),
    queryFn: fetchBlogPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogHeroSection />
      <Suspense>
        <BlogFiltersSection />
        <ArticleGridSection />
      </Suspense>
      <BlogNewsletterSection />
    </HydrationBoundary>
  );
}
