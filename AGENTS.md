# Agent Instructions — fe-multi-web-template

Primary navigation for AI coding agents working in this monorepo. Read this file first, then follow the routing below. Do not load every document for every task.

---

## Repository Purpose

`fe-multi-web-template` is a **pnpm workspaces + Turborepo** monorepo template that pairs a public marketing site with a private admin portal. The bundled example brand is **PawPair**, a fictional pet social discovery app. Both apps are Next.js 16 with React 19, Tailwind CSS 4, and shadcn/Base UI primitives. Shared packages supply the UI library (`@fe-template/ui`) and the Prisma client (`@fe-template/db`).

- Apps: `apps/web` (port 9000), `apps/admin` (port 9001)
- Packages: `packages/ui` (`@fe-template/ui`), `packages/db` (`@fe-template/db`), `packages/config` (placeholder)
- Auth: Supabase Auth + `@supabase/ssr` in `apps/admin` only
- Database: Prisma 6 on Supabase Postgres
- Lint/Format: Biome at root; ESLint flat config in each app
- Tests: Vitest + Storybook in `apps/web`; Storybook only in `apps/admin`

---

## Mandatory Reading Order

1. Read this file (`/AGENTS.md`).
2. Read the relevant root documentation in `docs/` (use the routing table below).
3. Determine the affected app or package.
4. Read that app or package's local `AGENTS.md`, then its `docs/README.md`.
5. Inspect nearby implementation examples before creating new code.
6. Create a plan before modifying code.
7. Run the required validation commands after implementation.

---

## Context-Based Documentation Routing

| Task type | Read first | Then read |
|---|---|---|
| Repository architecture, dependency flow, or cross-app refactor | `docs/architecture.md` | Affected app/package docs |
| Repository structure, workspace layout, or naming conventions | `docs/repository-structure.md` | Affected local docs |
| Development workflow, commands, or tooling | `docs/development-workflow.md` | Affected app/package docs |
| Frontend conventions (pages, sections, components, hooks) | `docs/frontend-conventions.md` | `apps/<app>/docs/patterns.md` |
| API integration, data fetching, Server Actions, or React Query | `docs/api-and-data-fetching.md` | Affected app/package docs |
| Styling, design tokens, or shared UI primitives | `docs/styling-and-design-system.md` | `packages/ui/docs/README.md` |
| Testing or Storybook | `docs/testing.md` | Relevant app docs |
| Environment variables or secrets handling | `docs/environment-variables.md` | Affected app/package docs |
| Deployment or production builds | `docs/deployment.md` | Affected app docs |
| Dependency choices or shared-package design | `docs/dependency-guidelines.md` | Affected package docs |
| App-specific task | `docs/frontend-conventions.md` and `docs/api-and-data-fetching.md` | `apps/<app>/AGENTS.md` → `apps/<app>/docs/README.md` |
| Package-specific task | `docs/dependency-guidelines.md` and `docs/api-and-data-fetching.md` | `packages/<package>/AGENTS.md` → `packages/<package>/docs/README.md` |
| Cross-app task | `docs/architecture.md` | Every affected `apps/<app>/AGENTS.md` and local docs |

For the full documentation index, see `docs/README.md`.

---

## Scope Rules

- Read only the documentation relevant to the current task.
- Avoid loading every documentation file unnecessarily.
- Prefer existing patterns over creating new abstractions.
- Search for existing packages before building duplicate functionality.
- Preserve public APIs unless the task explicitly requires a breaking change.
- Update documentation when architecture, commands, or behavior changes.
- Avoid editing unrelated apps or packages.
- Ask for clarification only when a material requirement cannot be inferred from the repository or the task.
- Do not expose secret values from environment files. Document variable names only.
- When documentation disagrees with implementation, treat the implementation as the current source of truth and record the inconsistency.

---

## Validation Rules

Run the commands that apply to the scope of your change. Always run at least lint and type-check before claiming a task is complete.

| Concern | Repository-wide | Scoped to one app/package |
|---|---|---|
| Install | `pnpm install` | — |
| Dev | `pnpm dev` | `pnpm --filter web dev` / `pnpm --filter admin dev` |
| Build | `pnpm build` | `pnpm --filter web build` / `pnpm --filter admin build` |
| Lint (Biome) | `pnpm lint` | `pnpm lint` (Biome scans the whole repo); `pnpm --filter @fe-template/ui lint` |
| Lint fix (Biome) | `pnpm lint:fix` | `pnpm lint:fix` |
| Format | `pnpm format` | `pnpm format` |
| App lint (ESLint) | `pnpm lint:apps` | `pnpm --filter web lint` / `pnpm --filter admin lint` |
| Type check | `pnpm typecheck` | `pnpm --filter <name> typecheck` |
| Storybook | `pnpm storybook` | `pnpm --filter web storybook` / `pnpm --filter admin storybook` |
| DB generate | `pnpm db:generate` | `pnpm --filter @fe-template/db db:generate` |
| DB migrate | — | `pnpm --filter @fe-template/db db:migrate` |
| DB seed | — | `pnpm --filter @fe-template/db db:seed` |
| DB studio | — | `pnpm --filter @fe-template/db db:studio` |

Makefile shortcuts also exist: `make dev`, `make build`, `make storybook`, `make fix`, `make fix-unsafe`. All support `FILTER=<workspace>`.

---

## Documentation Maintenance

Update documentation whenever you change the corresponding surface area:

- Root docs (`docs/`) — when repository-wide architecture, commands, or conventions change.
- App docs (`apps/<app>/docs/`) — when app-specific behavior, routes, structure, or env vars change.
- Package docs (`packages/<package>/docs/`) — when exported APIs, usage patterns, or commands change.
- Local `AGENTS.md` — when the scope, entry points, or validation rules of an app/package change.

---

## Quick Reference

| Workspace | Filter | Port |
|---|---|---|
| `apps/web` | `web` | 9000 |
| `apps/admin` | `admin` | 9001 |
| `packages/ui` | `@fe-template/ui` | — |
| `packages/db` | `@fe-template/db` | — |
| `packages/config` | `@fe-template/config` | — |

Key docs:
- `docs/README.md` — full documentation index
- `docs/llm/CONTEXT.md` — compact stack and folder map
- `docs/llm/PATTERNS.md` — required code patterns
- `docs/template/README.md` — human-facing template guide
- `docs/component-guide.md` — component usage index
