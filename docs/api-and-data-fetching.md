# API and Data Fetching — fe-multi-web-template

How data flows through the monorepo, including React Query, Prisma, Server Actions, API routes, and shared-package usage.

---

## Overview

| App | Server data source | Client data access |
|---|---|---|
| `apps/web` | Prisma via internal API routes (`src/app/api/*`) | TanStack Query hooks (`src/hooks/use-*/client.ts`) |
| `apps/admin` | Prisma directly in Server Components and Server Actions | TanStack Query hooks + TanStack Table in client components |

`@fe-template/db` is server-only. Never import it from a `"use client"` component in either app.

---

## `apps/web` pattern: API routes + React Query

### Internal API routes

These routes query `prisma` and return JSON:

| Route | File | Purpose |
|---|---|---|
| `GET /api/blog` | `apps/web/src/app/api/blog/route.ts` | Blog posts |
| `GET /api/pricing` | `apps/web/src/app/api/pricing/route.ts` | Pricing plans |
| `GET /api/testimonials` | `apps/web/src/app/api/testimonials/route.ts` | Testimonials |

### Hook structure

```text
apps/web/src/hooks/use-blog-posts/
  ├── client.ts              # useBlogPosts() React Query hook
  ├── server.ts              # server-side fetch with ISR revalidation
  ├── query.ts               # Query keys/options
  └── types.ts               # Shared types
```

Example `server.ts` pattern:

```ts
import { getApiOrigin } from "@/lib/utils";

export async function getBlogPosts() {
  const res = await fetch(new URL("/api/blog", getApiOrigin()), {
    next: { revalidate: 60 },
  });
  return res.json();
}
```

`getApiOrigin` uses `NEXT_PUBLIC_SITE_URL` or falls back to `http://localhost:9000`.

### Server Component usage

```tsx
import { getBlogPosts } from "@/hooks/use-blog-posts/server";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  return <BlogGrid posts={posts} />;
}
```

### Client usage

```tsx
import { useBlogPosts } from "@/hooks/use-blog-posts/client";

export function BlogSection() {
  const { data } = useBlogPosts();
  // ...
}
```

---

## `apps/admin` pattern: Prisma + Server Actions

### Server Components query directly

```tsx
import { prisma } from "@fe-template/db";

export default async function UsersPage() {
  const users = await prisma.user.findMany({ include: { pets: true } });
  return <UsersTable users={users} />;
}
```

### Prefetch + hydration

```tsx
import { getUsers } from "@/hooks/use-users/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({ queryKey: ["users"], queryFn: getUsers });
  return <HydrationBoundary state={dehydrate(queryClient)}><UsersTable /></HydrationBoundary>;
}
```

### Server Actions

Mutations live in route-colocated `actions.ts`:

```ts
"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";

export async function updateUser(formData: FormData) {
  // parse + validate with zod
  await prisma.user.update({ where: { id }, data });
  revalidatePath("/users");
}
```

Examples:
- `apps/admin/src/app/(dashboard)/users/actions.ts`
- `apps/admin/src/app/(dashboard)/posts/actions.ts`
- `apps/admin/src/app/(dashboard)/contacts/actions.ts`

### Supabase admin actions

Some admin actions (user invites) use the service role client:

```ts
import { createAdminClient } from "@/lib/supabase/admin";
```

See `apps/admin/src/app/(dashboard)/users/actions.ts` for the `inviteUserByEmail` pattern.

---

## Hook conventions (both apps)

Standard folder layout:

```text
hooks/use-[name]/
  ├── client.ts              # React Query hook
  ├── server.ts              # Server-side data source
  ├── query.ts               # Query key factory
  ├── types.ts               # Types
  └── useX.ts                # Barrel re-export
```

- `apps/web` uses this for `use-blog-posts`, `use-pricing-plans`, `use-testimonials`.
- `apps/admin` uses this for `use-users`, `use-pets`, `use-posts`, `use-contacts`, `use-testimonials`, `use-pricing-plans`.

See `docs/template/HOOKS.md` for more details.

---

## `@fe-template/db` API

Entry points:

| Entry | Exports | Use when |
|---|---|---|
| `@fe-template/db` | `prisma` + all `@prisma/client` exports | Default. Import from server code only. |
| `@fe-template/db/client` | `prisma` only | Rarely used; reserved for tree-shake preference. |

Example:

```ts
import { prisma } from "@fe-template/db";
import type { Role, UserStatus } from "@fe-template/db";
```

The client is a singleton cached on `globalThis` outside production to avoid connection pool exhaustion during Next.js dev hot reloads.

---

## Prisma schema layout

Multi-file schema under `packages/db/prisma/schema/`:

```text
packages/db/prisma/schema/
├── schema.prisma       # generator + datasource
├── user.prisma         # User, Profile, Role, UserStatus
├── pet.prisma          # Pet, PetSpecies, PetMatch, MatchStatus
├── post.prisma         # Post
└── marketing.prisma    # Contact, Testimonial, PricingPlan, ContactStatus
```

After changing a `.prisma` file:

```bash
pnpm --filter @fe-template/db db:migrate
pnpm --filter @fe-template/db db:generate
```

---

## Server-only rule

`@fe-template/db` and `apps/admin/src/lib/supabase/admin.ts` must only run on the server:

- Server Components
- Server Actions (`"use server"`)
- API route handlers (`route.ts`)
- Middleware

Never import them into a `"use client"` component.

---

## Error handling

- Admin Server Actions return serializable `{ success, error }` objects.
- Client components use `sonner` (`toast()`) to surface errors.
- Web API routes return standard Next.js `Response` objects; React Query surfaces errors on the client.

---

## Image uploads

`apps/admin` has a single API route for uploads:

| Route | File | Purpose |
|---|---|---|
| `POST /api/images` | `apps/admin/src/app/api/images/route.ts` | Upload an image to the Supabase Storage bucket `admin-uploads` |

The `FileUploader` component from `@fe-template/ui` is used in admin forms. See `apps/admin/src/lib/upload-image.ts` for the client-side helper.
