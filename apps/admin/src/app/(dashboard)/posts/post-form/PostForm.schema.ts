import { z } from "zod";

export const postFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional().nullable(),
  tags: z.string().optional(),
  published: z.boolean(),
  authorId: z.string().min(1, "Author is required"),
});

export type PostFormSchemaValues = z.infer<typeof postFormSchema>;
