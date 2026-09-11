# Styling and Design System — fe-multi-web-template

How styling, themes, and the shared UI primitives are organized.

---

## Stack

| Layer | Choice |
|---|---|
| CSS framework | Tailwind CSS 4 |
| PostCSS plugin | `@tailwindcss/postcss` |
| Utility merge | `cn()` from `tailwind-merge` + `clsx` |
| UI primitives | Base UI (`@base-ui/react`) wrapped in shadcn style (`base-nova`) |
| Animation | `tw-animate-css`, Framer Motion (scroll-reveal only) |
| Icons | `lucide-react` |
| Theme | `next-themes` + CSS variables |

---

## Tailwind 4 setup

Each app imports Tailwind in `src/app/globals.css`:

```css
@import "tailwindcss";
@import "shadcn/tailwind.css";
```

Each app also tells Tailwind to scan the shared UI package:

```css
@source "../../../../packages/ui/src/**/*.{ts,tsx}";
```

PostCSS config:

```js
// apps/web/postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

The same applies to `apps/admin`.

---

## Shared UI package (`@fe-template/ui`)

- Ships raw TypeScript/TSX. No build step.
- Apps transpile it via `transpilePackages: ["@fe-template/ui"]` in `next.config.ts`.
- Public barrel is `packages/ui/src/index.ts`.
- Subpath exports exist (`@fe-template/ui/styles.css`, `@fe-template/ui/*`) but no app currently uses them.
- `cn()` is exported from `@fe-template/ui` but apps also keep a local `@/lib/utils` copy.

See `packages/ui/docs/README.md` and `packages/ui/docs/api.md` for the public API.

---

## Brand tokens (PawPair example)

These are the current tokens for the bundled PawPair brand. Replace them when reusing the template.

| Token | Value | Where |
|---|---|---|
| Primary CTA | PawPair Coral `#FF6B6B` (`--color-brand-coral`) | Both apps. Mapped to shadcn `--primary` / `--sidebar-primary` / `--ring` so default `Button` is coral. `--primary-foreground` is `--color-brand-deep-ink` (`#17151F`) for WCAG AA contrast (~6.6:1) on coral. |
| Light background | Warm Cream `#FFF8EE` | Both apps |
| Dark background | Night `#111015` | Both apps |
| Display font | Fraunces (Google Fonts via `next/font`) | Both apps |
| Body font | Manrope (Google Fonts via `next/font`) | Both apps |
| `--color-brand-coral-soft` | `#ffe4e1` | **Admin only** (`apps/admin/src/app/globals.css`); light `--accent` |
| `--color-brand-night-elevated-2` | `#26212e` | **Admin only**; dark `--secondary` / `--muted` |

Fonts are loaded in each app's root layout via `next/font/google`.

See `docs/about-example-site/branding.md` for the full brand guide.

---

## Component variants

Most interactive primitives use `class-variance-authority` for variants. Examples:

- `buttonVariants` from `packages/ui/src/components/button/Button.tsx`
- `badgeVariants` from `packages/ui/src/components/badge/Badge.tsx`
- `toggleVariants` from `packages/ui/src/components/toggle/Toggle.tsx`

Import variants when you need to style a non-button element like a button:

```tsx
import { buttonVariants } from "@fe-template/ui";
import Link from "next/link";

<Link href="/" className={buttonVariants({ variant: "outline" })}>Home</Link>
```

---

## Theme handling

### `apps/web`

- Redux Toolkit (`src/store/slices/themeSlice.ts`) is the source of truth.
- `Providers.tsx` syncs the Redux theme value into `next-themes` so Tailwind dark-mode classes work.

### `apps/admin`

- Uses `next-themes` directly via `Providers.tsx` (no Redux).

---

## Animation rules

- Framer Motion is used only for scroll-reveal (`ScrollReveal` in `packages/ui/src/components/motion/scroll-reveal/`).
- Avoid adding motion to every element; prefer subtle entrance animations on sections.

---

## Adding a new shared primitive

1. Create `packages/ui/src/components/[kebab-name]/PascalCase.tsx`.
2. Add `PascalCase.stories.tsx` and `PascalCase.usecase.md`.
3. Re-export from `packages/ui/src/index.ts`.
4. Update `docs/component-guide.md` if the component is part of a common decision tree.
5. Run `pnpm --filter @fe-template/ui typecheck` and `pnpm lint`.

See `docs/template/COMPONENTS.md` for the full convention.

### shadcn CLI (`apps/web/components.json`)

`apps/admin` has no `components.json`. The CLI config lives in `apps/web` because that is where the `shadcn` package and Tailwind CSS entry (`src/app/globals.css`) live.

Aliases point at real import targets, not a local `src/components/` tree:

| Alias | Resolves to | Why |
|---|---|---|
| `ui`, `components` | `@fe-template/ui` | Shared primitives. The package barrel and `./src/components/*` exports are the only UI primitive home. |
| `utils` | `@/lib/utils` | Existing `apps/web/src/lib/utils.ts` (`cn()`). |
| `lib` | `@/lib` | Existing `apps/web/src/lib/`. |
| `hooks` | `@/hooks` | Existing `apps/web/src/hooks/`. |

Run the CLI from `apps/web`:

```bash
pnpm --filter web exec shadcn add <component>
```

The CLI still emits a flat file. After it runs:

1. Move the file into `packages/ui/src/components/<kebab-name>/<PascalName>.tsx`.
2. Add a story and `.usecase.md`.
3. Re-export from `packages/ui/src/index.ts`.
4. Do not leave generated files under `apps/web/src/components/` and do not recreate `src/components/ui/`.
5. App-only composition stays in `src/modules/` or `src/sections/`.

---

## Common mistakes to avoid

- Do not add a `src/components/ui/` folder inside apps.
- Do not forget the `@source` directive in `globals.css` when adding new UI package components; otherwise Tailwind will miss their classes.
- Do not import `@fe-template/ui` from client code unless the component itself supports client use (most do, but the data layer does not).
