# `apps/web` Patterns

Concrete patterns found in the marketing site. Imitate these files when adding new code.

---

## Page composition

A page imports sections from `src/sections/<page>/`. It should contain only composition logic, not heavy markup.

Example:

```tsx
// src/app/page.tsx
import { HeroSection } from "@/sections/home/hero/HeroSection";
import { SocialProofSection } from "@/sections/home/social-proof/SocialProofSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <SocialProofSection />
    </main>
  );
}
```

Real references:
- `src/app/page.tsx` — home page composition
- `src/app/pricing/page.tsx` — pricing page composition
- `src/app/about/page.tsx` — about page composition

---

## Section structure

Each section is a folder under `src/sections/<page>/<section>/`:

```text
src/sections/home/hero/
  ├── HeroSection.tsx
  ├── HeroSection.stories.tsx
  └── HeroSection.usecase.md
```

Real references:
- `src/sections/home/hero/HeroSection.tsx`
- `src/sections/pricing/hero/PricingHeroSection.tsx`
- `src/sections/blog/article-grid/ArticleGridSection.tsx`

Blog list and grid pages share a `?category=` query param. `BlogFiltersSection` writes it; `ArticleListSection` and `ArticleGridSection` filter the already-loaded posts client-side. Valid values live in `src/constants/blog.ts`.

---

## Hook structure

Standard `use-*/` folder with `client.ts` and `server.ts`:

```text
src/hooks/use-blog-posts/
  ├── client.ts
  ├── server.ts
  ├── query.ts
  └── types.ts
```

Real references:
- `src/hooks/use-blog-posts/server.ts` — SSR fetch with `next: { revalidate: 60 }`
- `src/hooks/use-blog-posts/client.ts` — React Query hook + relative `/api/blog` fetch
- `src/hooks/use-pricing-plans/server.ts`
- `src/hooks/use-testimonials/server.ts`

---

## API route pattern

API routes query Prisma directly and return JSON.

Example:

```ts
// src/app/api/blog/route.ts
import { prisma } from "@fe-template/db";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({ where: { published: true } });
  return NextResponse.json(posts);
}
```

Real references:
- `src/app/api/blog/route.ts`
- `src/app/api/pricing/route.ts`
- `src/app/api/testimonials/route.ts`

---

## Redux theme pattern

Theme is managed in `src/store/slices/themeSlice.ts` and synced to `next-themes` in `src/modules/providers/Providers.tsx`.

Real references:
- `src/store/slices/themeSlice.ts`
- `src/store/index.ts`
- `src/modules/providers/Providers.tsx`

---

## Constants and SEO

- Routes: `src/constants/routes.ts`
- SEO: `src/constants/seo.ts`
- Navigation: `src/constants/navigation.ts`
- Footer/header stub copy: `src/constants/placeholder-pages.ts` + `src/sections/placeholder/`

Add new routes to these files when adding pages. Every `ROUTES` path must have a matching `page.tsx`.

---

## Image pattern

Use `next/image` for raster assets. Avoid baking text or UI into images.

Real references:
- `src/sections/home/hero/HeroSection.tsx` for hero image usage
- `src/sections/blog/grid/BlogGridSection.tsx` for blog card images
- `public/images/` for asset organization

---

## Form pattern (no react-hook-form)

`apps/web` does not use `react-hook-form`. Simple forms use local state and `zod` for validation where needed.

Real references:
- `src/sections/contact/contact-form/ContactFormSection.tsx` for local-state form
- `src/sections/contact/contact-form/ContactFormSection.schema.ts` for zod schema
