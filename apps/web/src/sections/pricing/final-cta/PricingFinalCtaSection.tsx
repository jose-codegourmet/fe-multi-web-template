import Link from "next/link";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

const headline = "One good match can change the whole week.";
const supporting =
  "Start with a free profile. Upgrade only when you need more discovery and community tools.";
const primaryCtaLabel = "Create a free profile";
const primaryCtaHref = ROUTES.createProfile;
const secondaryCtaLabel = "View plans";
const secondaryCtaHref = "#plans";
const imageSrc = "/images/community/final-cta-happy-match.jpg";
const imageAlt = "Two pet parents and their dogs celebrating a successful match outdoors.";

type PricingFinalCtaSectionProps = {
  className?: string;
};

function PricingFinalCtaSection({ className }: PricingFinalCtaSectionProps) {
  return (
    <section
      data-slot="pricing-final-cta-section"
      className={cn(
        "relative overflow-hidden bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,107,107,0.16),_transparent_55%),radial-gradient(ellipse_at_top_right,_rgba(114,230,193,0.18),_transparent_50%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <ScrollReveal className="text-center lg:text-left">
          <h2 className="font-display text-3xl leading-tight font-semibold text-brand-deep-ink md:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-ink-500 md:text-lg">
            {supporting}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link
              href={primaryCtaHref}
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white hover:bg-brand-coral/90"
            >
              {primaryCtaLabel}
            </Link>
            <Link
              href={secondaryCtaHref}
              className="inline-flex h-10 items-center justify-center rounded-full border border-brand-ink-200 bg-brand-white px-5 text-sm font-medium text-brand-deep-ink hover:bg-brand-cream-200"
            >
              {secondaryCtaLabel}
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15} direction="left">
          <SectionImage
            src={imageSrc}
            alt={imageAlt}
            className="aspect-[4/5] w-full md:aspect-[3/2]"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

export { PricingFinalCtaSection };
