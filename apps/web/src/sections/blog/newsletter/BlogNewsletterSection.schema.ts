import { z } from "zod";

export const blogNewsletterSectionPropsSchema = z.object({
  className: z.string().optional(),
  headline: z.string().optional(),
  supporting: z.string().optional(),
  placeholder: z.string().optional(),
  submitLabel: z.string().optional(),
  successTitle: z.string().optional(),
  successMessage: z.string().optional(),
});

export type BlogNewsletterSectionProps = z.infer<typeof blogNewsletterSectionPropsSchema>;
