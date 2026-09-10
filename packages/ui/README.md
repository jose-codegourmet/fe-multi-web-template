# `@fe-template/ui`

Shared UI primitives for every app in the monorepo — shadcn/ui components (style `base-nova`) built on [Base UI](https://base-ui.com/), plus a handful of extras (chat, carousel, chart, scroll-reveal) and the `cn` class helper.

Consumed by [`apps/web`](../../apps/web/README.md) and [`apps/admin`](../../apps/admin/README.md). The package ships raw TypeScript/TSX — apps transpile it, so there is no build step.

---

## Import

Everything is re-exported from the package root barrel ([`src/index.ts`](src/index.ts)):

```tsx
import { Button, Card, CardContent, Dialog, cn } from "@fe-template/ui";
```

The package also exposes subpath and stylesheet entries (see `exports` in [package.json](package.json)):

```tsx
import { Button } from "@fe-template/ui/button/Button";   // direct file access
import "@fe-template/ui/styles.css";                       // tw-animate-css passthrough
```

Prefer the root barrel unless you have a reason to reach for a specific file.

---

## Consuming apps must wire two things

Both are already configured in `apps/web` and `apps/admin`; repeat them in any new app.

1. **Transpile the package** — `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  transpilePackages: ["@fe-template/ui"],
};
```

2. **Let Tailwind scan the package** — `src/app/globals.css`:

```css
@source "../../../../packages/ui/src/**/*.{ts,tsx}";
```

Without the `@source` directive, Tailwind never sees the class names used inside the package and the components render unstyled.

---

## Layout

```text
packages/ui/src/
├── components/
│   ├── button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   └── Button.usecase.md
│   ├── card/
│   ├── dialog/
│   └── …                       # ~60 primitives
├── lib/
│   └── utils.ts                # cn()
├── index.ts                    # barrel — every public export
└── styles.css
```

Folder names are kebab-case; files are PascalCase. Form components additionally carry `<Name>.schema.ts` and `<Name>.defaultvalues.ts`. Full conventions: [`docs/template/COMPONENTS.md`](../../docs/template/COMPONENTS.md).

Note that a few nested primitives break the flat pattern: `table/data-table/DataTable.tsx` and `motion/scroll-reveal/ScrollReveal.tsx`.

---

## Adding a primitive

1. Create `src/components/<kebab-name>/<PascalName>.tsx`.
2. Add `<PascalName>.stories.tsx` and `<PascalName>.usecase.md` alongside it (add `.schema.ts` / `.defaultvalues.ts` only if it is a form).
3. Export it from [`src/index.ts`](src/index.ts):

```ts
export * from "./components/<kebab-name>/<PascalName>";
```

4. If it pulls in a new runtime dependency, add that to this package's `dependencies` — not to the app's.
5. Document it in [`docs/component-guide.md`](../../docs/component-guide.md).

Client-side primitives need `"use client"` at the top of the file; keep it off components that are safe to render on the server.

---

## Storybook

Stories are co-located with each component and picked up by the Storybook instance in `apps/web` (its `.storybook/main.ts` globs `../../../packages/ui/src/**/*.stories.@(ts|tsx|mdx)`):

```bash
pnpm --filter web storybook        # http://localhost:6006
```

---

## Scripts

```bash
pnpm --filter @fe-template/ui typecheck
pnpm --filter @fe-template/ui lint   # Biome (`biome check .`)
```
