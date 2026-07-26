# Seed Data Constants Design

## Goal

Move the database seed records out of `packages/db/prisma/seed.ts` into a focused constants module so the seeding procedure is easier to scan and the demo data is organized by database entity.

## Structure

Create `packages/db/prisma/constants/` with these files:

- `users.ts`
- `pets.ts`
- `posts.ts`
- `testimonials.ts`
- `pricing-plans.ts`
- `index.ts`

Each entity file exports immutable seed records. `users.ts` also exports user ID constants, which the pet and post records use for owner and author relationships. The barrel file re-exports each module.

## Seed Procedure

`seed.ts` imports the records and iterates through each collection to run the existing Prisma `upsert` operations. The current uniqueness rules remain unchanged:

- Users, pets, testimonials, and pricing plans upsert by `id`.
- Posts upsert by `slug`.

The seed output retains the same summary and values as before.

## Validation

Run the database package typecheck and seed command. The seeded records and relationships must be unchanged from the current behavior.
