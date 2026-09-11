# Frontend Conventions — fe-multi-web-template

How pages, sections, components, hooks, forms, and routes are organized across the monorepo. This document points to the more detailed existing guides rather than duplicating them.

---

## Shared UI primitives

All shared UI comes from `@fe-template/ui`.

```tsx
import { Button, Card, ScrollReveal, cn } from "@fe-template/ui";
```

- Do not create a local `src/components/ui/` folder in apps.
- Add new primitives to `packages/ui/src/components/[name]/` and re-export from `packages/ui/src/index.ts`.
- See `packages/ui/docs/development.md` and `docs/template/COMPONENTS.md`.

---

## `apps/web` — page composition

Pages are thin shells that import sections from `apps/web/src/sections/`.

```text
apps/web/src/app/[route]/page.tsx      → imports sections from apps/web/src/sections/[page]/
apps/web/src/sections/[page]/[section]/
  ├── SectionName.tsx
  ├── SectionName.stories.tsx
  └── SectionName.usecase.md
```

Example: `apps/web/src/app/page.tsx` composes sections from `apps/web/src/sections/home/`.

Routes are centralized in `apps/web/src/constants/routes.ts`. SEO metadata is in `apps/web/src/constants/seo.ts`. Navigation is in `apps/web/src/constants/navigation.ts`.

See `apps/web/docs/patterns.md` for concrete file references and `docs/template/PAGES.md` for the route map.

---

## `apps/admin` — dashboard pages

Pages under `apps/admin/src/app/(dashboard)/` are async Server Components that query Prisma. Client components (tables, forms, dialogs) sit next to the page that uses them.

```text
apps/admin/src/app/(dashboard)/[route]/
  ├── page.tsx              # Server Component
  ├── actions.ts            # Server Actions (mutations)
  ├── table.tsx             # Client table (optional)
  └── dialog.tsx            # Client dialog/form (optional)
```

Examples:
- `apps/admin/src/app/(dashboard)/users/page.tsx`
- `apps/admin/src/app/(dashboard)/users/actions.ts`
- `apps/admin/src/app/(dashboard)/posts/posts-table.tsx`
- `apps/admin/src/app/(dashboard)/posts/post-form/PostForm.tsx`

See `apps/admin/docs/patterns.md` for concrete file references.

---

## Hook conventions

The standard hook folder is `apps/<app>/src/hooks/use-[name]/`:

```text
hooks/use-[name]/
  ├── client.ts             # React Query hook
  ├── server.ts             # Server-side fetch (server action or ISR fetch)
  ├── query.ts              # Query keys / options (optional)
  ├── types.ts              # Shared types (optional)
  └── useX.ts               # Re-export barrel (optional)
```

- `apps/web` uses this pattern for `use-blog-posts`, `use-pricing-plans`, `use-testimonials`.
- `apps/admin` also uses this pattern for `use-users`, `use-pets`, `use-posts`, `use-contacts`, `use-testimonials`, `use-pricing-plans`, `use-current-user`.
- Admin Server Components often query `prisma` directly instead of going through hooks.

See `docs/template/HOOKS.md` for the full hook convention.

---

## Form conventions

### `apps/admin`

Forms use `react-hook-form` + `zod` + `@hookform/resolvers`. Form modules live in `apps/admin/src/modules/auth/[form-name]/` and contain:

```text
modules/auth/[form-name]/
  ├── [FormName].tsx
  ├── [FormName].schema.ts    # zod schema
  └── [FormName].defaults.ts  # default form values
```

Examples: `login-form`, `signup-form`, `otp-form`.

Dashboard forms use the `Form`, `FormField`, `FormItem`, etc. primitives from `@fe-template/ui`.

### `apps/web`

`apps/web` does **not** depend on `react-hook-form`. Contact and newsletter forms use local state, `zod` schemas, and colocated `*.defaults.ts` files where applicable (e.g., `ContactFormSection.schema.ts`, `ContactFormSection.defaults.ts`).

---

## Loading, empty, and error states

- Use `Skeleton` from `@fe-template/ui` for loading states in tables and cards.
- Use `Empty` from `@fe-template/ui` for empty lists.
- Error handling in admin Server Actions returns serializable objects that client components surface with `sonner` toasts.
- `apps/web` API routes return standard JSON responses; React Query handles error states on the client.

---

## Component folder structure

For a new shared primitive in `packages/ui`:

```text
packages/ui/src/components/[kebab-name]/
  ├── PascalCase.tsx
  ├── PascalCase.stories.tsx
  └── PascalCase.usecase.md
```

Some components (like `form/`, `file-uploader/`, `scroll-area/`, `skeleton/`) may omit stories or add `.schema.ts` / `.defaults.ts` when they are form helpers.

See `docs/template/COMPONENTS.md` and `docs/component-guide.md` for usage guidance.

---

## Routes and route groups

- `apps/web` uses route folders directly under `src/app/`. No route groups.
- `apps/admin` uses the `(dashboard)` route group for the shell layout and the public-auth routes (`/login`, `/signup`, `/otp`) outside the group.
- Admin middleware matches all paths except static assets and image optimization. See `apps/admin/middleware.ts`.

---

## Image conventions

- Use `next/image` for all raster assets in `apps/web`.
- Keep UI text, buttons, pricing, and scores in React — never bake them into images.
- Pet portraits use `4:5` aspect ratio with `object-cover`.
- Only above-the-fold images use `priority` loading.
- Fallback: warm cream background + PawPair icon centered.

See `docs/about-example-site/image-guide.md` for the full image guide.
