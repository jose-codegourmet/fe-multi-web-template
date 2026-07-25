import { ScrollReveal } from "@fe-template/ui";
import { cn } from "@/lib/utils";

const eyebrow = "Community commitment";
const headline = "Standards we hold ourselves—and our community—to.";
const supporting =
  "PawPair is built for respectful, inclusive, and responsible pet socializing in real neighborhoods.";
const points = [
  "Respectful profile standards",
  "Inclusive treatment of pet types and breeds",
  "Responsible first-meet guidance",
  "Collaboration with trainers and shelters",
  "Clear reporting tools",
  "Accessible product design",
];

type CommunityCommitmentSectionProps = {
  className?: string;
};

function CommunityCommitmentSection({ className }: CommunityCommitmentSectionProps) {
  return (
    <section
      data-slot="community-commitment-section"
      className={cn("bg-background px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <ScrollReveal>
            <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">
              {eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight font-semibold text-brand-deep-ink md:text-4xl">
              {headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-ink-500 md:text-lg">
              {supporting}
            </p>
          </ScrollReveal>

          <ul className="grid list-none gap-3 sm:grid-cols-2">
            {points.map((point, index) => (
              <li key={point}>
                <ScrollReveal delay={0.06 * (index + 1)}>
                  <div className="flex items-start gap-3 rounded-2xl bg-brand-warm-cream/80 px-4 py-4 ring-1 ring-brand-ink-200/30">
                    <span
                      aria-hidden
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-mint/40 text-xs font-semibold text-brand-deep-ink"
                    >
                      ✓
                    </span>
                    <span className="text-sm leading-snug font-medium text-brand-deep-ink md:text-[0.9375rem]">
                      {point}
                    </span>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export { CommunityCommitmentSection };
