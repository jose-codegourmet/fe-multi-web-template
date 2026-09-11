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
| `/careers` | `app/careers/page.tsx` | Company stub |
| `/partners` | `app/partners/page.tsx` | Company stub |
| `/press` | `app/press/page.tsx` | Company stub |
| `/resources/community-guide` | `app/resources/community-guide/page.tsx` | Resource stub |
| `/resources/first-meet-checklist` | `app/resources/first-meet-checklist/page.tsx` | Resource stub |
| `/help` | `app/help/page.tsx` | Help center stub |
| `/status` | `app/status/page.tsx` | Status stub |
| `/legal/privacy` | `app/legal/privacy/page.tsx` | Legal stub |
| `/legal/terms` | `app/legal/terms/page.tsx` | Legal stub |
| `/legal/community-guidelines` | `app/legal/community-guidelines/page.tsx` | Legal stub |
| `/legal/cookies` | `app/legal/cookies/page.tsx` | Legal stub |
| `/legal/accessibility` | `app/legal/accessibility/page.tsx` | Legal stub |
| `/sign-in` | `app/sign-in/page.tsx` | Auth CTA stub (no auth) |
| `/create-profile` | `app/create-profile/page.tsx` | Auth CTA stub (no auth) |
| `/showcase` | `app/showcase/page.tsx` | Component showcase |
| `not-found` | `app/not-found.tsx` | Branded 404 |

Routes and SEO metadata are centralised in:

```text
src/constants/routes.ts
src/constants/seo.ts
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
contact-form/        ← form: includes .schema.ts + .defaults.ts
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
newsletter/          ← form: includes .schema.ts + .defaults.ts
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
3. Each section: `.tsx` + `.stories.tsx` (add `.schema.ts` + `.defaults.ts` only if it is a form)
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

Admin pages are async Server Components that query Prisma directly; mutations go through Server Actions in the co-located `actions.ts`. Everything under `(dashboard)` is gated by `apps/admin/middleware.ts` (Supabase session required). `/` is not the dashboard: `app/page.tsx` redirects to `/dashboard`.

| Route | File | Page |
| --- | --- | --- |
| `/` | `app/page.tsx` | Redirects to `/dashboard` |
| `/login` | `app/login/page.tsx` | Supabase email/password sign-in (outside the shell) |
| `/signup` | `app/signup/page.tsx` | Public self-signup |
| `/otp` | `app/otp/page.tsx` | OTP confirmation |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Dashboard — stat cards + charts |
| `/users` | `app/(dashboard)/users/page.tsx` | Users table with email search |
| `/users/[id]` | `app/(dashboard)/users/[id]/page.tsx` | User detail; role change via `role-select.tsx` |
| `/pets` | `app/(dashboard)/pets/page.tsx` | Pet profiles with owner |
| `/posts` | `app/(dashboard)/posts/page.tsx` | Posts list with published badge |
| `/posts/new` | `app/(dashboard)/posts/new/page.tsx` | Create post |
| `/posts/[id]` | `app/(dashboard)/posts/[id]/page.tsx` | Edit post |
| `/testimonials` | `app/(dashboard)/testimonials/page.tsx` | Testimonials with publish toggle |
| `/contacts` | `app/(dashboard)/contacts/page.tsx` | Contact inbox with status actions |
| `/pricing-plans` | `app/(dashboard)/pricing-plans/page.tsx` | Pricing plan CRUD |
| `/profile` | `app/(dashboard)/profile/page.tsx` | Signed-in admin profile |
| `POST /api/images` | `app/api/images/route.ts` | Upload to Supabase Storage (`admin-uploads`) |

Route-local client components (tables, forms, toggles) sit next to the page that uses them — `posts/posts-table.tsx`, `posts/post-form/PostForm.tsx`, `contacts/contacts-list.tsx`, and so on. The admin shell (sidebar + header) is `app/(dashboard)/layout.tsx` composing `src/modules/layout/`.

Setup and auth details: [`apps/admin/README.md`](../../apps/admin/README.md).
