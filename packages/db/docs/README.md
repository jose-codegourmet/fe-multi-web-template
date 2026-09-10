# `@fe-template/db` — Shared Database Package

Purpose, models, consumers, and commands for the Prisma + Supabase Postgres package.

---

## Purpose

`@fe-template/db` provides the shared Prisma 6 schema, migrations, seed data, and `PrismaClient` singleton for the monorepo. The database is Supabase Postgres. It is consumed by `apps/admin` and by the API routes in `apps/web`.

---

## What problems it solves

- Single source of truth for the database schema and client.
- Prevents duplicate Prisma client instances and connection pool exhaustion.
- Centralizes migrations and seeding.

---

## Intended consumers

- `apps/admin` — Server Components, Server Actions, and profile upserts.
- `apps/web` — Internal API routes for blog, pricing, and testimonials.

---

## Public entry points

| Entry | Path | What it provides |
|---|---|---|
| `@fe-template/db` | `src/index.ts` | `prisma` singleton + re-export of all `@prisma/client` types |
| `@fe-template/db/client` | `src/client.ts` | `prisma` singleton only |

---

## Major dependencies

| Dependency | Purpose |
|---|---|
| `@prisma/client` | Generated Prisma client and types |
| `prisma` | CLI and migration engine (dev dependency) |
| `tsx` | Run `seed.ts` (dev dependency) |

---

## Schema layout

```text
packages/db/prisma/schema/
├── schema.prisma       # generator + datasource
├── user.prisma         # User, Profile, Role, UserStatus
├── pet.prisma          # Pet, PetSpecies, PetMatch, MatchStatus
├── post.prisma         # Post
├── marketing.prisma    # Contact, Testimonial, PricingPlan, ContactStatus
└── migrations/           # Prisma migrations
```

### Models and enums

| Model/Enum | Notes |
|---|---|
| `User` | Email-unique, `role` (`USER` \| `ADMIN`), `status` (`PENDING` \| `VERIFIED` \| `DEACTIVATED` \| `MOCK`) |
| `Profile` | Supabase auth user UUID (`id` = `auth.users` UUID) |
| `Pet` | Belongs to a `User`; species enum; cascade-deletes with owner |
| `PetMatch` | Requester/receiver pet pair with match status |
| `Post` | Slug, tags, `published` flag, author |
| `Contact` | Contact-form submission with `UNREAD` / `READ` / `RESOLVED` status |
| `Testimonial` | Review with rating and `published` flag |
| `PricingPlan` | Plan name, price in cents, interval, features |

---

## Commands

All run from the repo root with `pnpm --filter @fe-template/db <script>`:

| Script | Command | Purpose |
|---|---|---|
| `db:generate` | `prisma generate` | Generate Prisma client |
| `db:migrate` | `prisma migrate dev` | Create and apply migration |
| `db:migrate:create` | `prisma migrate dev --create-only` | Create migration without applying |
| `db:deploy` | `prisma migrate deploy` | Apply pending migrations in CI/prod |
| `db:push` | `prisma db push` | Push schema without migration (prototyping only) |
| `db:studio` | `prisma studio` | Open Prisma Studio |
| `db:seed` | `tsx prisma/seed.ts` | Seed demo data |
| `typecheck` | `tsc --noEmit` | TypeScript check |

`postinstall` in `package.json` also runs `prisma generate`.

---

## Environment variables

| Variable | Purpose | Required? |
|---|---|---|
| `DATABASE_URL` | Prisma runtime connection | Yes |
| `DIRECT_URL` | Direct Postgres connection for migrations | Yes for migrations |

The Prisma CLI reads `packages/db/.env` (not the root `.env`).

---

## Local docs

- `packages/db/docs/api.md` — public API details
- `packages/db/docs/development.md` — migration and development workflow
- `packages/db/docs/examples.md` — usage examples in consuming apps

---

## Common task routing

| Task | Read next |
|---|---|
| Change schema | `packages/db/docs/development.md` |
| Use Prisma in an app | `packages/db/docs/examples.md`, `docs/api-and-data-fetching.md` |
| Seed data | `packages/db/docs/examples.md`, `prisma/seed.ts` |
| Migration troubleshooting | `packages/db/docs/development.md` |
