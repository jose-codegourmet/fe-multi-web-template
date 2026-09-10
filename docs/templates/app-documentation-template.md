# App Documentation Template

Use this template when creating a new app under `apps/`. Replace every `<placeholder>` with real information. Delete sections that do not apply. Do not leave inaccurate boilerplate in place.

---

## App: `<app-name>`

- **Workspace name**: `<workspace-name>` (used with `pnpm --filter <workspace-name>`)
- **Port**: `<port>`
- **Framework**: `<framework>`
- **Package name**: `<package.json name>`

## Purpose

`<Short description of what this app does and who uses it.>`

## Main responsibilities

- `<responsibility 1>`
- `<responsibility 2>`

## Technology used

| Layer | Choice |
|---|---|
| Framework | `<framework>` |
| UI | `<ui stack>` |
| State | `<state tools>` |
| Data | `<data tools>` |
| Auth | `<auth>` |
| Styling | `<styling>` |

## Entry points and routes

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | `<purpose>` |
| `<route>` | `src/app/<route>/page.tsx` | `<purpose>` |

## Important directories

| Directory | Purpose |
|---|---|
| `src/app/` | `<purpose>` |
| `src/sections/` | `<purpose>` |
| `src/modules/` | `<purpose>` |
| `src/hooks/` | `<purpose>` |
| `src/constants/` | `<purpose>` |
| `src/types/` | `<purpose>` |
| `src/lib/` | `<purpose>` |
| `public/` | `<purpose>` |

## Shared packages consumed

- `<package>` — `<how it is used>`

## External services

- `<service>` — `<how it is used>`

## Environment variables

| Variable | Purpose | Required? |
|---|---|---|
| `<VAR_NAME>` | `<purpose>` | `<yes/no>` |

## Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `pnpm --filter <workspace-name> dev` | `<purpose>` |
| `build` | `pnpm --filter <workspace-name> build` | `<purpose>` |
| `start` | `pnpm --filter <workspace-name> start` | `<purpose>` |
| `lint` | `pnpm --filter <workspace-name> lint` | `<purpose>` |
| `typecheck` | `pnpm --filter <workspace-name> typecheck` | `<purpose>` |
| `storybook` | `pnpm --filter <workspace-name> storybook` | `<purpose>` |

## Local agent instructions

See `<app-name>/AGENTS.md`.

## Architecture notes

`<High-level architecture: rendering model, data flow, auth, state. Link to architecture.md>`

## Patterns

`<Link to patterns.md and list the most important conventions.>`

## Validation

- `pnpm --filter <workspace-name> typecheck`
- `pnpm --filter <workspace-name> lint` (if available) or `pnpm lint` (Biome)
- `pnpm --filter <workspace-name> build` before claiming completion

## Documentation maintenance

Update this document when:
- A new route or entry point is added.
- A new shared package is consumed.
- A new environment variable is required.
- A build or development command changes.
- The app's architecture or boundaries change.
