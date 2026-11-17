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
pnpm start:apps
```

Starts already-built production Next.js apps on the configured ports without starting local Docker services or rewriting environment files. Root `pnpm start` is the local convenience command; it prepares Supabase and builds first.

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

These are required for the bundled PawPair reference. A client initialized from `PROJECT_STRUCTURE.md` uses only the variables required by its selected apps and services; a no-database landing plus mockapp does not need Supabase variables.

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

## Manual Vercel deployment

The existing `fe-multi-web-template-web` and `fe-multi-web-template-admin` Vercel projects are disconnected from Git. Pushes and pull requests do not deploy them. Both app roots also set `git.deploymentEnabled` to `false` in `vercel.json` so reconnecting Git does not silently restore automatic deployments.

To deploy, open the repository's **Actions → Deploy to Vercel → Run workflow**, select `main`, then choose `web` or `admin`. The workflow only has a `workflow_dispatch` trigger and rejects runs from other branches. It pulls the selected project's production settings, builds on the GitHub runner, and deploys the prebuilt output to Vercel production. It does not run database migrations or seed data.

Configure these GitHub repository **Actions variables** (Settings → Secrets and variables → Actions → Variables):

| Name | Value |
|---|---|
| `VERCEL_ORG_ID` | Vercel team ID for both projects |
| `VERCEL_WEB_PROJECT_ID` | Existing web project ID |
| `VERCEL_ADMIN_PROJECT_ID` | Existing admin project ID |

Configure one GitHub repository **Actions secret**, `VERCEL_TOKEN`, with a Vercel access token that can deploy both projects. Create and enter the token in GitHub yourself; do not commit it or paste it into chat. The workflow checks for all four settings before building. For a newly initialized client project, replace the project IDs with that client's Vercel projects and remove unused app choices.

The `production` GitHub environment may be configured with required reviewers if desired. Environment protection rules can require an additional approval after pressing **Run workflow**.

---

## Pre-deployment checklist

1. `pnpm install` is up to date.
2. `pnpm --filter @fe-template/db db:generate` has run.
3. `pnpm typecheck` passes.
4. `pnpm lint` passes.
5. `pnpm build` succeeds for the affected app(s).
6. Required environment variables are set in the deployment target.
7. Database migrations are applied (`pnpm --filter @fe-template/db db:deploy`) for the target environment.
