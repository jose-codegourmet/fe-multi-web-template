Create a Next.js marketing template repository from scratch with the following setup. Work **one phase at a time** (see Phased Breakdown). Confirm each phase is complete before starting the next. This keeps context and token usage manageable.

---

## Reference Documents

Before building, read these reference files:

- [`docs/aboustwebsite.md`](docs/aboustwebsite.md) — website purpose, page-by-page content direction, copy tone, and feature descriptions for the PawPair showcase brand
- [`docs/branding.md`](docs/branding.md) — brand name, tagline, colours, typography, logo rules, tone of voice, and design do/don'ts
- [`image-guide.md`](image-guide.md) — which parts of the app use which images, how assets should be cropped and placed, and what content must stay editable in React instead of being baked into images

All content, colour choices, typography, copy, and image usage used across pages, sections, Header, Footer, and SEO constants must align with these reference files.

---

## Git Setup (run first, before anything else)

```bash
git config --local user.name jose
git config --local user.email jose@codegourmet.io
git remote add origin git@github.com:jose-codegourmet/fe-template.git
```

---

## Project Bootstrap

- Initialize a **pnpm workspaces monorepo** (not a single-app repo), so an API app can be added later under `apps/`
- Use pnpm as the package manager
- Use TypeScript throughout
- Create a `.nvmrc` file at the **repo root** with the content: `24`
- Root files: `pnpm-workspace.yaml`, `package.json`, `.nvmrc`

### Monorepo Structure

```
fe-template/
├── image-guide.md       ← PawPair image placement and cropping guide
├── apps/
│   └── web/              ← Next.js App Router app (latest)
│       └── public/
│           └── images/   ← app images referenced by image-guide.md
├── packages/
│   └── config/           ← shared tsconfig, biome config
├── docs/
│   ├── aboustwebsite.md  ← PawPair website content & page direction
│   ├── branding.md       ← PawPair visual identity & brand guidelines
│   ├── template/         ← human-facing template structure docs
│   └── llm/              ← AI / LLM agent context for using this repo
├── scripts/
│   └── cleanup-unused.py ← remove unused components after copy
├── .github/
│   └── workflows/
│       └── ci.yml
├── pnpm-workspace.yaml
├── package.json
└── .nvmrc
```

`pnpm-workspace.yaml` should include:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## Phased Breakdown

Execute **exactly one phase per session / turn**. Do not skip ahead. After each phase, summarize what was done and stop for confirmation.

| Phase | Scope |
| --- | --- |
| **1** | Monorepo scaffold, root config files, `.nvmrc`, `pnpm-workspace.yaml`, `image-guide.md`, empty `apps/web` + `packages/config` + `docs/` (including `aboustwebsite.md` and `branding.md`) + `apps/web/public/images/` + `scripts/` |
| **2** | Install all packages; init shadcn; run `shadcn add --all`; configure Tailwind, Biome, Husky, lint-staged |
| **3** | Restructure **all** installed shadcn components into the component folder convention (only after Phase 2 is done) |
| **4** | Redux store + `themeSlice`; Providers tree (Redux, TanStack Query, next-themes driven by Redux theme) |
| **5** | Shared layout: responsive Header, Footer, and shared scroll-reveal motion helpers (+ Storybook stubs as needed) |
| **6** | Scaffold all pages; each page composed only of section components (no inline page markup) |
| **7** | Storybook fully wired; complete stories for components, sections, Header, and Footer |
| **8** | GitHub Actions CI workflow |
| **9** | `scripts/cleanup-unused.py` |
| **10** | `docs/template/` and `docs/llm/` documentation (CONTEXT must reference `docs/aboustwebsite.md`, `docs/branding.md`, and `image-guide.md`) |

---

## Package Installation

Install dependencies in the appropriate workspace packages (`apps/web` unless noted).

**Core (`apps/web`):**
- next (latest)
- react, react-dom (latest)
- typescript

**Styling:**
- tailwindcss (latest)
- @tailwindcss/typography
- next-themes (for applying class-based theme; **theme preference state lives in Redux** — see Theme section)
- shadcn/ui (initialize with `pnpm dlx shadcn@latest init` inside `apps/web`)
- Configure shadcn to use the App Router, TypeScript, Tailwind CSS, and the `@/` path alias

