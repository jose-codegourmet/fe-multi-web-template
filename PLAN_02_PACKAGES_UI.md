# PLAN 02 — Extract UI primitives into `packages/ui`

> Execute this plan in a fresh agent session. It is self-contained. Run **after** `PLAN_01_TURBOREPO.md`. When finished, **always commit and push to `main`** (see final step).

## Goal

Move the reusable **UI primitive** components out of `apps/web/src/components/` and into a new shared workspace package `@fe-template/ui` (`packages/ui`). Both `apps/web` and the future `apps/admin` will import UI primitives from this package.

**Only UI primitives move.** These stay in `apps/web`:
- `src/sections/**` (page sections)
- `src/modules/layout/**` (Header, Footer, Sidebar)
- `src/hooks/**`, `src/store/**`, `src/constants/**`, `src/lib/**` (except `utils.ts`, see below)
- `src/app/**`

## Context (current state)

- Components live in `apps/web/src/components/<name>/<Name>.tsx` (PascalCase files), each often with `<Name>.stories.tsx` and `<Name>.usecase.md`. ~60 primitives total.
- Components cross-import each other via the Next alias, e.g. `import { Button } from "@/components/button/Button"` and `import { cn } from "@/lib/utils"`.
- `apps/web/tsconfig.json` maps `"@/*": ["./src/*"]`.
- `apps/web/src/lib/utils.ts` contains `cn()` (clsx + tailwind-merge).
- Sections/modules also import components via `@/components/...`.
- shadcn config: `apps/web/components.json` (`style: base-nova`, aliases point to `@/components`, `@/lib/utils`, etc.).

## Components to move (the full primitive set)

accordion, alert, alert-dialog, aspect-ratio, attachment, avatar, badge, breadcrumb, bubble, button, button-group, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, direction, drawer, dropdown-menu, embla-carousel, empty, field, hover-card, input, input-group, input-otp, item, kbd, label, marker, menubar, message, message-scroller, motion (scroll-reveal), native-select, navigation-menu, pagination, popover, progress, providers, radio-group, resizable, scroll-area, select, separator, sheet, skeleton, slider, sonner, spinner, switch, table (+ table/data-table), tabs, textarea, toggle, toggle-group, tooltip

> Verify the exact list at execution time with: `ls apps/web/src/components`.

## Strategy

Use Next.js `transpilePackages` so the package ships raw TS/TSX and each app transpiles it. Inside `packages/ui`, resolve internal imports with a package-local `@/*` alias so the moved shadcn files need minimal edits.

## Steps

### 1. Scaffold `packages/ui`

Create the following files.

`packages/ui/package.json`:
```json
{
  "name": "@fe-template/ui",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "sideEffects": ["**/*.css"],
  "exports": {
    ".": "./src/index.ts",
    "./styles.css": "./src/styles.css",
    "./*": "./src/components/*"
  },
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "dependencies": {
    "@base-ui/react": "^1.6.0",
    "@shadcn/react": "^0.2.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.4.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "^12.42.2",
    "input-otp": "^1.4.2",
    "lucide-react": "^1.24.0",
    "next-themes": "^0.4.6",
    "react-day-picker": "^10.0.1",
    "react-resizable-panels": "^4.12.2",
    "recharts": "3.8.0",
    "sonner": "^2.0.7",
    "tailwind-merge": "^3.6.0",
    "tw-animate-css": "^1.4.0"
  },
  "peerDependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5"
  }
}
```

> These deps mirror the primitive-related deps currently in `apps/web/package.json`. Redux/TanStack Query stay in the apps (they belong to `providers`/store — but note `Providers.tsx` uses them; see step 4).

`packages/ui/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules", "**/*.stories.tsx", "**/*.stories.ts"]
}
```

### 2. Move the primitive component folders

Move every primitive folder from `apps/web/src/components/` to `packages/ui/src/components/`, preserving folder structure (including `.stories.tsx` and `.usecase.md`). Use `git mv` so history is retained:

```bash
mkdir -p packages/ui/src/components
git mv apps/web/src/components/* packages/ui/src/components/
```

Then remove the now-empty `apps/web/src/components/` directory if nothing remains.

### 3. Move `cn` util into the package

