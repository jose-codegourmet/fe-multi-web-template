import Link from "next/link";
import { Badge } from "@/components/badge/Badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/card/Card";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { DEMO_BLOG_POSTS } from "@/constants/demo-content";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

type RelatedPostsSectionProps = {
  className?: string;
  currentSlug: string;
};

function RelatedPostsSection({ className, currentSlug }: RelatedPostsSectionProps) {
  const related = DEMO_BLOG_POSTS.filter((post) => post.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section
      data-slot="related-posts-section"
      className={cn("bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Keep reading
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((post, index) => (
            <ScrollReveal key={post.slug} delay={0.08 * (index + 1)}>
              <Card className="h-full overflow-hidden border-none bg-brand-white shadow-none ring-1 ring-brand-ink-200/40">
                <Link href={ROUTES.blogPost(post.slug)} className="group block h-full">
                  <SectionImage
                    src={post.image}
                    alt={post.title}
                    className="aspect-[16/10] rounded-none"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <CardHeader>
                    <Badge className="w-fit bg-brand-coral/15 text-brand-coral">
                      {post.category}
                    </Badge>
                    <CardTitle className="font-display text-lg text-brand-deep-ink transition-colors group-hover:text-brand-coral">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-brand-ink-500">{post.excerpt}</CardDescription>
                  </CardHeader>
                </Link>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { RelatedPostsSection };
