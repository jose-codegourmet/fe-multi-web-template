# Component Conventions

All UI components in `apps/web/src/components/` follow a consistent folder structure. Storybook stories are co-located with each component.

---

## Standard Component (display / layout)

Every non-form component requires these files:

```text
src/components/my-component/
├── MyComponent.tsx
├── MyComponent.stories.tsx
└── MyComponent.usecase.md   ← usage guide (purpose, when/when-not, examples)
```

Example — a shadcn button restructured from the flat `ui/` layout:

```text
src/components/button/
├── Button.tsx
├── Button.stories.tsx
└── Button.usecase.md
```

The co-located `*.usecase.md` is the detailed when-to-use / when-not-to-use guide for that component. The index across all components lives in [`docs/component-guide.md`](../component-guide.md).

---

## Form Component

Add a Zod schema and default values **only** when the component is a form (React Hook Form, validation, submission):

```text
src/components/my-component/
├── MyComponent.tsx
├── MyComponent.stories.tsx
├── MyComponent.usecase.md
├── MyComponent.defaultvalues.ts   ← only for forms
└── MyComponent.schema.ts          ← only for forms
```

Example — contact form section:

```text
src/components/sections/contact/contact-form/
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

## shadcn/ui Components

All shadcn components were installed via `add --all` before being restructured out of the flat `components/ui/` directory into individual kebab-case folders under `src/components/`.

Do not add new components to a flat `ui/` folder.

---

## Section Components

Page sections live under `src/components/sections/[page]/[section-name]/`:

```text
src/components/sections/home/
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
src/components/sections/_shared/
└── SectionImage.tsx
```

Section naming: `[PageName]Section.tsx` (e.g. `HeroSection.tsx`, `AboutHeroSection.tsx`).

---

## Table Components

TanStack Table wrappers live under `src/components/table/`:

```text
src/components/table/
├── Table.tsx
├── Table.stories.tsx
├── Table.usecase.md
├── Table.schema.ts
├── Table.defaultvalues.ts
└── data-table/
    ├── DataTable.tsx
    └── DataTable.usecase.md
```

---

## Navigation & Footer

```text
src/components/navigation/header/
├── Header.tsx
├── Header.stories.tsx
├── Header.schema.ts
└── Header.defaultvalues.ts

src/components/footer/footer/
├── Footer.tsx
├── Footer.stories.tsx
├── Footer.schema.ts
└── Footer.defaultvalues.ts
```

---

## Motion Components

Framer Motion is limited to scroll-reveal animations:

```text
src/components/motion/scroll-reveal/
├── ScrollReveal.tsx
├── ScrollReveal.stories.tsx
├── ScrollReveal.usecase.md
├── ScrollReveal.schema.ts
└── ScrollReveal.defaultvalues.ts
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

Run Storybook locally:

```bash
pnpm --filter web storybook   # http://localhost:6006
```
