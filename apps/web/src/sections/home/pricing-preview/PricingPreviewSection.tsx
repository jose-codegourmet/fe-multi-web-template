"use client";

import {
  Badge,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollReveal,
} from "@fe-template/ui";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { usePricingPlans } from "@/hooks/use-pricing-plans/client";
import { cn } from "@/lib/utils";

type PricingPreviewSectionProps = {
  className?: string;
};

function PricingPreviewSection({ className }: PricingPreviewSectionProps) {
  const { data: pricingPlans = [] } = usePricingPlans();

  return (
    <section
      data-slot="pricing-preview-section"
      className={cn("bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display mx-auto max-w-2xl text-center text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Start free. Upgrade when your pack grows.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <ScrollReveal key={plan.id} delay={0.1 * (index + 1)}>
              <Card
                className={cn(
                  "relative h-full border-none bg-brand-white ring-brand-ink-200/40",
                  plan.featured && "ring-2 ring-brand-coral",
                )}
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="font-display text-xl text-brand-deep-ink">
                      {plan.name}
                    </CardTitle>
                    {plan.featured ? (
                      <Badge className="bg-brand-coral text-white">Most popular</Badge>
                    ) : null}
                  </div>
                  <p className="text-sm font-medium text-brand-lavender">{plan.nickname}</p>
                  <p className="font-display mt-2 text-3xl font-semibold text-brand-deep-ink">
                    {plan.price === 0 ? (
                      "Free"
                    ) : (
                      <>
                        ${plan.price / 100}
                        <span className="text-base font-normal text-brand-ink-500">/mo</span>
                      </>
                    )}
                  </p>
                  <CardDescription className="text-brand-ink-500">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={ROUTES.pricing}
                    className={cn(
                      buttonVariants({
                        variant: plan.featured ? "default" : "outline",
                        size: "lg",
                      }),
                      "h-10 w-full rounded-xl",
                      plan.featured
                        ? "bg-brand-coral text-white hover:bg-brand-coral/90"
                        : "border-brand-ink-200 text-brand-deep-ink hover:bg-brand-cream-200",
                    )}
                  >
                    {plan.ctaLabel}
                  </Link>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { PricingPreviewSection };
