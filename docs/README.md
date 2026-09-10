# Documentation Index — fe-multi-web-template

Master index for the `fe-multi-web-template` documentation system. Use this file to decide which documents to read for a given task. Do not read every file for every task.

---

## Start here

1. `/AGENTS.md` — primary navigation and rules for all AI agents.
2. This file (`docs/README.md`) — choose the next documents based on your task.
3. The relevant app or package `AGENTS.md` and `docs/README.md`.
4. Implementation examples in the relevant app or package.

---

## Apps and packages

| Workspace | Local docs | Local agent instructions |
|---|---|---|
| `apps/web` | `apps/web/docs/README.md` | `apps/web/AGENTS.md` |
| `apps/admin` | `apps/admin/docs/README.md` | `apps/admin/AGENTS.md` |
| `packages/ui` | `packages/ui/docs/README.md` | `packages/ui/AGENTS.md` |
| `packages/db` | `packages/db/docs/README.md` | `packages/db/AGENTS.md` |
| `packages/config` | (placeholder) | `packages/config/AGENTS.md` |

---

## Root documentation

| Document | Purpose | Read when |
|---|---|---|
| `docs/architecture.md` | Monorepo architecture, app/package graph, dependency flow, data flow | You need the big picture or are changing cross-app boundaries |
| `docs/repository-structure.md` | Directory layout, workspace names, key config files | You need to know where something lives |
| `docs/development-workflow.md` | All commands, Husky, Biome, commitlint, Makefile shortcuts | You are running, linting, formatting, or type-checking code |
| `docs/frontend-conventions.md` | Pages, sections, components, hooks, forms, routes | You are changing UI code in any app |
| `docs/api-and-data-fetching.md` | TanStack Query, Prisma, Server Actions, API routes | You are adding or changing data fetching |
| `docs/styling-and-design-system.md` | Tailwind 4, design tokens, `@fe-template/ui`, `cn()` | You are changing styles, themes, or shared UI |
| `docs/state-management.md` | Redux, TanStack Query, theme state | You are changing state or providers |
| `docs/environment-variables.md` | Env var names, ownership, pooled vs direct DB URLs | You are adding env vars or configuring services |
| `docs/testing.md` | Vitest, Storybook, test commands | You are adding or running tests |
| `docs/deployment.md` | Build, Vercel, outputs, production commands | You are changing build or deployment behavior |
| `docs/dependency-guidelines.md` | When to add dependencies to root, apps, or packages | You are adding or reorganizing dependencies |
| `docs/documentation-guidelines.md` | How to write and maintain this docs system | You are adding new apps, packages, or docs |

---

## Existing documentation preserved

These files are not duplicated by the new system. They remain authoritative for their topics.

| Path | Purpose | Read when |
|---|---|---|
| `docs/llm/CONTEXT.md` | Compact stack and folder map | You need a quick overview of the whole repo |
| `docs/llm/PATTERNS.md` | Required code patterns | You are writing new components, hooks, or pages |
| `docs/llm/PROMPTS.md` | Copy-paste prompts for scaffolding | You are scaffolding a new feature |
| `docs/template/README.md` | Human-facing template guide | You are onboarding a human or need setup steps |
| `docs/template/PAGES.md` | Web route map and admin route map | You are adding or changing routes |
| `docs/template/COMPONENTS.md` | Component folder conventions | You are adding components or sections |
| `docs/template/HOOKS.md` | Hook folder conventions | You are adding a `use-*` hook |
| `docs/component-guide.md` | LLM-oriented component index | You need to pick the right UI primitive |
| `docs/about-example-site/aboustwebsite.md` | PawPair content direction | You are editing marketing content |
| `docs/about-example-site/branding.md` | Brand identity and tokens | You are editing colors, typography, or voice |
| `docs/about-example-site/image-guide.md` | Image asset rules | You are adding or replacing images |
| `docs/superpowers/plans/` | Historical implementation plans | You need context on past decisions |
| `docs/superpowers/specs/` | Historical design specs | You need context on past decisions |

---

## Task routing

| Task type | Read first | Then read |
|---|---|---|
| Repository architecture | `docs/architecture.md` | Relevant app or package docs |
| Repository structure | `docs/repository-structure.md` | Affected local docs |
| App feature | `docs/frontend-conventions.md`, `docs/api-and-data-fetching.md` | `apps/<app>/AGENTS.md` → `apps/<app>/docs/README.md` |
| Shared UI primitive | `docs/frontend-conventions.md`, `docs/styling-and-design-system.md` | `packages/ui/AGENTS.md` → `packages/ui/docs/README.md` |
| API integration | `docs/api-and-data-fetching.md` | Relevant app and package docs |
| Cross-app refactor | `docs/architecture.md`, `docs/dependency-guidelines.md` | All affected local docs |
| Database change | `docs/api-and-data-fetching.md`, `packages/db/docs/development.md` | `packages/db/AGENTS.md`, affected app docs |
| Package change | `docs/dependency-guidelines.md`, `docs/api-and-data-fetching.md` | `packages/<package>/AGENTS.md` → `packages/<package>/docs/README.md` |
| Testing | `docs/testing.md` | Relevant app docs |
| Deployment | `docs/deployment.md` | Relevant app docs |
| Documentation | `docs/documentation-guidelines.md` | Relevant templates in `docs/templates/` |

---

## Documentation templates

Use these when creating a new app or package.

| Template | Path |
|---|---|
| App documentation | `docs/templates/app-documentation-template.md` |
| Package documentation | `docs/templates/package-documentation-template.md` |
| Local `AGENTS.md` | `docs/templates/local-agents-template.md` |
