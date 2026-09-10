# Required Patterns

Patterns every agent must follow when modifying this repository.

---

## Where Code Goes

| Kind | Location | Import |
| --- | --- | --- |
| Shared primitive | `packages/ui/src/components/<kebab>/` | `import { Button } from "@fe-template/ui"` |
| Page section | `apps/web/src/sections/<page>/<section>/` | `@/sections/home/hero/HeroSection` |
| App chrome | `apps/<app>/src/modules/layout/` | `@/modules/layout/...` |
| Database access | `packages/db` | `import { prisma } from "@fe-template/db"` |

Never re-create `apps/*/src/components/` for something shared — it belongs in `packages/ui`.

---

## Component Folder Structure

`packages/ui` primitives should ship `.tsx` + `.stories.tsx` + `.usecase.md`. That trio is **required for new shared primitives** (61 of 63 existing folders already have it; `Form` and `FileUploader` are the exceptions).

In `apps/`, `.usecase.md` is **recommended, not mandatory**. App sections typically have `.tsx` + `.stories.tsx` only (40 web sections have stories; the only app usecase file today is `apps/web/src/modules/providers/Providers.usecase.md`). Do not block a PR solely for a missing app-level `.usecase.md`.

Add `.schema.ts` + `.defaultvalues.ts` **only** when the component is a form (Zod validation, React Hook Form). Admin dashboard forms use `*.defaults.ts` instead.

```text
packages/ui/src/components/my-component/
├── MyComponent.tsx
├── MyComponent.stories.tsx
├── MyComponent.usecase.md         ← required for new packages/ui primitives
├── MyComponent.schema.ts          ← forms only
└── MyComponent.defaultvalues.ts   ← forms only (web); admin uses *.defaults.ts
```

- Folder: kebab-case
- Files: PascalCase
- shadcn components: individual folders under `packages/ui/src/components/`, not flat `ui/`
- Every new primitive gets an `export * from "./components/<kebab>/<Pascal>";` line in `packages/ui/src/index.ts`

---

## Section-Per-Page Rule

Pages compose sections only. No large inline JSX in `page.tsx`.

```text
apps/web/src/sections/[page]/[section-name]/
├── [PageName]Section.tsx
└── [PageName]Section.stories.tsx
```

Section folder map:

```text
sections/home/       announcement, hero, social-proof, how-it-works,
                     compatibility-features, product-preview, safety,
                     use-cases, testimonials, pricing-preview,
                     blog-preview, final-cta

sections/about/      hero, origin-story, mission-vision, values,
                     team, community-commitment, final-cta

sections/pricing/    hero, plans, comparison, faq, final-cta

sections/contact/    hero, contact-form, contact-options,
                     faq-preview, final-cta

sections/blog/       hero, featured-article, article-list, article-grid,
                     article-header, article-body, filters,
                     related-posts, newsletter

sections/not-found/  hero
```

Special locations:

```text
apps/web/src/modules/layout/navigation/header/   Header.tsx + stories
apps/web/src/modules/layout/footer/              Footer.tsx + stories
apps/web/src/modules/layout/sidebar/             Sidebar.tsx + stories
packages/ui/src/components/table/                TanStack Table wrappers
packages/ui/src/components/motion/scroll-reveal/ Framer Motion scroll-reveal only
```

---

## Data Access

`packages/db` owns the Prisma schema and exports a client singleton. Query it from Server Components and Server Actions only — importing it into a `"use client"` file will break the build.

```tsx
// apps/admin/src/app/(dashboard)/posts/page.tsx
import { prisma } from "@fe-template/db";

export default async function PostsPage() {
  const posts = await prisma.post.findMany({ include: { author: true } });
  return <PostsTable posts={posts} />;
}
```

Mutations are Server Actions in a co-located `actions.ts`, validated with Zod, followed by `revalidatePath`:

```ts
"use server";
import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";

export async function publishPost(id: string) {
  await prisma.post.update({ where: { id }, data: { published: true } });
  revalidatePath("/posts");
}
```

- No separate REST/API layer for admin — Server Actions write through Prisma directly
- Schema changes go in `packages/db/prisma/schema/*.prisma`, then `db:migrate` + `db:generate`
- Client interactivity (filters, toggles) lives in small `"use client"` components that receive plain serializable props

---

## Hook Structure

```text
apps/<app>/src/hooks/use-[name]/
├── client.ts    ← use[Name] (TanStack Query, client components)
└── server.ts    ← fetch[Name] (server prefetch / RSC)
```

Folder name: kebab-case, must start with `use-`. Hooks are per-app, not shared through `packages/ui`.

Simple utility hooks (no API) may be a single file: `src/hooks/use-mobile.ts`.

---

## Redux themeSlice

```ts
// store/slices/themeSlice.ts
type ThemeMode = "light" | "dark" | "system";
// default: "system"
// action: setTheme(mode)
```

- Redux is the **source of truth** for the user's theme preference
- Theme toggle dispatches `setTheme` to Redux
- `next-themes` reads Redux state and applies the DOM class (`light` / `dark`)
- Do not store theme preference outside Redux

---

## Responsive Design

Mobile-first. Use Tailwind breakpoints:

| Breakpoint | Min width |
| --- | --- |
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |

- One-column layouts on mobile
- Stack pricing cards vertically on mobile
- Full-width CTAs where helpful on small screens
- Avoid fixed widths that cause horizontal overflow

---

## Framer Motion

**Scroll-reveal only.** Use `ScrollReveal` from `@fe-template/ui` (source: `packages/ui/src/components/motion/scroll-reveal/`).

Allowed:
- Section fade-and-rise on scroll into view
- In-view animation triggered once

Not allowed:
- Page transitions
- Constant bouncing or looping animations
- Autoplay video

Always respect `prefers-reduced-motion`.

---

## TanStack Query

- Client hooks in `hooks/use-[name]/client.ts`
- Server prefetch in `hooks/use-[name]/server.ts`
- React Query Devtools: **development only** — never render in production

---

## TanStack Table

All data tables use TanStack Table via the wrappers in `packages/ui/src/components/table/`:

```tsx
import { DataTable } from "@fe-template/ui";
```

Do not build custom table implementations outside that folder. Admin tables compose `DataTable` in route-local `"use client"` components.

---

## Images

- Use `next/image` for all photography and raster assets
- Assets in `apps/web/public/images/`
- Descriptive alt text on every meaningful image
- UI text stays in React, not in images
- See [`image-guide.md`](../about-example-site/image-guide.md)

---

## Routes & SEO

Centralise in `apps/web/src/constants/`:

```ts
// routes.ts
export const ROUTES = { home: "/", about: "/about", ... } as const;

// seo.ts — page title + description per route
```

Add new routes to both files when scaffolding a page.

---

## Git & Commits

- **Biome** for lint and format
- **Husky** pre-commit: lint-staged runs Biome on staged files
- **commitlint** enforces Conventional Commits on commit-msg

Format: `type(scope): description`

Examples:

```bash
feat(sections): add hero to pricing page
fix(header): correct mobile nav z-index
docs(template): update COMPONENTS guide
chore(deps): bump next to latest
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Cleanup Script

After copying the template, remove unused components from `apps/web`:

```bash
python scripts/cleanup-unused.py           # dry-run
python scripts/cleanup-unused.py --delete  # delete
```

The script does not scan `packages/ui`; prune unused primitives there by hand, deleting the folder and its export line in `packages/ui/src/index.ts`.

Document any removed components in the commit message.
