import { Card, CardDescription, CardHeader, CardTitle, ScrollReveal } from "@fe-template/ui";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

type UseCasesSectionProps = {
  className?: string;
};

const USE_CASES = [
  {
    title: "The Weekend Walker",
    description: "For pets who need company on regular neighborhood routes.",
  },
  {
    title: "The Park Sprinter",
    description: "For high-energy dogs looking for compatible play sessions.",
  },
  {
    title: "The Gentle Senior",
    description: "For slower companions who prefer calm company.",
  },
  {
    title: "The Curious Introvert",
    description: "For shy pets who need patient, low-pressure introductions.",
  },
];

function UseCasesSection({ className }: UseCasesSectionProps) {
  return (
    <section
      data-slot="use-cases-section"
      className={cn("bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display mx-auto max-w-2xl text-center text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Whatever their social speed, there is a place for them.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {USE_CASES.map((useCase, index) => (
            <ScrollReveal key={useCase.title} delay={0.08 * (index + 1)}>
              <Card className="h-full border-none bg-brand-white ring-brand-ink-200/40">
                <CardHeader>
                  <CardTitle className="font-display text-xl text-brand-deep-ink">
                    {useCase.title}
                  </CardTitle>
                  <CardDescription className="text-brand-ink-500">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2} className="mt-12">
          <SectionImage
            src="/images/community/community-group-walk.jpg"
            alt="A group of pets and owners on a community walk"
            className="aspect-[21/9] w-full"
            sizes="(max-width: 768px) 100vw, 1152px"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

export { UseCasesSection };
