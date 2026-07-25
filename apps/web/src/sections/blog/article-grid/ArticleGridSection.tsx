import Link from "next/link";
import { Badge } from "@/components/badge/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card/Card";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { DEMO_BLOG_POSTS } from "@/constants/demo-content";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

type ArticleGridSectionProps = {
  className?: string;
};

function ArticleGridSection({ className }: ArticleGridSectionProps) {
  return (
    <section
      data-slot="article-grid-section"
      className={cn("bg-brand-white px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-12 max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Explore the archive
          </h2>
          <p className="mt-3 text-base text-brand-ink-500">
            Browse guides by topic—perfect for skimming on a walk break.
          </p>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_BLOG_POSTS.map((post, index) => (
            <ScrollReveal key={post.slug} delay={0.06 * (index + 1)}>
              <Card className="h-full overflow-hidden border-none bg-brand-warm-cream/60 shadow-none ring-1 ring-brand-ink-200/40 transition-shadow hover:shadow-md">
                <Link href={ROUTES.blogPost(post.slug)} className="group block h-full">
                  <SectionImage
                    src={post.image}
                    alt={post.title}
                    className="aspect-[16/10] rounded-none rounded-t-[calc(var(--radius)*2)]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <CardHeader>
                    <Badge className="w-fit bg-brand-coral/15 text-brand-coral">
                      {post.category}
                    </Badge>
                    <CardTitle className="font-display text-xl text-brand-deep-ink transition-colors group-hover:text-brand-coral">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-brand-ink-500">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-brand-ink-500">
                      {post.author.name}
                      <span className="mx-1.5">·</span>
                      {post.readingTime}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ArticleGridSection };
