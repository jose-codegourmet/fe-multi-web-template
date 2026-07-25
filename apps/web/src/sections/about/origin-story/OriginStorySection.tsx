import { ScrollReveal } from "@fe-template/ui";
import { cn } from "@/lib/utils";

const eyebrow = "Origin story";
const headline = "Friendly does not always mean compatible.";
const paragraphs = [
  "PawPair began with a simple observation: two friendly pets are not automatically compatible. One may want to sprint, another may prefer to sniff quietly, and their humans may have completely different routines.",
  "The product was designed around the idea that context improves introductions. Better profiles, clearer expectations, and thoughtful matching can make social experiences less stressful for pets and people.",
];

type OriginStorySectionProps = {
  className?: string;
};

function OriginStorySection({ className }: OriginStorySectionProps) {
  return (
    <section
      data-slot="origin-story-section"
      className={cn("bg-background px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-3xl">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold text-brand-deep-ink md:text-4xl">
            {headline}
          </h2>
          <div className="mt-6 space-y-5">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 48)}
                className="text-base leading-relaxed text-brand-ink-500 md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { OriginStorySection };
