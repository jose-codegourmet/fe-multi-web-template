# Pages

All marketing pages live under `apps/web/src/app/` and compose section components only — no large inline JSX in `page.tsx`. Sections live under `apps/web/src/sections/`.

Admin routes live under `apps/admin/src/app/` and follow a different pattern (Server Components querying Prisma) — see [Admin Route Map](#admin-route-map).

Content direction: [`docs/about-example-site/aboustwebsite.md`](../about-example-site/aboustwebsite.md)

---

## Route Map — `apps/web`

| Route | File | Page |
| --- | --- | --- |
| `/` | `app/page.tsx` | Home |
| `/about` | `app/about/page.tsx` | About |
| `/contact` | `app/contact/page.tsx` | Contact |
| `/pricing` | `app/pricing/page.tsx` | Pricing |
| `/blog` | `app/blog/page.tsx` | Blog list (editorial) |
| `/blog/grid` | `app/blog/grid/page.tsx` | Blog grid |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Blog post |
| `/otp` | `app/otp/page.tsx` | OTP verification demo |
| `/showcase` | `app/showcase/page.tsx` | Component showcase |
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
import { AboutHeroSection } from "@/sections/about/hero/AboutHeroSection";
import { OriginStorySection } from "@/sections/about/origin-story/OriginStorySection";
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

Sections build on primitives from `@fe-template/ui`:

```tsx
import { Badge, buttonVariants, ScrollReveal } from "@fe-template/ui";
```

---

## Section Folder Map

### Home — `src/sections/home/`

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

### About — `src/sections/about/`

```text
hero/
origin-story/
mission-vision/
values/
team/
community-commitment/
final-cta/
```

### Pricing — `src/sections/pricing/`

```text
hero/
plans/
comparison/
faq/
final-cta/
```

### Contact — `src/sections/contact/`

```text
hero/
contact-form/        ← form: includes .schema.ts + .defaultvalues.ts
contact-options/
faq-preview/
final-cta/
```

### Blog — `src/sections/blog/`

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

### Not Found — `src/sections/not-found/`

```text
hero/
```

### Shared

```text
src/sections/_shared/SectionImage.tsx
src/sections/otp/OtpVerifySection.tsx   ← single-file section, no folder
```

---

## Adding a New Page

1. Create `app/[route]/page.tsx` — compose sections only
2. Add sections under `src/sections/[page-name]/[section-name]/`
3. Each section: `.tsx` + `.stories.tsx` (add `.schema.ts` + `.defaultvalues.ts` only if it is a form)
4. Register the route in `src/constants/routes.ts`
5. Add SEO metadata in `src/constants/seo.ts`
6. Copy content from [`docs/about-example-site/aboustwebsite.md`](../about-example-site/aboustwebsite.md)
7. Use images from [`image-guide.md`](../about-example-site/image-guide.md)
8. Commit with Conventional Commits

---

## Layout — `apps/web`

Global layout is in `app/layout.tsx`. It wraps every page with:

- Redux `Provider`
- TanStack Query `QueryClientProvider`
- `next-themes` `ThemeProvider`
- `Header` (navigation)
- `Footer`

Header, footer, and sidebar live in `src/modules/layout/`; the provider tree lives in `src/modules/providers/`. Individual pages do not repeat header/footer markup.

---

## Admin Route Map

Admin pages are async Server Components that query Prisma directly; mutations go through Server Actions in the co-located `actions.ts`. Everything under `(dashboard)` is gated by `apps/admin/middleware.ts` (Supabase session required).

| Route | File | Page |
| --- | --- | --- |
| `/` | `app/(dashboard)/page.tsx` | Dashboard — stat cards + posts-per-month chart |
| `/users` | `app/(dashboard)/users/page.tsx` | Users table with email search |
| `/users/[id]` | `app/(dashboard)/users/[id]/page.tsx` | User detail; role change via `role-select.tsx` |
| `/pets` | `app/(dashboard)/pets/page.tsx` | Pet profiles with owner |
| `/posts` | `app/(dashboard)/posts/page.tsx` | Posts list with published badge |
| `/posts/new` | `app/(dashboard)/posts/new/page.tsx` | Create post |
| `/posts/[id]` | `app/(dashboard)/posts/[id]/page.tsx` | Edit post |
| `/testimonials` | `app/(dashboard)/testimonials/page.tsx` | Testimonials with publish toggle |
| `/contacts` | `app/(dashboard)/contacts/page.tsx` | Contact inbox with status actions |
| `/login` | `app/login/page.tsx` | Supabase email/password sign-in (outside the shell) |

Route-local client components (tables, forms, toggles) sit next to the page that uses them — `posts/posts-table.tsx`, `posts/post-form.tsx`, `contacts/contacts-list.tsx`, and so on. The admin shell (sidebar + header) is `app/(dashboard)/layout.tsx` composing `src/modules/layout/`.

Setup and auth details: [`apps/admin/README.md`](../../apps/admin/README.md).
