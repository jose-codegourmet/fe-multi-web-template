import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card/Card";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { cn } from "@/lib/utils";

const eyebrow = "Our values";
const headline = "Principles that shape every product decision.";
const supporting =
  "We design for pets first, then for the humans who care for them—never the other way around.";
const values = [
  {
    title: "Pet Wellbeing First",
    description: "Engagement metrics never matter more than healthy interactions.",
  },
  {
    title: "Compatibility Over Popularity",
    description: "The goal is not to collect the most matches. The goal is to find good ones.",
  },
  {
    title: "Humans Stay in Control",
    description: "Pet parents decide who to talk to, what to share, and when to meet.",
  },
  {
    title: "Local Community Matters",
    description: "Strong communities are built through consistent, responsible connections.",
  },
  {
    title: "Design Should Feel Easy",
    description: "Responsible choices should be clear, accessible, and simple to complete.",
  },
];

type ValuesSectionProps = {
  className?: string;
};

function ValuesSection({ className }: ValuesSectionProps) {
  return (
    <section
      data-slot="values-section"
      className={cn("bg-background px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold text-brand-deep-ink md:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-ink-500 md:text-lg">
            {supporting}
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <ScrollReveal key={value.title} delay={0.08 * (index + 1)}>
              <Card className="h-full border-none bg-brand-warm-cream/70 ring-brand-ink-200/30">
                <CardHeader>
                  <span
                    aria-hidden
                    className="mb-2 flex size-8 items-center justify-center rounded-full bg-brand-coral/15 font-display text-sm font-semibold text-brand-coral"
                  >
                    {index + 1}
                  </span>
                  <CardTitle className="font-display text-lg font-semibold text-brand-deep-ink">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-brand-ink-500">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ValuesSection };
