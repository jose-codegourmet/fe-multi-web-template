"use client";

import {
  Badge,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollReveal,
} from "@fe-template/ui";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useBlogPosts } from "@/hooks/use-blog-posts/client";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

type BlogPreviewSectionProps = {
  className?: string;
};

function BlogPreviewSection({ className }: BlogPreviewSectionProps) {
  const { data: posts = [] } = useBlogPosts();
  const previewPosts = posts.slice(0, 3);

  return (
    <section
      data-slot="blog-preview-section"
      className={cn("bg-brand-white px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-display max-w-2xl text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Better introductions start with better information.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {previewPosts.map((post, index) => (
            <ScrollReveal key={post.slug} delay={0.1 * (index + 1)}>
              <Link
                href={ROUTES.blogPost(post.slug)}
                className="group block h-full focus-visible:outline-none"
              >
                <Card className="h-full overflow-hidden border-none bg-brand-warm-cream ring-transparent transition-shadow group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-brand-coral">
                  <SectionImage
                    src={post.image}
                    alt=""
                    className="aspect-[16/10] rounded-none rounded-t-xl"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    imageClassName="transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <CardHeader>
                    <Badge
                      variant="secondary"
                      className="mb-1 w-fit bg-brand-lavender/20 text-brand-deep-ink"
                    >
                      {post.category}
                    </Badge>
                    <CardTitle className="font-display text-lg leading-snug text-brand-deep-ink group-hover:text-brand-coral">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-brand-ink-500">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-brand-ink-500">
                      {post.readingTime} · {post.publishedAt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.25} className="mt-10 flex justify-center">
          <Link
            href={ROUTES.blog}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 rounded-xl border-brand-ink-200 px-5 text-brand-deep-ink hover:bg-brand-cream-200",
            )}
          >
            Explore the blog
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { BlogPreviewSection };
