import { z } from "zod";

export const contactTopicSchema = z.enum([
  "General question",
  "Account support",
  "Safety concern",
  "Community partnership",
  "Shelter or rescue partnership",
  "Press and media",
  "Product feedback",
]);

export const contactFormSectionPropsSchema = z.object({
  className: z.string().optional(),
  headline: z.string().optional(),
  supporting: z.string().optional(),
  submitLabel: z.string().optional(),
  successTitle: z.string().optional(),
  successMessage: z.string().optional(),
  topics: z.array(z.string()).optional(),
});

export type ContactFormSectionProps = z.infer<typeof contactFormSectionPropsSchema>;
export type ContactTopic = z.infer<typeof contactTopicSchema>;
