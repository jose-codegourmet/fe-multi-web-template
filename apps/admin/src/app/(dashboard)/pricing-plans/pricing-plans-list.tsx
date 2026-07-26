"use client";

import { Badge, Button } from "@fe-template/ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { usePricingPlans } from "@/hooks/use-pricing-plans/client";
import { DeletePricingPlanDialog, PricingPlanDialog } from "./pricing-plan-dialog";

export function PricingPlansList() {
  const { data: plans = [] } = usePricingPlans();

  if (plans.length === 0) {
    return <p className="text-sm text-muted-foreground">No pricing plans yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.id} className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{plan.name}</h3>
              {plan.nickname && <p className="text-sm text-muted-foreground">{plan.nickname}</p>}
            </div>
            <div className="flex items-center gap-1">
              <PricingPlanDialog
                plan={plan}
                trigger={
                  <Button variant="ghost" size="icon" className="size-8">
                    <PencilIcon className="size-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                }
              />
              <DeletePricingPlanDialog
                plan={plan}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                  >
                    <Trash2Icon className="size-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                }
              />
            </div>
          </div>
          <p className="mb-2 text-2xl font-bold">
            ${(plan.price / 100).toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {plan.featured && <Badge>Featured</Badge>}
            <Badge variant={plan.active ? "default" : "secondary"}>
              {plan.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          {plan.features.length > 0 && (
            <ul className="mt-3 space-y-1">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-muted-foreground">
                  · {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