**shadcn install order (mandatory):**
1. Initialize shadcn
2. Install **all** available shadcn components with `pnpm dlx shadcn@latest add --all` (or equivalent “add all” flow)
3. Do **not** hand-write any UI primitive that shadcn already provides
4. Only **after** all shadcn components are installed and confirmed, begin restructuring them into the component folder convention (Phase 3)

**Fonts:**
- Use `next/font/google` — fonts must match [`docs/branding.md`](docs/branding.md); apply the primary brand font globally in the root layout

**Data Fetching:**
- @tanstack/react-query (latest)
- @tanstack/react-query-devtools
- React Query Devtools must be rendered **only** when `process.env.NODE_ENV === "development"`

**Tables:**
- @tanstack/react-table (latest)
- All data tables must use TanStack Table
- Table-related UI lives under `src/components/table/` following the component folder structure

**State Management:**
- @reduxjs/toolkit (latest)
- react-redux (latest)
- Store lives under `src/store/`
- Wrap the app with the Redux Provider in the root layout (client provider pattern)

**Animations:**
- framer-motion (latest)
- Use Framer Motion only for scroll-reveal and in-view motion effects
- Do **not** use Framer Motion for full page transitions; prefer an optimized static/page-navigation experience

**Images / Media:**
- Store all app image assets under `apps/web/public/images/`
- Follow filenames, folders, placements, and crop guidance from [`image-guide.md`](image-guide.md)
- Use `next/image` for raster assets
- Keep headlines, buttons, pricing, chat UI, navigation, and other editable UI in React, not inside generated images

**Storybook:**
- Initialize Storybook inside `apps/web` with `pnpm dlx storybook@latest init`
- Use the Next.js framework integration (`@storybook/nextjs`) and essentials addons
- Stories are **co-located** with components (see Component Folder Structure)
- Every section component must have a **complete** Storybook story (controls, default args, meaningful variants)

**Linting/Formatting:**
- @biomejs/biome (latest) — initialize with `pnpm dlx @biomejs/biome@latest init` (prefer shared config under `packages/config` when practical)
- Configure biome with formatting and linting rules

**Git Hooks (repo root):**
- husky (latest) — initialize with `pnpm dlx husky init`
- lint-staged (latest)

---

## Configuration Files

### biome.json
- Enable formatter and linter
- Set indent style to spaces, indent width 2
- Enable recommended lint rules

### Tailwind / CSS
- Configure content paths for the web app (`app/`, `src/components/`, etc.)
- Enable dark mode via the `class` strategy
- Colour palette and typography must follow [`docs/branding.md`](docs/branding.md)
- **Responsive (mandatory):** mobile-first Tailwind utilities throughout; all sections, Header, and Footer must work at `sm`, `md`, `lg`, and `xl`; avoid hardcoded widths that break on small screens

### next.config.ts
- Enable React strict mode

### tsconfig.json
- Strict mode on
- Path alias `@/` pointing to the web app `src/` (or project root as configured consistently)

### .nvmrc
- Content: `24`

---

## GitHub Actions

- Add `.github/workflows/ci.yml`
- On every push and pull request to main branches, run at least:
  - install (pnpm)
  - Biome lint / format check
  - TypeScript type-check
  - Storybook build
  - tests (if/when a test runner is present; otherwise type-check + lint + Storybook build are the minimum)
- Use Node from `.nvmrc` (`24`) and pnpm caching where practical

---

## Component Folder Structure

Every UI component — including those that come from shadcn — must follow this structure **after** Phase 2 install:

```
src/components/
└── my-component/
    ├── MyComponent.tsx
    ├── MyComponent.stories.tsx
    ├── MyComponent.defaults.ts
    └── MyComponent.schema.ts
```

Rules:
- Folder name: kebab-case (`my-component`)
- Files: PascalCase matching the component name
- `.stories.tsx` — Storybook stories (complete, not empty stubs)
- `.defaults.ts` — default props / defaults
- `.schema.ts` — types / Zod (or equivalent) schema for props
- Do **not** leave shadcn components as only flat files under `components/ui/` after Phase 3

