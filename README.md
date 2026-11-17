# FE Multi-Web Template

A production-ready **pnpm workspaces + Turborepo** monorepo template pairing a public marketing site with an admin portal — Next.js 16.4.6, React 19, Tailwind 4, shadcn/ui (Base UI), Prisma, and Supabase.

The bundled example brand is **PawPair**, a fictional pet social discovery app (“Better matches. Happier tails.”). Use this repo as a GitHub template, then follow the confirmed client brief before adapting the example.

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
| Monorepo | pnpm workspaces + Turborepo 2.11.11 |
| Framework | Next.js 16.4.6 (App Router) |
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
- **Python 3.11+** — used by the local startup and env helpers
- A hosted **Supabase** project, or Docker plus the Supabase CLI for local Postgres and Auth

---

## Start a client project

Read [TODO.md](TODO.md) first. Follow [client onboarding](docs/project/onboarding.md): collect client/project name, product, intended users, any combination of marketing website, mockup, admin dashboard, customer dashboard, and custom apps, plus features, brand/assets, and integrations. Save the answers in `docs/project/brief.md` and explicitly confirm the saved revision before scaffolding, example cleanup, or product implementation. Reuse that record across chats; silence is not approval. A template maintenance request does not confirm a client brief.

Create only selected apps. PawPair `web` and `admin` are references; mockups, customer dashboards, and custom apps are created only when selected. [AGENTS.md](AGENTS.md) supplies shared agent instructions; [CLAUDE.md](CLAUDE.md) routes Claude to them. All agents follow [the usage policy](ai-usage/README.md); view the local dashboard with `pnpm ai-usage:serve`.

After the brief is confirmed, the agent writes root `PROJECT_STRUCTURE.md` using [the structure template](docs/project/PROJECT_STRUCTURE.template.md). It records selected app workspaces and whether a database is needed. `pnpm project:init --dry-run` checks the plan; `pnpm project:init` creates those app shells, activates only their pnpm workspaces, and installs dependencies. For a landing page plus mockapp with `database.kind: none`, `pnpm dev` and `pnpm start` run without Supabase or Docker. The command does not overwrite or delete the bundled PawPair references.

## Run the reference template

```bash
nvm use
pnpm install
pnpm dev   # local Supabase, Prisma setup, web :9000, admin :9001
```

`pnpm start` does the same local setup, builds both apps, and runs the production servers. Docker and the Supabase CLI must be installed and Docker must be running. The commands create the loopback-only `pawpair-local` network if needed, reuse the local Supabase stack, refresh gitignored env files, apply pending Prisma migrations, and upsert the PawPair demo seed. Existing seed records are not overwritten.

To run a single app:

```bash
pnpm --filter web dev            # http://localhost:9000
pnpm --filter admin dev          # http://localhost:9001
pnpm --filter web storybook      # http://localhost:6006
```

First-time database setup and admin login are covered in [`packages/db/README.md`](packages/db/README.md) and [`apps/admin/README.md`](apps/admin/README.md).

### Local Supabase without a hosted project

The committed `supabase/config.toml` uses ports 55321 (API), 55322 (Postgres), and 55323 (Studio) so it can coexist with another local Supabase stack. From the repository root, run one command:

```bash
pnpm dev
# or pnpm start for a fresh local production build and server
```

Open [Supabase Studio](http://127.0.0.1:55323), the [web example](http://localhost:9000), or the [admin login](http://localhost:9001/login). `pnpm supabase:local:env` remains available to refresh the ignored env files separately. `supabase stop` stops this local stack while retaining its local data. For hosted deployments with managed environment variables, use `pnpm build` followed by `pnpm start:apps`; this skips the local Docker setup.

The Prisma migrations protect the public demo tables with RLS and deny direct anonymous Data API access. The admin portal still gates by Supabase session only, so role authorization must be implemented before deploying it publicly.

---

## Root scripts

| Script | Runs |
| --- | --- |
| `pnpm dev` | Prepare local Supabase, then run web (9000) and admin (9001) |
| `pnpm dev:apps` | Run both app dev servers without local backend setup |
| `pnpm build` | `turbo run build` — production build of every workspace |
| `pnpm start` | Prepare local Supabase, build, then start both apps |
| `pnpm start:apps` | Start built apps without local backend setup |
| `pnpm typecheck` | `turbo run typecheck` — TypeScript across all workspaces |
| `pnpm lint` | `biome check .` across the repo |
| `pnpm lint:apps` | ESLint in web and admin (Next.js rules) |
| `pnpm format` | `biome format --write .` |
| `pnpm build-storybook` | `turbo run build-storybook` — static Storybook build |
| `pnpm ai-usage:serve` | Local AI usage dashboard; see `ai-usage/README.md` |
| `pnpm supabase:local:env` | Populate ignored env files from the running local Supabase stack |
| `pnpm project:init` | Initialize selected app workspaces from a confirmed `PROJECT_STRUCTURE.md` |
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

1. Use this repository as a template and read [TODO.md](TODO.md).
2. Complete [discovery, save the brief, and explicitly confirm it](docs/project/onboarding.md).
3. Plan selected workspaces and shared foundations; follow the seven checklist phases.
4. Deliberately replace/remove PawPair branding, copy, metadata, navigation, assets, pages, features, auth email templates, seed fixtures, and obsolete example docs. Preserve needed infrastructure and review dependencies before removal.
5. Create or adapt only selected apps, verify them, and update project documentation.

Never delete real database data or rewrite applied migrations as cleanup. Review seed scripts before running them and use new forward migrations for schema changes. PawPair remains a useful reference in this template, not client content.

> The cleanup script scans `apps/web/src/{app,modules,sections,hooks,store}` for import references and reports unused folders under `modules/` and `sections/`. Shared primitives now live in `packages/ui`, so the script does not currently prune them — remove unused `packages/ui/src/components/*` folders (and their `packages/ui/src/index.ts` export lines) by hand.

The script is only a component aid. It does not rebrand the product, handle admin features, seed data, or email templates. See [the full cleanup checklist](docs/project/onboarding.md#replace-example-content-safely).

---

## Documentation

| Path | Purpose |
| --- | --- |
| [TODO.md](TODO.md) | Ordered seven-phase project checklist and persistent discovery status |
| [docs/project/onboarding.md](docs/project/onboarding.md) | Client discovery, saved brief confirmation, selected apps, safe cleanup |
| [ai-usage/README.md](ai-usage/README.md) | Shared usage policy and dashboard |
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
