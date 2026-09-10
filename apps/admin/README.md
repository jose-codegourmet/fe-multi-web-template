# `apps/admin`

The admin portal for [`apps/web`](../web/README.md) — a Next.js App Router app that manages the same Supabase Postgres database the marketing site is built around. Runs on **port 9001** so it can sit alongside web (9000).

It consumes [`@fe-template/ui`](../../packages/ui/README.md) for primitives and [`@fe-template/db`](../../packages/db/README.md) for the Prisma client.

---

## Features

| Area | Route | What it does |
| --- | --- | --- |
| Root | `/` | Redirects to `/dashboard` (`src/app/page.tsx`) |
| Dashboard | `/dashboard` | Stat cards (users, pets, posts, unread contacts) and charts |
| Users | `/users`, `/users/[id]` | List/search users; detail view with their pets and posts; change role |
| Pets | `/pets` | Pet profiles with owner |
| Posts (CMS) | `/posts`, `/posts/new`, `/posts/[id]` | List, create, edit, and publish blog posts |
| Testimonials | `/testimonials` | Review submissions and toggle publish state |
| Contacts | `/contacts` | Contact-form inbox with UNREAD / READ / RESOLVED status |
| Pricing plans | `/pricing-plans` | Create, edit, and delete pricing plans |
| Profile | `/profile` | Signed-in admin profile |
| Login | `/login` | Supabase email + password sign-in |
| Signup | `/signup` | Public self-signup |
| OTP | `/otp` | Email OTP confirmation |
| Images | `POST /api/images` | Upload to the Supabase Storage `admin-uploads` bucket |

Pages are async Server Components that query Prisma directly; mutations run through Server Actions (`actions.ts` next to each route) that call Prisma and then `revalidatePath`. The only HTTP API route is `POST /api/images`.

---

## Run

From the monorepo root:

```bash
pnpm install
pnpm --filter @fe-template/db db:generate   # required before first run
pnpm --filter admin dev                     # http://localhost:9001
pnpm --filter admin build
pnpm --filter admin typecheck
```

`pnpm dev` at the root runs this app together with `apps/web`.

---

## Environment

Copy [`.env.example`](.env.example) to `.env.local` (gitignored):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL — used by the browser client and middleware |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role for admin invites (`src/lib/supabase/admin.ts`) |
| `DATABASE_URL` | Postgres connection used by Prisma at runtime — prefer the pooled URL (port 6543, `?pgbouncer=true`) in production |
| `DIRECT_URL` | Direct Postgres connection (port 5432) |

---

## Auth setup

Authentication is Supabase Auth via `@supabase/ssr`:

- `src/lib/supabase/client.ts` — browser client (login page)
- `src/lib/supabase/server.ts` — cookie-based server client
- `src/lib/supabase/admin.ts` — service-role client (user invite)
- [`middleware.ts`](middleware.ts) — refreshes the session on every request and redirects unauthenticated visitors to `/login`; signed-in users hitting `/login`, `/signup`, or `/otp` are sent to `/dashboard`

To get your first admin in:

1. In the Supabase dashboard, go to **Authentication → Users → Add user** and create an email/password user (confirm the email so it can sign in).
2. Make sure a matching row exists in the Prisma `User` table with the same email, and set its `role` to `ADMIN`:

```bash
pnpm --filter @fe-template/db db:studio    # edit the User row, or
pnpm --filter @fe-template/db db:seed      # seed demo data including an admin user
```

3. Visit http://localhost:9001/login and sign in.

Auth today is **session-only**. `middleware.ts` gates on "is there a Supabase session" and carries a TODO for `User.role === ADMIN`. `/signup` is a public route, so anyone who can register gets a session and can reach every dashboard route. Most Server Actions do not re-check the session or role. An ADMIN role gate is not implemented yet.

---

## Structure

```text
apps/admin/
├── middleware.ts               # Supabase session refresh + route gating
└── src/
    ├── app/
    │   ├── page.tsx            # Redirects / → /dashboard
    │   ├── (dashboard)/        # Admin shell: sidebar + header + pages
    │   │   ├── layout.tsx
    │   │   ├── dashboard/      # /dashboard
    │   │   ├── users/
    │   │   ├── pets/
    │   │   ├── posts/          # list, new, [id], post-form/PostForm.tsx
    │   │   ├── testimonials/
    │   │   ├── contacts/
    │   │   ├── pricing-plans/
    │   │   └── profile/
    │   ├── login/page.tsx
    │   ├── signup/page.tsx
    │   ├── otp/page.tsx
    │   ├── api/images/route.ts
    │   ├── layout.tsx          # Root layout
    │   └── globals.css         # Tailwind 4 + @source for packages/ui
    ├── hooks/
    │   ├── use-users/          # fetchUsers + usersQueryKey
    │   ├── use-pets/
    │   ├── use-posts/
    │   ├── use-contacts/
    │   ├── use-testimonials/
    │   ├── use-pricing-plans/
    │   ├── use-current-user.ts
    │   ├── current-user.ts
    │   └── use-mobile.ts
    ├── lib/                    # supabase clients, upload-image, utils
    └── modules/
        ├── auth/               # login-form, signup-form, otp-form
        ├── layout/             # AdminSidebar, AdminHeader, sidebar/
        └── providers/          # Query client, theme, toaster
```

Route-local client components (tables, forms, toggles) sit next to the page that uses them, e.g. `posts/posts-table.tsx` and `posts/post-form/PostForm.tsx`.

---

## Further reading

- [Root README](../../README.md) — monorepo overview and env matrix
- [`apps/admin/AGENTS.md`](./AGENTS.md) — agent entry points and validation commands
- [`apps/admin/docs/patterns.md`](./docs/patterns.md) — CRUD, prefetch, and form conventions
- [`packages/db/README.md`](../../packages/db/README.md) — schema, migrations, seeding
- [`packages/ui/README.md`](../../packages/ui/README.md) — shared primitives
