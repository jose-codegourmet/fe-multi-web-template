# Agent Instructions — `apps/web`

Local agent instructions for the public marketing site. Read `/AGENTS.md` first, then this file.

---

## Scope

`apps/web` is the public PawPair marketing site. It renders demo content and internal API routes query Prisma. It does **not** have authentication, middleware, or Supabase clients.

- **Port**: 9000
- **Filter**: `pnpm --filter web`
- **Package name**: `web`

---

## Important directories

| Directory | Purpose |
|---|---|
| `src/app/` | Next.js App Router routes and API routes |
| `src/sections/` | Page sections, organized per page |
| `src/modules/layout/` | Header, footer, navigation |
| `src/modules/providers/` | Redux + TanStack Query + theme providers |
| `src/hooks/` | TanStack Query hooks (`use-blog-posts`, `use-pricing-plans`, `use-testimonials`) |
| `src/constants/` | Routes, SEO metadata, navigation |
| `src/types/` | Marketing-domain types |
| `src/store/` | Redux store + theme slice |
| `src/lib/` | Utility helpers and mock data |
| `public/images/` | Brand and marketing image assets |

---

## Shared packages used

- `@fe-template/ui` — shared UI primitives (Button, Card, ScrollReveal, etc.).
- `@fe-template/db` — Prisma client used only in API routes (`src/app/api/*`).

---

## Entry points

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Home page (ISR, `revalidate = 60`) |
| `/about` | `src/app/about/page.tsx` | About page |
| `/blog` | `src/app/blog/page.tsx` | Blog list (editorial, ISR `revalidate = 60`) |
| `/blog/grid` | `src/app/blog/grid/page.tsx` | Blog grid (`PAGE_SEO.blogGrid`, ISR `revalidate = 60`) |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` | Blog post detail (ISR + `generateStaticParams`) |
| `/pricing` | `src/app/pricing/page.tsx` | Pricing page |
| `/contact` | `src/app/contact/page.tsx` | Contact page |
| `/otp` | `src/app/otp/page.tsx` | OTP verification demo (`PAGE_SEO.otp`) |
| `/careers`, `/partners`, `/press` | `src/app/{careers,partners,press}/page.tsx` | Company stub pages (`PLACEHOLDER_PAGES`) |
| `/resources/community-guide`, `/resources/first-meet-checklist` | `src/app/resources/*/page.tsx` | Resource stub pages |
| `/help`, `/status` | `src/app/{help,status}/page.tsx` | Support stub pages |
| `/legal/*` | `src/app/legal/*/page.tsx` | Legal stub pages (privacy, terms, guidelines, cookies, accessibility) |
| `/sign-in`, `/create-profile` | `src/app/{sign-in,create-profile}/page.tsx` | Auth CTA stubs — no real authentication |
| `/showcase` | `src/app/showcase/page.tsx` | Dev catalog (`ComponentsShowcase`, `SectionsShowcase`, `ThemePreview`). Intentionally omitted from `PAGE_SEO` — not a marketing page. |
| `not-found` | `src/app/not-found.tsx` | Branded 404 (`PAGE_SEO.notFound`) |
| `/api/blog` | `src/app/api/blog/route.ts` | Blog posts API |
| `/api/pricing` | `src/app/api/pricing/route.ts` | Pricing plans API |
| `/api/testimonials` | `src/app/api/testimonials/route.ts` | Testimonials API |

---

## Validation commands

| Concern | Command |
|---|---|
| Dev | `pnpm --filter web dev` |
| Build | `pnpm --filter web build` |
| Type check | `pnpm --filter web typecheck` |
| Lint (ESLint) | `pnpm --filter web lint` |
| Biome (repo-wide) | `pnpm lint` |
| Storybook | `pnpm --filter web storybook` |

---

## Restrictions and boundaries

- No authentication. Do not add middleware, login, or signup pages here without a plan.
- Do not import `@fe-template/db` from client components or pages. Only import it in API routes.
- Do not create a local `src/components/ui/` folder. Use `@fe-template/ui`.
- Shared UI wiring must remain in place: `transpilePackages` in `next.config.ts` and the `@source` directive in `globals.css`.
- `NEXT_PUBLIC_SITE_URL` is used for server-side self-fetching but is not in `.env.example`. Document it if you add it.

---

## Common task routing

| Task | Read next |
|---|---|
| New page | `docs/frontend-conventions.md`, `docs/template/PAGES.md`, then `apps/web/docs/patterns.md` |
| New section | `docs/frontend-conventions.md`, `docs/template/COMPONENTS.md`, then inspect `src/sections/home/` |
| New API route | `docs/api-and-data-fetching.md`, then inspect `src/app/api/blog/route.ts` |
| New hook | `docs/template/HOOKS.md`, then inspect `src/hooks/use-blog-posts/` |
| Style change | `docs/styling-and-design-system.md` |

---

## Documentation maintenance

Update this file and `apps/web/docs/` when:
- A new route or API route is added.
- A new shared package is consumed.
- A new environment variable is required.
- The validation commands change.
