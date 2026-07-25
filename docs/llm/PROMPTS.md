# Agent Prompts

Copy-paste prompts for common scaffolding tasks. All prompts assume familiarity with [`CONTEXT.md`](./CONTEXT.md) and [`PATTERNS.md`](./PATTERNS.md).

---

## Scaffold a New Page

```
Add a new page at /[route] following fe-template conventions:
- page.tsx composes sections only
- sections under src/components/sections/[page-name]/[section-name]/ with .tsx + .stories.tsx + .usecase.md each
- only add .schema.ts + .defaultvalues.ts if a section is a form
- copy from docs/aboustwebsite.md, colours/fonts from docs/branding.md
- images from image-guide.md in apps/web/public/images/
- complete Storybook story per section
- add route to src/constants/routes.ts and SEO to seo.ts
- commit with Conventional Commits (husky + commitlint)
```

---

## Scaffold a New Section

```
Add section [SectionName] to page [page-name]:
- folder: src/components/sections/[page]/[section]/
- files: SectionName.tsx + SectionName.stories.tsx + SectionName.usecase.md
- only add SectionName.schema.ts + SectionName.defaultvalues.ts if the section is a form
- use ScrollReveal for in-view animation if appropriate
- content from docs/aboustwebsite.md
- commit: feat(sections): add [section] to [page]
```

---

## Scaffold a New Component

```
Add component [ComponentName] following fe-template conventions:
- folder: src/components/[component-name]/ (kebab-case)
- files: ComponentName.tsx + ComponentName.stories.tsx + ComponentName.usecase.md
- only add ComponentName.schema.ts + ComponentName.defaultvalues.ts if the component is a form
- use shadcn primitives where applicable
- add Storybook story with Default variant
- commit: feat(components): add [ComponentName]
```

---

## Scaffold a New Hook

```
Add API hook use-[name]:
- src/hooks/use-[name]/client.ts (useReactQuery hook)
- src/hooks/use-[name]/server.ts (server fetch/prefetch)
- commit: feat(hooks): add use-[name] query hook
```

---

## Remove Unused Components

```
Run the cleanup script to identify and remove unused shadcn components:
- python scripts/cleanup-unused.py           (dry-run first)
- python scripts/cleanup-unused.py --delete  (after reviewing dry-run output)
- commit: chore(components): remove unused [component-name] folders
```

---

## Update Brand Content

```
Update [page/section] copy to match docs/aboustwebsite.md:
- read docs/aboustwebsite.md for the target section
- apply brand voice from docs/branding.md (warm, playful, clear — not childish)
- use Coral #FF6B6B for primary CTAs, Fraunces for display headings, Manrope for body
- commit: docs(content): update [section] copy
```

---

## Add Storybook Story

```
Add or update Storybook story for [ComponentName]:
- file: src/components/[path]/ComponentName.stories.tsx
- title: "Components/[Name]" or "Sections/[Page]/[Name]"
- include Default story at minimum
- for sections: include variants for mobile layout and dark mode if applicable
- commit: docs(storybook): add story for [ComponentName]
```
