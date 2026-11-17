# Environment Variables — fe-multi-web-template

All documented environment variable names for the bundled PawPair reference. Values are never committed or exposed here. After `pnpm project:init`, use the selected apps and services in `PROJECT_STRUCTURE.md` to decide which variables are needed; a `database.kind: none` client does not need database or Supabase variables merely because the reference files remain on disk.

---

## Variable matrix

| Variable | Used by | Purpose | Required? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | root, `apps/admin`, `apps/web` | Supabase project URL | Yes for admin auth |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | root, `apps/admin`, `apps/web` | Supabase publishable (anon) key | Yes for admin auth |
| `SUPABASE_SERVICE_ROLE_KEY` | `apps/admin` | Supabase service role for admin actions | Yes for admin user invite |
| `DATABASE_URL` | root, `apps/admin`, `packages/db` | Prisma runtime connection | Yes for Prisma |
| `DIRECT_URL` | root, `apps/admin`, `packages/db` | Direct Postgres connection for migrations | Yes for migrations |
| `NEXT_PUBLIC_SITE_URL` | `apps/web` | API origin for server-side self-fetch | Yes for web SSR in deployed environments |
| `NODE_ENV` | all apps | Standard Node environment | Auto-set |

`turbo.json` `globalEnv` (cache keys for these deployment-required vars plus `NODE_ENV`): `NODE_ENV`, `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.

For the Docker-backed PawPair reference, run `pnpm dev` or `pnpm start` from the repo root. Both commands create the local network if needed, start Supabase, apply Prisma migrations, and seed the demo data. The env helper runs automatically: it reads `supabase status -o json`, confirms the API and Postgres use the configured loopback ports, and updates the ignored root, web, admin, and database env files. It writes the local service-role key only to the admin env files. `pnpm supabase:local:env` can still be run separately. Use `pnpm dev:apps` or `pnpm start:apps` when managed environment variables should be left alone.

---

## File ownership

| File | Committed? | Notes |
|---|---|---|
| `.env` (root) | No | Gitignored. Convenience copy for local dev. |
| `packages/db/.env` | No | Gitignored. Read by the Prisma CLI. |
| `apps/web/.env.local` | No | Gitignored. Next.js loads automatically. |
| `apps/admin/.env.local` | No | Gitignored. Next.js loads automatically. |
| `.env.example` (root) | Yes | Placeholder only. |
| `apps/admin/.env.example` | Yes | Placeholder only. |
| `apps/web/.env.example` | Yes | Placeholder only. |
| `packages/db/.env.example` | Yes | Placeholder only. |

---

## Pooled vs direct database URLs

Supabase provides two connection modes:

- **Pooled** (`*.pooler.supabase.com:6543`, with `?pgbouncer=true`) — use for `DATABASE_URL` in production/serverless. Many short-lived instances would otherwise exhaust Postgres connections.
- **Direct** (`db.<project-ref>.supabase.co:5432`) — use for `DIRECT_URL` always. Migrations need a direct connection because pgbouncer's transaction pooling does not support the statements Prisma Migrate issues.

Local development can point both at the direct URL, which is what `.env.example` files do by default.
The Docker-backed local stack uses the same local Postgres URL for `DATABASE_URL` and `DIRECT_URL`.

---

## App-specific notes

### `apps/web`

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are declared in `.env.example` but are **not used in source code** today. They are scaffolding for future Supabase integration.
- `NEXT_PUBLIC_SITE_URL` is documented in `apps/web/.env.example` and used by server-side fetch helpers for internal API routes. Falls back to `http://localhost:9000`.

### `apps/admin`

- All five variables are required: Supabase Auth middleware/clients, Prisma runtime, and Supabase admin service role.

### `packages/db`

- Only `DATABASE_URL` and `DIRECT_URL` are needed. `packages/db/prisma.config.ts` loads `packages/db/.env` via `dotenv`.
- Both URLs must point at **Supabase Postgres** (hosted or `supabase start`). `Profile.id` foreign-keys to `auth.users`; plain Postgres is not supported. See `packages/db/README.md`.

---

## Adding a new environment variable

1. Add it to the correct `.env.example` file.
2. Add it to `turbo.json` `globalEnv` if it affects builds or is used in multiple apps.
3. Document it here and in the relevant app/package docs.
4. Do not commit real values.
