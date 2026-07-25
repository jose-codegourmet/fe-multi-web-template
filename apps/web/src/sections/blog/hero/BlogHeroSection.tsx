import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { cn } from "@/lib/utils";

type BlogHeroSectionProps = {
  className?: string;
};

function BlogHeroSection({ className }: BlogHeroSectionProps) {
  return (
    <section
      data-slot="blog-hero-section"
      className={cn(
        "relative overflow-hidden bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(167,139,250,0.16),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(255,209,102,0.18),_transparent_50%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">
            PawPair Blog
          </p>
          <h1 className="font-display mt-4 text-4xl leading-tight font-semibold text-brand-deep-ink md:text-5xl">
            Guides for better playdates, walks, and local pet communities.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-brand-ink-500 md:text-lg">
            Practical stories and safety-minded tips for pet parents who want friendship without the
            guesswork.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { BlogHeroSection };
