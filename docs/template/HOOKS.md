# API Hooks

API hooks in `apps/web/src/hooks/` follow a client/server split pattern for TanStack Query integration with Next.js App Router server components.

---

## Folder Structure

Each hook is a kebab-case folder starting with `use-`:

```text
src/hooks/use-my-hook/
├── client.ts    ← useMyHook (React Query hook for client components)
└── server.ts    ← fetchMyHook (server-side fetch / prefetch for RSC)
```

---

## Naming Rules

| Element | Convention | Example |
| --- | --- | --- |
| Folder | `use-` prefix, kebab-case | `use-pet-profiles/` |
| Client export | `use` + PascalCase | `usePetProfiles` in `client.ts` |
| Server export | `fetch` + PascalCase | `fetchPetProfiles` in `server.ts` |

---

## Client Hook (`client.ts`)

Used in Client Components (`"use client"`). Wraps TanStack Query:

```ts
// src/hooks/use-pet-profiles/client.ts
import { useQuery } from "@tanstack/react-query";

export function usePetProfiles() {
  return useQuery({
    queryKey: ["pet-profiles"],
    queryFn: () => fetch("/api/pet-profiles").then((r) => r.json()),
  });
}
```

---

## Server Fetch (`server.ts`)

Used in Server Components and for prefetching before hydration:

```ts
// src/hooks/use-pet-profiles/server.ts
export async function fetchPetProfiles() {
  const res = await fetch(`${process.env.API_URL}/pet-profiles`, {
    next: { revalidate: 60 },
  });
  return res.json();
}
```

Prefetch in a Server Component page:

```tsx
// app/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchPetProfiles } from "@/hooks/use-pet-profiles/server";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["pet-profiles"],
    queryFn: fetchPetProfiles,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* client components that call usePetProfiles() */}
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

These do not need a `client.ts` / `server.ts` split.

---

## React Query Devtools

TanStack Query Devtools are included in development only. Do not import or render them in production builds.
