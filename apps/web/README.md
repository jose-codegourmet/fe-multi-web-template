# `apps/web`

The Next.js App Router application inside the [fe-template](../../README.md) monorepo.

Prefer running scripts from the **repo root** so workspace tooling and filters stay consistent.

---

## Run

From the monorepo root:

```bash
pnpm install
pnpm dev                         # http://localhost:3000
pnpm --filter web storybook      # http://localhost:6006
pnpm build
pnpm --filter web typecheck
```

From this package:

```bash
pnpm dev
pnpm storybook
pnpm build
pnpm typecheck
```

---

## Key entry points

| Path | Role |
| --- | --- |
| [`src/app/layout.tsx`](src/app/layout.tsx) | Root layout, providers, fonts |
| [`src/app/`](src/app/) | Routes (home, about, blog, contact, pricing, otp, showcase, …) |
| [`src/sections/`](src/sections/) | Page sections composed by routes |
| [`src/components/`](src/components/) | UI primitives (shadcn-style folders) |
| [`src/modules/layout/`](src/modules/layout/) | Header, footer, sidebar |
| [`src/store/`](src/store/) | Redux store and slices |
| [`public/images/`](public/images/) | Brand and marketing assets |

---

## Further reading

- [Root README](../../README.md) — monorepo overview and quick start
- [`docs/template/PAGES.md`](../../docs/template/PAGES.md) — scaffolded pages and section map
- [`docs/template/COMPONENTS.md`](../../docs/template/COMPONENTS.md) — component conventions
- [`docs/template/README.md`](../../docs/template/README.md) — full template guide
