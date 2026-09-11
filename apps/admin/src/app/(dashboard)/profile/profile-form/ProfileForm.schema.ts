import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string(),
  bio: z.string(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const profilePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ProfilePasswordValues = z.infer<typeof profilePasswordSchema>;
