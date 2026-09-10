# `@fe-template/db`

Prisma 6 schema, migrations, seed data, and the shared `PrismaClient` singleton for the monorepo. The database is **Supabase Postgres**.

Currently consumed by [`apps/admin`](../../apps/admin/README.md); [`apps/web`](../../apps/web/README.md) renders demo content and does not query the database yet.

---

## Import

```ts
import { prisma } from "@fe-template/db";

const users = await prisma.user.findMany({ include: { pets: true } });
```

Generated Prisma types are re-exported too, so `import type { Post, Role } from "@fe-template/db"` works without depending on `@prisma/client` directly.

The client is a singleton cached on `globalThis` outside production, which keeps Next.js dev hot-reloads from opening a new connection pool on every rebuild. Query it from Server Components and Server Actions only — never from a `"use client"` component.

---

## Schema

Prisma's split-schema layout, configured via `"prisma": { "schema": "prisma/schema" }` in [package.json](package.json):

```text
packages/db/prisma/
├── schema/
│   ├── schema.prisma      # generator + datasource
│   ├── user.prisma        # User, Profile, Role
│   ├── pet.prisma         # Pet, PetSpecies, PetMatch, MatchStatus
│   ├── post.prisma        # Post
│   ├── marketing.prisma   # Contact, Testimonial, PricingPlan
│   └── migrations/        # Prisma migrations (multi-file schema path)
└── seed.ts
```

| Model | Notes |
| --- | --- |
| `User` | Email-unique account with `role` (`USER` \| `ADMIN`), owns pets and posts |
| `Profile` | Supabase auth user (`id` = `auth.users` UUID) created after OTP confirmation |
| `Pet` | Belongs to a `User`; species enum; cascade-deletes with its owner |
| `PetMatch` | Requester/receiver pet pair with `PENDING` / `ACCEPTED` / `REJECTED` status |
| `Post` | Blog post with slug, tags, `published` flag, and author |
| `Contact` | Contact-form submission with `UNREAD` / `READ` / `RESOLVED` status |
| `Testimonial` | Review with rating and `published` flag |
| `PricingPlan` | Plan name, price in cents, interval, features |

---

## Commands

Run from the repo root with `pnpm --filter @fe-template/db <script>`:

| Script | Purpose |
| --- | --- |
| `db:generate` | Generate the Prisma client (run after install and after schema changes) |
| `db:migrate` | Create and apply a migration in development |
| `db:migrate:create` | Create a migration without applying it (`--create-only`) |
| `db:deploy` | Apply pending migrations (CI / production) |
| `db:push` | Push the schema without a migration (prototyping only) |
| `db:studio` | Open Prisma Studio to browse and edit rows |
| `db:seed` | Seed demo data via `prisma/seed.ts` (includes an `ADMIN` user) |
| `typecheck` | `tsc --noEmit` |

`pnpm db:generate` at the repo root runs `db:generate` across the workspace via Turbo.

---

## Environment

The Prisma CLI reads [`packages/db/.env`](.env.example) (not the root `.env`), so this package keeps its own copy:

```bash
cp packages/db/.env.example packages/db/.env
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Connection used by the client at runtime |
| `DIRECT_URL` | Direct connection used for migrations (`directUrl` in `schema.prisma`) |

### Pooled vs direct connections

Supabase offers two connection strings, and they are not interchangeable:

- **Pooled** (`aws-0-<region>.pooler.supabase.com:6543`, with `?pgbouncer=true`) — use for `DATABASE_URL` in production and any serverless deployment, where many short-lived instances would otherwise exhaust Postgres connections.
- **Direct** (`db.<project-ref>.supabase.co:5432`) — use for `DIRECT_URL` always. Migrations need a direct connection because pgbouncer's transaction pooling does not support the statements Prisma Migrate issues.

Local development can point both at the direct URL, which is what `.env.example` does by default.

---

## First-time setup

```bash
cp packages/db/.env.example packages/db/.env       # fill in your Supabase credentials
pnpm --filter @fe-template/db db:migrate           # create the schema
pnpm --filter @fe-template/db db:seed              # optional demo data
pnpm --filter @fe-template/db db:generate          # generate the client
```
