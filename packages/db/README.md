# `@fe-template/db`

Prisma 6 schema, migrations, seed data, and the shared `PrismaClient` singleton for the monorepo. The database target is **Supabase Postgres only** (hosted project or local `supabase start`). Plain Postgres is not supported.

Consumed by [`apps/admin`](../../apps/admin/README.md) (Server Components and Server Actions) and by [`apps/web`](../../apps/web/README.md) API routes (`src/app/api/{blog,pricing,testimonials}/route.ts`). Marketing pages do not import Prisma; they go through those routes and `fetch*` helpers. See [`docs/api-and-data-fetching.md`](../../docs/api-and-data-fetching.md).

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

Prisma's split-schema layout, configured via `schema` and `migrations.seed` in [prisma.config.ts](prisma.config.ts):

```text
packages/db/prisma/
├── schema/
│   ├── schema.prisma      # generator + datasource
│   ├── user.prisma        # User, Profile, Role, UserStatus
│   ├── pet.prisma         # Pet, PetSpecies, PetMatch, MatchStatus
│   ├── post.prisma        # Post
│   ├── marketing.prisma   # Contact, Testimonial, PricingPlan
│   └── migrations/        # Prisma migrations (multi-file schema path)
└── seed.ts
```

| Model | Notes |
| --- | --- |
| `User` | Email-unique account with `role` (`USER` \| `ADMIN`) and `status` (`UserStatus`, default `PENDING`); owns pets and posts |
| `Profile` | Supabase auth user (`id` = `auth.users` UUID). `Profile.id` has a **required** cross-schema FK to `auth.users(id)` `ON DELETE CASCADE`, applied in `20260727060109_add_profiles_table` (not expressible in Prisma). |
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
| `db:seed` | Seed demo data via `prisma/seed.ts` (users, pets, posts, testimonials, plans, contacts, pet matches). `Profile` is upserted only for existing `auth.users` UUIDs — the seed never invents Auth rows. |
| `typecheck` | `tsc --noEmit` |

`pnpm db:generate` at the repo root runs `db:generate` across the workspace via Turbo.

`db:migrate` and `db:deploy` run `scripts/assert-supabase-auth.ts` first. That preflight checks for `auth.users` and exits with a clear error on plain Postgres, instead of failing later on the `Profile_id_fkey` statement.

---

## Supported database targets

| Target | Supported? | Notes |
| --- | --- | --- |
| Hosted Supabase Postgres | Yes | Production and shared-dev default. Includes `auth.users`. |
| Local Supabase (`supabase start`) | Yes | Required path for running migrations on a machine without a cloud project. |
| Plain Postgres (Docker, CI, other hosts) | No | No `auth` schema. `prisma migrate deploy` fails in `20260727060109_add_profiles_table` unless the preflight catches it first. |

This is a hard product requirement, not an accident of the migration. Admin auth is Supabase Auth; `Profile.id` must stay aligned with `auth.users`. **Do not drop `Profile_id_fkey`** to make plain Postgres work — that would break the intended delete-cascade model.

The applied SQL in `20260727060109_add_profiles_table` is left unchanged so checksums on already-migrated Supabase projects stay valid.

### Local migrations (`supabase start`)

1. Install the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started).
2. From a directory with a Supabase project (or `supabase init` if you are bootstrapping local-only), start the stack:

```bash
supabase start
```

3. Copy the local database URL from the CLI output (default is typically `postgresql://postgres:postgres@127.0.0.1:54322/postgres`) into `packages/db/.env` for both `DATABASE_URL` and `DIRECT_URL`.
4. Run migrations against that instance:

```bash
pnpm --filter @fe-template/db db:migrate
```

`db:push` does **not** create `Profile_id_fkey` (the FK is raw SQL, not in `user.prisma`). Use migrate against Supabase, not `db:push`, when you need the real schema.

---

## Environment

`prisma.config.ts` loads [`packages/db/.env`](.env.example) with `dotenv` (Prisma skips automatic `.env` loading when a config file is present). The package keeps its own copy rather than using the root `.env`:

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
