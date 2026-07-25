import Image from "next/image";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { DEMO_PETS } from "@/constants/demo-content";
import { cn } from "@/lib/utils";

const eyebrow = "Pricing";
const headline = "Start free. Upgrade when your pack needs more.";
const supporting =
  "Create a meaningful profile and find matches without paying. Paid plans unlock convenience, visibility, and community tools.";
const philosophy = "PawPair is for friendships and community—not a breeding marketplace.";

const featuredPets = DEMO_PETS.filter((pet) =>
  ["mochi", "luna", "atlas", "pepper"].includes(pet.id),
);

type PricingHeroSectionProps = {
  className?: string;
};

function PricingHeroSection({ className }: PricingHeroSectionProps) {
  return (
    <section
      data-slot="pricing-hero-section"
      className={cn(
        "relative overflow-hidden bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,107,107,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(167,139,250,0.14),_transparent_50%)]"
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <ScrollReveal className="mx-auto max-w-3xl">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl leading-tight font-semibold text-brand-deep-ink md:text-5xl">
            {headline}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-brand-ink-500 md:text-lg">
            {supporting}
          </p>
          <p className="mt-4 text-sm font-medium text-brand-ink-700 md:text-base">{philosophy}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.15} className="mt-10 flex justify-center">
          <ul className="flex items-center -space-x-3" aria-label="Featured pets">
            {featuredPets.map((pet) => (
              <li
                key={pet.id}
                className="relative size-14 overflow-hidden rounded-full ring-2 ring-brand-warm-cream md:size-16"
              >
                <Image src={pet.image} alt={pet.name} fill sizes="64px" className="object-cover" />
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { PricingHeroSection };
