"use client";

import { useQuery } from "@tanstack/react-query";
import { pricingPlansQueryKey } from "./query";
import { fetchPricingPlans } from "./server";

export function usePricingPlans() {
  return useQuery({
    queryKey: pricingPlansQueryKey.list(),
    queryFn: fetchPricingPlans,
  });
}