Create `packages/ui/src/lib/utils.ts` with the same `cn` implementation:
```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Keep `apps/web/src/lib/utils.ts` too (sections may still use `@/lib/utils`), OR re-export from the package — simplest is to leave the app copy and have package components use the package copy. Because the package `tsconfig` maps `@/*` to `packages/ui/src`, the moved components' existing `import { cn } from "@/lib/utils"` will now resolve to `packages/ui/src/lib/utils.ts` automatically. No edit needed inside moved files for `cn` or cross-component `@/components/...` imports.

### 4. Handle `providers` (special case)

`packages/ui/src/components/providers/Providers.tsx` currently imports Redux store (`@/store`) and TanStack Query. These are app-level concerns, not UI primitives.

Decision: **Do not move `Providers` into the shared package.** Move it back to the app:
```bash
git mv packages/ui/src/components/providers apps/web/src/modules/providers
```
Update its imports to `@/store`, keep it app-local. Each app owns its own providers. (When `apps/admin` is built in PLAN 04 it will get its own providers.)

Similarly review `chart` and `sonner` — these ARE fine as UI primitives (recharts / sonner are in the package deps).

### 5. Create the package barrel export

Create `packages/ui/src/index.ts` re-exporting every component and the util. Generate it from the folder list, e.g.:

```ts
export * from "./lib/utils";

export * from "./components/accordion/Accordion";
export * from "./components/alert/Alert";
export * from "./components/alert-dialog/AlertDialog";
// ... one line per primitive, matching the actual exported file name in each folder
export * from "./components/tooltip/Tooltip";
```

> Determine each folder's main file (PascalCase, non-story) at execution time. Watch for name collisions on generic exports (e.g. multiple files exporting `buttonVariants`); if collisions occur, prefer subpath imports (`@fe-template/ui/button/Button`) over the barrel for those, or alias the re-exports.

### 6. Move shared styles (optional but recommended)

The Tailwind theme tokens live in `apps/web/src/app/globals.css`. Keep `globals.css` in each app (Tailwind 4 scans app source). No CSS move is strictly required because Tailwind 4 in each app must `@source` the package. See step 8.

Create `packages/ui/src/styles.css` as a placeholder that `@import "tw-animate-css";` if needed, or leave the export pointing to an empty file. Not critical for functionality.

### 7. Wire `apps/web` to consume the package

In `apps/web/package.json` dependencies, add:
```json
"@fe-template/ui": "workspace:*"
```

In `apps/web/next.config.ts`, enable transpilation:
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@fe-template/ui"],
};

export default nextConfig;
```

### 8. Make Tailwind 4 scan the package

Tailwind 4 uses CSS-based config. In `apps/web/src/app/globals.css`, add an `@source` directive so utility classes used inside `packages/ui` are generated:

```css
@source "../../../../packages/ui/src/**/*.{ts,tsx}";
```

> Confirm the relative depth from `apps/web/src/app/globals.css` to `packages/ui/src`. Adjust `../` count as needed.

### 9. Rewrite imports in `apps/web` consumers

Every `apps/web` file (sections, modules, app pages) that imported primitives from `@/components/...` must now import from `@fe-template/ui`.

Find them:
```bash
rg "@/components/" apps/web/src --files-with-matches
```

Rewrite, e.g.:
```ts
// before
import { Button } from "@/components/button/Button";
import { Card, CardHeader } from "@/components/card/Card";
// after
import { Button, Card, CardHeader } from "@fe-template/ui";
```

Do NOT rewrite imports that point at things still in the app (`@/sections`, `@/modules`, `@/store`, `@/hooks`, `@/constants`, `@/lib` other than utils). The `cn` util: sections importing `@/lib/utils` can keep the app copy, or switch to `import { cn } from "@fe-template/ui"` — pick one and be consistent (recommend importing `cn` from `@fe-template/ui`).

### 10. Update shadcn config in `apps/web`

Update `apps/web/components.json` aliases so future `shadcn add` installs into the package, or document that new primitives should be added to `packages/ui`. Minimal safe change: leave `components.json` in `apps/web` but add a note in the package README that primitives now live in `packages/ui/src/components`. (A full shadcn re-point is optional.)

### 11. Storybook

Storybook config (`apps/web/.storybook/main.ts`) globs stories. Update the stories glob to include the package:
```ts
stories: [
  "../src/**/*.stories.@(ts|tsx|mdx)",
  "../../../packages/ui/src/**/*.stories.@(ts|tsx|mdx)",
]
```
Adjust relative path as needed.

### 12. Turbo wiring

`packages/ui` exposes `typecheck` and `lint`. Because `apps/web` now depends on `@fe-template/ui`, Turbo's `^build`/`^typecheck` ordering handles it automatically. No `turbo.json` change required, but confirm `packages/ui` has a `typecheck` script (it does, from step 1).

### 13. Verify

```bash
pnpm install
pnpm --filter @fe-template/ui typecheck
pnpm typecheck
pnpm build
pnpm --filter web dev   # smoke test: home + a few pages render, styles intact
```

Fix any unresolved imports or missing exports (barrel collisions are the most likely issue — see step 5 note).

## Acceptance criteria

- [ ] `packages/ui` exists with `package.json`, `tsconfig.json`, `src/index.ts`, and all primitive folders under `src/components/`.
- [ ] `apps/web/src/components/` no longer contains primitives (only `providers` moved to `src/modules/providers`).
- [ ] `apps/web` depends on `@fe-template/ui` (`workspace:*`) and lists it in `transpilePackages`.
- [ ] All `apps/web` primitive imports resolve from `@fe-template/ui`; no dangling `@/components/*` imports remain.
- [ ] Tailwind styles render correctly (package scanned via `@source`).
- [ ] `pnpm build` and `pnpm typecheck` pass.

## Final step — commit and push to main (REQUIRED)

```bash
git add -A
git commit -m "refactor: extract UI primitives into @fe-template/ui package"
git push origin main
```
