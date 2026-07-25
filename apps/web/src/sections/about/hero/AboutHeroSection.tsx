import { ScrollReveal } from "@fe-template/ui";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

const eyebrow = "Why PawPair exists";
const headline = "Pet friendship should not depend on a lucky park encounter.";
const body =
  "Every pet has a different comfort level, play style, and social rhythm. PawPair was imagined as a better way for pet parents to understand those differences and find companions who genuinely fit.";
const imageSrc = "/images/about/about-pawpair-community.jpg";
const imageAlt = "Pets and their humans gathering in a local park community";

type AboutHeroSectionProps = {
  className?: string;
};

function AboutHeroSection({ className }: AboutHeroSectionProps) {
  return (
    <section
      data-slot="about-hero-section"
      className={cn(
        "relative overflow-hidden bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,107,107,0.14),_transparent_50%),radial-gradient(ellipse_at_bottom_right,_rgba(167,139,250,0.16),_transparent_55%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal className="flex flex-col gap-5">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">{eyebrow}</p>
          <h1 className="font-display text-4xl leading-tight font-semibold text-brand-deep-ink md:text-5xl">
            {headline}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-brand-ink-500 md:text-lg">{body}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.15} direction="left">
          <SectionImage
            src={imageSrc}
            alt={imageAlt}
            priority
            className="aspect-[4/5] w-full md:aspect-[5/6]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

export { AboutHeroSection };
