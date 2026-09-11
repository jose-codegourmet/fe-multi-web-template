# `apps/admin` Architecture

Authentication, rendering, data flow, and state management for the admin portal.

---

## Authentication flow

```mermaid
flowchart TD
    LOGIN["/login\nLoginForm"] -->|signInWithPassword| SERVER["Supabase Auth"]
    SIGNUP["/signup\nSignupForm"] -->|signUp| OTP["/otp\nOtpForm"]
    SIGNUP -->|email link| CALLBACK["/auth/callback"]
    CALLBACK -->|exchangeCodeForSession| CREATE_PROFILE["createProfile\nServer Action"]
    OTP -->|verifyOtp| CREATE_PROFILE
    CREATE_PROFILE -->|upsert Profile| PRISMA["Prisma / Profile"]
    SERVER -->|session cookie| DASHBOARD["/dashboard"]
    CREATE_PROFILE --> DASHBOARD
    MIDDLEWARE["middleware.ts"] -->|refresh + gate| DASHBOARD
```

### Middleware

`apps/admin/middleware.ts`:

- Refreshes the Supabase session on every request.
- Redirects unauthenticated visitors from protected **page** routes to `/login`.
- Does not redirect unauthenticated `/api/*` requests. Those continue to the route handler (for example `POST /api/images` returns JSON `401`).
- Redirects authenticated visitors away from `/login`, `/signup`, `/otp` to `/dashboard`.
- Treats `/auth/callback` as a public route so the confirmation link can exchange the auth code while unauthenticated. Authenticated visitors are not redirected away from the callback.
- **Known boundary**: gates on session presence only; `TODO` notes `User.role === ADMIN` enforcement is not yet wired.

### Supabase clients

| Client | Path | Use |
|---|---|---|
| Browser | `src/lib/supabase/client.ts` | Login, signup, OTP, sign-out forms |
| Server (cookie) | `src/lib/supabase/server.ts` | Server Components / Server Actions needing auth context |
| Service role | `src/lib/supabase/admin.ts` | Invite users via `inviteUserByEmail`, then set `app_metadata.role` |

### Profile creation

After OTP confirmation, `src/modules/auth/otp-form/actions.ts` creates a `Profile` row in Prisma. Login also attempts to upsert a `Profile` for back-compat.

---

## Rendering model

- Next.js 16 App Router with Server Components by default.
- `(dashboard)` is a route group with a shared shell layout (`src/app/(dashboard)/layout.tsx`).
- Public auth routes (`/login`, `/signup`, `/otp`, `/auth/callback`) live outside the route group.
- Dashboard pages are async Server Components that query `prisma` directly.
- Tables, forms, and dialogs are client components co-located with their page.

### Client dashboard layout

`(dashboard)/layout.tsx` is a **client** component (`"use client"`). It calls `usePathname()` to map the URL to the `AdminHeader` title (`TITLES` plus `/users/` and `/posts/` prefixes). Keep it a client component unless the title mapping is moved to a nested client child; converting it to a Server Component without that split would break the header title.

### Route-group widgets (not routes)

These files sit at the `(dashboard)` group root and are **not** pages. `dashboard/page.tsx` imports them via `../`:

- `src/app/(dashboard)/community-growth-chart.tsx`
- `src/app/(dashboard)/recent-activity.tsx`

Do not add `page.tsx` next to them or treat them as dead leftovers.

### Post editor wrappers

`src/app/(dashboard)/posts/post-editor.tsx` exports `NewPostEditor` and `EditPostEditor`. They load authors/posts through `use-posts` and render `post-form/PostForm.tsx`. `/posts/new` and `/posts/[id]` use these wrappers rather than importing `PostForm` directly.

### Two 404 boundaries

| File | When it runs |
|---|---|
| `src/app/not-found.tsx` | Unknown URLs **outside** the dashboard shell (full-viewport branded 404) |
| `src/app/(dashboard)/not-found.tsx` | Unknown URLs **inside** `(dashboard)` so the sidebar/header stay mounted |

These are not duplicates. Deleting either changes 404 chrome for that segment.

### Loading and error boundaries

| File | When it runs |
|---|---|
| `src/app/loading.tsx` | Suspense fallback for public routes (login/signup/otp) |
| `src/app/error.tsx` | Uncaught errors **outside** the dashboard shell (full-viewport branded error + reset) |
| `src/app/(dashboard)/loading.tsx` | Suspense fallback for dashboard pages (DataTable-style skeleton; shell stays mounted) |
| `src/app/(dashboard)/error.tsx` | Uncaught errors **inside** `(dashboard)` with a reset action; sidebar/header stay mounted |

`error.tsx` files are Client Components. They log the error and expose `reset()` so a thrown Server Component error (for example on a list page) renders branded UI instead of the Next.js default.

---

## Data flow

```text
Server Component (page.tsx)
  → prisma query (direct)
  → prefetchQuery + HydrationBoundary
  → Client table/form (React Query + TanStack Table)

Mutation
  → Client form / dialog
  → Server Action (actions.ts)
  → prisma or Supabase admin
  → revalidatePath
  → Client refetches
```

- Read queries use `prisma` directly in Server Components or via `use-*/server.ts` for prefetch.
- Mutations use route-colocated `actions.ts` files marked `"use server"`.

---

## State management

- **TanStack Query** — server-state caching and hydration.
- **next-themes** — theme toggle (no Redux in admin).
- **sonner** — toast notifications for errors and success.

---

## Shared package wiring

### `@fe-template/ui`

- Imported via `import { ... } from "@fe-template/ui"`.
- Transpiled by `transpilePackages: ["@fe-template/ui"]` in `next.config.ts`.
- Scanned by Tailwind via `@source "../../../../packages/ui/src/**/*.{ts,tsx}"` in `globals.css`.

### `@fe-template/db`

- Imported in Server Components, Server Actions, and API routes only.
- Server-only. Never import from client components.

---

## Important boundaries

- Auth gates on session presence, not role. Any authenticated Supabase user can currently access the dashboard.
- `@fe-template/db` and `src/lib/supabase/admin.ts` must not be imported from client components.
- `src/login/` is an empty leftover directory. Use `src/app/login/`.
- Signup confirmation links land on `/auth/callback`, which exchanges the PKCE code for a session and redirects to `/dashboard`.
