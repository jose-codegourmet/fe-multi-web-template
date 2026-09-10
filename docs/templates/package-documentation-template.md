# Package Documentation Template

Use this template when creating a new package under `packages/`. Replace every `<placeholder>` with real information. Delete sections that do not apply. Do not leave inaccurate boilerplate in place.

---

## Package: `<package-name>`

- **Workspace name**: `<workspace-name>` (used with `pnpm --filter <workspace-name>`)
- **Package name**: `<package.json name>`
- **Version**: `<version>`

## Purpose

`<Short description of what this package does and why it exists.>`

## Problems it solves

- `<problem 1>`
- `<problem 2>`

## Intended consumers

- `<app or package>` — `<how it consumes this package>`

## Public entry points

| Entry | Path | Exports |
|---|---|---|
| `.` | `<entry file>` | `<list public exports>` |
| `<subpath>` | `<subpath file>` | `<list public exports>` |

## Major dependencies

| Dependency | Purpose |
|---|---|
| `<dep>` | `<purpose>` |

## Packages or apps that consume it

- `<consumer>` — `<where it imports this package>`

## Basic usage

```ts
import { <something> } from "<package-name>";

// example
```

## Development commands

| Script | Command | Purpose |
|---|---|---|
| `typecheck` | `pnpm --filter <workspace-name> typecheck` | TypeScript check |
| `lint` | `pnpm --filter <workspace-name> lint` | Lint (if available) |
| `build` | `pnpm --filter <workspace-name> build` | Build (if available) |
| `test` | `pnpm --filter <workspace-name> test` | Tests (if available) |

## Local agent instructions

See `<package-name>/AGENTS.md`.

## API surface

`<Link to api.md or list the public API here.>`

## Development and release

`<Build process, versioning, publishing. Link to development.md.>`

## Examples

`<Link to examples.md or include basic examples.>`

## Documentation maintenance

Update this document when:
- A new public export is added.
- The public API changes.
- A new consumer appears.
- Build or development commands change.
- Versioning or publishing expectations change.
