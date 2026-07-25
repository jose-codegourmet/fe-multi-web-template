# PLAN 04 — Scaffold `apps/admin` (admin portal)

> Execute this plan in a fresh agent session. It is self-contained. Run **after** `PLAN_02_PACKAGES_UI.md` and `PLAN_03_PACKAGES_DB.md`. When finished, **always commit and push to `main`** (see final step).

## Goal

Create `apps/admin`, a Next.js 16 App Router admin portal for `apps/web`. It provides:
- **Dashboard** — overview stats + charts (analytics)
- **User management** — list/search users, view detail, change role
- **Pets** — list pet profiles
- **Content (CMS)** — blog posts: list / create / edit / publish; testimonials management
- **Contacts** — contact-form submissions inbox with status
- **Auth** — Supabase Auth login gating all admin routes

It consumes `@fe-template/ui` (primitives) and `@fe-template/db` (Prisma client). Match the stack and conventions of `apps/web`.

## Context / conventions to mirror from `apps/web`

- Next.js **16.2.10**, React **19.2.4**, TypeScript 5, Tailwind CSS 4 (`@tailwindcss/postcss`), shadcn style `base-nova`.
- `apps/web/tsconfig.json` maps `"@/*": ["./src/*"]`.
- `apps/web/next.config.ts` uses `reactStrictMode` + (after PLAN 02) `transpilePackages`.
- Primitives now live in `@fe-template/ui`; import from there.
- Prisma client comes from `@fe-template/db`.
- Layout modules pattern lives under `apps/web/src/modules/layout` (Header/Footer/Sidebar) — reuse the Sidebar pattern for admin nav.

## Steps

### 1. Scaffold app config

Create `apps/admin/package.json` (mirror web deps; admin needs UI + db + supabase; drop marketing-only deps if desired but simplest is to mirror):
```json
{
  "name": "admin",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "lint": "eslint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@fe-template/ui": "workspace:*",
    "@fe-template/db": "workspace:*",
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.47.0",
    "@reduxjs/toolkit": "^2.12.0",
    "@tanstack/react-query": "^5.101.2",
    "@tanstack/react-table": "^8.21.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^1.24.0",
    "next": "16.2.10",
    "next-themes": "^0.4.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-redux": "^9.3.0",
    "recharts": "3.8.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0",
    "zod": "^4.4.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.10",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```
> `dev`/`start` run on port **3001** so web (3000) and admin (3001) run simultaneously.

Create these mirroring `apps/web`:
- `apps/admin/tsconfig.json` — copy web's, keep `"@/*": ["./src/*"]`.
- `apps/admin/next.config.ts`:
  ```ts
  import type { NextConfig } from "next";
  const nextConfig: NextConfig = {
    reactStrictMode: true,
    transpilePackages: ["@fe-template/ui"],
  };
  export default nextConfig;
  ```
- `apps/admin/postcss.config.mjs` — copy from web.
- `apps/admin/eslint.config.mjs` — copy from web.
- `apps/admin/next-env.d.ts` — copy from web (or let `next dev` generate it).

### 2. Global styles

Create `apps/admin/src/app/globals.css` by copying `apps/web/src/app/globals.css` (Tailwind 4 theme tokens + `base-nova` variables). Include the `@source` directive for the UI package:
```css
@source "../../../../packages/ui/src/**/*.{ts,tsx}";
```
Verify the relative depth to `packages/ui/src`.

### 3. Supabase client helpers

Create `apps/admin/src/lib/supabase/client.ts` (browser) and `apps/admin/src/lib/supabase/server.ts` (server, cookie-based) using `@supabase/ssr`:

`client.ts`:
```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
```

`server.ts`:
```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // called from a Server Component; middleware refreshes the session
          }
        },
      },
    },
  );
}
```

### 4. Auth middleware (route gating)

Create `apps/admin/middleware.ts` that refreshes the Supabase session and redirects unauthenticated users to `/login` for every route except `/login` and static assets. Use the standard `@supabase/ssr` middleware pattern (`createServerClient` with request/response cookie plumbing, then `supabase.auth.getUser()` → redirect if null).

> Since the user is configuring Supabase themselves, keep auth logic standard and documented. Admin-role enforcement (checking `User.role === ADMIN` via Prisma) can be a follow-up — add a TODO comment where the role check would go.

### 5. Providers

Create `apps/admin/src/modules/providers/Providers.tsx` wrapping children with TanStack Query client, `next-themes` `ThemeProvider`, and `sonner` Toaster. (Redux optional — include a minimal store only if a feature needs it; otherwise skip to keep admin lean. If skipping Redux, remove redux deps from step 1.)

