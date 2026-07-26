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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  NativeSelect,
  Switch,
  Textarea,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { pricingPlansQueryKey } from "@/hooks/use-pricing-plans/query";
import type { PricingPlanRow } from "@/hooks/use-pricing-plans/types";
import {
  createPricingPlan,
  deletePricingPlan,
  type PlanFormValues,
  updatePricingPlan,
} from "./actions";

const planFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nickname: z.string().optional(),
  priceInDollars: z.coerce.number().min(0, "Price must be non-negative"),
  interval: z.enum(["month", "year"]),
  description: z.string().optional(),
  featuresText: z.string(),
  ctaLabel: z.string().optional(),
  featured: z.boolean(),
  active: z.boolean(),
});

type FormValues = z.infer<typeof planFormSchema>;

// ---- Create / Edit Dialog ----

type PricingPlanDialogProps = {
  plan?: PricingPlanRow;
  trigger?: React.ReactElement;
};

export function PricingPlanDialog({ plan, trigger }: PricingPlanDialogProps) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const form = useForm({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: plan?.name ?? "",
      nickname: plan?.nickname ?? "",
      priceInDollars: plan ? plan.price / 100 : 0,
      interval: (plan?.interval as FormValues["interval"]) ?? "month",
      description: plan?.description ?? "",
      featuresText: plan?.features.join("\n") ?? "",
      ctaLabel: plan?.ctaLabel ?? "",
      featured: plan?.featured ?? false,
      active: plan?.active ?? true,
    },
  });

  async function onSubmit(values: FormValues) {
    const data: PlanFormValues = {
      name: values.name,
      nickname: values.nickname || undefined,
      price: Math.round(values.priceInDollars * 100),
      interval: values.interval,
      description: values.description || undefined,
      features: values.featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      ctaLabel: values.ctaLabel || undefined,
      featured: values.featured,
      active: values.active,
    };

    const result = plan ? await updatePricingPlan(plan.id, data) : await createPricingPlan(data);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(plan ? "Plan updated" : "Plan created");
    await qc.invalidateQueries({ queryKey: pricingPlansQueryKey.list() });
    setOpen(false);
    form.reset();
  }

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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Pro Plan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input placeholder="Pro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ctaLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Label</FormLabel>
                    <FormControl>
                      <Input placeholder="Get started" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priceInDollars"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        placeholder="29.00"
                        {...field}
                        value={field.value as number}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interval</FormLabel>
                    <FormControl>
                      <NativeSelect {...field}>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={2} className="rounded-2xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="featuresText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      className="rounded-2xl"
                      placeholder={"One feature per line"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between gap-4">
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-2 rounded-2xl border border-border/60 p-3">
                    <FormLabel className="mb-0">Featured</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between gap-2 rounded-2xl border border-border/60 p-3">
                    <FormLabel className="mb-0">Active</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Delete Dialog ----

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
