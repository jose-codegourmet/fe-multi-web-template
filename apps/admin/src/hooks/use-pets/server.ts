"use server";

import { prisma } from "@fe-template/db";
import type { PetRow } from "./types";

export async function fetchPets(): Promise<PetRow[]> {
  const pets = await prisma.pet.findMany({
    include: { owner: true },
    orderBy: { createdAt: "desc" },
  });

  return pets.map((pet) => ({
    id: pet.id,
    name: pet.name,
    species: pet.species,
    breed: pet.breed,
    age: pet.age,
    photoUrl: pet.photoUrl,
    ownerName: pet.owner.name,
    ownerEmail: pet.owner.email,
    createdAt: pet.createdAt.toISOString(),
  }));
}
