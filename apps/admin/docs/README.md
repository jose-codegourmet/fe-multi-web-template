# `apps/admin` — Admin Portal

Purpose, routes, features, and commands for the admin portal.

---

## Purpose

`apps/admin` is the internal admin portal for the PawPair example. It manages users, pets, blog posts, pricing plans, testimonials, and contacts stored in the shared Prisma database. It uses Supabase Auth for authentication and runs alongside `apps/web` on port 9001.

- **Primary users**: Internal admins
- **Port**: 9001
- **Filter**: `admin`

---

## Main responsibilities

- Dashboard with stats and charts.
- User management (list, search, detail, role change, status change, invite).
- Pet profile management.
- Blog post CMS (list, create, edit, publish).
- Testimonial moderation.
- Contact inbox with status workflow.
- Pricing plan CRUD.

---

## Technology

| Layer | Choice |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19, `@fe-template/ui`, Tailwind CSS 4 |
| Auth | Supabase Auth via `@supabase/ssr` |
| Data | Prisma via `@fe-template/db` (Server Components + Server Actions) |
| Tables | TanStack Table |
| Forms | `react-hook-form` + `zod` + `@hookform/resolvers` |
| Charts | Recharts |
| State | TanStack Query + next-themes |

---

## Routes and entry points

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Redirects to `/dashboard` |
| `/login` | `src/app/login/page.tsx` | Sign in |
| `/signup` | `src/app/signup/page.tsx` | Sign up |
| `/otp` | `src/app/otp/page.tsx` | OTP confirmation |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Signup email confirmation callback |
| `/dashboard` | `src/app/(dashboard)/dashboard/page.tsx` | Dashboard |
| `/users` | `src/app/(dashboard)/users/page.tsx` | User list |
| `/users/[id]` | `src/app/(dashboard)/users/[id]/page.tsx` | User detail |
| `/pets` | `src/app/(dashboard)/pets/page.tsx` | Pet list |
| `/posts` | `src/app/(dashboard)/posts/page.tsx` | Post list |
| `/posts/new` | `src/app/(dashboard)/posts/new/page.tsx` | Create post |
| `/posts/[id]` | `src/app/(dashboard)/posts/[id]/page.tsx` | Edit post |
| `/testimonials` | `src/app/(dashboard)/testimonials/page.tsx` | Testimonials |
| `/contacts` | `src/app/(dashboard)/contacts/page.tsx` | Contacts |
| `/pricing-plans` | `src/app/(dashboard)/pricing-plans/page.tsx` | Pricing plans |
| `/profile` | `src/app/(dashboard)/profile/page.tsx` | Admin profile |
| `/api/images` | `src/app/api/images/route.ts` | Image upload |

---

## Important directories

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js routes, API routes, and layouts |
| `src/app/(dashboard)/` | Protected dashboard shell and pages |
| `src/hooks/` | TanStack Query hooks for dashboard entities |
| `src/lib/supabase/` | Browser, server, and service-role Supabase clients |
| `src/modules/auth/` | Login, signup, OTP forms |
| `src/modules/layout/` | AdminSidebar, AdminHeader, sidebar |
| `src/modules/providers/` | Query client, theme, toaster providers |
| `email-templates/` | Supabase Auth email HTML |

---

## Shared packages consumed

- `@fe-template/ui` — all shared UI primitives.
- `@fe-template/db` — Prisma client and types, used server-side only.

---

## External services

- **Supabase Auth** — session-based auth, login/signup/OTP, email confirmation callback, user invites.
- **Supabase Storage** — `admin-uploads` bucket for image uploads.
- **Supabase Postgres** — backing database, accessed via Prisma.

---

## Environment variables

| Variable | Purpose | Required? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (browser + middleware + server) | Yes |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for admin invites | Yes for user invite |
| `DATABASE_URL` | Prisma runtime connection | Yes |
| `DIRECT_URL` | Prisma direct connection for migrations | Yes for migrations |

---

## Scripts

| Script | Command | Purpose |
|---|---|---|
| Dev | `pnpm --filter admin dev` | Start dev server on port 9001 |
| Build | `pnpm --filter admin build` | Production build |
| Start | `pnpm --filter admin start` | Start built app on port 9001 |
| Type check | `pnpm --filter admin typecheck` | `tsc --noEmit` |
| Lint | `pnpm --filter admin lint` | ESLint |
| Storybook | `pnpm --filter admin storybook` | Storybook on port 6007 |

---

## Local docs

- `apps/admin/docs/architecture.md` — auth, rendering, data flow
- `apps/admin/docs/development.md` — setup, first admin login, debugging
- `apps/admin/docs/patterns.md` — CRUD patterns and file references

---

## Common task routing

| Task | Read next |
|---|---|
| New CRUD page | `apps/admin/docs/patterns.md`, `docs/api-and-data-fetching.md` |
| Auth change | `apps/admin/docs/architecture.md`, `docs/api-and-data-fetching.md` |
| New form | `apps/admin/docs/patterns.md`, `docs/frontend-conventions.md` |
| Database change | `packages/db/docs/development.md` |
| Shared UI change | `packages/ui/docs/README.md` |
