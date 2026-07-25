# PLAN 05 — Env files + docs/README updates

> Execute this plan in a fresh agent session. It is self-contained. Run **last**, after PLANs 01–04. When finished, **always commit and push to `main`** (see final step).

## Goal

1. Create all environment files: real `.env.local` / `.env` (gitignored) with the provided Supabase credentials, plus committed `.env.example` placeholders.
2. Rewrite every README and doc to accurately describe the new multi-app / multi-package structure.

## Provided credentials (put in gitignored env files ONLY)

```
NEXT_PUBLIC_SUPABASE_URL=https://iqysqkmmtkthxrfiklhc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_6S7XHsbSaCrf26zux6KUFw_M3wr3MaT
DB password: sH76PstdF8NnaYvS
Direct connection: postgresql://postgres:sH76PstdF8NnaYvS@db.iqysqkmmtkthxrfiklhc.supabase.co:5432/postgres
```

## Part A — Environment files

### 1. Confirm `.gitignore`

Ensure these are ignored (add if missing), and that `.env.example` is explicitly allowed:
```
.env
.env.*
!.env.example
```
Because this is a monorepo, this must cover nested paths too (root patterns like `.env` and `.env.*` match nested files in git). Verify `packages/db/.env`, `apps/web/.env.local`, `apps/admin/.env.local` are all ignored. **Never commit real secrets.**

### 2. Root `.env` (gitignored) + `.env.example` (committed)

`/.env` (real values — NOT committed):
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://iqysqkmmtkthxrfiklhc.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_6S7XHsbSaCrf26zux6KUFw_M3wr3MaT

# Prisma / Postgres (Supabase)
DATABASE_URL="postgresql://postgres:sH76PstdF8NnaYvS@db.iqysqkmmtkthxrfiklhc.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:sH76PstdF8NnaYvS@db.iqysqkmmtkthxrfiklhc.supabase.co:5432/postgres"
```

`/.env.example` (committed — placeholders only):
```
# Supabase (get from Supabase Dashboard -> Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx

