# PawPair Frontend Template

Human-facing documentation for the `fe-template` monorepo — a Next.js marketing template showcasing the fictional PawPair pet social discovery brand.

For a shorter overview, see the [root README](../../README.md).

---

## Monorepo Layout

```text
fe-template/
├── apps/
│   └── web/                  # Next.js App Router application
├── packages/
│   └── config/               # Shared config package
├── docs/
│   ├── about-example-site/   # PawPair brand, content, image guide
│   ├── template/             # Human-facing docs (this folder)
│   └── llm/                  # AI agent context docs
├── scripts/
│   └── cleanup-unused.py     # Remove unused component folders
└── .github/workflows/ci.yml  # CI pipeline
```

---

## Prerequisites

- **Node.js 24** — version pinned in [`.nvmrc`](../../.nvmrc)
- **pnpm** — package manager (see root `packageManager` in `package.json`)

```bash
nvm use          # switches to Node 24 via .nvmrc
pnpm install
```

---

## Install & Run

```bash
pnpm install
pnpm --filter web dev        # http://localhost:3000
pnpm --filter web storybook  # http://localhost:6006
```

Root-level shortcuts:

```bash
pnpm dev                     # same as pnpm --filter web dev
pnpm build                   # production build
pnpm build-storybook         # static Storybook build
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
- [PAGES.md](./PAGES.md) — Scaffolded pages and section map
- [`docs/llm/`](../llm/) — AI agent context (CONTEXT, PATTERNS, PROMPTS)
