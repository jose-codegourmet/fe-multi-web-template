# `apps/admin`

The admin portal for [`apps/web`](../web/README.md) — a Next.js App Router app that manages the same Supabase Postgres database the marketing site is built around. Runs on **port 3001** so it can sit alongside web (3000).

It consumes [`@fe-template/ui`](../../packages/ui/README.md) for primitives and [`@fe-template/db`](../../packages/db/README.md) for the Prisma client.

---

## Features

| Area | Route | What it does |
| --- | --- | --- |
| Dashboard | `/` | Stat cards (users, pets, posts, unread contacts) and a posts-per-month chart |
| Users | `/users`, `/users/[id]` | List/search users; detail view with their pets and posts; change role |
| Pets | `/pets` | Pet profiles with owner |
| Posts (CMS) | `/posts`, `/posts/new`, `/posts/[id]` | List, create, edit, and publish blog posts |
| Testimonials | `/testimonials` | Review submissions and toggle publish state |
| Contacts | `/contacts` | Contact-form inbox with UNREAD / READ / RESOLVED status |
| Login | `/login` | Supabase email + password sign-in |

Pages are async Server Components that query Prisma directly; mutations run through Server Actions (`actions.ts` next to each route) that call Prisma and then `revalidatePath`. There is no separate API layer.

---

## Run

From the monorepo root:

```bash
pnpm install
pnpm --filter @fe-template/db db:generate   # required before first run
pnpm --filter admin dev                     # http://localhost:3001
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
| `DATABASE_URL` | Postgres connection used by Prisma at runtime — prefer the pooled URL (port 6543, `?pgbouncer=true`) in production |
| `DIRECT_URL` | Direct Postgres connection (port 5432) |

---

## Auth setup

Authentication is Supabase Auth via `@supabase/ssr`:

- `src/lib/supabase/client.ts` — browser client (login page)
- `src/lib/supabase/server.ts` — cookie-based server client
- [`middleware.ts`](middleware.ts) — refreshes the session on every request and redirects unauthenticated visitors to `/login`; signed-in users hitting `/login` are sent back to `/`

To get your first admin in:

1. In the Supabase dashboard, go to **Authentication → Users → Add user** and create an email/password user (confirm the email so it can sign in).
2. Make sure a matching row exists in the Prisma `User` table with the same email, and set its `role` to `ADMIN`:

```bash
pnpm --filter @fe-template/db db:studio    # edit the User row, or
pnpm --filter @fe-template/db db:seed      # seed demo data including an admin user
```

3. Visit http://localhost:3001 and sign in.

> Role enforcement is not wired up yet: the middleware currently gates on "is there a Supabase session", and `middleware.ts` carries a TODO for the `User.role === ADMIN` check once auth users are linked to DB users. Any authenticated Supabase user can currently reach the dashboard.

---

## Structure

```text
apps/admin/
├── middleware.ts               # Supabase session refresh + route gating
└── src/
    ├── app/
    │   ├── (dashboard)/        # Admin shell: sidebar + header + pages
    │   │   ├── layout.tsx
    │   │   ├── page.tsx        # Dashboard
    │   │   ├── users/          # page.tsx, [id]/page.tsx, actions.ts
    │   │   ├── pets/
    │   │   ├── posts/          # list, new, [id], post-form.tsx, actions.ts
    │   │   ├── testimonials/
    │   │   └── contacts/
    │   ├── login/page.tsx
    │   ├── layout.tsx          # Root layout
    │   └── globals.css         # Tailwind 4 + @source for packages/ui
    ├── hooks/                  # use-mobile.ts
    ├── lib/                    # supabase clients, utils
    └── modules/
        ├── layout/             # AdminSidebar, AdminHeader, sidebar/
        └── providers/          # Query client, theme, toaster
```

Route-local client components (tables, forms, toggles) sit next to the page that uses them, e.g. `posts/posts-table.tsx`.

---

## Further reading

- [Root README](../../README.md) — monorepo overview and env matrix
- [`packages/db/README.md`](../../packages/db/README.md) — schema, migrations, seeding
- [`packages/ui/README.md`](../../packages/ui/README.md) — shared primitives
