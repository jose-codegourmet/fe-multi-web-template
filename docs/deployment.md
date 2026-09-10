# Deployment — fe-multi-web-template

Build, outputs, and deployment notes for the monorepo.

---

## Build

### Production build (all workspaces)

```bash
pnpm build
```

This runs `turbo run build` and produces:

- `.next/` in `apps/web` and `apps/admin`
- `storybook-static/` in `apps/web` and `apps/admin` (via `build-storybook`)

### Scoped build

```bash
pnpm --filter web build
pnpm --filter admin build
pnpm --filter web build-storybook
pnpm --filter admin build-storybook
```

---

## Start built apps

```bash
pnpm start
```

Starts production Next.js on the configured ports:

- `apps/web`: port 9000
- `apps/admin`: port 9001

Scoped:

```bash
pnpm --filter web start
pnpm --filter admin start
```

---

## Turborepo outputs

From `turbo.json`:

```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": [".next/**", "!.next/cache/**", "dist/**", "storybook-static/**"]
  }
}
```

- `.next/**` is cached, except `.next/cache/**`.
- `dist/**` is cached for any workspace that emits it (none currently do).
- `storybook-static/**` is cached for built Storybook.

---

## Environment variables for deployment

These must be present in the deployment environment:

| Variable | Required for |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `apps/admin` auth |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `apps/admin` auth |
| `SUPABASE_SERVICE_ROLE_KEY` | `apps/admin` user invite |
| `DATABASE_URL` | `apps/admin` and `apps/web` API routes (Prisma) |
| `DIRECT_URL` | `packages/db` migrations |
| `NEXT_PUBLIC_SITE_URL` | `apps/web` SSR self-fetch |

See `docs/environment-variables.md` for details.

---

## Platform notes

The root `README.md` references a live demo of the marketing site on Vercel. No CI/CD configuration exists in the repository (no `.github/workflows/` or similar), so deployments are currently manual or platform-triggered from the default branch.

---

## Pre-deployment checklist

1. `pnpm install` is up to date.
2. `pnpm --filter @fe-template/db db:generate` has run.
3. `pnpm typecheck` passes.
4. `pnpm lint` passes.
5. `pnpm build` succeeds for the affected app(s).
6. Required environment variables are set in the deployment target.
7. Database migrations are applied (`pnpm --filter @fe-template/db db:deploy`) for the target environment.
