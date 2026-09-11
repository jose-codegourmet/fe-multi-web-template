# Repository Structure — fe-multi-web-template

Directory layout and where common concerns live. Use this when you need to find a file or understand workspace boundaries.

---

## Root layout

```text
fe-multi-web-template/
├── AGENTS.md                 # Agent entry point (new)
├── README.md                 # Human-facing monorepo overview
├── package.json              # Root workspace scripts and devDependencies
├── pnpm-workspace.yaml       # Workspace globs: apps/*, packages/*
├── turbo.json                # Turborepo pipeline
├── biome.json                # Root lint and format config
├── commitlint.config.js      # Conventional Commits
├── Makefile                  # Turbo/Biome shortcuts
├── .nvmrc                    # Node 24
├── .husky/                   # Pre-commit + commit-msg hooks
├── .env.example              # Root env var names
├── .env                      # Local env values (gitignored)
├── docs/                     # Documentation system
├── apps/                     # Applications
├── packages/                 # Shared packages
├── scripts/                  # Python helpers (see Scripts below)
├── images/                   # Root source photography assets
└── prompt.md                 # Original bootstrap prompt
```

---

## Apps

### `apps/web` — public marketing site

```text
apps/web/
├── package.json              # Scripts: dev, build, start, lint, storybook, typecheck
├── next.config.ts            # transpilePackages: ["@fe-template/ui"]
├── tsconfig.json             # @/* → ./src/*, strict, excludes stories
├── eslint.config.mjs         # Next.js flat config + storybook plugin
├── postcss.config.mjs        # Tailwind 4 PostCSS plugin
├── vitest.config.ts          # Vitest + Storybook + Playwright browser
├── vitest.shims.d.ts         # Vitest type shims
├── components.json           # shadcn "base-nova" CLI config; ui/components → @fe-template/ui
├── .env.example              # Env var names
├── .storybook/               # Storybook config (port 6006)
├── public/                   # Static assets, images/
└── src/
    ├── app/                  # Next.js App Router routes
    │   ├── layout.tsx        # Root layout, fonts, providers
    │   ├── page.tsx          # Home page (force-dynamic)
    │   ├── not-found.tsx
    │   ├── about/
    │   ├── blog/             # page, grid/page, [slug]/page
    │   ├── contact/
    │   ├── otp/
    │   ├── pricing/
    │   ├── showcase/
    │   └── api/              # blog, pricing, testimonials routes
    ├── sections/             # Page sections, per-page folder
    ├── modules/              # layout (header, footer, sidebar), providers
    ├── hooks/                # use-blog-posts, use-pricing-plans, use-testimonials, use-mobile
    ├── constants/            # routes.ts, seo.ts, navigation.ts
    ├── types/                # Marketing-domain types
    ├── store/                # Redux store + theme slice
    └── lib/                  # utils.ts, mock/pets.ts
```

### `apps/admin` — admin portal

```text
apps/admin/
├── middleware.ts             # Supabase session + route guards
├── package.json              # Scripts: dev, build, start, lint, storybook, typecheck
├── next.config.ts            # transpilePackages: ["@fe-template/ui"]
├── tsconfig.json             # @/* → ./src/*, strict
├── eslint.config.mjs         # Next.js flat config
├── postcss.config.mjs        # Tailwind 4 PostCSS plugin
├── .env.example              # Env var names
├── .storybook/               # Storybook config (port 6007)
├── email-templates/          # Supabase Auth email HTML
└── src/
    ├── app/
    │   ├── layout.tsx        # Root layout
    │   ├── page.tsx          # Redirects to /dashboard
    │   ├── not-found.tsx
    │   ├── login/page.tsx
    │   ├── signup/page.tsx
    │   ├── otp/page.tsx
    │   ├── api/images/route.ts
    │   └── (dashboard)/      # Dashboard shell and pages
    │       ├── layout.tsx
    │       ├── dashboard/page.tsx
    │       ├── users/        # page, [id]/page, actions.ts, table/dialogs
    │       ├── pets/
    │       ├── posts/        # page, new/, [id]/, actions.ts, post-form/PostForm.tsx
    │       ├── pricing-plans/
    │       ├── testimonials/
    │       ├── contacts/
    │       └── profile/
    ├── hooks/                # use-*/server.ts + client.ts patterns
    ├── lib/                  # supabase clients, utils, upload-image
    └── modules/              # auth forms, layout, providers
```

---

## Packages

