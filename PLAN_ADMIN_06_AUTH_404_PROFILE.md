# Plan ADMIN_06 — Login, 404, and Profile

## Purpose

Complete the public/admin edge states and give authenticated administrators a first-class account page.

## Files

- `apps/admin/src/app/login/page.tsx`
- `apps/admin/src/app/(dashboard)/not-found.tsx` (new)
- `apps/admin/src/app/not-found.tsx` (new)
- `apps/admin/src/app/(dashboard)/profile/page.tsx` (new)
- `apps/admin/src/app/(dashboard)/profile/profile-form.tsx` (new)
- `apps/admin/src/app/(dashboard)/profile/actions.ts` (new)

## Implementation

### Login

Keep existing Supabase `signInWithPassword` flow and error handling. Redesign:

- Full-bleed centered layout with soft blurred blob decorations behind a `max-w-[480px]` `Card`
- Logo mark + Fraunces "Welcome back, Admin." + Manrope subcopy
- Email/password inputs with leading `Mail` / `Lock` icons
- Password show/hide toggle (`Eye` / `EyeOff`)
- Submit button shows `Loader2` spinner while loading
- Footer trust badge ("Encrypted admin access") + faint `Pets` / `ShieldCheck` / `KeyRound` icons

### 404 pages

- `(dashboard)/not-found.tsx` — inside sidebar/header shell: "404 — This trail went cold" Fraunces headline with italic coral accent, "Return to dashboard" + "Browse pets" CTAs, decorative `Search` / `PawPrint` icon cards
- Root `not-found.tsx` — no sidebar chrome, same copy/CTAs for requests outside any layout

### Profile page

- Server fetch of Prisma `User` by email (or reuse `use-current-user`)
- Editable `name` and `bio` via `updateProfile` server action
- Read-only email + role Badge + "Member since" date + avatar initials
- Change password via `supabase.auth.updateUser({ password })` client-side
- Sign out button
- Light / Dark / System theme control for convenience

## Before / after

```bash
nvm use 24
pnpm --filter admin typecheck && pnpm --filter admin lint
git add apps/admin/src/app/login apps/admin/src/app/not-found.tsx apps/admin/src/app/\(dashboard\)/not-found.tsx apps/admin/src/app/\(dashboard\)/profile
git commit -m "feat(admin): redesign login, add 404 pages and profile page"
```
