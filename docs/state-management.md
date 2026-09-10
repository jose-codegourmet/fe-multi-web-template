# State Management — fe-multi-web-template

How state is handled across the monorepo.

---

## `apps/web`

### Redux Toolkit

- Store: `apps/web/src/store/index.ts`
- Hooks: `apps/web/src/store/hooks.ts`
- Slices: `apps/web/src/store/slices/themeSlice.ts`

Redux is used primarily for the theme slice. The slice stores the active theme and `Providers.tsx` syncs it to `next-themes` so Tailwind dark-mode classes apply.

```tsx
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setTheme } from "@/store/slices/themeSlice";
```

### TanStack Query

- Provider: `apps/web/src/modules/providers/Providers.tsx`
- Hooks: `apps/web/src/hooks/use-blog-posts/client.ts`, `use-pricing-plans/client.ts`, `use-testimonials/client.ts`

Server-state (blog posts, pricing, testimonials) is cached via React Query. Server-side fetches happen in `use-*/server.ts` and are revalidated with `next: { revalidate: 60 }`.

### Local component state

Forms that do not need server round-trips (e.g., contact form UI demo) use local `useState`.

---

## `apps/admin`

### TanStack Query

- Provider: `apps/admin/src/modules/providers/Providers.tsx`
- Server Components prefetch data and pass it through `HydrationBoundary`.
- Client components use the matching `use-*/client.ts` hook.

Hooks:
- `use-users`, `use-pets`, `use-posts`, `use-contacts`, `use-testimonials`, `use-pricing-plans`

### `next-themes`

Admin does not use Redux. `next-themes` handles theme toggling directly in the layout/providers.

---

## Shared packages

Neither `packages/ui` nor `packages/db` manage client state. `packages/db` is server-only and must never be imported into client components.

---

## When to use which tool

| Need | Tool |
|---|---|
| Theme across the app | `next-themes` (admin) or Redux → `next-themes` (web) |
| Server data caching | TanStack Query |
| Form state (admin) | `react-hook-form` + `zod` |
| Form state (web, simple) | Local `useState` |
| Global UI state | Local state or React Query, avoid Redux unless truly global |

---

## Adding a new slice

1. Create `apps/web/src/store/slices/[name]Slice.ts`.
2. Add the reducer to `apps/web/src/store/index.ts`.
3. Export typed hooks from `apps/web/src/store/hooks.ts` if needed.
4. Update `apps/web/AGENTS.md` and `apps/web/docs/patterns.md` if the slice changes app-wide patterns.
