# Agent Context — fe-multi-web-template

Concise context for AI agents working in this repository.

---

## Stack

| Layer | Tech |
| --- | --- |
| Monorepo | pnpm workspaces + Turborepo |
| Framework | Next.js 16 App Router (two apps: `web`, `admin`) |
| UI | shadcn/ui on Base UI, shared via `@fe-template/ui`; Tailwind CSS 4 |
| Database | Prisma 6 + Supabase Postgres only (`Profile` FK → `auth.users`), shared via `@fe-template/db` |
| Auth | Supabase Auth (`@supabase/ssr`) — admin only |
| State | Redux Toolkit (`themeSlice`, web) |
| Theme | next-themes (DOM), Redux source of truth |
| Data | TanStack Query + TanStack Table; Prisma direct in admin Server Components |
| Motion | Framer Motion (scroll-reveal only) |
| Docs | Storybook co-located with components |
| Lint | Biome, Husky, commitlint |

---

## Folder Map

```text
apps/web/src/               ← marketing site (port 9000)
├── app/                    ← pages (section composition only)
├── sections/               ← page sections, per page folder
├── constants/              ← routes.ts, seo.ts, navigation.ts
├── hooks/                  ← use-*/client.ts + server.ts
├── types/                  ← shared marketing-domain types
├── modules/layout/         ← header, footer, sidebar
├── modules/providers/      ← Redux + Query + theme
└── store/                  ← Redux store + themeSlice

apps/admin/src/             ← admin portal (port 9001)
├── app/(dashboard)/        ← dashboard, users, pets, posts, testimonials, contacts
├── app/login/              ← Supabase sign-in
├── lib/supabase/           ← browser + server clients
└── modules/                ← AdminSidebar, AdminHeader, providers

packages/ui/src/            ← @fe-template/ui — shared primitives
├── components/<kebab>/     ← ~60 shadcn/Base UI components
├── lib/utils.ts            ← cn()
└── index.ts                ← barrel: every public export

packages/db/                ← @fe-template/db — Prisma client
├── prisma/schema/*.prisma  ← split schema (user, pet, post, marketing)
├── prisma/seed.ts
└── src/client.ts           ← prisma singleton
```

Reference docs:

```text
docs/about-example-site/aboustwebsite.md   ← PawPair content direction
docs/about-example-site/branding.md        ← Brand identity
docs/about-example-site/image-guide.md     ← Image placement guide
docs/template/                             ← Human-facing docs
docs/llm/                                  ← This folder
scripts/cleanup-unused.py
```

---

## Key Imports

```ts
import { Button, Card, ScrollReveal, cn } from "@fe-template/ui";   // shared primitives
import { prisma } from "@fe-template/db";                            // Prisma client (server only)
import { HeroSection } from "@/sections/home/hero/HeroSection";      // app-local sections
```

---

## How to Add Things

| Task | Location | Files |
| --- | --- | --- |
| New web page | `apps/web/src/app/[route]/page.tsx` + `apps/web/src/sections/[page]/` | `page.tsx` composes sections only |
| New section | `apps/web/src/sections/[page]/[section]/` | `.tsx` + `.stories.tsx` + `.usecase.md`; add `.schema.ts` + `.defaults.ts` only if it is a form |
| New shared primitive | `packages/ui/src/components/[name]/` | `.tsx` + `.stories.tsx` + `.usecase.md`, plus an export line in `packages/ui/src/index.ts` |
| New admin page | `apps/admin/src/app/(dashboard)/[route]/page.tsx` | Async Server Component querying `prisma`; mutations in a co-located `actions.ts` |
| New model / field | `packages/db/prisma/schema/*.prisma` | Then `pnpm --filter @fe-template/db db:migrate` and `db:generate` |
| New hook | `apps/<app>/src/hooks/use-[name]/` | `client.ts` (React Query) + `server.ts` (server prefetch) |
| New route constant | `apps/web/src/constants/routes.ts` | Add to `ROUTES` object |
| New SEO entry | `apps/web/src/constants/seo.ts` | Add page metadata |

---

## Brand & Content Summary

### 1. PawPair — Product

Fictional pet social discovery app. Tagline: **"Better matches. Happier tails."**

Users create pet profiles, discover compatible pets nearby, match, chat, and arrange playdates. `apps/web` is a **marketing showcase** — it has no auth or matchmaking algorithm. Prisma models in `packages/db` back the admin portal **and** the public site's `/api/blog`, `/api/pricing`, and `/api/testimonials` routes. See [`docs/api-and-data-fetching.md`](../api-and-data-fetching.md).

Primary CTAs: Find a playmate, Create a pet profile, Start matching, Join the pack.

Full content direction: [`aboustwebsite.md`](../about-example-site/aboustwebsite.md)

### 2. Branding

| Token | Value |
| --- | --- |
| Primary CTA | PawPair Coral `#FF6B6B` |
| Display font | Fraunces (Google Fonts via `next/font`) |
| Body font | Manrope (Google Fonts via `next/font`) |
| Light background | Warm Cream `#FFF8EE` |
| Dark background | Night `#111015` |

Brand personality: playful, friendly, smart, trustworthy, modern — not childish or corporate.

Full brand guide: [`branding.md`](../about-example-site/branding.md)

### 3. Images

Assets live in `apps/web/public/images/`:

```text
brand/  hero/  product/  features/  about/  community/  pets/  blog/  illustrations/
```

Rules:
- Use `next/image` for all photography and raster assets
- Keep UI text, buttons, pricing, and scores in React — never bake them into images
- Pet portraits use `4:5` aspect ratio with `object-cover`
- Only above-the-fold images use `priority` loading
- Fallback: warm cream background + PawPair icon centred

Full placement guide: [`image-guide.md`](../about-example-site/image-guide.md)

---

## Cleanup Script

Remove unused components from `apps/web` after copying the template:

```bash
python scripts/cleanup-unused.py           # dry-run
python scripts/cleanup-unused.py --delete  # delete unused folders
```

The script does not scan `packages/ui` — prune unused primitives there by hand, removing both the folder and its export line in `packages/ui/src/index.ts`.

---

## Commits

All commits must pass Husky + commitlint. Use Conventional Commits:

```bash
feat(sections): add hero to pricing page
docs(llm): update CONTEXT brand summary
```

---

## Further Reading

- [`docs/template/`](../template/) — Human-facing docs (README, COMPONENTS, HOOKS, PAGES)
- [`PATTERNS.md`](./PATTERNS.md) — Required code patterns
- [`PROMPTS.md`](./PROMPTS.md) — Copy-paste agent prompts
- [`packages/ui/README.md`](../../packages/ui/README.md) — Shared primitives package
- [`packages/db/README.md`](../../packages/db/README.md) — Prisma schema and commands
- [`apps/admin/README.md`](../../apps/admin/README.md) — Admin portal and Supabase auth
