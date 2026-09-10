# Development Workflow — fe-multi-web-template

How to install, run, lint, format, type-check, and test the monorepo. All commands are derived from the actual `package.json` files and `Makefile`.

---

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

---

## Run

### All apps together

```bash
pnpm dev
```

Starts `apps/web` on port 9000 and `apps/admin` on port 9001 via Turborepo.

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
pnpm lint:apps                  # all apps via turbo
pnpm --filter web lint          # web only
pnpm --filter admin lint        # admin only
```

Note: `packages/ui` also has a `lint` script (`eslint .`), but `pnpm lint:apps` only runs `turbo run lint`, which includes whatever Turbo sees in the workspace. No package currently has `lint` in the root Turbo pipeline for all scopes, so package linting is normally reached via `pnpm --filter @fe-template/ui lint`.

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
