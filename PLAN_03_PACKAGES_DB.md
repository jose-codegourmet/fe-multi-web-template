# PLAN 03 — Create `packages/db` (Prisma + Supabase)

> Execute this plan in a fresh agent session. It is self-contained. Run **after** `PLAN_01_TURBOREPO.md` (can run in parallel with PLAN 02). When finished, **always commit and push to `main`** (see final step).

## Goal

Create a dedicated `@fe-template/db` package (`packages/db`) that owns the Prisma client and schema. Both `apps/web` and `apps/admin` import the client from `@fe-template/db`. The database is hosted on **Supabase** (Postgres). Prisma schemas are kept **separate/split by domain** using Prisma's multi-file schema folder.

> Do NOT run `prisma migrate deploy` against Supabase or otherwise provision Supabase — the user is setting Supabase up themselves. Stop at `prisma generate` and `prisma migrate dev --create-only` (migration files created but you may skip applying if the DB is not ready). If the DB is reachable, applying is fine.

## Supabase / DB details (provided by user)

- `NEXT_PUBLIC_SUPABASE_URL=https://iqysqkmmtkthxrfiklhc.supabase.co`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_6S7XHsbSaCrf26zux6KUFw_M3wr3MaT`
- DB password: `sH76PstdF8NnaYvS`
- Direct connection string: `postgresql://postgres:sH76PstdF8NnaYvS@db.iqysqkmmtkthxrfiklhc.supabase.co:5432/postgres`

Prisma with Supabase wants two URLs:
- `DATABASE_URL` — pooled connection (pgBouncer, port 6543) for the app runtime.
- `DIRECT_URL` — direct connection (port 5432) for migrations.

For now use the direct string for both if the pooled string is unknown:
```
DATABASE_URL="postgresql://postgres:sH76PstdF8NnaYvS@db.iqysqkmmtkthxrfiklhc.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:sH76PstdF8NnaYvS@db.iqysqkmmtkthxrfiklhc.supabase.co:5432/postgres"
```
> The pooled URL (recommended for serverless) looks like `postgresql://postgres.iqysqkmmtkthxrfiklhc:sH76PstdF8NnaYvS@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true`. The env file created in PLAN 05 will note this; leave a TODO comment.

## Steps

### 1. Scaffold `packages/db`

`packages/db/package.json`:
```json
{
  "name": "@fe-template/db",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./client": "./src/client.ts"
  },
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:create": "prisma migrate dev --create-only",
    "db:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@prisma/client": "^6.3.0"
  },
  "devDependencies": {
    "prisma": "^6.3.0",
    "tsx": "^4.19.2",
    "typescript": "^5"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```
> Use latest Prisma 6.x resolved by pnpm; do not hard-pin if a newer patch exists.

`packages/db/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/**/*.ts", "prisma/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2. Enable split (separate) Prisma schemas

Use Prisma's multi-file schema folder. Create files under `packages/db/prisma/schema/`.

`packages/db/prisma/schema/schema.prisma` (datasource + generator only):
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

> Prisma 6 supports the `prisma/schema` folder natively (the `prismaSchemaFolder` preview flag graduated). If the installed version still needs it, add `previewFeatures = ["prismaSchemaFolder"]` to the generator. Configure the schema location via `package.json` `"prisma": { "schema": "prisma/schema" }` if auto-detection fails.

Split the domain models into separate files:

`packages/db/prisma/schema/user.prisma`:
```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatarUrl String?
  role      Role     @default(USER)
  bio       String?
  pets      Pet[]
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
}
```

`packages/db/prisma/schema/pet.prisma`:
```prisma
enum PetSpecies {
  DOG
  CAT
  BIRD
  RABBIT
  OTHER
}

model Pet {
  id        String     @id @default(cuid())
  name      String
  species   PetSpecies @default(DOG)
  breed     String?
  age       Int?
  bio       String?
  photoUrl  String?
  owner     User       @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  ownerId   String
  // matches this pet initiated
  matchesInitiated PetMatch[] @relation("Requester")
  // matches this pet received
  matchesReceived  PetMatch[] @relation("Receiver")
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@index([ownerId])
}

enum MatchStatus {
  PENDING
  ACCEPTED
  REJECTED
}

