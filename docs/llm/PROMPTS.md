# Agent Prompts

Read root `TODO.md` and `AGENTS.md` first. Client scaffolding, example cleanup, and product implementation require actual answers in a saved `docs/project/brief.md` with explicit user confirmation; follow `docs/project/onboarding.md`. Create only selected apps. PawPair content below is reference only. All agents follow `ai-usage/README.md` (`pnpm ai-usage:serve` for the dashboard).
Copy-paste prompts for common scaffolding tasks. All prompts assume familiarity with [`CONTEXT.md`](./CONTEXT.md) and [`PATTERNS.md`](./PATTERNS.md).

---

## Scaffold a New Page (apps/web)

```
Add a new page at /[route] in apps/web following template conventions:
- page.tsx composes sections only
- sections under apps/web/src/sections/[page-name]/[section-name]/ with .tsx + .stories.tsx + .usecase.md each
- only add .schema.ts + .defaults.ts if a section is a form
- import primitives from @fe-template/ui (never from a local components folder)
- use content and brand direction from the confirmed docs/project/brief.md; use PawPair docs only when maintaining the reference example
- use the confirmed brief's image assets and guidance; use the PawPair image guide only for reference maintenance
- complete Storybook story per section
- add route to apps/web/src/constants/routes.ts and SEO to seo.ts
- commit with Conventional Commits (husky + commitlint)
```

---

## Scaffold a New Section

```
Add section [SectionName] to page [page-name]:
- folder: apps/web/src/sections/[page]/[section]/
- files: SectionName.tsx + SectionName.stories.tsx + SectionName.usecase.md
- only add SectionName.schema.ts + SectionName.defaults.ts if the section is a form
- import primitives from @fe-template/ui
- use ScrollReveal for in-view animation if appropriate
- content from the confirmed docs/project/brief.md (PawPair docs only for reference maintenance)
- commit: feat(sections): add [section] to [page]
```

---

## Scaffold a Shared Primitive

```
Add component [ComponentName] to the shared UI package:
- folder: packages/ui/src/components/[component-name]/ (kebab-case)
- files: ComponentName.tsx + ComponentName.stories.tsx + ComponentName.usecase.md
- only add ComponentName.schema.ts + ComponentName.defaults.ts if the component is a form
- build on @base-ui/react primitives where applicable, use cn() from the package lib
- add "use client" only if it needs state/effects/browser APIs
- export it from packages/ui/src/index.ts
- add any new runtime dependency to packages/ui/package.json
- document it in docs/component-guide.md
- commit: feat(ui): add [ComponentName]
```

---

## Scaffold an Admin Page

```
Add admin page /[route] in apps/admin:
- file: apps/admin/src/app/(dashboard)/[route]/page.tsx as an async Server Component
- query data with: import { prisma } from "@fe-template/db"
- render with primitives from @fe-template/ui (DataTable for tabular data)
- mutations go in a co-located actions.ts using "use server", validated with Zod,
  ending in revalidatePath("/[route]")
- interactive bits (filters, toggles, forms) as small "use client" components next to the page
- add the route to the AdminSidebar nav in apps/admin/src/modules/layout/AdminSidebar.tsx
- commit: feat(admin): add [route] page
```

---

## Change the Database Schema

```
Add [model/field] to the Prisma schema:
- edit the matching file in packages/db/prisma/schema/ (user | pet | post | marketing)
- run: pnpm --filter @fe-template/db db:migrate
- run: pnpm --filter @fe-template/db db:generate
- update packages/db/prisma/seed.ts if the new data should be seeded
- update the model table in packages/db/README.md
- commit: feat(db): add [model/field]
```

---

## Scaffold a New Hook

```
Add API hook use-[name] in apps/[app]:
- apps/[app]/src/hooks/use-[name]/client.ts (TanStack Query hook)
- apps/[app]/src/hooks/use-[name]/server.ts (server fetch/prefetch)
- commit: feat(hooks): add use-[name] query hook
```

---

## Remove Unused Components

```
After the saved client brief is explicitly confirmed, review unused components in apps/web:
- python scripts/cleanup-unused.py           (dry-run first)
- python scripts/cleanup-unused.py --delete  (after reviewing dry-run output)
- inspect imports and consumers before removing anything; the script is not a full example-content cleanup
- the script does not cover packages/ui: review primitive consumers before removing folders
  or exports from packages/ui/src/index.ts
- commit: chore(components): remove unused [component-name] folders
```

---

## Update Brand Content

```
Update [page/section] copy to match the confirmed docs/project/brief.md (use PawPair docs only for reference maintenance):
- read the confirmed brief for target content, brand voice, colours, and typography
- only when maintaining the PawPair example, use its content and branding reference docs
- commit: docs(content): update [section] copy
```

---

## Add Storybook Story

```
Add or update Storybook story for [ComponentName]:
- file: next to the component (packages/ui/src/components/[path]/ or apps/web/src/sections/[path]/)
- title: "Components/[Name]" or "Sections/[Page]/[Name]"
- include Default story at minimum
- for sections: include variants for mobile layout and dark mode if applicable
- verify with: pnpm --filter web storybook
- commit: docs(storybook): add story for [ComponentName]
```
