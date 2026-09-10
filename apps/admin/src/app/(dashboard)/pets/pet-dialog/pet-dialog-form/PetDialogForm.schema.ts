import { z } from "zod";

export const petSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.enum(["DOG", "CAT", "BIRD", "RABBIT", "OTHER"]),
  breed: z.string().optional(),
  age: z.coerce.number().int().min(0).max(30).optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional().nullable(),
  ownerId: z.string().min(1, "Owner is required"),
});

export type PetFormValues = z.infer<typeof petSchema>;
