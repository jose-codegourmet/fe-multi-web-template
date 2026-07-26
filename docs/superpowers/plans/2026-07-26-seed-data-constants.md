# Seed Data Constants Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Organize all Prisma demo records into entity-specific constants modules while preserving the existing seed results.

**Architecture:** `packages/db/prisma/constants/` owns immutable data definitions grouped by Prisma entity. `seed.ts` owns only Prisma client lifecycle, relationship-aware upsert calls, and completion logging; it imports the data from the constants barrel.

**Tech Stack:** TypeScript, Prisma 6, pnpm workspace.

## Global Constraints

- Preserve every current seed value, unique key, relationship, and seed summary.
- Retain `upsert` behavior: `id` for users, pets, testimonials, and pricing plans; `slug` for posts.
- Do not add dependencies.

---

## File Structure

- Create: `packages/db/prisma/constants/users.ts` — user IDs and user records.
- Create: `packages/db/prisma/constants/pets.ts` — pet records referencing user IDs.
- Create: `packages/db/prisma/constants/posts.ts` — post records referencing user IDs with ISO publication dates.
- Create: `packages/db/prisma/constants/testimonials.ts` — testimonial records.
- Create: `packages/db/prisma/constants/pricing-plans.ts` — pricing plan records.
- Create: `packages/db/prisma/constants/index.ts` — public seed-data exports.
- Modify: `packages/db/prisma/seed.ts` — imports data and performs equivalent upserts.

### Task 1: Create typed seed-data modules

**Files:**
- Create: `packages/db/prisma/constants/users.ts`
- Create: `packages/db/prisma/constants/pets.ts`
- Create: `packages/db/prisma/constants/posts.ts`
- Create: `packages/db/prisma/constants/testimonials.ts`
- Create: `packages/db/prisma/constants/pricing-plans.ts`
- Create: `packages/db/prisma/constants/index.ts`

**Interfaces:**
- Produces: readonly arrays `seedUsers`, `seedPets`, `seedPosts`, `seedTestimonials`, and `seedPricingPlans`.
- Produces: `SEED_USER_IDS` object with named user IDs.

- [ ] **Step 1: Add the user data and relationship IDs**

```ts
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
  { id: SEED_USER_IDS.admin, email: "admin@example.com", name: "Admin User", role: Role.ADMIN, bio: "Platform administrator" },
  { id: SEED_USER_IDS.bea, email: "bea@example.com", name: "Bea Lim", role: Role.USER, bio: "Pet Wellbeing Advisor" },
  { id: SEED_USER_IDS.marco, email: "marco@example.com", name: "Marco", role: Role.USER },
  { id: SEED_USER_IDS.nina, email: "nina@example.com", name: "Nina Cruz", role: Role.USER, bio: "Community Writer" },
  { id: SEED_USER_IDS.aya, email: "aya@example.com", name: "Aya Santos", role: Role.USER, bio: "Community Experience Lead" },
  { id: SEED_USER_IDS.jules, email: "jules@example.com", name: "Jules Reyes", role: Role.USER, bio: "Head of Pet Safety" },
] as const;
```

- [ ] **Step 2: Move each remaining entity's records without changing their values**

```ts
// pets.ts uses PetSpecies and SEED_USER_IDS for ownerId.
// posts.ts stores publishedAt as the current ISO date strings and uses
// SEED_USER_IDS for authorId; seed.ts converts them with new Date().
// testimonials.ts and pricing-plans.ts copy their current records verbatim.
export const seedTestimonials = [/* existing three records */] as const;
export const seedPricingPlans = [/* existing three records */] as const;
```

- [ ] **Step 3: Add explicit barrel exports**

```ts
export * from "./users";
export * from "./pets";
export * from "./posts";
export * from "./testimonials";
export * from "./pricing-plans";
```

- [ ] **Step 4: Typecheck the constants modules**

Run: `pnpm --filter @fe-template/db typecheck`  
Expected: exits with code 0.

### Task 2: Simplify the seed procedure

**Files:**
- Modify: `packages/db/prisma/seed.ts:1-356`

**Interfaces:**
- Consumes: arrays and IDs exported from `./constants`.
- Produces: the same persisted demo records and summary output as before.

- [ ] **Step 1: Replace inline record declarations with constants imports**

```ts
import { PrismaClient } from "@prisma/client";
import {
  seedPets,
  seedPosts,
  seedPricingPlans,
  seedTestimonials,
  seedUsers,
} from "./constants";
```

- [ ] **Step 2: Upsert each collection using its unchanged unique key**

```ts
const users = await Promise.all(
  seedUsers.map((user) =>
    prisma.user.upsert({ where: { id: user.id }, update: {}, create: user }),
  ),
);

await Promise.all(
  seedPosts.map(({ publishedAt, ...post }) =>
    prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: { ...post, publishedAt: new Date(publishedAt) },
    }),
  ),
);
```

- [ ] **Step 3: Preserve the completion summary**

```ts
console.log("Seed complete:", {
  users: users.map(({ email }) => email),
  pets: pets.map(({ name }) => name),
  posts: seedPosts.length,
  testimonials: seedTestimonials.length,
  pricingPlans: seedPricingPlans.map(({ name }) => name),
});
```

- [ ] **Step 4: Verify compilation and seed execution**

Run: `pnpm --filter @fe-template/db typecheck && pnpm --filter @fe-template/db db:seed`  
Expected: typecheck exits with code 0 and seed output reports 6 users, 5 pets, 4 posts, 3 testimonials, and the Free, Plus, and Pack plans.
