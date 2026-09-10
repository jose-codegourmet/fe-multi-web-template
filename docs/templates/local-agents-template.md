# Local `AGENTS.md` Template

Use this template for a new `apps/<app>/AGENTS.md` or `packages/<package>/AGENTS.md`. Replace every `<placeholder>` with real information. Keep it concise. Do not duplicate the root `/AGENTS.md`.

---

## Scope

This file applies to `<app-or-package-name>`. The root `/AGENTS.md` still applies first.

## What this workspace does

`<One or two sentences.>`

## Important directories

| Directory | Purpose |
|---|---|
| `<directory>` | `<purpose>` |

## Shared packages used

- `<package>` — `<how it is used>`

## Public entry points (for packages)

- `<entry>` — `<path>` — `<what it exports>`

## Consumers (for packages)

- `<app or package>` — `<how it consumes this workspace>`

## Validation commands

| Concern | Command |
|---|---|
| Type check | `pnpm --filter <workspace-name> typecheck` |
| Lint | `pnpm --filter <workspace-name> lint` (or `pnpm lint` if no local lint) |
| Build | `pnpm --filter <workspace-name> build` |
| Tests | `pnpm --filter <workspace-name> test` (if available) |

## Restrictions and boundaries

- `<boundary 1>`
- `<boundary 2>`
- `<do not do X>`

## Common task routing

| Task | Read next |
|---|---|
| New feature | `docs/README.md` → `<workspace>/docs/README.md` → `<workspace>/docs/patterns.md` |
| Bug fix | Inspect implementation examples near the affected code |
| API change | `<workspace>/docs/api.md` and identify all consumers |

## Documentation maintenance

Update this file when the workspace's scope, entry points, validation commands, or boundaries change.
