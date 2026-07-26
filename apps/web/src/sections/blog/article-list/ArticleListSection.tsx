"use client";

import { Badge, ScrollReveal } from "@fe-template/ui";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { useBlogPosts } from "@/hooks/use-blog-posts/client";
import { cn } from "@/lib/utils";

type ArticleListSectionProps = {
  className?: string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ArticleListSection({ className }: ArticleListSectionProps) {
  const { data: posts = [] } = useBlogPosts();

  return (
    <section
      data-slot="article-list-section"
      className={cn("bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Latest from the pack
          </h2>
        </ScrollReveal>

        <ul className="mt-10 divide-y divide-brand-ink-200/70 border-y border-brand-ink-200/70">
          {posts.map((post, index) => (
            <li key={post.slug}>
              <ScrollReveal delay={0.06 * (index + 1)}>
                <Link
                  href={ROUTES.blogPost(post.slug)}
                  className="group flex flex-col gap-3 py-8 transition-colors sm:flex-row sm:items-start sm:justify-between sm:gap-10"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge className="bg-brand-coral/15 text-brand-coral">{post.category}</Badge>
                      <span className="text-xs text-brand-ink-500">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-semibold text-brand-deep-ink transition-colors group-hover:text-brand-coral md:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-ink-500 md:text-base">
                      {post.excerpt || "Read the latest update from the PawPair team."}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-brand-coral group-hover:underline">
                    Read more
                  </span>
                </Link>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export { ArticleListSection };