---

## Page Sections as Components

- Each page is composed of **section components**
- `page.tsx` must **only** import and arrange sections (plus lightweight shared layout wrappers if needed) — **no large inline JSX** for page content
- Section components live under:

```
src/components/sections/
└── [page-name]/
    └── [section-name]/
        ├── SectionName.tsx
        ├── SectionName.stories.tsx
        ├── SectionName.defaults.ts
        └── SectionName.schema.ts
```

- Example for Home: `sections/home/hero/`, `sections/home/features/`, `sections/home/testimonials/`, `sections/home/cta/`
- Every section must have its **own complete Storybook** stories

---

## Navigation Header and Footer

- `src/components/navigation/` — shared `<Header>` with nav links and theme toggle
- `src/components/footer/` — shared `<Footer>` with links and copyright
- Nav links and footer content are defined in [`docs/aboustwebsite.md`](docs/aboustwebsite.md); logo and brand rules in [`docs/branding.md`](docs/branding.md); logo and shared image usage must also follow [`image-guide.md`](image-guide.md)
- Both follow the component folder convention
- Both must have complete Storybook stories
- Both must be **responsive** (Header: mobile hamburger / sheet menu; Footer: stacked then multi-column on larger breakpoints)
- Mount Header and Footer from the root layout (or a shared shell layout)

---

## API Hooks Structure

When creating API / data hooks, use this structure:

```
src/hooks/
└── use-my-hook/
    ├── client.ts    ← useMyHook lives here (React Query client hook)
    └── server.ts    ← fetchMyHook lives here (server fetch / prefetch)
```

Rules:
- Folder name: kebab-case starting with `use-`
- `client.ts` exports the React Query hook (e.g. `useMyHook`)
- `server.ts` exports the server-side fetch/prefetch function (e.g. `fetchMyHook`)

---

## State Management

- Create a Redux Toolkit store under `src/store/` (`configureStore`, typed hooks)
- Provide the store via a client `Providers` component used from the root layout
- **Theme preference must live in Redux** — see Theme section (`themeSlice`)

---

## Tables

- Use `@tanstack/react-table` for all tabular data
- Place table building blocks under `src/components/table/` using the standard component folder structure

---

## Theme (Dark / Light / Auto) — Redux as source of truth

- Tailwind `class` dark mode
- Colour tokens and light/dark palette must align with [`docs/branding.md`](docs/branding.md)
- Create `src/store/slices/themeSlice.ts` with state: `"light" | "dark" | "system"` (default: `"system"`)
- Theme toggle **dispatches** to the Redux slice (do not keep theme preference only in local React state)
- Wire `next-themes` (or class application) so the active Redux theme value drives the rendered theme
- Redux is the **single source of truth** for the user’s theme preference; `next-themes` applies it to the DOM

---

## Constants

- Create `src/constants/` with at least:
  - `routes.ts` — app route path constants
  - `seo.ts` — default SEO / metadata constants
- Default meta title, description, and OG content must be sourced from [`docs/aboustwebsite.md`](docs/aboustwebsite.md) and [`docs/branding.md`](docs/branding.md)

---

## Storybook

- Init Storybook in `apps/web`
- Stories co-located per Component Folder Structure (`*.stories.tsx`)
- Complete stories required for: shared UI components, **all page sections**, Header, and Footer
- Ensure Storybook can resolve Tailwind, path aliases, and theme (light/dark) where practical

---

## Image Assets

- All app images live in `apps/web/public/images/`
- Image filenames, folder placement, crop guidance, and section-level usage must follow [`image-guide.md`](image-guide.md)
- Use `next/image` for photography and raster illustrations
- Keep headlines, buttons, pricing, chat UI, navigation, and other editable UI in React, not inside generated images
- Every meaningful image must have descriptive alt text, responsive `sizes`, and intentional aspect ratio / crop handling

---

## Pages to Scaffold

Create these App Router pages under `apps/web`. Each page file only composes section components.