### `packages/ui` — shared UI primitives (`@fe-template/ui`)

```text
packages/ui/
├── package.json              # exports: ., ./styles.css, ./*
├── tsconfig.json             # noEmit
├── README.md                 # Existing package README
└── src/
    ├── index.ts              # Public barrel export
    ├── styles.css            # tw-animate-css import
    ├── lib/utils.ts          # cn()
    └── components/           # 63 component folders; see packages/ui/src/index.ts
```

### `packages/db` — Prisma client and schema (`@fe-template/db`)

```text
packages/db/
├── package.json              # prisma: schema = prisma/schema
├── tsconfig.json             # noEmit
├── .env.example              # DATABASE_URL, DIRECT_URL
├── README.md                 # Existing package README
├── src/
│   ├── index.ts              # Re-exports @prisma/client + prisma
│   └── client.ts             # PrismaClient singleton
└── prisma/
    ├── schema/
    │   ├── schema.prisma     # generator + datasource
    │   ├── user.prisma
    │   ├── pet.prisma
    │   ├── post.prisma
    │   ├── marketing.prisma
    │   └── migrations/       # Multi-file schema migrations
    ├── seed.ts               # Seed script
    └── constants/            # Seed data constants
```

### `packages/config` — placeholder

```text
packages/config/
└── package.json              # No exports, no dependencies, no consumers
```

---

## Key config files

| File | Purpose |
|---|---|
| `package.json` | Root scripts, `packageManager`, `lint-staged` |
| `pnpm-workspace.yaml` | Workspace globs and `allowBuilds` |
| `turbo.json` | Task pipeline, global env, outputs |
| `biome.json` | Formatter and linter for the whole repo |
| `commitlint.config.js` | Conventional Commits rule |
| `Makefile` | Common command shortcuts with `FILTER` support |
| `.nvmrc` | Node 24 |
| `.husky/pre-commit` | `pnpm exec lint-staged` |
| `.husky/commit-msg` | `pnpm exec commitlint --edit $1` |

---

## Scripts

| Script | Purpose | When to run |
|---|---|---|
| `scripts/cleanup-unused.py` | Dry-run (default) or `--delete` unused folders under the paths it scans in `apps/web` | After forking the template, when pruning unused marketing sections |
| `scripts/migrate-components.py` | One-off “PLAN 03” helper that moved flat `apps/web/src/components/ui/<kebab>.tsx` files into kebab folders | **Do not run.** That source directory no longer exists; primitives now live in `packages/ui`. The script rewrites imports and generates stub schema/story files. Keep it only as history. |

---

## Superpowers artifacts

- `docs/superpowers/plans/` and `docs/superpowers/specs/` are **committed historical** implementation plans and specs. Read them for past decisions; they are not current agent instructions.
- A root `.superpowers/` directory is **not** part of this repository. If a local Superpowers plugin creates one, treat it as machine-local state (gitignored). Do not commit it.

---

## Where to put new code

| Concern | Location |
|---|---|
| New web page | `apps/web/src/app/[route]/page.tsx` + `apps/web/src/sections/[page]/` |
| New web section | `apps/web/src/sections/[page]/[section]/` |
| New admin page | `apps/admin/src/app/(dashboard)/[route]/page.tsx` + co-located client components |
| New admin mutation | `apps/admin/src/app/(dashboard)/[route]/actions.ts` |
| New shared primitive | `packages/ui/src/components/[name]/` + export in `packages/ui/src/index.ts` |
| New model / field | `packages/db/prisma/schema/*.prisma` |
| New hook | `apps/<app>/src/hooks/use-[name]/` with `client.ts` + `server.ts` |
| New route constant | `apps/web/src/constants/routes.ts` |
| New SEO metadata | `apps/web/src/constants/seo.ts` |
| New shared config | Prefer `packages/config` only after planning; currently empty |

---

## Notable empty or stale locations

- `apps/admin/src/login/` exists but is empty. Use `apps/admin/src/app/login/`.
- `apps/admin/README.md` lists the dashboard as `/` and references `(dashboard)/page.tsx`; the current code redirects `/` to `/dashboard` and uses `app/(dashboard)/dashboard/page.tsx`.
- Signup email confirmation is handled by `apps/admin/src/app/auth/callback/route.ts`.
- `apps/web` API routes query Prisma; marketing pages fetch through `src/hooks/use-*/server.ts`. See `docs/api-and-data-fetching.md`.
