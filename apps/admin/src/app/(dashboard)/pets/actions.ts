"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const petSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.enum(["DOG", "CAT", "BIRD", "RABBIT", "OTHER"]),
  breed: z.string().optional(),
  age: z.number().int().min(0).max(30).optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  ownerId: z.string().min(1, "Owner is required"),
});

export type PetFormValues = z.infer<typeof petSchema>;
export type ActionResult = { success: true } | { success: false; error: string };

export async function createPet(data: PetFormValues): Promise<ActionResult> {
  const parsed = petSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    await prisma.pet.create({
      data: {
        name: parsed.data.name,
        species: parsed.data.species,
        breed: parsed.data.breed || null,
        age: parsed.data.age ?? null,
        bio: parsed.data.bio || null,
        photoUrl: parsed.data.photoUrl || null,
        ownerId: parsed.data.ownerId,
      },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create pet" };
  }

  revalidatePath("/pets");
  return { success: true };
}

export async function updatePet(id: string, data: PetFormValues): Promise<ActionResult> {
  const parsed = petSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    await prisma.pet.update({
      where: { id },
      data: {
        name: parsed.data.name,
        species: parsed.data.species,
        breed: parsed.data.breed || null,
        age: parsed.data.age ?? null,
        bio: parsed.data.bio || null,
        photoUrl: parsed.data.photoUrl || null,
        ownerId: parsed.data.ownerId,
      },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update pet" };
  }

  revalidatePath("/pets");
  return { success: true };
}

export async function deletePet(id: string): Promise<ActionResult> {
  try {
    await prisma.pet.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete pet" };
  }
  revalidatePath("/pets");
  return { success: true };
}
