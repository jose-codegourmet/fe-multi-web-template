import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card/Card";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { cn } from "@/lib/utils";

type ContactOptionsSectionProps = {
  className?: string;
};

const OPTIONS = [
  {
    title: "Support",
    description: "Account help, matching questions, and product troubleshooting.",
    email: "support@pawpair.example",
  },
  {
    title: "Partnerships",
    description: "Community hosts, local businesses, and collaboration ideas.",
    email: "partners@pawpair.example",
  },
  {
    title: "Press",
    description: "Media kits, interviews, and product announcements.",
    email: "press@pawpair.example",
  },
  {
    title: "Safety",
    description: "Urgent safety reports and community guideline concerns.",
    email: "safety@pawpair.example",
  },
] as const;

function ContactOptionsSection({ className }: ContactOptionsSectionProps) {
  return (
    <section
      data-slot="contact-options-section"
      className={cn("bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Or reach the right desk directly
          </h2>
          <p className="mt-3 text-base text-brand-ink-500">
            Prefer email? Use the inbox that matches your question—demo addresses only.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OPTIONS.map((option, index) => (
            <ScrollReveal key={option.title} delay={0.08 * (index + 1)}>
              <Card className="h-full border-none bg-brand-white shadow-none ring-1 ring-brand-ink-200/50">
                <CardHeader>
                  <CardTitle className="font-display text-xl text-brand-deep-ink">
                    {option.title}
                  </CardTitle>
                  <CardDescription className="text-brand-ink-500">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <a
                    href={`mailto:${option.email}`}
                    className="text-sm font-medium text-brand-coral hover:underline"
                  >
                    {option.email}
                  </a>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { ContactOptionsSection };
