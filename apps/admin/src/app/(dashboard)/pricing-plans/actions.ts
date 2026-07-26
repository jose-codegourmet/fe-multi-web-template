"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nickname: z.string().optional(),
  price: z.number().int().min(0, "Price must be non-negative"),
  interval: z.enum(["month", "year"]),
  description: z.string().optional(),
  features: z.array(z.string()),
  ctaLabel: z.string().optional(),
  featured: z.boolean(),
  active: z.boolean(),
});

export type PlanFormValues = z.infer<typeof planSchema>;
export type ActionResult = { success: true } | { success: false; error: string };

export async function createPricingPlan(data: PlanFormValues): Promise<ActionResult> {
  const parsed = planSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    await prisma.pricingPlan.create({
      data: {
        name: parsed.data.name,
        nickname: parsed.data.nickname || null,
        price: parsed.data.price,
        interval: parsed.data.interval,
        description: parsed.data.description || null,
        features: parsed.data.features,
        ctaLabel: parsed.data.ctaLabel || null,
        featured: parsed.data.featured,
        active: parsed.data.active,
      },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create plan" };
  }

  revalidatePath("/pricing-plans");
  return { success: true };
}

export async function updatePricingPlan(id: string, data: PlanFormValues): Promise<ActionResult> {
  const parsed = planSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    await prisma.pricingPlan.update({
      where: { id },
      data: {
        name: parsed.data.name,
        nickname: parsed.data.nickname || null,
        price: parsed.data.price,
        interval: parsed.data.interval,
        description: parsed.data.description || null,
        features: parsed.data.features,
        ctaLabel: parsed.data.ctaLabel || null,
        featured: parsed.data.featured,
        active: parsed.data.active,
      },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update plan" };
  }

  revalidatePath("/pricing-plans");
  return { success: true };
}

export async function deletePricingPlan(id: string): Promise<ActionResult> {
  try {
    await prisma.pricingPlan.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete plan" };
  }
  revalidatePath("/pricing-plans");
  return { success: true };
}
