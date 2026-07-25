import type { PricingPlan } from "./types";

const apiOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function fetchPricingPlans(): Promise<PricingPlan[]> {
  const response = await fetch(new URL("/api/pricing", apiOrigin), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Unable to load pricing plans.");
  }

  return response.json();
}
