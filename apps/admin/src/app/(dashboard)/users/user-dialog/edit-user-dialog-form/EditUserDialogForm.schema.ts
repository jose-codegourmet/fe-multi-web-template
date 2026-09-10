import { z } from "zod";

export const userUpdateSchema = z.object({
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]),
  bio: z.string().optional(),
  avatarUrl: z.string().optional().nullable(),
});

export type UpdateFormValues = z.infer<typeof userUpdateSchema>;
