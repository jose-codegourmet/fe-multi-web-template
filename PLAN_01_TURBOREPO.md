# PLAN 01 — Add Turborepo

> Execute this plan in a fresh agent session. It is self-contained. When finished, **always commit and push to `main`** (see final step).

## Goal

Introduce [Turborepo](https://turbo.build/) as the task orchestrator for this pnpm-workspaces monorepo, replacing the current ad-hoc `pnpm --filter web ...` root scripts. This prepares the repo for multiple apps (`apps/web`, `apps/admin`) and packages (`packages/ui`, `packages/db`, `packages/config`).

## Context (current state)

- Package manager: **pnpm 11.0.8** workspaces (`pnpm-workspace.yaml` globs `apps/*`, `packages/*`).
- **No** `turbo.json` exists yet.
- Root `package.json` (`name: fe-template`, `type: module`) scripts today:
  ```json
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "lint": "biome check .",
    "format": "biome format --write .",
    "typecheck": "pnpm -r typecheck",
    "build-storybook": "pnpm --filter web build-storybook",
    "prepare": "husky"
  }
  ```
- Apps expose these scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `storybook`, `build-storybook`.
- `.gitignore` already ignores `.turbo/` (verify; add if missing).

## Steps

### 1. Install Turborepo at the root

Add `turbo` as a root dev dependency (do not pin an outdated version; let pnpm resolve latest 2.x):

```bash
pnpm add -D -w turbo
```

### 2. Create `turbo.json` at the repo root

Create `/turbo.json`:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "globalDependencies": [".env", ".env.local"],
  "globalEnv": [
    "NODE_ENV",
    "DATABASE_URL",
    "DIRECT_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  ],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**", "storybook-static/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "start": {
      "cache": false,
      "persistent": true
    },
    "build-storybook": {
      "outputs": ["storybook-static/**"]
    },
    "db:generate": {
      "cache": false
    }
  }
}
```

Notes:
- `^build` means "build this package's workspace dependencies first" — important because `apps/*` will depend on `packages/ui` and `packages/db`.
- The `globalEnv` entries stop Turbo from warning about env-var usage; keep this list in sync as new env vars are added in later plans.

### 3. Update root `package.json` scripts to delegate to Turbo

Replace the `scripts` block with:

```json
"scripts": {
  "dev": "turbo run dev",
  "build": "turbo run build",
  "start": "turbo run start",
  "lint": "biome check .",
  "lint:apps": "turbo run lint",
  "format": "biome format --write .",
  "typecheck": "turbo run typecheck",
  "build-storybook": "turbo run build-storybook",
  "prepare": "husky"
}
```

Keep `lint`/`format` as Biome at the root (repo-wide formatting), and add `lint:apps` for the per-app ESLint runs via Turbo. Keep `prepare: husky`.

### 4. Ensure `.turbo/` is gitignored

Confirm `.gitignore` contains a line for `.turbo` (both root and nested). If not present, add:

```
# turbo
.turbo
```

### 5. Verify

Run the following and confirm no errors:

```bash
pnpm install
pnpm typecheck
pnpm build
```

`pnpm build` should build `apps/web` through Turbo. It's acceptable if only `web` builds at this stage (other apps/packages are added in later plans).

## Acceptance criteria

- [ ] `turbo` is a root dev dependency and `turbo.json` exists at the repo root.
- [ ] Root scripts run through `turbo run ...` (except Biome `lint`/`format`).
- [ ] `pnpm build` and `pnpm typecheck` succeed via Turbo.
- [ ] `.turbo` is gitignored.

## Final step — commit and push to main (REQUIRED)

Always finish by committing and pushing to `main`:

```bash
git add -A
git commit -m "chore: add Turborepo task orchestration"
git push origin main
```
