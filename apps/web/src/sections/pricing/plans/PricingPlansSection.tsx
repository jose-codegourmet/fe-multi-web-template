import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ScrollReveal,
} from "@fe-template/ui";
import Link from "next/link";
import { DEMO_PRICING_PLANS } from "@/constants/demo-content";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const eyebrow = "Plans";
const headline = "Choose the plan that fits your pack.";
const supporting =
  "Every plan includes safety checklist access and compatibility-minded discovery.";
const featuredBadgeLabel = "Most popular";
const plans = DEMO_PRICING_PLANS;

function formatPrice(priceMonthly: number) {
  if (priceMonthly === 0) return "Free";
  return `$${priceMonthly}`;
}

type PricingPlansSectionProps = {
  className?: string;
};

function PricingPlansSection({ className }: PricingPlansSectionProps) {
  return (
    <section
      id="plans"
      data-slot="pricing-plans-section"
      className={cn("bg-background px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold text-brand-deep-ink md:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-ink-500 md:text-lg">
            {supporting}
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => {
            const featured = Boolean(plan.featured);
            return (
              <ScrollReveal key={plan.id} delay={0.1 * (index + 1)}>
                <Card
                  className={cn(
                    "relative h-full border-none ring-brand-ink-200/40",
                    featured
                      ? "bg-brand-white shadow-lg ring-2 ring-brand-coral/40"
                      : "bg-brand-warm-cream/60",
                  )}
                >
                  {featured ? (
                    <Badge className="absolute top-4 right-4 bg-brand-coral text-white">
                      {featuredBadgeLabel}
                    </Badge>
                  ) : null}
                  <CardHeader>
                    <p className="text-xs font-medium tracking-wide text-brand-coral uppercase">
                      {plan.nickname}
                    </p>
                    <CardTitle className="font-display text-2xl font-semibold text-brand-deep-ink">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="font-display text-4xl font-semibold text-brand-deep-ink">
                        {formatPrice(plan.priceMonthly)}
                      </span>
                      {plan.priceMonthly > 0 ? (
                        <span className="text-sm text-brand-ink-500">/month</span>
                      ) : null}
                    </div>
                    <CardDescription className="mt-2 text-sm leading-relaxed text-brand-ink-500">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2.5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-brand-ink-700"
                        >
                          <span
                            aria-hidden
                            className="mt-1 size-1.5 shrink-0 rounded-full bg-brand-mint"
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="border-0 bg-transparent">
                    <Link
                      href={ROUTES.createProfile}
                      className={cn(
                        "inline-flex h-10 w-full items-center justify-center rounded-full px-5 text-sm font-medium",
                        featured
                          ? "bg-brand-coral text-white hover:bg-brand-coral/90"
                          : "border border-brand-ink-200 bg-brand-white text-brand-deep-ink hover:bg-brand-cream-200",
                      )}
                    >
                      {plan.ctaLabel}
                    </Link>
                  </CardFooter>
                </Card>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { PricingPlansSection };
