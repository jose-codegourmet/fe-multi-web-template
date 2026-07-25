# Pages

All pages live under `apps/web/src/app/` and compose section components only — no large inline JSX in `page.tsx`.

Content direction: [`docs/aboustwebsite.md`](../aboustwebsite.md)

---

## Route Map

| Route | File | Page |
| --- | --- | --- |
| `/` | `app/page.tsx` | Home |
| `/about` | `app/about/page.tsx` | About |
| `/contact` | `app/contact/page.tsx` | Contact |
| `/pricing` | `app/pricing/page.tsx` | Pricing |
| `/blog` | `app/blog/page.tsx` | Blog list (editorial) |
| `/blog/grid` | `app/blog/grid/page.tsx` | Blog grid |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Blog post |
| `not-found` | `app/not-found.tsx` | Branded 404 |

Routes and SEO metadata are centralised in:

```text
src/constants/routes.ts
src/constants/seo.ts
src/constants/demo-content.ts
```

---

## Page Composition Rule

`page.tsx` files import and render section components in order. No business logic, no large JSX blocks:

```tsx
// app/about/page.tsx
import { AboutHeroSection } from "@/components/sections/about/hero/AboutHeroSection";
import { OriginStorySection } from "@/components/sections/about/origin-story/OriginStorySection";
// ...

export default function AboutPage() {
  return (
    <>
      <AboutHeroSection />
      <OriginStorySection />
      {/* ...remaining sections */}
    </>
  );
}
```

---

## Section Folder Map

### Home — `src/components/sections/home/`

```text
announcement/
hero/
social-proof/
how-it-works/
compatibility-features/
product-preview/
safety/
use-cases/
testimonials/
pricing-preview/
blog-preview/
final-cta/
```

### About — `src/components/sections/about/`

```text
hero/
origin-story/
mission-vision/
values/
team/
community-commitment/
final-cta/
```

### Pricing — `src/components/sections/pricing/`

```text
hero/
plans/
comparison/
faq/
final-cta/
```

### Contact — `src/components/sections/contact/`

```text
hero/
contact-form/        ← form: includes .schema.ts + .defaultvalues.ts
contact-options/
faq-preview/
final-cta/
```

### Blog — `src/components/sections/blog/`

```text
hero/
featured-article/
article-list/        ← used on /blog
article-grid/        ← used on /blog/grid
article-header/      ← used on /blog/[slug]
article-body/        ← used on /blog/[slug]
filters/
related-posts/       ← used on /blog/[slug]
newsletter/          ← form: includes .schema.ts + .defaultvalues.ts
```

### Not Found — `src/components/sections/not-found/`

```text
hero/
```

---

## Adding a New Page

1. Create `app/[route]/page.tsx` — compose sections only
2. Add sections under `src/components/sections/[page-name]/[section-name]/`
3. Each section: `.tsx` + `.stories.tsx` (add `.schema.ts` + `.defaultvalues.ts` only if it is a form)
4. Register the route in `src/constants/routes.ts`
5. Add SEO metadata in `src/constants/seo.ts`
6. Copy content from [`docs/aboustwebsite.md`](../aboustwebsite.md)
7. Use images from [`image-guide.md`](../../image-guide.md)
8. Commit with Conventional Commits

---

## Layout

Global layout is in `app/layout.tsx`. It wraps every page with:

- Redux `Provider`
- TanStack Query `QueryClientProvider`
- `next-themes` `ThemeProvider`
- `Header` (navigation)
- `Footer`

Individual pages do not repeat header/footer markup.
