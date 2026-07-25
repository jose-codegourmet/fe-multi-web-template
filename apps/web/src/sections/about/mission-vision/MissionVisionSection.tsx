import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card/Card";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { cn } from "@/lib/utils";

const eyebrow = "Mission & vision";
const headline = "What we are building toward.";
const cards = [
  {
    label: "Mission",
    title: "Happier, healthier, more social lives",
    body: "Help pets live happier, healthier, and more social lives through better local connections.",
  },
  {
    label: "Vision",
    title: "Thoughtful introductions, everyday simple",
    body: "Make thoughtful pet introductions as normal and accessible as booking a walk.",
  },
];

type MissionVisionSectionProps = {
  className?: string;
};

function MissionVisionSection({ className }: MissionVisionSectionProps) {
  return (
    <section
      data-slot="mission-vision-section"
      className={cn("bg-brand-warm-cream/60 px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold text-brand-deep-ink md:text-4xl">
            {headline}
          </h2>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {cards.map((card, index) => (
            <ScrollReveal key={card.label} delay={0.1 * (index + 1)}>
              <Card className="h-full border-none bg-brand-white ring-brand-ink-200/40">
                <CardHeader>
                  <p className="text-xs font-medium tracking-wide text-brand-coral uppercase">
                    {card.label}
                  </p>
                  <CardTitle className="font-display text-xl font-semibold text-brand-deep-ink md:text-2xl">
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-brand-ink-500">
                    {card.body}
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

export { MissionVisionSection };
