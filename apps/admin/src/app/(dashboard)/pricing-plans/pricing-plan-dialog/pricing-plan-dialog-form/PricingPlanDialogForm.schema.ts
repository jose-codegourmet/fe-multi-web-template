import { z } from "zod";

export const planFormSchema = z.object({
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

export type PlanFormValues = z.infer<typeof planFormSchema>;
