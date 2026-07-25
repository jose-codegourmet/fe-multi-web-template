import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEMO_BLOG_POSTS } from "@/constants/demo-content";
import { DEFAULT_SEO } from "@/constants/seo";
import { ArticleBodySection } from "@/sections/blog/article-body/ArticleBodySection";
import { ArticleHeaderSection } from "@/sections/blog/article-header/ArticleHeaderSection";
import { BlogNewsletterSection } from "@/sections/blog/newsletter/BlogNewsletterSection";
import { RelatedPostsSection } from "@/sections/blog/related-posts/RelatedPostsSection";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return DEMO_BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = DEMO_BLOG_POSTS.find((item) => item.slug === slug);

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
  const post = DEMO_BLOG_POSTS.find((item) => item.slug === slug);

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
