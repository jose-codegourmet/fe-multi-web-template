import Link from "next/link";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

type NotFoundHeroSectionProps = {
  className?: string;
};

function NotFoundHeroSection({ className }: NotFoundHeroSectionProps) {
  return (
    <section
      data-slot="not-found-hero-section"
      className={cn(
        "relative overflow-hidden bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,107,107,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(167,139,250,0.14),_transparent_50%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal className="flex flex-col gap-6">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">
            404 — This trail went cold
          </p>
          <h1 className="font-display text-4xl leading-tight font-semibold text-brand-deep-ink md:text-5xl">
            We sniffed everywhere. This page is gone.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-brand-ink-500 md:text-lg">
            The link may have moved, or someone buried it in the backyard.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={ROUTES.home}
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white hover:bg-brand-coral/90"
            >
              Return home
            </Link>
            <Link
              href={ROUTES.blog}
              className="inline-flex h-10 items-center justify-center rounded-full border border-brand-ink-200 bg-brand-white px-5 text-sm font-medium text-brand-deep-ink hover:bg-brand-cream-200"
            >
              Browse the blog
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <SectionImage
            src="/images/illustrations/pawpair-404.png"
            alt="Curious pet looking for a missing page on a dotted paw trail"
            objectFit="contain"
            priority
            className="aspect-square w-full bg-transparent"
            imageClassName="object-contain p-4 md:p-8"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

export { NotFoundHeroSection };
