# Environment Variables — fe-multi-web-template

All documented environment variable names. Values are never committed or exposed here.

---

## Variable matrix

| Variable | Used by | Purpose | Required? |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | root, `apps/admin`, `apps/web` | Supabase project URL | Yes for admin auth |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | root, `apps/admin`, `apps/web` | Supabase publishable (anon) key | Yes for admin auth |
| `SUPABASE_SERVICE_ROLE_KEY` | `apps/admin` | Supabase service role for admin actions | Yes for admin user invite |
| `DATABASE_URL` | root, `apps/admin`, `packages/db` | Prisma runtime connection | Yes for Prisma |
| `DIRECT_URL` | root, `apps/admin`, `packages/db` | Direct Postgres connection for migrations | Yes for migrations |
| `NEXT_PUBLIC_SITE_URL` | `apps/web` | API origin for server-side self-fetch | Recommended for web SSR |
| `NODE_ENV` | all apps | Standard Node environment | Auto-set |

`turbo.json` declares `globalEnv`: `NODE_ENV`, `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

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

---

## App-specific notes

### `apps/web`

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are declared in `.env.example` but are **not used in source code** today. They are scaffolding for future Supabase integration.
- `NEXT_PUBLIC_SITE_URL` is used in `apps/web/src/hooks/use-*/server.ts` to fetch internal API routes during SSR, but it is **not documented in `.env.example`**. Falls back to `http://localhost:9000`.

### `apps/admin`

- All five variables are required: Supabase Auth middleware/clients, Prisma runtime, and Supabase admin service role.

### `packages/db`

- Only `DATABASE_URL` and `DIRECT_URL` are needed. The Prisma CLI reads `packages/db/.env`.

---

## Adding a new environment variable

1. Add it to the correct `.env.example` file.
2. Add it to `turbo.json` `globalEnv` if it affects builds or is used in multiple apps.
3. Document it here and in the relevant app/package docs.
4. Do not commit real values.
