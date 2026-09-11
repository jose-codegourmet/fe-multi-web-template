# Testing — fe-multi-web-template

Testing tools, commands, and conventions in the monorepo.

---

## Current testing landscape

| Workspace | Unit tests | E2E tests | Storybook | Config |
|---|---|---|---|---|
| `apps/web` | No standalone files | No | Yes (port 6006) | `vitest.config.ts`, Storybook 10 + `@storybook/addon-vitest` |
| `apps/admin` | No | No | Yes (port 6007) | `.storybook/` plus admin-specific stories under `src/` |
| `packages/ui` | No | No | Consumed by `apps/web` storybook | No test config |
| `packages/db` | No | No | No | No test config |

No `test` script exists in any `package.json`. The Vitest setup in `apps/web` is primarily for Storybook's Vitest addon, not for a standalone test suite.

---

## `apps/web` testing setup

`apps/web/vitest.config.ts` configures:

- `@storybook/addon-vitest` browser project
- `@vitest/browser-playwright` provider
- Coverage via `@vitest/coverage-v8`

This runs Storybook stories in Chromium via Playwright.

### Commands

```bash
pnpm --filter web storybook      # start Storybook on port 6006
pnpm --filter web build-storybook # build static Storybook
```

---

## `apps/admin` testing setup

Storybook on port 6007 globs both `apps/admin/src/**/*.stories.*` and `packages/ui` stories. Admin coverage is a small, representative set — not every page:

| Story | Path | Why it exists |
|---|---|---|
| `AdminHeader` | `src/modules/layout/AdminHeader.stories.tsx` | Dashboard shell chrome |
| `AdminSidebar` | `src/modules/layout/AdminSidebar.stories.tsx` | Dashboard shell chrome |
| `LoginForm` | `src/modules/auth/login-form/LoginForm.stories.tsx` | Representative auth form |
| `UsersTable` | `src/app/(dashboard)/users/users-table/UsersTable.stories.tsx` | Representative DataTable usage |
| `StatusBadge` | `src/app/(dashboard)/users/StatusBadge.stories.tsx` | User status chip used in tables |

Do not add a story for every admin route. Prefer isolated chrome, forms, and tables that regress independently of page data fetching.

Stories that depend on TanStack Query seed cache via `src/storybook/seeded-query.tsx` so they render without Prisma or a live Supabase session.

### Commands

```bash
pnpm --filter admin storybook       # start Storybook on port 6007
pnpm --filter admin build-storybook # build static Storybook
```

---

## Storybook conventions

- Co-locate stories with components: `ComponentName.stories.tsx` next to `ComponentName.tsx`.
- Co-locate use-case docs: `ComponentName.usecase.md` next to the component.
- Shared primitives are in `packages/ui/src/components/**` and are consumed by both app Storybooks.
- `apps/admin` also ships a small set of admin-only stories (shell, one form, one table). See the admin section above.

See `docs/template/COMPONENTS.md` for story conventions.

---

## Adding tests

If you add a test suite:

1. Add a `test` script to the relevant `package.json`.
2. Add the task to `turbo.json` if it should run in CI.
3. Document the command here and in the relevant app/package docs.
4. Prefer the existing Vitest/Playwright stack in `apps/web` before introducing a new test runner.

---

## Validation commands

| Workspace | Command | Purpose |
|---|---|---|
| `apps/web` | `pnpm --filter web storybook` | Start Storybook |
| `apps/admin` | `pnpm --filter admin storybook` | Start Storybook |
| `apps/web` | `pnpm --filter web build-storybook` | Build static Storybook |
| `apps/admin` | `pnpm --filter admin build-storybook` | Build static Storybook |

There is no `pnpm test` today. Run `pnpm typecheck` and `pnpm lint` as the minimum validation before completing a task.
