import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { pricingPlansQueryKey } from "@/hooks/use-pricing-plans/query";
import { fetchPricingPlans } from "@/hooks/use-pricing-plans/server";
import { PricingPlanDialog } from "./pricing-plan-dialog";
import { PricingPlansList } from "./pricing-plans-list";

export default async function PricingPlansPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: pricingPlansQueryKey.list(),
    queryFn: fetchPricingPlans,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pricing Plans</h1>
          <PricingPlanDialog />
        </div>
        <PricingPlansList />
      </div>
    </HydrationBoundary>
  );
}
