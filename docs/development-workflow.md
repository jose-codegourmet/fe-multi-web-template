# Development Workflow — fe-multi-web-template

How to install, run, lint, format, type-check, and test the monorepo. All commands are derived from the actual `package.json` files and `Makefile`.

---

## Client project gate

Before client scaffolding, example cleanup, or product implementation, read root `TODO.md` and complete [discovery and explicit saved-brief confirmation](project/onboarding.md). Before initialization, run commands use the bundled PawPair references. After `pnpm project:init`, they use only the selected app workspaces. Create/adapt only confirmed selected apps. Template maintenance is authorized separately.

After confirmation, write root `PROJECT_STRUCTURE.md` from [the structure template](project/PROJECT_STRUCTURE.template.md), then run `pnpm project:init --dry-run` and `pnpm project:init`. The initializer validates the brief revision and confirmation record, creates only selected app shells, updates the active pnpm workspace list, and installs dependencies. It leaves PawPair reference directories on disk. With `database.kind: none`, root `pnpm dev` and `pnpm start` skip Docker entirely. With `database.kind: supabase`, initialization assigns a distinct local project identity, ports, and network; the run commands start that service and write selected app env files, but do not apply PawPair migrations or seed to the client.

## Shared AI usage

Codex, Claude, and delegated agents follow [ai-usage/README.md](../ai-usage/README.md) for usage recording. Start the local dashboard with:

```bash
pnpm ai-usage:serve
```

Record only available measurements and identify unavailable values honestly. Follow the usage README for collection details and limitations.

## Prerequisites

- **Node.js 24** — pinned in `.nvmrc`
- **pnpm 11.0.8** — pinned only in the root `package.json` `packageManager` field. `pnpm-workspace.yaml` holds workspace globs and `allowBuilds`, not the version pin.

Switch Node version:

```bash
nvm use
```

---

## Install

```bash
pnpm install
```

This triggers `postinstall` in `packages/db` to run `prisma generate`.

---

## Environment setup

```bash
cp .env.example .env                          # fill in Supabase values
cp packages/db/.env.example packages/db/.env  # Prisma CLI reads this
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
```

Variable names are documented in `docs/environment-variables.md`. Never commit real values.

### Local Supabase with Docker

For the bundled PawPair reference, a hosted Supabase project is optional. `supabase/config.toml` assigns separate local ports because another stack may occupy the defaults. With Docker running and the Supabase CLI installed, the root commands handle the loopback-only network, local stack, ignored env files, pending Prisma migrations, and idempotent demo seed:

```bash
pnpm dev
pnpm start # alternative: build and run local production servers
```

The local API is at `http://127.0.0.1:55321`, Postgres at port 55322, Studio at `http://127.0.0.1:55323`, and the email inbox at port 55324. The startup scripts require Python 3.11+, verify those loopback ports, and write no credentials to committed files or command output. The seed upserts missing demo records without overwriting existing ones. `supabase stop` stops the stack; local data remains for the next start. Prisma owns the schema and seed, so Supabase CLI migrations and seeds are disabled in this local config. For hosted environments, run `pnpm dev:apps` or `pnpm start:apps` with externally configured environment variables.

---

## Run

### All apps together

```bash
pnpm dev
```

Prepares the local backend, then starts `apps/web` on port 9000 and `apps/admin` on port 9001 via Turborepo.

### One app at a time

```bash
pnpm --filter web dev       # http://localhost:9000
pnpm --filter admin dev     # http://localhost:9001
```

### Storybook

```bash
pnpm --filter web storybook      # http://localhost:6006
pnpm --filter admin storybook    # http://localhost:6007
```

---

## Build

### Production build (all workspaces)

```bash
pnpm build
```

### Scoped build

```bash
pnpm --filter web build
pnpm --filter admin build
```

---

## Lint and format

### Biome (root, monorepo-wide)

```bash
pnpm lint           # check
pnpm lint:fix       # safe auto-fix
pnpm lint:fix:unsafe # safe + unsafe auto-fix
pnpm format         # format --write
```

### App ESLint (Next.js rules)

```bash
pnpm lint:apps                  # web and admin ESLint
pnpm --filter web lint          # web only
pnpm --filter admin lint        # admin only
```

`packages/ui` is linted by Biome, not ESLint. Run `pnpm --filter @fe-template/ui lint` (`biome check .`) or the repo-wide `pnpm lint`. `pnpm lint:apps` is for Next.js ESLint in `apps/web` and `apps/admin` only.

---

## Type checking

```bash
pnpm typecheck
```

Runs `tsc --noEmit` via Turbo in the four workspaces that define a `typecheck` script: `web`, `admin`, `@fe-template/ui`, and `@fe-template/db`. `packages/config` has no scripts and is excluded.

Scoped:

```bash
pnpm --filter web typecheck
pnpm --filter admin typecheck
pnpm --filter @fe-template/ui typecheck
pnpm --filter @fe-template/db typecheck
```

---

## Database workflow

```bash
pnpm --filter @fe-template/db db:generate       # generate Prisma client
pnpm --filter @fe-template/db db:migrate        # create + apply migration
pnpm --filter @fe-template/db db:migrate:create # create without applying
pnpm --filter @fe-template/db db:push           # prototype: push schema without migration
pnpm --filter @fe-template/db db:deploy         # apply pending migrations in CI/prod
pnpm --filter @fe-template/db db:seed           # seed demo data
pnpm --filter @fe-template/db db:studio          # open Prisma Studio
```

---

## Testing

```bash
pnpm --filter web storybook      # component tests via Storybook + Vitest addon
```

No `test` script exists in any `package.json`. See `docs/testing.md` for the full testing picture.

---

## Makefile shortcuts

All support `FILTER=<workspace>`.

| Target | Equivalent | Notes |
|---|---|---|
| `make dev` | `pnpm turbo run dev` | Runs all apps |
| `make build` | `pnpm turbo run build` | Full production build |
| `make storybook` | `pnpm turbo run storybook` | Starts Storybook |
| `make fix` | `pnpm biome check --write <path>` | Safe auto-fix |
| `make fix-unsafe` | `pnpm biome check --write --unsafe <path>` | Unsafe auto-fix allowed |

Examples:

```bash
make dev FILTER=web
make build FILTER=admin
make fix FILTER=packages/ui
```

---

## Git hooks

Husky is configured via `prepare`:

| Hook | Command | Purpose |
|---|---|---|
| `pre-commit` | `pnpm exec lint-staged` | Biome check on staged files |
| `commit-msg` | `pnpm exec commitlint --edit $1` | Enforce Conventional Commits |

Commit messages must follow Conventional Commits:

```bash
feat(sections): add hero to pricing page
fix(admin): correct posts table sort order
docs(db): document pooled connection string
```

---

## Turborepo task notes

From `turbo.json`:

- `build` depends on `^build` and outputs `.next/**`, `dist/**`, `storybook-static/**`.
- `lint` and `typecheck` depend on `^build`. Run `pnpm build` before them if outputs are stale.
- `dev`, `start`, and `storybook` are `persistent: true` and `cache: false`.
- `db:generate` is `cache: false`.

---

## Required validation before completing a task

At minimum, run the commands that touch your scope:

1. `pnpm --filter <workspace> typecheck`
2. `pnpm lint` (or `pnpm --filter <workspace> lint` if the app/package has its own lint script)
3. If you changed the UI package, also run `pnpm --filter @fe-template/ui typecheck`.
4. If you changed the DB schema, also run `pnpm --filter @fe-template/db db:generate` and verify migrations.
