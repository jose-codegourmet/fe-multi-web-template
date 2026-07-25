# Component Conventions

Components are split between one shared package and the apps that consume it. Storybook stories are co-located with each component in both places.

| Kind | Location | Import |
| --- | --- | --- |
| Shared primitives (Button, Card, Dialog, Table, ScrollReveal, …) | `packages/ui/src/components/<kebab-name>/` | `import { Button } from "@fe-template/ui"` |
| Page sections | `apps/web/src/sections/<page>/<section>/` | `import { HeroSection } from "@/sections/home/hero/HeroSection"` |
| App chrome (header, footer, sidebar) | `apps/<app>/src/modules/layout/` | `import { Header } from "@/modules/layout/navigation/header/Header"` |
| Provider tree | `apps/<app>/src/modules/providers/` | `import { Providers } from "@/modules/providers/Providers"` |
| Route-local admin UI (tables, forms) | next to the route in `apps/admin/src/app/(dashboard)/…` | relative import |

Rule of thumb: if both apps could use it, it belongs in `packages/ui`. If it knows about a specific page or brand, it stays in the app.

---

## Standard Component (display / layout)

Every non-form component requires these files:

```text
packages/ui/src/components/my-component/
├── MyComponent.tsx
├── MyComponent.stories.tsx
└── MyComponent.usecase.md   ← usage guide (purpose, when/when-not, examples)
```

Example — the shadcn button:

```text
packages/ui/src/components/button/
├── Button.tsx
├── Button.stories.tsx
└── Button.usecase.md
```

The co-located `*.usecase.md` is the detailed when-to-use / when-not-to-use guide for that component. The index across all components lives in [`docs/component-guide.md`](../component-guide.md).

---

## Form Component

Add a Zod schema and default values **only** when the component is a form (React Hook Form, validation, submission):

```text
my-component/
├── MyComponent.tsx
├── MyComponent.stories.tsx
├── MyComponent.usecase.md
├── MyComponent.defaultvalues.ts   ← only for forms
└── MyComponent.schema.ts          ← only for forms
```

Example — contact form section:

```text
apps/web/src/sections/contact/contact-form/
├── ContactFormSection.tsx
├── ContactFormSection.stories.tsx
├── ContactFormSection.usecase.md
├── ContactFormSection.defaultvalues.ts
└── ContactFormSection.schema.ts
```

Non-form components (cards, heroes, grids) do **not** get `.schema.ts` or `.defaultvalues.ts`.

---

## Naming Rules

| Element | Convention | Example |
| --- | --- | --- |
| Folder | kebab-case | `scroll-area/`, `contact-form/` |
| Component file | PascalCase | `ScrollArea.tsx` |
| Story file | PascalCase + `.stories.tsx` | `ScrollArea.stories.tsx` |
| Use-case doc | PascalCase + `.usecase.md` | `Button.usecase.md` |
| Schema file | PascalCase + `.schema.ts` | `ContactFormSection.schema.ts` |
| Default values | PascalCase + `.defaultvalues.ts` | `ContactFormSection.defaultvalues.ts` |

---

## Adding a Shared Primitive

1. Create `packages/ui/src/components/<kebab-name>/<PascalName>.tsx` (plus stories and usecase doc).
2. Export it from `packages/ui/src/index.ts`:

```ts
export * from "./components/<kebab-name>/<PascalName>";
```

3. Add any new runtime dependency to `packages/ui/package.json`, not to the app.
4. Add `"use client"` only if the component needs browser APIs, state, or effects.

shadcn components were installed with `add --all` and restructured out of the flat `components/ui/` directory into individual kebab-case folders, then moved into `packages/ui`. Do not add new components to a flat `ui/` folder, and do not re-create a `src/components/` folder inside an app for something that belongs in the package.

Details: [`packages/ui/README.md`](../../packages/ui/README.md).

---

## Section Components

Page sections live in the app, under `apps/web/src/sections/[page]/[section-name]/`:

```text
apps/web/src/sections/home/
├── announcement/
│   ├── AnnouncementSection.tsx
│   └── AnnouncementSection.stories.tsx
├── hero/
│   ├── HeroSection.tsx
│   └── HeroSection.stories.tsx
├── social-proof/
├── how-it-works/
├── compatibility-features/
├── product-preview/
├── safety/
├── use-cases/
├── testimonials/
├── pricing-preview/
├── blog-preview/
└── final-cta/
```

Shared section utilities:

```text
apps/web/src/sections/_shared/
└── SectionImage.tsx
```

Section naming: `[PageName]Section.tsx` (e.g. `HeroSection.tsx`, `AboutHeroSection.tsx`).

---

## Table Components

TanStack Table wrappers are shared primitives:

```text
packages/ui/src/components/table/
├── Table.tsx
├── Table.stories.tsx
├── Table.usecase.md
├── Table.schema.ts
├── Table.defaultvalues.ts
└── data-table/
    ├── DataTable.tsx
    └── DataTable.usecase.md
```

Admin tables compose `DataTable` from `@fe-template/ui` in route-local client components, e.g. `apps/admin/src/app/(dashboard)/users/users-table.tsx`.

---

## Navigation & Footer

App chrome is per-app, not shared:

```text
apps/web/src/modules/layout/navigation/header/
├── Header.tsx
└── Header.stories.tsx

apps/web/src/modules/layout/footer/
├── Footer.tsx
└── Footer.stories.tsx

apps/web/src/modules/layout/sidebar/
├── Sidebar.tsx
└── Sidebar.stories.tsx

apps/admin/src/modules/layout/
├── AdminHeader.tsx
├── AdminSidebar.tsx
└── sidebar/Sidebar.tsx
```

---

## Motion Components

Framer Motion is limited to scroll-reveal animations, and lives in the shared package:

```text
packages/ui/src/components/motion/scroll-reveal/
├── ScrollReveal.tsx
├── ScrollReveal.stories.tsx
└── ScrollReveal.usecase.md
```

```tsx
import { ScrollReveal } from "@fe-template/ui";
```

Use `ScrollReveal` to wrap section content for in-view fade-and-rise animation. Do not use Framer Motion for page transitions.

---

## Storybook

Every component and section must have a `.stories.tsx` file. Stories use the default export pattern:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  title: "Components/MyComponent",
  component: MyComponent,
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {};
```

Section stories use titles like `"Sections/Home/Hero"`.

The Storybook instance lives in `apps/web/.storybook` and globs stories from both `apps/web/src` and `packages/ui/src`, so package stories show up automatically:

```bash
pnpm --filter web storybook   # http://localhost:6006
```
