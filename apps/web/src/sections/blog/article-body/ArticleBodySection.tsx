import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import type { BlogPost } from "@/constants/demo-content";
import { cn } from "@/lib/utils";

type ArticleBodySectionProps = {
  className?: string;
  post: BlogPost;
};

function ArticleBodySection({ className, post }: ArticleBodySectionProps) {
  const paragraphs = post.body ?? [];

  return (
    <section
      data-slot="article-body-section"
      className={cn("bg-brand-white px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-3xl">
          <div className="prose-pawpair space-y-6">
            {paragraphs.map((paragraph, index) => (
              <div key={`${post.slug}-${paragraph.slice(0, 48)}`}>
                <p className="text-base leading-relaxed text-brand-ink-700 md:text-lg">
                  {paragraph}
                </p>

                {index === 0 ? (
                  <blockquote className="my-10 border-l-4 border-brand-coral pl-6">
                    <p className="font-display text-2xl leading-snug font-semibold text-brand-deep-ink md:text-3xl">
                      Compatibility cues like energy level and play style help you choose the right
                      companion before you arrive.
                    </p>
                  </blockquote>
                ) : null}
              </div>
            ))}

            {paragraphs.length === 0 ? (
              <p className="text-base leading-relaxed text-brand-ink-500">{post.excerpt}</p>
            ) : null}

            <aside className="mt-10 rounded-[28px] border border-brand-mint/40 bg-brand-mint/10 p-6">
              <p className="text-sm font-medium tracking-wide text-brand-deep-ink uppercase">
                Safety note
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink-700 md:text-base">
                Always meet in public spaces, keep first sessions short, and pause if either pet
                shows stress signals.
              </p>
            </aside>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { ArticleBodySection };
