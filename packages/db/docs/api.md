# `@fe-template/db` Public API

Documented public exports of `@fe-template/db`. Internal seed and migration helpers are not listed here.

---

## Entry points

| Entry | Path | Exports | Stability |
|---|---|---|---|
| `@fe-template/db` | `src/index.ts` | `prisma` + all `@prisma/client` exports | Stable |
| `@fe-template/db/client` | `src/client.ts` | `prisma` | Stable |

---

## `prisma` singleton

`src/client.ts` exports a single `PrismaClient` instance cached on `globalThis` outside production. This prevents Next.js dev hot reloads from creating new connection pools.

```ts
import { prisma } from "@fe-template/db";

const users = await prisma.user.findMany({ include: { pets: true } });
```

---

## Re-exported Prisma types

`src/index.ts` re-exports everything from `@prisma/client`, including:

- Generated model types: `User`, `Profile`, `Pet`, `PetMatch`, `Post`, `Contact`, `Testimonial`, `PricingPlan` (8 models)
- Enums: `Role`, `UserStatus`, `PetSpecies`, `MatchStatus`, `ContactStatus`
- The `Prisma` namespace
- The `PrismaClient` class

Example:

```ts
import type { Role, UserStatus } from "@fe-template/db";
```

---

## Server-only constraint

`@fe-template/db` must only be imported in server code:

- Server Components
- Server Actions (`"use server"`)
- API route handlers (`route.ts`)
- Middleware
- Seed and migration scripts

Never import `@fe-template/db` from a `"use client"` component.

---

## Error behavior

- Prisma errors bubble up as exceptions. Server Actions should catch them and return serializable error objects to the client.
- Connection errors usually indicate incorrect `DATABASE_URL` or pooler settings. See `docs/environment-variables.md` for pooled vs direct URLs.
- `db:migrate` / `db:deploy` fail before Prisma runs if `auth.users` is missing (plain Postgres). See `packages/db/README.md`.

---

## Stability and breaking changes

- Removing or renaming `prisma` or the `@prisma/client` re-export is a breaking change for all consumers.
- Adding a new model or enum is not breaking.
- Removing a model or enum is breaking. Update all consumers and their docs before removing.
