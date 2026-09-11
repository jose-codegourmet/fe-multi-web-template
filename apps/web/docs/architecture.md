# `apps/web` Architecture

Rendering model, data flow, state, and boundaries for the public marketing site.

---

## Rendering model

- Next.js 16 App Router with Server Components by default.
- Marketing pages are static or ISR. Home, blog list, blog grid, and blog post routes set `revalidate = 60` to match `next: { revalidate: 60 }` on `use-*/server.ts` fetches. `/showcase` is a static developer catalog (no auth, cookies, or request-time data).
- Do not set `dynamic = "force-dynamic"` unless a page reads cookies, headers, or other request-time data. `apps/web` has no auth or middleware today.
- Client components are marked `"use client"` and live in sections, providers, and interactive UI pieces.

---

## Data flow

```text
Prisma (packages/db)
  → API routes (apps/web/src/app/api/{blog,pricing,testimonials}/route.ts)
  → server.ts fetches (apps/web/src/hooks/use-*/server.ts)
  → HydrationBoundary / React Query client.ts
  → sections and pages
```

- Server Components import `use-*/server.ts` to fetch data at render time with `next: { revalidate: 60 }`.
- Client sections use `use-*/client.ts` for React Query caching.
- No Server Actions in `apps/web`. Mutations are not needed for the marketing site today.

---

## State management

- **Redux Toolkit** (`src/store/slices/themeSlice.ts`) stores the active theme and is the source of truth.
- **next-themes** is synced from Redux in `src/modules/providers/Providers.tsx` so Tailwind dark-mode classes work.
- **TanStack Query** caches server state for blog, pricing, and testimonials.
- Local `useState` is used for simple UI forms (e.g., contact form demo).

---

## Shared package wiring

### `@fe-template/ui`

- Imported via `import { Button, Card, ... } from "@fe-template/ui"`.
- Transpiled by `transpilePackages: ["@fe-template/ui"]` in `next.config.ts`.
- Scanned by Tailwind via `@source "../../../../packages/ui/src/**/*.{ts,tsx}"` in `globals.css`.

### `@fe-template/db`

- Imported only in API routes (`src/app/api/*`).
- Server-only. Never import from client components or pages.

---

## Important boundaries

- No authentication. No middleware.
- API routes are read-only today. No mutations or protected endpoints.
- `NEXT_PUBLIC_SITE_URL` is used for SSR self-fetch but is not in `.env.example`.
- Every `ROUTES` path has a matching `page.tsx`. Company, resource, support, legal, and account CTA routes use shared stub copy in `src/constants/placeholder-pages.ts`.

---

## Routing and navigation

- Routes are defined in `src/app/`.
- Constants are centralized in `src/constants/routes.ts`.
- SEO metadata is in `src/constants/seo.ts`.
- Navigation links are in `src/constants/navigation.ts`.

See `docs/template/PAGES.md` for the full route map and section-to-page mapping.