### 6. Admin shell layout

`apps/admin/src/app/layout.tsx`: root layout importing `globals.css`, wrapping `<Providers>`.

Create an admin chrome under `apps/admin/src/modules/layout/`:
- `AdminSidebar.tsx` — vertical nav using `@fe-template/ui` primitives + `lucide-react` icons. Links: Dashboard `/`, Users `/users`, Pets `/pets`, Posts `/posts`, Testimonials `/testimonials`, Contacts `/contacts`.
- `AdminHeader.tsx` — top bar with page title, theme toggle, sign-out button (calls `supabase.auth.signOut()`).

Use a route group so the login page is outside the shell:
```
apps/admin/src/app/
  (dashboard)/
    layout.tsx        # renders AdminSidebar + AdminHeader + {children}
    page.tsx          # Dashboard
    users/page.tsx
    users/[id]/page.tsx
    pets/page.tsx
    posts/page.tsx
    posts/new/page.tsx
    posts/[id]/page.tsx
    testimonials/page.tsx
    contacts/page.tsx
  login/page.tsx
  layout.tsx          # root
  globals.css
```

### 7. Pages (Server Components query Prisma directly)

All list/detail pages are async Server Components that import `{ prisma }` from `@fe-template/db`.

- **Dashboard `(dashboard)/page.tsx`**: stat cards (counts of users, pets, posts, unread contacts via `prisma.user.count()` etc.) + a `recharts` chart of posts-per-month or signups-per-month. Use `@fe-template/ui` Card/Chart.
- **Users `/users`**: `prisma.user.findMany` rendered in a data table (`@tanstack/react-table` + UI table primitive). Columns: avatar/name, email, role, pets count, createdAt. Search box (client filter is fine to start).
- **User detail `/users/[id]`**: user info + their pets and posts.
- **Pets `/pets`**: `prisma.pet.findMany({ include: { owner: true } })` in a table.
- **Posts `/posts`**: `prisma.post.findMany({ include: { author: true } })` with published badge and Edit link.
- **Create post `/posts/new`** and **Edit `/posts/[id]`**: a form (title, slug, excerpt, content textarea, tags, published switch, cover image URL). Submit via a **Server Action** (`"use server"`) that calls `prisma.post.create/update` then `revalidatePath("/posts")` and redirects. Use Zod to validate.
- **Testimonials `/testimonials`**: list with publish toggle (Server Action updates `published`).
- **Contacts `/contacts`**: inbox table with status badges; Server Action to mark READ/RESOLVED.

Keep forms and mutations as Server Actions to avoid building a separate API layer. Where interactivity is needed (toggles, table filtering), use small `"use client"` components.

### 8. Login page

`apps/admin/src/app/login/page.tsx`: a client component with email/password (or magic link) using the browser Supabase client. On success, redirect to `/`. Style with `@fe-template/ui` Card/Input/Button. Add a note that the user must create an admin user in Supabase.

### 9. Env

Admin needs (documented fully in PLAN 05):
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
DATABASE_URL=...
DIRECT_URL=...
```
Create `apps/admin/.env.local` (gitignored) with the values from PLAN 03/05 and `apps/admin/.env.example` with placeholders.

### 10. Turbo / workspace

`apps/admin` is picked up by the existing `apps/*` workspace glob and Turbo tasks automatically. Confirm `pnpm install` links `@fe-template/ui` and `@fe-template/db`.

### 11. Verify

```bash
pnpm install
pnpm --filter admin typecheck
pnpm --filter admin build
pnpm --filter admin dev   # visit http://localhost:3001 -> redirected to /login
```
> DB-backed pages require a reachable Supabase DB + generated Prisma client. If the DB isn't provisioned yet, ensure pages fail gracefully / typecheck still passes. It's acceptable for runtime data to be empty until the user finishes Supabase setup.

## Acceptance criteria

- [ ] `apps/admin` runs on port 3001 and builds.
- [ ] Consumes `@fe-template/ui` and `@fe-template/db`.
- [ ] Supabase auth middleware gates all `(dashboard)` routes; `/login` works.
- [ ] Pages exist: dashboard, users (+detail), pets, posts (list/new/edit), testimonials, contacts.
- [ ] Post create/edit and status toggles use Server Actions writing via Prisma.
- [ ] `apps/admin/.env.example` present; real `.env.local` gitignored.
- [ ] `pnpm typecheck` passes across the repo.

## Final step — commit and push to main (REQUIRED)

```bash
git add -A
git commit -m "feat: add apps/admin portal (CMS, user management, analytics) with Supabase auth"
git push origin main
```
