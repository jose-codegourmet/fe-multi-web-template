import { PetSpecies } from "@prisma/client";

import { SEED_USER_IDS } from "./users";

export const SEED_PET_IDS = {
  mochi: "seed-pet-mochi",
  luna: "seed-pet-luna",
  atlas: "seed-pet-atlas",
  pepper: "seed-pet-pepper",
  benny: "seed-pet-benny",
} as const;

export const seedPets = [
  {
    id: SEED_PET_IDS.mochi,
    name: "Mochi",
    species: PetSpecies.DOG,
    breed: "Shih Tzu mix",
    age: 3,
    bio: "Weekend walks and small-dog playdates.",
    photoUrl: "/images/hero/pet-mochi-profile.jpg",
    ownerId: SEED_USER_IDS.admin,
  },
  {
    id: SEED_PET_IDS.luna,
    name: "Luna",
    species: PetSpecies.DOG,
    breed: "Golden Retriever",
    age: 9,
    bio: "Gentle senior who prefers quiet company.",
    photoUrl: "/images/pets/pet-luna-profile.jpg",
    ownerId: SEED_USER_IDS.bea,
  },
  {
    id: SEED_PET_IDS.atlas,
    name: "Atlas",
    species: PetSpecies.DOG,
    breed: "Australian Shepherd",
    age: 4,
    bio: "High-energy dog looking for compatible play sessions.",
    photoUrl: "/images/pets/pet-atlas-profile.jpg",
    ownerId: SEED_USER_IDS.marco,
  },
  {
    id: SEED_PET_IDS.pepper,
    name: "Pepper",
    species: PetSpecies.CAT,
    breed: "Gray tabby",
    age: 5,
    bio: "Curious introvert who needs patient introductions.",
    photoUrl: "/images/pets/pet-pepper-profile.jpg",
    ownerId: SEED_USER_IDS.nina,
  },
  {
    id: SEED_PET_IDS.benny,
    name: "Benny",
    species: PetSpecies.DOG,
    breed: "Mixed breed",
    age: 6,
    bio: "Friendly walker who loves regular neighborhood routes.",
    photoUrl: "/images/pets/pet-benny-profile.jpg",
    ownerId: SEED_USER_IDS.admin,
  },
] as const;
