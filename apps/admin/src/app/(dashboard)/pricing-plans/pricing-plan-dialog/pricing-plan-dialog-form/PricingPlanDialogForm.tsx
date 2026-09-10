"use client";

import {
  Button,
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { pricingPlansQueryKey } from "@/hooks/use-pricing-plans/query";
import type { PricingPlanRow } from "@/hooks/use-pricing-plans/types";
import {
  createPricingPlan,
  type PlanFormValues as PlanActionValues,
  updatePricingPlan,
} from "../../actions";
import { getPricingPlanDefaultValues } from "./PricingPlanDialogForm.defaults";
import { type PlanFormValues, planFormSchema } from "./PricingPlanDialogForm.schema";

type PricingPlanDialogFormProps = {
  plan?: PricingPlanRow;
  onSuccess?: () => void;
};

export function PricingPlanDialogForm({ plan, onSuccess }: PricingPlanDialogFormProps) {
  const qc = useQueryClient();
  const form = useForm({
    resolver: zodResolver(planFormSchema),
    defaultValues: getPricingPlanDefaultValues(plan),
  });

  async function onSubmit(values: PlanFormValues) {
    const data: PlanActionValues = {
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
    form.reset();
    onSuccess?.();
  }

  return (
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
                  placeholder="One feature per line"
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
