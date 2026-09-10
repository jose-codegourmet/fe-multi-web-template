import type { PetRow } from "@/hooks/use-pets/types";
import type { PetFormValues } from "./PetDialogForm.schema";

export type OwnerOption = { id: string; name: string | null; email: string };

export function getPetDefaultValues(
  pet: PetRow | undefined,
  ownerOptions: OwnerOption[],
): PetFormValues {
  return {
    name: pet?.name ?? "",
    species: (pet?.species as PetFormValues["species"]) ?? "DOG",
    breed: pet?.breed ?? "",
    age: pet?.age ?? undefined,
    bio: pet?.bio ?? "",
    photoUrl: pet?.photoUrl ?? null,
    ownerId: pet?.ownerId ?? ownerOptions[0]?.id ?? "",
  };
}
