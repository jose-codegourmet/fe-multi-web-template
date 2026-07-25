import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/badge/Badge";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import type { BlogPost } from "@/constants/demo-content";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

type ArticleHeaderSectionProps = {
  className?: string;
  post: BlogPost;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ArticleHeaderSection({ className, post }: ArticleHeaderSectionProps) {
  return (
    <section
      data-slot="article-header-section"
      className={cn("bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-brand-ink-500">
              <li>
                <Link href={ROUTES.home} className="hover:text-brand-coral">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-brand-ink-200">
                /
              </li>
              <li>
                <Link href={ROUTES.blog} className="hover:text-brand-coral">
                  Blog
                </Link>
              </li>
              <li aria-hidden className="text-brand-ink-200">
                /
              </li>
              <li className="truncate text-brand-deep-ink" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          <Badge className="bg-brand-coral/15 text-brand-coral">{post.category}</Badge>

          <h1 className="font-display mt-4 text-4xl leading-tight font-semibold text-brand-deep-ink md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-brand-ink-500">{post.excerpt}</p>

          <div className="mt-8 flex items-center gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-brand-cream-200">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                sizes="48px"
                className="object-contain p-2"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-deep-ink">{post.author.name}</p>
              <p className="text-xs text-brand-ink-500">
                {post.author.role}
                <span className="mx-1.5">·</span>
                {formatDate(post.publishedAt)}
                <span className="mx-1.5">·</span>
                {post.readingTime} read
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mx-auto mt-12 max-w-4xl">
          <SectionImage
            src={post.image}
            alt={post.title}
            priority
            className="aspect-[16/9] w-full"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

export { ArticleHeaderSection };
