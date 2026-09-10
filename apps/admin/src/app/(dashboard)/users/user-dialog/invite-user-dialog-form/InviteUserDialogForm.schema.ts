import { z } from "zod";

export const userInviteSchema = z.object({
  email: z.string().email("Valid email required"),
  role: z.enum(["USER", "ADMIN"]),
});

export type InviteFormValues = z.infer<typeof userInviteSchema>;
