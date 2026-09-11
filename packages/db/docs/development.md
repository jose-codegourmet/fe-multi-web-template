# `@fe-template/db` Development

How to develop against the Prisma schema, run migrations, and validate the package.

---

## Package structure

```text
packages/db/
├── src/
│   ├── client.ts          # PrismaClient singleton
│   └── index.ts           # Public exports
├── prisma/
│   ├── schema/
│   │   ├── schema.prisma  # generator + datasource
│   │   ├── user.prisma
│   │   ├── pet.prisma
│   │   ├── post.prisma
│   │   ├── marketing.prisma
│   │   └── migrations/    # Prisma migrations
│   ├── seed.ts            # Seed script
│   └── constants/         # Seed data constants
├── prisma.config.ts       # schema path + seed command
├── package.json
└── tsconfig.json
```

---

## Multi-file schema

Prisma is configured in `prisma.config.ts` (not `package.json`):

```ts
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

loadEnv({ path: resolve(import.meta.dirname, ".env"), quiet: true });

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/schema/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
```

Keep models grouped by domain:

- `user.prisma` — `User`, `Profile`, `Role`, `UserStatus`
- `pet.prisma` — `Pet`, `PetSpecies`, `PetMatch`, `MatchStatus`
- `post.prisma` — `Post`
- `marketing.prisma` — `Contact`, `Testimonial`, `PricingPlan`, `ContactStatus`

`schema.prisma` contains the generator and datasource.

---

## Migration workflow

1. Edit the relevant `.prisma` file.
2. Run migrations in development:

```bash
pnpm --filter @fe-template/db db:migrate
```

3. Generate the client:

```bash
pnpm --filter @fe-template/db db:generate
```

4. Apply in production/CI:

```bash
pnpm --filter @fe-template/db db:deploy
```

---

## Prototyping without migrations

For rapid local iteration only:

```bash
pnpm --filter @fe-template/db db:push
```

**Do not use `db:push` in production or shared environments.** It does not create migration files and can lose data.

---

## Seeding

```bash
pnpm --filter @fe-template/db db:seed
```

Seed data is in `prisma/constants/` and imported by `prisma/seed.ts`. The demo seed includes `admin@example.com` with `Role.ADMIN` and `UserStatus.VERIFIED`, plus other demo users also set to `VERIFIED`.

---

## Pooled vs direct URLs

- `DATABASE_URL` should use the pooled connection (`*.pooler.supabase.com:6543?pgbouncer=true`) in production/serverless.
- `DIRECT_URL` must always use the direct connection (`db.<project-ref>.supabase.co:5432`) for migrations.
- Local development can point both to the direct URL.

`prisma.config.ts` loads `packages/db/.env` with `dotenv` because Prisma 6 skips automatic `.env` loading when a config file is present.

See `docs/environment-variables.md` for the full matrix.

---

## Validation commands

| Command | Purpose |
|---|---|
| `pnpm --filter @fe-template/db typecheck` | TypeScript check |
| `pnpm --filter @fe-template/db db:generate` | Generate Prisma client |
| `pnpm --filter @fe-template/db db:migrate` | Create and apply migration |
| `pnpm --filter @fe-template/db db:seed` | Seed demo data |
| `pnpm lint` | Biome across the repo |

---

## How to safely change the package

1. Edit the schema file(s).
2. Create and apply a migration.
3. Generate the client.
4. Update `packages/db/docs/README.md` and `packages/db/docs/api.md` if the public API changed.
5. Identify all consumers (`apps/admin`, `apps/web` API routes) and update their imports if needed.
6. Run type-checking and builds for affected consumers.
7. Seed or migrate data as needed.

---

## How to validate consuming apps

After schema changes, run:

```bash
pnpm --filter @fe-template/db db:generate
pnpm --filter admin typecheck
pnpm --filter web typecheck
pnpm --filter admin build
pnpm --filter web build
```

If a migration is required, run `db:migrate` before `db:generate`.
