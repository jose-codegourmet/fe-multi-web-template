# `apps/web`

The public marketing site (Next.js App Router) inside the [fe-multi-web-template](../../README.md) monorepo. Runs on **port 9000**; the admin portal lives in [`apps/admin`](../admin/README.md) on port 9001.

Prefer running scripts from the **repo root** so workspace tooling and filters stay consistent.

---

## Run

From the monorepo root:

```bash
pnpm install
pnpm --filter web dev            # http://localhost:9000
pnpm --filter web storybook      # http://localhost:6006
pnpm --filter web build
pnpm --filter web typecheck
```

`pnpm dev` at the root runs this app together with `apps/admin` via Turbo.

From this package:

```bash
pnpm dev
pnpm storybook
pnpm build
pnpm typecheck
```

---

## UI primitives

Shared primitives (Button, Card, Dialog, …) come from the workspace package [`@fe-template/ui`](../../packages/ui/README.md), not from a local `src/components/` folder:

```tsx
import { Badge, buttonVariants, ScrollReveal } from "@fe-template/ui";
```

Two pieces of wiring make that work, and both are already in place:

- `next.config.ts` lists `transpilePackages: ["@fe-template/ui"]`
- `src/app/globals.css` includes `@source "../../../../packages/ui/src/**/*.{ts,tsx}";` so Tailwind scans the package for class names

App-specific composition (page sections, header/footer/sidebar, providers) stays in this app.

---

## Key entry points

| Path | Role |
| --- | --- |
| [`src/app/layout.tsx`](src/app/layout.tsx) | Root layout, providers, fonts |
| [`src/app/`](src/app/) | Routes (home, about, blog, contact, pricing, otp, showcase, …) |
| [`src/sections/`](src/sections/) | Page sections composed by routes |
| [`src/modules/layout/`](src/modules/layout/) | Header, footer, sidebar |
| [`src/modules/providers/`](src/modules/providers/) | Redux + TanStack Query + theme providers |
| [`src/constants/`](src/constants/) | `routes.ts`, `seo.ts`, `navigation.ts` |
| [`src/types/`](src/types/) | Shared marketing-domain types |
| [`src/hooks/`](src/hooks/) | API hooks (`client.ts` / `server.ts` split) |
| [`src/store/`](src/store/) | Redux store and slices |
| [`public/images/`](public/images/) | Brand and marketing assets |

---

## Environment

Copy [`.env.example`](.env.example) to `.env.local` (gitignored):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key |

This app renders demo content and does not query Supabase or Prisma yet — the variables are scaffolding for when it does. If you add direct Prisma access, depend on `@fe-template/db` and add `DATABASE_URL` / `DIRECT_URL` as well.

---

## Further reading

- [Root README](../../README.md) — monorepo overview and quick start
- [`packages/ui/README.md`](../../packages/ui/README.md) — shared primitives
- [`docs/template/PAGES.md`](../../docs/template/PAGES.md) — routes and section map
- [`docs/template/COMPONENTS.md`](../../docs/template/COMPONENTS.md) — component conventions
- [`docs/template/README.md`](../../docs/template/README.md) — full template guide