model PetMatch {
  id          String      @id @default(cuid())
  requester   Pet         @relation("Requester", fields: [requesterId], references: [id], onDelete: Cascade)
  requesterId String
  receiver    Pet         @relation("Receiver", fields: [receiverId], references: [id], onDelete: Cascade)
  receiverId  String
  status      MatchStatus @default(PENDING)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@unique([requesterId, receiverId])
  @@index([status])
}
```

`packages/db/prisma/schema/post.prisma`:
```prisma
model Post {
  id         String    @id @default(cuid())
  title      String
  slug       String    @unique
  excerpt    String?
  content    String
  coverImage String?
  tags       String[]
  published  Boolean   @default(false)
  publishedAt DateTime?
  author     User      @relation(fields: [authorId], references: [id])
  authorId   String
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  @@index([slug])
  @@index([published])
}
```

`packages/db/prisma/schema/marketing.prisma`:
```prisma
enum ContactStatus {
  UNREAD
  READ
  RESOLVED
}

model Contact {
  id        String        @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String
  status    ContactStatus @default(UNREAD)
  createdAt DateTime      @default(now())

  @@index([status])
}

model Testimonial {
  id         String   @id @default(cuid())
  content    String
  authorName String
  petName    String?
  rating     Int      @default(5)
  published  Boolean  @default(false)
  createdAt  DateTime @default(now())
}

model PricingPlan {
  id        String   @id @default(cuid())
  name      String
  price     Int      // cents
  interval  String   @default("month")
  features  String[]
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 3. Prisma client singleton

`packages/db/src/client.ts`:
```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

`packages/db/src/index.ts`:
```ts
export { prisma } from "./client";
export * from "@prisma/client";
```
> Re-exporting `@prisma/client` gives apps access to generated types (e.g. `Role`, `Post`, `Prisma`) via `@fe-template/db`.

### 4. Seed script (optional, useful for admin/dev)

`packages/db/prisma/seed.ts`: create a small seed inserting one ADMIN user, a couple pets, sample posts, testimonials, and pricing plans. Guard with upserts so it's idempotent. Keep it minimal.

### 5. Env for Prisma

Create `packages/db/.env` (gitignored — verify `.gitignore` covers nested `.env`) with `DATABASE_URL` and `DIRECT_URL` from the details above, because Prisma CLI reads `.env` from the schema's package by default. PLAN 05 will centralize env, but Prisma CLI needs these locally to `generate`/`migrate`. Also add a `packages/db/.env.example` with placeholders.

### 6. Generate the client

```bash
pnpm install
pnpm --filter @fe-template/db db:generate
```

Then create the initial migration (create-only if the DB may not be reachable yet):
```bash
pnpm --filter @fe-template/db db:migrate:create --name init
```
If Supabase is reachable, apply with `pnpm --filter @fe-template/db db:migrate`. Otherwise leave the migration file committed for the user to apply.

### 7. Turbo wiring

`turbo.json` already has a `db:generate` task (from PLAN 01). Ensure apps that depend on `@fe-template/db` trigger generation. Simplest: add a `postinstall` or rely on running `db:generate` before build. Add to root `package.json`:
```json
"scripts": {
  "db:generate": "turbo run db:generate"
}
```
And optionally make app `build` depend on generated client by adding `"db:generate"` to the app build's `dependsOn` if needed. Document this.

### 8. Verify

```bash
pnpm --filter @fe-template/db typecheck
pnpm --filter @fe-template/db db:generate   # must succeed and emit the client
```

## Acceptance criteria

- [ ] `packages/db` exists with split schema files under `prisma/schema/` (schema.prisma + user/pet/post/marketing).
- [ ] `@fe-template/db` exports `prisma` client singleton and re-exports `@prisma/client` types.
- [ ] `prisma generate` succeeds.
- [ ] Initial migration created (applied only if Supabase reachable).
- [ ] `packages/db/.env.example` documents `DATABASE_URL` + `DIRECT_URL`; real `.env` is gitignored.

## Final step — commit and push to main (REQUIRED)

> Ensure no real secrets are committed — `.env` must stay gitignored; only `.env.example` (placeholders) is committed.

```bash
git add -A
git commit -m "feat: add @fe-template/db package with Prisma schema and Supabase config"
git push origin main
```
