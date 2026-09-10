"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@fe-template/ui";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { pricingPlansQueryKey } from "@/hooks/use-pricing-plans/query";
import type { PricingPlanRow } from "@/hooks/use-pricing-plans/types";
import { deletePricingPlan } from "../actions";
import { PricingPlanDialogForm } from "./pricing-plan-dialog-form/PricingPlanDialogForm";

type PricingPlanDialogProps = {
  plan?: PricingPlanRow;
  trigger?: React.ReactElement;
};

export function PricingPlanDialog({ plan, trigger }: PricingPlanDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm">
              <PlusIcon className="mr-1 size-4" />
              New Plan
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{plan ? "Edit Plan" : "New Plan"}</DialogTitle>
        </DialogHeader>
        <PricingPlanDialogForm plan={plan} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

type DeletePricingPlanDialogProps = {
  plan: PricingPlanRow;
  trigger: React.ReactElement;
};

export function DeletePricingPlanDialog({ plan, trigger }: DeletePricingPlanDialogProps) {
  const qc = useQueryClient();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const result = await deletePricingPlan(plan.id);
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Plan deleted");
    await qc.invalidateQueries({ queryKey: pricingPlansQueryKey.list() });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {plan.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {plan.name} and all related data. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {pending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
