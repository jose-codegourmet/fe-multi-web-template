# `apps/web` — Public Marketing Site

Purpose, routes, shared packages, and commands for the public marketing site.

---

## Purpose

`apps/web` is the public-facing PawPair marketing site. It showcases the fictional pet social discovery app through a home page, about page, blog, pricing, contact, and component showcase. It has no authentication and renders demo content served by internal API routes.

- **Primary users**: Public visitors
- **Port**: 9000
- **Filter**: `web`

---

## Main responsibilities

- Display marketing content via page sections.
- Serve blog posts, pricing plans, and testimonials through API routes.
- Provide SEO-friendly pages with Next.js App Router.
- Showcase shared UI primitives on `/showcase`.

---

## Technology

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19, `@fe-template/ui`, Tailwind CSS 4 |
| State | Redux Toolkit (theme), TanStack Query (server state) |
| Data | Internal API routes + Prisma via `@fe-template/db` |
| Auth | None |
| Styling | Tailwind CSS 4, `next/font` (Fraunces, Manrope) |

---

## Routes and entry points

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Home page |
| `/about` | `src/app/about/page.tsx` | About page |
| `/blog` | `src/app/blog/page.tsx` | Blog listing |
| `/blog/grid` | `src/app/blog/grid/page.tsx` | Blog grid view |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | Blog post detail |
| `/contact` | `src/app/contact/page.tsx` | Contact page |
| `/pricing` | `src/app/pricing/page.tsx` | Pricing page |
| `/showcase` | `src/app/showcase/page.tsx` | Component showcase |
| `/otp` | `src/app/otp/page.tsx` | OTP UI demo (no real auth) |
| `/careers` | `src/app/careers/page.tsx` | Company stub |
| `/partners` | `src/app/partners/page.tsx` | Company stub |
| `/press` | `src/app/press/page.tsx` | Company stub |
| `/resources/community-guide` | `src/app/resources/community-guide/page.tsx` | Resource stub |
| `/resources/first-meet-checklist` | `src/app/resources/first-meet-checklist/page.tsx` | Resource stub |
| `/help` | `src/app/help/page.tsx` | Help center stub |
| `/status` | `src/app/status/page.tsx` | Status stub |
| `/legal/privacy` | `src/app/legal/privacy/page.tsx` | Legal stub |
| `/legal/terms` | `src/app/legal/terms/page.tsx` | Legal stub |
| `/legal/community-guidelines` | `src/app/legal/community-guidelines/page.tsx` | Legal stub |
| `/legal/cookies` | `src/app/legal/cookies/page.tsx` | Legal stub |
| `/legal/accessibility` | `src/app/legal/accessibility/page.tsx` | Legal stub |
| `/sign-in` | `src/app/sign-in/page.tsx` | Auth CTA stub (no auth) |
| `/create-profile` | `src/app/create-profile/page.tsx` | Auth CTA stub (no auth) |
| `/api/blog` | `src/app/api/blog/route.ts` | Blog posts JSON |
| `/api/pricing` | `src/app/api/pricing/route.ts` | Pricing plans JSON |
| `/api/testimonials` | `src/app/api/testimonials/route.ts` | Testimonials JSON |

---

## Important directories

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js routes and API routes |
| `src/sections/` | Page sections, one folder per page |
| `src/modules/layout/` | Header, footer, navigation, sidebar |
| `src/modules/providers/` | Redux, TanStack Query, next-themes providers |
| `src/hooks/` | React Query hooks (`use-blog-posts`, `use-pricing-plans`, `use-testimonials`) |
| `src/constants/` | `routes.ts`, `seo.ts`, `navigation.ts` |
| `src/types/` | Marketing-domain types (blog, pricing, pets, testimonials) |
| `src/store/` | Redux store and theme slice |
| `src/lib/` | Utility helpers and mock data |
| `public/images/` | Brand, hero, product, feature, pet, blog, and illustration assets |

---

## Shared packages consumed

- `@fe-template/ui` — all shared UI primitives.
- `@fe-template/db` — Prisma client, used only in API routes.

---

## External services

- **Prisma / Supabase Postgres** — API routes query the shared database.
- No Supabase Auth, no email service, no third-party APIs.

---

## Environment variables

| Variable | Purpose | Required? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Scaffolding only; not used in source | No |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Scaffolding only; not used in source | No |
| `NEXT_PUBLIC_SITE_URL` | API origin for SSR self-fetch (falls back to `http://localhost:9000`) | Recommended |

Note: `NEXT_PUBLIC_SITE_URL` is used in `src/hooks/use-*/server.ts` but is not in `apps/web/.env.example`.

---

## Scripts

| Script | Command | Purpose |
|---|---|---|
| Dev | `pnpm --filter web dev` | Start dev server on port 9000 |
| Build | `pnpm --filter web build` | Production build |
| Start | `pnpm --filter web start` | Start built app on port 9000 |
| Type check | `pnpm --filter web typecheck` | `tsc --noEmit` |
| Lint | `pnpm --filter web lint` | ESLint |
| Storybook | `pnpm --filter web storybook` | Storybook on port 6006 |

---

## Local docs

- `apps/web/docs/architecture.md` — rendering and data flow
- `apps/web/docs/development.md` — local setup and debugging
- `apps/web/docs/patterns.md` — concrete patterns and file references

---

## Common task routing

| Task | Read next |
|---|---|
| New page | `apps/web/docs/patterns.md`, `docs/template/PAGES.md` |
| New section | `apps/web/docs/patterns.md`, `docs/template/COMPONENTS.md` |
| New API route | `apps/web/docs/architecture.md`, `docs/api-and-data-fetching.md` |
| Styling | `docs/styling-and-design-system.md` |
| State | `docs/state-management.md` |
