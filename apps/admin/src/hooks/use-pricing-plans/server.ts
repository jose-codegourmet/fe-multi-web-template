"use server";

import { prisma } from "@fe-template/db";
import type { PricingPlanRow } from "./types";

export async function fetchPricingPlans(): Promise<PricingPlanRow[]> {
  const plans = await prisma.pricingPlan.findMany({ orderBy: { createdAt: "asc" } });

  return plans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    nickname: plan.nickname,
    price: plan.price,
    interval: plan.interval,
    description: plan.description,
    features: plan.features,
    ctaLabel: plan.ctaLabel,
    featured: plan.featured,
    active: plan.active,
    createdAt: plan.createdAt.toISOString(),
  }));
}
