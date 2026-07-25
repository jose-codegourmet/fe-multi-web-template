import { Card, CardDescription, CardHeader, CardTitle, ScrollReveal } from "@fe-template/ui";
import { cn } from "@/lib/utils";

type CompatibilityFeaturesSectionProps = {
  className?: string;
};

const FEATURES = [
  {
    title: "Energy Match",
    description:
      "Find pets who want the same pace, from slow neighborhood walks to full-speed park sessions.",
  },
  {
    title: "Play Style",
    description:
      "Separate gentle players, chase lovers, wrestlers, observers, and pets still learning social confidence.",
  },
  {
    title: "Size and Age Preferences",
    description: "Set comfortable ranges for safer, more enjoyable introductions.",
  },
  {
    title: "Availability",
    description: "Match with people whose walking and playdate schedules fit yours.",
  },
  {
    title: "Distance",
    description: "Choose a realistic discovery radius around your neighborhood.",
  },
  {
    title: "Social Comfort",
    description: "Make space for shy, reactive, senior, or selectively social pets.",
  },
];

function CompatibilityFeaturesSection({ className }: CompatibilityFeaturesSectionProps) {
  return (
    <section
      id="features"
      data-slot="compatibility-features-section"
      className={cn("bg-brand-white px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">
            More than a cute photo
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Matching built around personality—not just proximity.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <ScrollReveal key={feature.title} delay={0.05 * (index + 1)}>
              <Card className="h-full border-none bg-brand-warm-cream ring-transparent">
                <CardHeader>
                  <CardTitle className="font-display text-lg text-brand-deep-ink">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-brand-ink-500">
                    {feature.description}
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

export { CompatibilityFeaturesSection };
