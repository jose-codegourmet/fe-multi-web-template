import { z } from "zod";

export const testimonialFormSchema = z.object({
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required"),
  petName: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  published: z.boolean(),
});

export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>;
