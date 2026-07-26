import { Badge, ScrollReveal } from "@fe-template/ui";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { fetchBlogPosts } from "@/hooks/use-blog-posts/server";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

type FeaturedArticleSectionProps = {
  className?: string;
};

async function FeaturedArticleSection({ className }: FeaturedArticleSectionProps) {
  const post = (await fetchBlogPosts())[0];

  if (!post) {
    return null;
  }

  return (
    <section
      data-slot="featured-article-section"
      className={cn("bg-brand-white px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <Link
            href={ROUTES.blogPost(post.slug)}
            className="group grid items-center gap-10 lg:grid-cols-2 lg:gap-14"
          >
            <SectionImage
              src={post.image}
              alt={post.title}
              className="aspect-[16/11] w-full transition-transform duration-500 group-hover:scale-[1.01]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <div className="flex flex-col gap-4">
              <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">
                Featured guide
              </p>
              <Badge className="w-fit bg-brand-coral/15 text-brand-coral">{post.category}</Badge>
              <h2 className="font-display text-3xl font-semibold text-brand-deep-ink transition-colors group-hover:text-brand-coral md:text-4xl">
                {post.title}
              </h2>
              <p className="text-base leading-relaxed text-brand-ink-500">{post.excerpt}</p>
              <p className="text-sm text-brand-ink-700">
                By {post.author.name}
                <span className="mx-2 text-brand-ink-200">·</span>
                {post.readingTime}
              </p>
              <span className="mt-2 inline-flex h-10 w-fit items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white group-hover:bg-brand-coral/90">
                Read article
              </span>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { FeaturedArticleSection };
