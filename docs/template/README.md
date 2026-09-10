# PawPair Frontend Template

Human-facing documentation for the `fe-multi-web-template` monorepo — a Next.js marketing site plus admin portal, showcasing the fictional PawPair pet social discovery brand.

For a shorter overview, see the [root README](../../README.md).

---

## Monorepo Layout

```text
fe-multi-web-template/
├── apps/
│   ├── web/                  # Marketing site (Next.js, port 9000)
│   └── admin/                # Admin portal (Next.js, port 9001)
│       └── email-templates/  # Supabase Auth email HTML (copy into dashboard)
├── packages/
│   ├── ui/                   # Shared UI primitives (@fe-template/ui)
│   ├── db/                   # Prisma + Supabase Postgres (@fe-template/db)
│   └── config/               # Shared config package (@fe-template/config)
├── docs/
│   ├── about-example-site/   # PawPair brand, content, image guide
│   ├── template/             # Human-facing docs (this folder)
│   └── llm/                  # AI agent context docs
├── scripts/
│   └── cleanup-unused.py     # Remove unused component folders from apps/web
└── turbo.json                # Turborepo pipeline
```

Where things live:

| Concern | Location |
| --- | --- |
| Shared primitives (Button, Card, Dialog, …) | `packages/ui/src/components/` → `import { Button } from "@fe-template/ui"` |
| Page sections | `apps/web/src/sections/[page]/[section]/` |
| Header / footer / sidebar / providers | `apps/<app>/src/modules/` |
| Database access | `packages/db` → `import { prisma } from "@fe-template/db"` |
| Supabase Auth email HTML | `apps/<app>/email-templates/` (copy into Supabase dashboard) |

---

## Prerequisites

- **Node.js 24** — version pinned in [`.nvmrc`](../../.nvmrc)
- **pnpm** — package manager (see root `packageManager` in `package.json`)

```bash
nvm use          # switches to Node 24 via .nvmrc
pnpm install
```

A Supabase project is also needed for the admin portal and database — see the [root README](../../README.md#environment-variables) for the env matrix.

---

## Install & Run

```bash
pnpm install
cp .env.example .env                            # then fill in Supabase values
cp packages/db/.env.example packages/db/.env
cp apps/web/.env.example apps/web/.env.local
cp apps/admin/.env.example apps/admin/.env.local
pnpm --filter @fe-template/db db:generate
```

Per app:

```bash
pnpm --filter web dev        # http://localhost:9000
pnpm --filter admin dev      # http://localhost:9001
pnpm --filter web storybook  # http://localhost:6006
```

Root-level shortcuts (all run through Turbo):

```bash
pnpm dev                     # web (9000) + admin (9001) together
pnpm build                   # production build of every workspace
pnpm build-storybook         # static Storybook build
pnpm db:generate             # Prisma client generation
```

---

## Lint & Typecheck

```bash
pnpm lint                    # Biome check across the monorepo
pnpm format                  # Biome format --write
pnpm typecheck               # TypeScript check (all packages)
```

---

## Images

All image assets live under `apps/web/public/images/`. Use `next/image` for all photography and raster illustrations.

See the full placement guide: [`image-guide.md`](../about-example-site/image-guide.md)

Key folders:

```text
apps/web/public/images/
├── brand/          # Logo and icon
├── hero/           # Hero lifestyle photography
├── product/        # Phone mockups
├── features/       # Feature / safety images
├── about/          # About page imagery
├── community/      # Group walks, final CTA
├── pets/           # Pet profile portraits
├── blog/           # Article hero images
└── illustrations/  # 404 and decorative assets
```

Keep UI text, buttons, pricing, and interactive elements in React — not baked into images.

---

## Email Templates

Each app that integrates with Supabase Auth keeps an `email-templates/` folder at its app root (for example `apps/admin/email-templates/`).

These HTML files use [Supabase Auth email template](https://supabase.com/docs/guides/auth/auth-email-templates) Go syntax — variables such as `{{ .ConfirmationURL }}` and `{{ .Token }}`.

**They are not loaded by the app at runtime.** The folder exists so you can version-control the markup, then copy each file into the Supabase dashboard (**Authentication → Email Templates**) for previewing, debugging, and publishing.

Current templates:

| File | Supabase template |
| --- | --- |
| `apps/admin/email-templates/confirm-email.html` | Confirm signup |

When you add auth to another app, create the same `email-templates/` folder there and keep only the templates that app needs.

---

## Brand & Content

| Document | Purpose |
| --- | --- |
| [`docs/about-example-site/aboustwebsite.md`](../about-example-site/aboustwebsite.md) | PawPair website purpose, page content, navigation, footer, demo models |
| [`docs/about-example-site/branding.md`](../about-example-site/branding.md) | Brand identity, colours, typography, logo, tone of voice |

**PawPair** is a fictional pet social discovery app. Tagline: **"Better matches. Happier tails."**

Primary CTA colour: Coral `#FF6B6B`. Display font: Fraunces. Body font: Manrope.

---

## Cleanup Script

After copying this template for a new project, remove unused shadcn components with:

```bash
python scripts/cleanup-unused.py           # dry-run (default) — lists unused folders
python scripts/cleanup-unused.py --delete  # permanently remove unused component folders
```

The script scans `apps/web/src/app`, `components`, `hooks`, and `store` for import references and reports any component folder with no incoming imports.

> Shared primitives now live in `packages/ui`, which the script does not scan. Prune unused `packages/ui/src/components/*` folders by hand and remove their export lines from `packages/ui/src/index.ts`.

---

## Git Hooks

This repo uses **Husky** + **lint-staged** + **commitlint**:

- **Pre-commit:** Biome check on staged files (`lint-staged`)
- **Commit-msg:** Conventional Commits enforced via commitlint

All commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat(sections): add hero to pricing page
fix(header): correct mobile nav z-index
docs(template): update PAGES guide
```

---

## Further Reading

- [COMPONENTS.md](./COMPONENTS.md) — Component folder conventions
- [HOOKS.md](./HOOKS.md) — API hook structure
- [PAGES.md](./PAGES.md) — Scaffolded pages, section map, and admin routes
- [`packages/ui/README.md`](../../packages/ui/README.md) — Shared primitives package
- [`packages/db/README.md`](../../packages/db/README.md) — Prisma schema, migrations, seeding
- [`apps/admin/README.md`](../../apps/admin/README.md) — Admin portal and Supabase auth setup
- [`docs/llm/`](../llm/) — AI agent context (CONTEXT, PATTERNS, PROMPTS)
