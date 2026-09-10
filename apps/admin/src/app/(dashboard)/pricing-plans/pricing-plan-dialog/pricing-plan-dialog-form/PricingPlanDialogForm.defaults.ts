import type { PricingPlanRow } from "@/hooks/use-pricing-plans/types";
import type { PlanFormValues } from "./PricingPlanDialogForm.schema";

export function getPricingPlanDefaultValues(plan: PricingPlanRow | undefined): PlanFormValues {
  return {
    name: plan?.name ?? "",
    nickname: plan?.nickname ?? "",
    priceInDollars: plan ? plan.price / 100 : 0,
    interval: (plan?.interval as PlanFormValues["interval"]) ?? "month",
    description: plan?.description ?? "",
    featuresText: plan?.features.join("\n") ?? "",
    ctaLabel: plan?.ctaLabel ?? "",
    featured: plan?.featured ?? false,
    active: plan?.active ?? true,
  };
}
