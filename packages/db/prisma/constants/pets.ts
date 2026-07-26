import { PetSpecies } from "@prisma/client";

import { SEED_USER_IDS } from "./users";

export const seedPets = [
  {
    id: "seed-pet-mochi",
    name: "Mochi",
    species: PetSpecies.DOG,
    breed: "Shih Tzu mix",
    age: 3,
    bio: "Weekend walks and small-dog playdates.",
    photoUrl: "/images/hero/pet-mochi-profile.jpg",
    ownerId: SEED_USER_IDS.admin,
  },
  {
    id: "seed-pet-luna",
    name: "Luna",
    species: PetSpecies.DOG,
    breed: "Golden Retriever",
    age: 9,
    bio: "Gentle senior who prefers quiet company.",
    photoUrl: "/images/pets/pet-luna-profile.jpg",
    ownerId: SEED_USER_IDS.bea,
  },
  {
    id: "seed-pet-atlas",
    name: "Atlas",
    species: PetSpecies.DOG,
    breed: "Australian Shepherd",
    age: 4,
    bio: "High-energy dog looking for compatible play sessions.",
    photoUrl: "/images/pets/pet-atlas-profile.jpg",
    ownerId: SEED_USER_IDS.marco,
  },
  {
    id: "seed-pet-pepper",
    name: "Pepper",
    species: PetSpecies.CAT,
    breed: "Gray tabby",
    age: 5,
    bio: "Curious introvert who needs patient introductions.",
    photoUrl: "/images/pets/pet-pepper-profile.jpg",
    ownerId: SEED_USER_IDS.nina,
  },
  {
    id: "seed-pet-benny",
    name: "Benny",
    species: PetSpecies.DOG,
    breed: "Mixed breed",
    age: 6,
    bio: "Friendly walker who loves regular neighborhood routes.",
    photoUrl: "/images/pets/pet-benny-profile.jpg",
    ownerId: SEED_USER_IDS.admin,
  },
] as const;
