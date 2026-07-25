# Plan ADMIN_01 — Theme Tokens (light / dark / auto)

## Purpose

Wire PawPair's existing palette into the semantic tokens used by `apps/admin`, so every shared UI component supports light, dark, and system mode consistently.

## Files

- `apps/admin/src/app/globals.css`
- `apps/admin/src/modules/layout/AdminHeader.tsx`

## Implementation

### Radius

Bump `--radius` from `0.625rem` to `1rem` so `rounded-xl` / `rounded-2xl` / `rounded-3xl` land in the mockups' "friendly, exceptionally rounded" 20–32px range per `branding.md`.

### New raw brand tokens

Add inside the existing `@theme inline` block:

- `--color-brand-coral-soft: #ffe4e1` — light-mode tint for chip/accent backgrounds
- `--color-brand-night-elevated-2: #26212e` — secondary dark-mode surface (hover/chip bg)

### `:root` (light)

Replace the neutral oklch block with PawPair mappings:

- `--background` → warm-cream
- `--foreground` → deep-ink
- `--card` / `--popover` → white
- `--primary` → coral
- `--primary-foreground` → **deep-ink** (not white — WCAG AA: white on coral is ~2.8:1 fail; deep-ink on coral is ~6.5:1 pass)
- `--secondary` / `--muted` → cream-200
- `--muted-foreground` → ink-500
- `--accent` → coral-soft
- `--chart-1..5` → coral / lavender / sky / mint / yellow
- `--sidebar` → white; `--sidebar-accent` → coral
- `--radius: 1rem`

### `.dark`

- `--background` → night
- `--foreground` → soft-white
- `--card` / `--popover` → night-elevated
- `--primary` → coral; `--primary-foreground` → deep-ink
- `--secondary` / `--muted` → night-elevated-2
- `--muted-foreground` → muted-lilac
- `--accent` → `rgba(255, 107, 107, 0.16)`; `--accent-foreground` → coral
- `--sidebar` → night-elevated; `--sidebar-accent` → coral

### Theme switcher

Replace the binary sun/moon `Button` in `AdminHeader.tsx` with a `DropdownMenu` offering **Light / Dark / System**, using `theme` (not just `resolvedTheme`) from `next-themes` to show a check on the active choice, calling `setTheme("light" | "dark" | "system")`. Keep a static Sun/Moon glyph on the trigger reflecting `resolvedTheme`.

## Before / after

```bash
nvm use 24
pnpm --filter admin typecheck && pnpm --filter admin lint
git add apps/admin/src/app/globals.css apps/admin/src/modules/layout/AdminHeader.tsx
git commit -m "style(admin): wire PawPair brand tokens into light/dark/auto theme"
```
