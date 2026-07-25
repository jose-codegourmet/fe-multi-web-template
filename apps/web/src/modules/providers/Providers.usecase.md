# Providers — Use Cases

> Part of the [Component Usage Guide](../../../../../docs/component-guide.md).

## Purpose

App-wide client provider tree for Redux, React Query, and theme.

## When to use

- Mount **once** in the root layout around the app shell (already used in `apps/web/src/app/layout.tsx`)

## When NOT to use

- Nested duplicates in feature routes
- Storybook/tests that need a lighter harness — provide only the deps you need

## Examples

### Root layout mount

```tsx
import { Providers } from "@/modules/providers/Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

## Gotchas

- `"use client"`; store and QueryClient created once via refs; pairs with `suppressHydrationWarning` on `<html>`
