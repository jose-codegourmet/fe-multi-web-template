import { ScrollReveal } from "@fe-template/ui";
import Image from "next/image";
import { DEMO_PETS } from "@/constants/demo-content";
import { cn } from "@/lib/utils";

type SocialProofSectionProps = {
  className?: string;
};

const STATS = [
  { value: "4.9", label: "average community rating" },
  { value: "12,000+", label: "introductions started" },
  { value: "Hundreds", label: "of local walks planned" },
];

function SocialProofSection({ className }: SocialProofSectionProps) {
  const avatars = DEMO_PETS.slice(0, 5);

  return (
    <section
      data-slot="social-proof-section"
      className={cn("bg-brand-white px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="flex flex-col items-center gap-10 text-center">
          <div className="flex -space-x-3">
            {avatars.map((pet) => (
              <div
                key={pet.id}
                className="relative size-12 overflow-hidden rounded-full border-2 border-brand-white bg-brand-cream-200 shadow-sm md:size-14"
              >
                <Image src={pet.image} alt={pet.name} fill sizes="56px" className="object-cover" />
              </div>
            ))}
          </div>

          <h2 className="font-display max-w-2xl text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            More good walks. Fewer awkward park introductions.
          </h2>

          <dl className="grid w-full gap-8 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <dt className="font-display text-3xl font-semibold text-brand-coral md:text-4xl">
                  {stat.value}
                </dt>
                <dd className="text-sm text-brand-ink-500 md:text-base">{stat.label}</dd>
              </div>
            ))}
          </dl>

          <p className="text-xs text-brand-ink-500/80">
            Demo metrics for showcase purposes — not verified real-world data.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { SocialProofSection };
