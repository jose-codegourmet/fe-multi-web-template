import { prisma } from "@fe-template/db";
import { type PetRow, PetsTable } from "./pets-table";

async function getPets(): Promise<PetRow[]> {
  try {
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
      ownerName: pet.owner.name,
      ownerEmail: pet.owner.email,
      createdAt: pet.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function PetsPage() {
  const pets = await getPets();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{pets.length} pets</p>
      <PetsTable data={pets} />
    </div>
  );
}