Content, section copy, and page direction for each route are defined in [`docs/aboustwebsite.md`](docs/aboustwebsite.md). Visual identity (colours, type, tone) comes from [`docs/branding.md`](docs/branding.md).
Page and section imagery must follow [`image-guide.md`](image-guide.md), with assets stored in `apps/web/public/images/`.

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about` | About Us |
| `/contact` | Contact |
| `/pricing` | Pricing |
| `/blog` | Blog list (sample) |
| `/blog/grid` | Blog grid (sample) |
| `/blog/[slug]` | Blog post (sample) |
| `not-found` | 404 (`app/not-found.tsx`) |

Use Framer Motion only for scroll-reveal / in-view animations where appropriate. Do **not** add full page transitions. Layout must be responsive.

---

## React Query Devtools

- Mount `<ReactQueryDevtools />` only in development (`process.env.NODE_ENV === "development"`)
- Place QueryClientProvider in the shared Providers tree alongside Redux and theme wiring

---

## Python Cleanup Script

- Add `scripts/cleanup-unused.py` at the repo root
- Purpose: after copying this template, remove components the project does not use
- Behavior:
  - Scan `apps/web/src/components/` (and related packages if applicable) for component folders
  - Detect folders that are never imported from app code (pages, layouts, other components)
  - Default: **dry-run** — print unused component folders
  - With `--delete`: permanently remove those unused folders
- Document usage in `docs/template/README.md` and `docs/llm/CONTEXT.md`

---

## Docs

### Brand & content sources (required)

- [`docs/aboustwebsite.md`](docs/aboustwebsite.md) — PawPair website purpose and page-by-page content
- [`docs/branding.md`](docs/branding.md) — PawPair brand guidelines (identity, colour, type, voice)
- [`image-guide.md`](image-guide.md) — image placement, crop guidance, and asset folder structure for the app

### `docs/template/` (human-facing)

- `README.md` — monorepo layout, how to run web app / Storybook, how to run cleanup script; link to brand docs above and explain that images live in `apps/web/public/images/`
- `COMPONENTS.md` — component folder convention (with examples)
- `HOOKS.md` — API hooks `client.ts` / `server.ts` convention
- `PAGES.md` — scaffolded pages, section-per-page rule, routing notes; point to `docs/aboustwebsite.md` for content

### `docs/llm/` (AI / any language model)

So an LLM can correctly use and extend this template:

- `CONTEXT.md` — concise stack overview, folder map, how to add a page, component, section, and API hook; **must also reference and briefly summarise** [`docs/aboustwebsite.md`](docs/aboustwebsite.md), [`docs/branding.md`](docs/branding.md), and [`image-guide.md`](image-guide.md) so an agent gets full context in one place
- `PATTERNS.md` — required patterns: component structure, section-per-page, hook structure, Redux `themeSlice`, responsive rules
- `PROMPTS.md` — copy-paste prompts to scaffold a new page, section, or hook following this repo’s conventions, brand docs, and image placement rules

---

## Delivery Checklist

Confirm before finishing (all phases complete):

1. Monorepo with `image-guide.md`, `apps/web/public/images/`, `apps/web`, `packages/config`, `docs/aboustwebsite.md`, `docs/branding.md`, `docs/template`, `docs/llm`, `scripts/`
2. All shadcn components installed via `add --all` **before** restructuring
3. Components restructured to folder convention with stories / defaults / schema
4. Tailwind + responsive layout; Header + Footer with Storybook; mobile nav; colours/type from branding docs; image usage from `image-guide.md`
5. Redux Toolkit with `themeSlice` driving light / dark / system; next-themes applies it
6. TanStack Query (+ devtools in dev) + TanStack Table
7. Framer Motion limited to scroll-reveal / in-view animations only
8. All listed pages + 404; each page built from section components only; copy from `docs/aboustwebsite.md`; imagery from `image-guide.md`
9. Complete Storybook stories for components, sections, Header, Footer
10. `.github/workflows/ci.yml` present and covers lint, type-check, Storybook build
11. `scripts/cleanup-unused.py` dry-run + `--delete`
12. `docs/llm/` with CONTEXT, PATTERNS, PROMPTS (CONTEXT references brand docs and `image-guide.md`)
13. `src/constants/` with routes and SEO sourced from brand/website docs
14. Biome + Husky + lint-staged + `.nvmrc` (`24`)
