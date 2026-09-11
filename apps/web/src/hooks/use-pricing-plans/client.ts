"use client";

import { useQuery } from "@tanstack/react-query";
import { pricingPlansQueryKey } from "./query";
import type { PricingPlan } from "./types";

async function fetchPricingPlans(): Promise<PricingPlan[]> {
  const response = await fetch("/api/pricing");

  if (!response.ok) {
    throw new Error("Unable to load pricing plans.");
  }

  return response.json();
}

export function usePricingPlans() {
  return useQuery({
    queryKey: pricingPlansQueryKey.list(),
    queryFn: fetchPricingPlans,
  });
}
