import { ScrollReveal } from "@fe-template/ui";
import Link from "next/link";
import type { PlaceholderPageCopy } from "@/constants/placeholder-pages";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type PlaceholderHeroSectionProps = PlaceholderPageCopy & {
  className?: string;
};

function PlaceholderHeroSection({
  eyebrow,
  title,
  description,
  body,
  primaryCta,
  className,
}: PlaceholderHeroSectionProps) {
  return (
    <section
      data-slot="placeholder-hero-section"
      className={cn(
        "relative overflow-hidden bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,107,107,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(167,139,250,0.14),_transparent_50%)]"
      />

      <div className="relative mx-auto max-w-3xl">
        <ScrollReveal className="flex flex-col gap-6">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">{eyebrow}</p>
          <h1 className="font-display text-4xl leading-tight font-semibold text-brand-deep-ink md:text-5xl">
            {title}
          </h1>
          <p className="text-base leading-relaxed text-brand-ink-500 md:text-lg">{description}</p>
          <p className="text-base leading-relaxed text-brand-ink-500">{body}</p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={primaryCta.href}
              className="inline-flex h-10 items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white hover:bg-brand-coral/90"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={ROUTES.home}
              className="inline-flex h-10 items-center justify-center rounded-full border border-brand-ink-200 bg-brand-white px-5 text-sm font-medium text-brand-deep-ink hover:bg-brand-cream-200"
            >
              Return home
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { PlaceholderHeroSection };
