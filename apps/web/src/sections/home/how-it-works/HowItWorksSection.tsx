import { Card, CardDescription, CardHeader, CardTitle } from "@/components/card/Card";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { cn } from "@/lib/utils";

type HowItWorksSectionProps = {
  className?: string;
};

const STEPS = [
  {
    title: "Create their profile",
    description:
      "Add personality, size, age, energy level, play style, favorite activities, and a few great photos.",
  },
  {
    title: "Discover compatible pets",
    description: "Browse nearby profiles and understand why each pet may be a good fit.",
  },
  {
    title: "Chat and meet safely",
    description: "Message the pet parent, agree on expectations, and plan a public first meetup.",
  },
];

function HowItWorksSection({ className }: HowItWorksSectionProps) {
  return (
    <section
      id="how-it-works"
      data-slot="how-it-works-section"
      className={cn("bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display mx-auto max-w-2xl text-center text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Three steps to a better first sniff.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <ScrollReveal key={step.title} delay={0.1 * (index + 1)}>
              <Card className="h-full border-none bg-brand-white ring-brand-ink-200/50">
                <CardHeader>
                  <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-brand-coral/15 font-display text-sm font-semibold text-brand-coral">
                    {index + 1}
                  </span>
                  <CardTitle className="font-display text-xl text-brand-deep-ink">
                    {step.title}
                  </CardTitle>
                  <CardDescription className="text-brand-ink-500">
                    {step.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { HowItWorksSection };
