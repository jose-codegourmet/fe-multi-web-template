# API Hooks

API hooks live in each app's own `src/hooks/` folder (`apps/web/src/hooks/`, `apps/admin/src/hooks/`) and follow a client/server split for TanStack Query plus Next.js App Router. Hooks are not shared through `packages/ui` — that package holds presentational primitives only.

## Inventory

### `apps/web`

| Folder / file | Role |
| --- | --- |
| `use-blog-posts/` | `fetchBlogPosts`, `useBlogPosts`, `blogPostsQueryKey` |
| `use-pricing-plans/` | `fetchPricingPlans`, `usePricingPlans` |
| `use-testimonials/` | `fetchTestimonials`, `useTestimonials` |
| `use-mobile.ts` | Viewport utility (single file, no `client.ts` / `server.ts`) |

### `apps/admin`

| Folder / file | Role |
| --- | --- |
| `use-users/` | `fetchUsers`, `fetchUser`, `useUsers`, `usersQueryKey` |
| `use-pets/` | `fetchPets`, `usePets` |
| `use-posts/` | `fetchPosts`, `fetchPost`, `usePosts` |
| `use-contacts/` | `fetchContacts`, `useContacts` |
| `use-testimonials/` | `fetchTestimonials`, `useTestimonials` |
| `use-pricing-plans/` | `fetchPricingPlans` (no barrel file) |
| `use-current-user.ts` | Client current-user hook |
| `current-user.ts` | Server `fetchCurrentUserByEmail` |
| `use-mobile.ts` | Viewport utility |

---

## Folder Structure

Each data hook is a kebab-case folder starting with `use-`:

```text
apps/<app>/src/hooks/use-blog-posts/
├── client.ts    ← useBlogPosts (React Query hook)
├── server.ts    ← fetchBlogPosts (server fetch / Prisma)
├── query.ts     ← blogPostsQueryKey.list()
├── types.ts
└── useBlogPosts.ts  ← barrel (most folders have one; admin use-pricing-plans does not)
```

---

## Naming Rules

| Element | Convention | Example |
| --- | --- | --- |
| Folder | `use-` prefix, kebab-case | `use-blog-posts/` |
| Client export | `use` + PascalCase | `useBlogPosts` in `client.ts` |
| Server export | `fetch` + PascalCase | `fetchBlogPosts` in `server.ts` |
| Query keys | `*QueryKey.list()` | `blogPostsQueryKey.list()` → `["blog-posts","list"]` |

---

## Client Hook (`client.ts`)

Used in Client Components (`"use client"`). Wraps TanStack Query and **re-imports the same `fetch*` function from `server.ts`** (it does not call `/api/...` from the browser as a separate path):

```ts
// apps/web/src/hooks/use-blog-posts/client.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { blogPostsQueryKey } from "./query";
import { fetchBlogPosts } from "./server";

export function useBlogPosts() {
  return useQuery({
    queryKey: blogPostsQueryKey.list(),
    queryFn: fetchBlogPosts,
  });
}
```

`next: { revalidate: 60 }` on the server fetch is a no-op when this runs in the browser.

---

## Server Fetch (`server.ts`)

`apps/web` fetchers hit internal API routes with an inline origin (there is no `API_URL` or `getApiOrigin`):

```ts
// apps/web/src/hooks/use-blog-posts/server.ts
const apiOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:9000";

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch(new URL("/api/blog", apiOrigin), {
    next: { revalidate: 60 },
  });
  if (!response.ok) {
    throw new Error("Unable to load blog posts.");
  }
  return response.json();
}
```

`apps/admin` `server.ts` files query `prisma` from `@fe-template/db` directly (for example `fetchUsers` in `use-users/server.ts`).

Prefetch in a Server Component page uses `new QueryClient()` and `*QueryKey.list()`:

```tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { blogPostsQueryKey } from "@/hooks/use-blog-posts/query";
import { fetchBlogPosts } from "@/hooks/use-blog-posts/server";

export default async function BlogPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: blogPostsQueryKey.list(),
    queryFn: fetchBlogPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* client components that call useBlogPosts() */}
    </HydrationBoundary>
  );
}
```

---

## Utility Hooks

Simple utility hooks that do not call an API may live as a single file (no folder):

```text
src/hooks/use-mobile.ts
```

Admin also keeps `use-current-user.ts` and `current-user.ts` as single files outside the `use-<name>/` folder convention.

---

## React Query Devtools

TanStack Query Devtools are included in development only. Do not import or render them in production builds.

---

## Admin: Prisma in `server.ts`, Server Actions for writes

In `apps/admin`, list pages prefetch `fetch*` helpers that query Prisma. Mutations go through route-colocated Server Actions. Reach for a TanStack Query hook for client-driven UI (tables, dialogs, optimistic updates) — see [`docs/llm/PATTERNS.md`](../llm/PATTERNS.md#data-access) and [`docs/api-and-data-fetching.md`](../api-and-data-fetching.md).