# Prisma / Postgres
# Pooled (app runtime, port 6543 + pgbouncer) recommended for serverless:
# DATABASE_URL="postgresql://postgres.YOUR-PROJECT:YOUR-PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true"
# Direct (migrations, port 5432):
DATABASE_URL="postgresql://postgres:YOUR-PASSWORD@db.YOUR-PROJECT.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:YOUR-PASSWORD@db.YOUR-PROJECT.supabase.co:5432/postgres"
```

### 3. Per-package / per-app env files

Create these gitignored real files and matching `.env.example` committed files:

- `packages/db/.env` — `DATABASE_URL`, `DIRECT_URL` (Prisma CLI reads this). `.env.example` with placeholders.
- `apps/web/.env.local` — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (+ `DATABASE_URL`/`DIRECT_URL` if web queries Prisma directly). `.env.example` with placeholders.
- `apps/admin/.env.local` — same four vars. `.env.example` with placeholders.

> Note: Next.js loads `.env.local` per app automatically. Prisma CLI loads `.env` from `packages/db`. The root `.env` is a convenience/reference and is read by Turbo `globalEnv`.

### 4. Add a note about the pooled connection string

In each `.env.example` and in the DB README, note that for production/serverless the pooled `pooler.supabase.com:6543?pgbouncer=true` URL should be used for `DATABASE_URL` while `DIRECT_URL` stays on `db.<project>.supabase.co:5432`.

## Part B — READMEs and docs

Rewrite the following to be exact and consistent with the new structure. Verify all commands/paths against the actual repo at execution time.

### 5. Root `README.md`

Rewrite to document:
- **Structure:**
  ```
  apps/
    web/     Public marketing site (Next.js, port 3000)
    admin/   Admin portal: CMS, user management, analytics (Next.js, port 3001)
  packages/
    ui/      Shared UI primitives (@fe-template/ui)
    db/      Prisma client + schema, Supabase Postgres (@fe-template/db)
    config/  Shared config (@fe-template/config)
  docs/      Documentation
  ```
- **Stack:** pnpm workspaces + **Turborepo**, Next.js 16, React 19, Tailwind 4, shadcn (base-nova) + Base UI, Prisma 6, Supabase, Biome, Husky/commitlint.
- **Quick start:**
  ```bash
  pnpm install
  cp .env.example .env            # fill in Supabase values
  pnpm --filter @fe-template/db db:generate
  pnpm dev                        # runs web (3000) + admin (3001) via Turbo
  ```
- **Scripts table:** `pnpm dev`, `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm format`, `pnpm db:generate`, etc.
- **Env vars table:** the four vars, where each is used.
- Remove/replace stale references (the old README mentions `.github/workflows/ci.yml`, `fe-template-builder/`, `turbo.json` — either create accurate references or drop them; `turbo.json` now exists from PLAN 01).
- Docs index linking into `docs/`.

### 6. `apps/web/README.md`

Update to reflect: primitives now imported from `@fe-template/ui`; DB access via `@fe-template/db`; run with `pnpm --filter web dev` (port 3000); env via `apps/web/.env.local`.

### 7. `apps/admin/README.md` (new)

Create: purpose (admin portal for web), features (dashboard/analytics, users, pets, posts CMS, testimonials, contacts), Supabase auth setup (create an admin user in Supabase, set `role=ADMIN` in DB), run with `pnpm --filter admin dev` (port 3001), env vars.

### 8. `packages/ui/README.md` (new)

Create: what it is, how to import (`import { Button } from "@fe-template/ui"`), where components live (`src/components/<name>/<Name>.tsx`), how to add a new primitive, Tailwind `@source` requirement in consuming apps, Storybook location.

### 9. `packages/db/README.md` (new)

Create: Prisma + Supabase overview, split schema layout (`prisma/schema/*.prisma`), models list, commands (`db:generate`, `db:migrate`, `db:studio`, `db:seed`), env vars (`DATABASE_URL` pooled vs `DIRECT_URL`), how apps import (`import { prisma } from "@fe-template/db"`).

### 10. `docs/` updates

- `docs/template/README.md` — update layout/structure section for apps + packages + Turborepo; update image/brand/cleanup notes still-valid parts.
- `docs/template/PAGES.md` — fix stale paths (it references `src/components/sections/`; actual is `src/sections/`). Add admin routes map.
- `docs/template/COMPONENTS.md` — components now live in `packages/ui`; update conventions and import examples.
- `docs/template/HOOKS.md` — verify still accurate; update paths if needed.
- `docs/llm/CONTEXT.md` — update the architecture description to multi-app + packages/db + Prisma/Supabase so AI agents have correct context.
- `docs/llm/PATTERNS.md` / `docs/llm/PROMPTS.md` — update import patterns (`@fe-template/ui`, `@fe-template/db`) and any data-access patterns (Prisma via Server Components/Actions).
- `docs/component-guide.md` — update the component location/import section.
- `docs/about-example-site/*` — content is brand/story; leave unless it references code paths.

> Goal: every README and doc must be **exact** — no dangling references to old paths, and new packages/apps documented.

### 11. Verify

```bash
pnpm install
pnpm typecheck
pnpm build
git status   # confirm no real .env files are staged
```
Double-check `git status` / `git diff --cached` shows only `.env.example` files (never real `.env`/`.env.local`).

## Acceptance criteria

- [ ] Real env files created and gitignored (root, packages/db, apps/web, apps/admin).
- [ ] `.env.example` committed at root + each app/db package with placeholders.
- [ ] Root README rewritten (structure, stack, quick start, scripts, env).
- [ ] `apps/web/README.md` updated; `apps/admin`, `packages/ui`, `packages/db` READMEs created.
- [ ] All `docs/` files updated; no stale paths remain.
- [ ] No real secrets committed.

## Final step — commit and push to main (REQUIRED)

> Verify `git status` shows NO real `.env`/`.env.local` before committing.

```bash
git add -A
git commit -m "docs: add env examples and update all READMEs and docs for multi-repo structure"
git push origin main
```
