import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_SEO } from "@/constants/seo";
import { fetchBlogPosts } from "@/hooks/use-blog-posts/server";
import { ArticleBodySection } from "@/sections/blog/article-body/ArticleBodySection";
import { ArticleHeaderSection } from "@/sections/blog/article-header/ArticleHeaderSection";
import { BlogNewsletterSection } from "@/sections/blog/newsletter/BlogNewsletterSection";
import { RelatedPostsSection } from "@/sections/blog/related-posts/RelatedPostsSection";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const posts = await fetchBlogPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return {
      title: DEFAULT_SEO.title,
      description: DEFAULT_SEO.description,
    };
  }

  return {
    title: `${post.title} | PawPair Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const posts = await fetchBlogPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <ArticleHeaderSection post={post} />
      <ArticleBodySection post={post} />
      <RelatedPostsSection currentSlug={post.slug} />
      <BlogNewsletterSection />
    </>
  );
}
