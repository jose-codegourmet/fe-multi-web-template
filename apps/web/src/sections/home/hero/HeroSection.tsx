import { Badge, buttonVariants, ScrollReveal } from "@fe-template/ui";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { showcasePets } from "@/lib/mock/pets";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

type HeroSectionProps = {
  className?: string;
};

const PROOF_POINTS = [
  "Free to create a profile",
  "Compatibility-based discovery",
  "Safety-first meetup tools",
];

const mochi = showcasePets[0];

function HeroSection({ className }: HeroSectionProps) {
  return (
    <section
      data-slot="hero-section"
      className={cn(
        "relative overflow-hidden bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(167,139,250,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(255,107,107,0.12),_transparent_50%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal className="flex flex-col gap-6">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">
            The social app for pets and their humans
          </p>

          <h1 className="font-display text-4xl leading-tight font-semibold text-brand-deep-ink md:text-5xl lg:text-[3.25rem]">
            Your pet&apos;s next best friend is closer than you think.
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-brand-ink-500 md:text-lg">
            Create a profile, discover compatible pets nearby, and plan safer playdates with humans
            you can trust.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={ROUTES.createProfile}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-xl bg-brand-coral px-5 text-white hover:bg-brand-coral/90",
              )}
            >
              Find a playmate
            </Link>
            <Link
              href={ROUTES.howItWorks}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 rounded-xl border-brand-ink-200 bg-brand-white px-5 text-brand-deep-ink hover:bg-brand-cream-200",
              )}
            >
              See how it works
            </Link>
          </div>

          <ul className="mt-2 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {PROOF_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-brand-ink-700">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-brand-mint" />
                {point}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.15} direction="left" className="relative">
          <SectionImage
            src="/images/hero/hero-pet-meetup.jpg"
            alt="Pets and their humans meeting for a playdate at the park"
            priority
            className="aspect-[4/5] w-full md:aspect-[5/6]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          <div className="absolute right-3 bottom-3 left-3 sm:right-auto sm:bottom-6 sm:left-6 sm:w-[min(100%,280px)]">
            <div className="rounded-[20px] border border-brand-ink-200/60 bg-brand-white/95 p-3 shadow-lg backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-2xl bg-brand-cream-200">
                  <Image
                    src={mochi.image}
                    alt={mochi.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-display text-base font-semibold text-brand-deep-ink">
                      {mochi.name}
                    </p>
                    {mochi.verified ? (
                      <Badge variant="secondary" className="bg-brand-mint/30 text-brand-deep-ink">
                        Verified
                      </Badge>
                    ) : null}
                  </div>
                  <p className="truncate text-xs text-brand-ink-500">
                    {mochi.breed} · {mochi.age} yrs · {mochi.distanceKm} km
                  </p>
                  <Badge className="mt-1.5 bg-brand-coral/15 text-brand-coral">
                    {mochi.compatibilityScore}% match
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { HeroSection };
