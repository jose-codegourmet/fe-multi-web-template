# FE Multi-Web Template

A production-ready **pnpm workspaces + Turborepo** monorepo template pairing a public marketing site with an admin portal — Next.js 16, React 19, Tailwind 4, shadcn/ui (Base UI), Prisma, and Supabase.

The bundled example brand is **PawPair**, a fictional pet social discovery app (“Better matches. Happier tails.”). Use this repo as a GitHub template, then swap brand content and prune unused components.

**Live demo (web):** [https://fe-template-web-9t3u.vercel.app/](https://fe-template-web-9t3u.vercel.app/)

---

## Monorepo structure

```text
fe-multi-web-template/
├── apps/
│   ├── web/                 # Public marketing site (Next.js, port 9000)
│   └── admin/               # Admin portal: CMS, user management, analytics (Next.js, port 9001)
├── packages/
│   ├── ui/                  # Shared UI primitives (@fe-template/ui)
│   ├── db/                  # Prisma client + schema, Supabase Postgres (@fe-template/db)
│   └── config/              # Shared config (@fe-template/config)
├── docs/
│   ├── template/            # Human-facing template docs
│   ├── llm/                 # AI agent context (CONTEXT, PATTERNS, PROMPTS)
│   └── about-example-site/  # PawPair brand, content, image guide
├── scripts/
│   ├── cleanup-unused.py        # Prune unused apps/web folders (dry-run by default)
│   └── migrate-components.py    # Historical one-off; do not run (see docs/repository-structure.md)
├── docs/superpowers/        # Historical plans/specs — not a live skill pack
└── turbo.json               # Turborepo pipeline
```

| Workspace | Package name | Purpose |
| --- | --- | --- |
| [`apps/web`](apps/web/README.md) | `web` | Marketing site — sections, blog, pricing, contact |
| [`apps/admin`](apps/admin/README.md) | `admin` | Admin portal — dashboard, users, pets, posts CMS, testimonials, contacts |
| [`packages/ui`](packages/ui/README.md) | `@fe-template/ui` | Shared shadcn/Base UI primitives consumed by both apps |
| [`packages/db`](packages/db/README.md) | `@fe-template/db` | Prisma schema, migrations, seed, and shared `prisma` client |
| `packages/config` | `@fe-template/config` | Placeholder for shared config |

---

## Stack

| Layer | Choice |
| --- | --- |
| Monorepo | pnpm workspaces + Turborepo 2 |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui (`base-nova` style) on Base UI |
| Database | Prisma 6 + Supabase Postgres |
| Auth | Supabase Auth (`@supabase/ssr`) — admin only |
| State | Redux Toolkit, TanStack Query (web) |
| Tables / charts | TanStack Table, Recharts |
| Motion | Framer Motion (scroll-reveal only) |
| Docs / UI kit | Storybook 10 (config in `apps/web/.storybook`) |
| Lint / format | Biome |
| Tests | Vitest (Storybook test runner in `apps/web` only; no `test` script or unit suite yet — see [`docs/testing.md`](docs/testing.md)) |
| Git hooks | Husky, lint-staged, commitlint (Conventional Commits) |

---

## Prerequisites

- **Node.js 24** — pinned in [`.nvmrc`](.nvmrc)
- **pnpm** — see `packageManager` in [`package.json`](package.json)
- A **Supabase** project (Postgres + Auth) for the database and admin login

---

## Quick start

```bash
nvm use
pnpm install
cp .env.example .env                              # fill in your Supabase values
cp packages/db/.env.example packages/db/.env      # Prisma CLI reads this
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
pnpm --filter @fe-template/db db:generate         # generate the Prisma client
pnpm dev                                          # web :9000 + admin :9001 via Turbo
```

To run a single app:

```bash
pnpm --filter web dev            # http://localhost:9000
pnpm --filter admin dev          # http://localhost:9001
pnpm --filter web storybook      # http://localhost:6006
```

First-time database setup and admin login are covered in [`packages/db/README.md`](packages/db/README.md) and [`apps/admin/README.md`](apps/admin/README.md).

---

## Root scripts

| Script | Runs |
| --- | --- |
| `pnpm dev` | `turbo run dev` — web (9000) and admin (9001) together |
| `pnpm build` | `turbo run build` — production build of every workspace |
| `pnpm start` | `turbo run start` — start built apps |
| `pnpm typecheck` | `turbo run typecheck` — TypeScript across all workspaces |
| `pnpm lint` | `biome check .` across the repo |
| `pnpm lint:apps` | `turbo run lint` — per-app ESLint (Next.js rules) |
| `pnpm format` | `biome format --write .` |
| `pnpm build-storybook` | `turbo run build-storybook` — static Storybook build |
| `pnpm db:generate` | `turbo run db:generate` — Prisma client generation |

Database-specific scripts (migrate, studio, seed) live in [`packages/db`](packages/db/README.md) and run via `pnpm --filter @fe-template/db <script>`.

---

## Makefile shortcuts

The root [`Makefile`](Makefile) wraps common Turbo and Biome commands. Pass an optional `FILTER` to scope a target to `apps/<name>` or `packages/<name>`.

| Target | Equivalent | Notes |
| --- | --- | --- |
| `make dev` | `pnpm turbo run dev` | Runs all apps; add `FILTER=web` or `FILTER=admin` to scope |
| `make build` | `pnpm turbo run build` | Full production build; supports `FILTER` |
| `make storybook` | `pnpm turbo run storybook` | Starts Storybook; supports `FILTER` |
| `make fix` | `pnpm biome check --write <path>` | Safe Biome auto-fix on the filtered path (or repo root) |
| `make fix-unsafe` | `pnpm biome check --write --unsafe <path>` | Same but allows unsafe transforms |

```bash
make dev                     # web + admin via Turbo
make dev FILTER=web          # web only
make build FILTER=admin      # admin production build
make storybook FILTER=web    # Storybook for web
make fix FILTER=admin        # Biome auto-fix apps/admin
make fix-unsafe              # unsafe Biome fixes across the repo
```

---

## Environment variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `apps/admin` (auth), `apps/web` (reserved) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `apps/admin` (auth), `apps/web` (reserved) | Supabase publishable (anon) key |
| `DATABASE_URL` | `packages/db`, `apps/admin`, `apps/web` | Postgres connection for Prisma at runtime — use the pooled URL (port 6543, `?pgbouncer=true`) in production/serverless |
| `DIRECT_URL` | `packages/db` | Direct Postgres connection (port 5432) for migrations |

Where each file lives:

| File | Committed? | Notes |
| --- | --- | --- |
| `.env` | No | Root convenience copy; listed in `turbo.json` `globalDependencies`. `globalEnv` lists variable names (`NODE_ENV`, `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). |
| `packages/db/.env` | No | Read by the Prisma CLI |
| `apps/web/.env.local` | No | Loaded automatically by Next.js |
| `apps/admin/.env.local` | No | Loaded automatically by Next.js |
| `*.env.example` | Yes | Placeholders only — never commit real credentials |

`apps/web` has no auth or Supabase client, but its API routes query Prisma via `@fe-template/db`. Data flow: Prisma → `src/app/api/{blog,pricing,testimonials}` → `fetch*` in `src/hooks/use-*/server.ts` → sections. See [`docs/api-and-data-fetching.md`](docs/api-and-data-fetching.md).

---

## Using as a template

1. Click **Use this template** on GitHub (or clone the repo).
2. Install dependencies and configure env files (see Quick start).
3. Replace PawPair brand/content under [`docs/about-example-site/`](docs/about-example-site/) and `apps/web/public/images/`.
4. Adjust the Prisma models in `packages/db/prisma/schema/` to your domain, then run `pnpm --filter @fe-template/db db:migrate`.
5. Remove unused component folders:

```bash
python scripts/cleanup-unused.py           # dry-run (default)
python scripts/cleanup-unused.py --delete  # permanently remove unused folders
```

> The cleanup script scans `apps/web/src/{app,modules,sections,hooks,store}` for import references and reports unused folders under `modules/` and `sections/`. Shared primitives now live in `packages/ui`, so the script does not currently prune them — remove unused `packages/ui/src/components/*` folders (and their `packages/ui/src/index.ts` export lines) by hand.

---

## Documentation

| Path | Purpose |
| --- | --- |
| [`apps/web/README.md`](apps/web/README.md) | Marketing site: entry points, scripts |
| [`apps/admin/README.md`](apps/admin/README.md) | Admin portal: features, Supabase auth setup |
| [`packages/ui/README.md`](packages/ui/README.md) | Shared primitives: imports, adding a component |
| [`packages/db/README.md`](packages/db/README.md) | Prisma + Supabase: schema, commands, env |
| [`docs/component-guide.md`](docs/component-guide.md) | Per-component usage guide (when / when-not) |
| [`docs/template/README.md`](docs/template/README.md) | Full template guide (layout, images, hooks, commits) |
| [`docs/template/PAGES.md`](docs/template/PAGES.md) | Web routes, section map, and admin route map |
| [`docs/template/COMPONENTS.md`](docs/template/COMPONENTS.md) | Component folder conventions |
| [`docs/template/HOOKS.md`](docs/template/HOOKS.md) | API hook structure |
| [`docs/llm/`](docs/llm/) | AI agent context, patterns, and prompts |
| [`docs/about-example-site/`](docs/about-example-site/) | PawPair branding, content, and image guide |

---

## Commits

Husky runs Biome on staged files pre-commit, and commitlint enforces [Conventional Commits](https://www.conventionalcommits.org/) on the commit message:

```bash
feat(sections): add hero to pricing page
fix(admin): correct posts table sort order
docs(db): document pooled connection string
```
