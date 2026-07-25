# Required Patterns

Patterns every agent must follow when modifying this repository.

---

## Component Folder Structure

Every component requires `.tsx` + `.stories.tsx` + `.usecase.md`.

Add `.schema.ts` + `.defaultvalues.ts` **only** when the component is a form (Zod validation, React Hook Form):

```text
src/components/my-component/
├── MyComponent.tsx
├── MyComponent.stories.tsx
├── MyComponent.usecase.md         ← purpose, when/when-not, examples
├── MyComponent.schema.ts          ← forms only
└── MyComponent.defaultvalues.ts   ← forms only
```

- Folder: kebab-case
- Files: PascalCase
- shadcn components: individual folders under `src/components/`, not flat `ui/`

---

## Section-Per-Page Rule

Pages compose sections only. No large inline JSX in `page.tsx`.

```text
src/components/sections/[page]/[section-name]/
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
components/navigation/header/   Header.tsx + stories
components/footer/footer/       Footer.tsx + stories
components/table/               TanStack Table wrappers
components/motion/scroll-reveal/  Framer Motion scroll-reveal only
```

---

## Hook Structure

```text
src/hooks/use-[name]/
├── client.ts    ← use[Name] (TanStack Query, client components)
└── server.ts    ← fetch[Name] (server prefetch / RSC)
```

Folder name: kebab-case, must start with `use-`.

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

**Scroll-reveal only.** Use `ScrollReveal` from `components/motion/scroll-reveal/`.

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

All data tables use TanStack Table via wrappers in `src/components/table/`.

Do not build custom table implementations outside this folder.

---

## Images

- Use `next/image` for all photography and raster assets
- Assets in `apps/web/public/images/`
- Descriptive alt text on every meaningful image
- UI text stays in React, not in images
- See [`image-guide.md`](../../image-guide.md)

---

## Routes & SEO

Centralise in `src/constants/`:

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

After copying the template, remove unused shadcn components:

```bash
python scripts/cleanup-unused.py           # dry-run
python scripts/cleanup-unused.py --delete  # delete
```

Document any removed components in the commit message.
