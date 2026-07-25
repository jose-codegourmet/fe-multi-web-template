# FE Template

A production-ready **pnpm workspaces** monorepo template for marketing sites — Next.js 16, React 19, Tailwind 4, and shadcn/ui.

The bundled example brand is **PawPair**, a fictional pet social discovery app (“Better matches. Happier tails.”). Use this repo as a GitHub template, then swap brand content and prune unused components.

**Live demo:** [https://fe-template-web-9t3u.vercel.app/](https://fe-template-web-9t3u.vercel.app/)

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, shadcn/ui |
| State | Redux Toolkit, TanStack Query |
| Motion | Framer Motion |
| Docs / UI kit | Storybook 10 |
| Lint / format | Biome |
| Tests | Vitest |
| Git hooks | Husky, lint-staged, commitlint (Conventional Commits) |
| Package manager | pnpm workspaces |

---

## Monorepo structure

```text
fe-template/
├── apps/
│   └── web/                 # Next.js App Router application
├── packages/
│   └── config/              # Shared config package
├── docs/
│   ├── template/            # Human-facing template docs
│   ├── llm/                 # AI agent context (CONTEXT, PATTERNS, PROMPTS)
│   └── about-example-site/  # PawPair brand, content, image guide
├── fe-template-builder/     # Agent skill for scaffolding from this template
├── scripts/
│   └── cleanup-unused.py    # Remove unused component folders
└── .github/workflows/ci.yml # CI pipeline
```

---

## Prerequisites

- **Node.js 24** — pinned in [`.nvmrc`](.nvmrc)
- **pnpm** — see `packageManager` in [`package.json`](package.json)

```bash
nvm use
pnpm install
```

---

## Quick start

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm --filter web storybook   # http://localhost:6006
```

### Root scripts

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the Next.js dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Biome check across the monorepo |
| `pnpm format` | Biome format `--write` |
| `pnpm typecheck` | TypeScript check (all packages) |
| `pnpm build-storybook` | Static Storybook build |

---

## Using as a template

1. Click **Use this template** on GitHub (or clone the repo).
2. Install dependencies and run the app (see Quick start).
3. Replace PawPair brand/content under `docs/about-example-site/` and `apps/web/public/images/`.
4. Remove unused shadcn component folders:

```bash
python scripts/cleanup-unused.py           # dry-run (default)
python scripts/cleanup-unused.py --delete  # permanently remove unused folders
```

---

## Agent skill (`fe-template-builder`)

This repository includes an [Agent Skill](https://agentskills.io/specification) so coding agents can scaffold and customize new sites from this template.

| Path | Purpose |
| --- | --- |
| [`fe-template-builder/SKILL.md`](fe-template-builder/SKILL.md) | Skill instructions (name + description for discovery) |
| [`fe-template-builder/scripts/create-project.sh`](fe-template-builder/scripts/create-project.sh) | Clone template into a fresh local project |
| [`fe-template-builder/references/`](fe-template-builder/references/) | Structure map for agents |
| [`fe-template-builder/assets/example-brief.md`](fe-template-builder/assets/example-brief.md) | Intake brief template |

### Install / use with an agent

- **Cursor / Codex (repo skill):** open this repo (or a clone) and ask the agent to follow `fe-template-builder`.
- **Codex skill installer:** install from this GitHub repo, then invoke `fe-template-builder`.
- **Deterministic scaffold:**

```bash
./fe-template-builder/scripts/create-project.sh my-new-site
```

GitHub topics `claude-skills` and `claude-code-skill` are set so directories such as SkillsMP can index this skill after their next sync.

---

## Documentation

| Path | Purpose |
| --- | --- |
| [`docs/component-guide.md`](docs/component-guide.md) | Per-component usage guide (when / when-not); links to co-located `*.usecase.md` |
| [`docs/template/README.md`](docs/template/README.md) | Full template guide (layout, images, hooks, commits) |
| [`docs/template/PAGES.md`](docs/template/PAGES.md) | Routes and section map |
| [`docs/template/COMPONENTS.md`](docs/template/COMPONENTS.md) | Component folder conventions (incl. `*.usecase.md`) |
| [`docs/template/HOOKS.md`](docs/template/HOOKS.md) | API hook structure |
| [`docs/llm/`](docs/llm/) | AI agent context, patterns, and prompts |
| [`docs/about-example-site/`](docs/about-example-site/) | PawPair branding, content, and image guide |

---

## CI

On push and pull request to `main` / `master`, GitHub Actions runs:

1. Biome lint
2. Typecheck
3. Storybook build

See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
