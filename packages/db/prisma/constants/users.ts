import { Role } from "@prisma/client";

export const SEED_USER_IDS = {
  admin: "seed-user-admin",
  bea: "seed-user-bea",
  marco: "seed-user-marco",
  nina: "seed-user-nina",
  aya: "seed-user-aya",
  jules: "seed-user-jules",
} as const;

export const seedUsers = [
  {
    id: SEED_USER_IDS.admin,
    email: "admin@example.com",
    name: "Admin User",
    role: Role.ADMIN,
    bio: "Platform administrator",
  },
  {
    id: SEED_USER_IDS.bea,
    email: "bea@example.com",
    name: "Bea Lim",
    role: Role.USER,
    bio: "Pet Wellbeing Advisor",
  },
  {
    id: SEED_USER_IDS.marco,
    email: "marco@example.com",
    name: "Marco",
    role: Role.USER,
  },
  {
    id: SEED_USER_IDS.nina,
    email: "nina@example.com",
    name: "Nina Cruz",
    role: Role.USER,
    bio: "Community Writer",
  },
  {
    id: SEED_USER_IDS.aya,
    email: "aya@example.com",
    name: "Aya Santos",
    role: Role.USER,
    bio: "Community Experience Lead",
  },
  {
    id: SEED_USER_IDS.jules,
    email: "jules@example.com",
    name: "Jules Reyes",
    role: Role.USER,
    bio: "Head of Pet Safety",
  },
] as const;
