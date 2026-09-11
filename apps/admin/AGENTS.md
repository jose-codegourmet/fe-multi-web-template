# Agent Instructions — `apps/admin`

Local agent instructions for the admin portal. Read `/AGENTS.md` first, then this file.

---

## Scope

`apps/admin` is the internal admin portal. It manages users, pets, blog posts, pricing plans, testimonials, and contacts stored in the shared Prisma database. It uses Supabase Auth for authentication.

- **Port**: 9001
- **Filter**: `pnpm --filter admin`
- **Package name**: `admin`

---

## Important directories

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js App Router routes |
| `src/app/(dashboard)/` | Dashboard shell and all protected pages |
| `src/app/login/`, `src/app/signup/`, `src/app/otp/`, `src/app/auth/callback/` | Public auth routes |
| `src/app/api/images/route.ts` | Image upload endpoint for Supabase Storage |
| `src/hooks/` | TanStack Query data hooks in `use-<name>/` folders (`use-users`, `use-pets`, `use-posts`, `use-contacts`, `use-testimonials`, `use-pricing-plans`, `use-current-user`). Viewport utility `use-mobile.ts` stays a single file. |
| `src/lib/supabase/` | Browser, server, and service-role Supabase clients |
| `src/modules/auth/` | Login, signup, and OTP forms |
| `src/modules/layout/` | AdminSidebar, AdminHeader, sidebar components |
| `src/modules/providers/` | Query client, theme, toaster providers |
| `email-templates/` | Supabase Auth email HTML templates (copied to dashboard) |

---

## Shared packages used

- `@fe-template/ui` — all shared UI primitives (Button, DataTable, Dialog, Form, FileUploader, etc.).
- `@fe-template/db` — Prisma client, used in Server Components, Server Actions, and API routes.

---

## Entry points

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Redirects to `/dashboard` |
| `/login` | `src/app/login/page.tsx` | Sign in |
| `/signup` | `src/app/signup/page.tsx` | Sign up |
| `/otp` | `src/app/otp/page.tsx` | OTP confirmation |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Signup email confirmation (PKCE code exchange) |
| `/dashboard` | `src/app/(dashboard)/dashboard/page.tsx` | Dashboard with stats and charts |
| `/users` | `src/app/(dashboard)/users/page.tsx` | User list |
| `/users/[id]` | `src/app/(dashboard)/users/[id]/page.tsx` | User detail |
| `/pets` | `src/app/(dashboard)/pets/page.tsx` | Pet list |
| `/posts` | `src/app/(dashboard)/posts/page.tsx` | Blog post list |
| `/posts/new` | `src/app/(dashboard)/posts/new/page.tsx` | Create post |
| `/posts/[id]` | `src/app/(dashboard)/posts/[id]/page.tsx` | Edit post |
| `/testimonials` | `src/app/(dashboard)/testimonials/page.tsx` | Testimonial moderation |
| `/contacts` | `src/app/(dashboard)/contacts/page.tsx` | Contact inbox |
| `/pricing-plans` | `src/app/(dashboard)/pricing-plans/page.tsx` | Pricing plan CRUD |
| `/profile` | `src/app/(dashboard)/profile/page.tsx` | Admin profile |
| `/api/images` | `src/app/api/images/route.ts` | Upload image to Supabase Storage |

---

## Validation commands

| Concern | Command |
|---|---|
| Dev | `pnpm --filter admin dev` |
| Build | `pnpm --filter admin build` |
| Type check | `pnpm --filter admin typecheck` |
| Lint (ESLint) | `pnpm --filter admin lint` |
| Biome (repo-wide) | `pnpm lint` |
| Storybook | `pnpm --filter admin storybook` |

---

## Restrictions and boundaries

- All routes under `(dashboard)` are protected by `middleware.ts` by session presence only. Unauthenticated `/api/*` requests are not redirected to `/login`; the route handler returns JSON. A TODO in `middleware.ts` notes that `User.role === ADMIN` enforcement is not yet wired.
- `(dashboard)/layout.tsx` is a client component (pathname → header title). Dashboard widgets `community-growth-chart.tsx` and `recent-activity.tsx` live at the route-group root. There are two 404 files (`app/not-found.tsx` and `(dashboard)/not-found.tsx`) plus `loading.tsx` / `error.tsx` at the app root and `(dashboard)` group. See `apps/admin/docs/architecture.md`.
- `@fe-template/db` and `src/lib/supabase/admin.ts` are server-only. Never import them from client components.
- Forms use `react-hook-form` + `zod` + `@hookform/resolvers`. Follow the existing `.schema.ts` and `.defaultValues.ts` pattern in auth modules.
- Shared UI wiring must remain in place: `transpilePackages` in `next.config.ts` and the `@source` directive in `globals.css`.
- The empty directory `src/login/` is not used. Use `src/app/login/`.
- Signup email confirmation uses `/auth/callback` (public middleware route) to exchange the Supabase auth code for a session.

---

## Common task routing

| Task | Read next |
|---|---|
| New CRUD page | `apps/admin/docs/patterns.md`, `docs/api-and-data-fetching.md` |
| New auth flow | `apps/admin/docs/architecture.md`, `docs/api-and-data-fetching.md` |
| New table or dialog | `apps/admin/docs/patterns.md`, `docs/component-guide.md` |
| New form | `docs/frontend-conventions.md`, inspect `src/modules/auth/login-form/` |
| Image upload | `src/lib/upload-image.ts`, `src/app/api/images/route.ts` |
| Database change | `packages/db/docs/development.md`, `docs/api-and-data-fetching.md` |

---

## Documentation maintenance

Update this file and `apps/admin/docs/` when:
- A new route is added.
- Auth or role enforcement changes.
- A new shared package is consumed.
- A new environment variable is required.
- The validation commands change.
