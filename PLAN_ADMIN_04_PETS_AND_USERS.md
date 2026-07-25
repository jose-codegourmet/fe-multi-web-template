# Plan ADMIN_04 — Pets and Users

## Purpose

Restyle the existing pets registry and users management flows around real model fields rather than mockup-only attributes.

## Files

- `apps/admin/src/app/(dashboard)/pets/page.tsx`
- `apps/admin/src/app/(dashboard)/pets/pets-table.tsx`
- `apps/admin/src/hooks/use-pets/server.ts`
- `apps/admin/src/hooks/use-pets/types.ts`
- `apps/admin/src/app/(dashboard)/users/users-table.tsx`
- `apps/admin/src/app/(dashboard)/users/[id]/user-detail.tsx`

## Implementation

### Pets

- Extend `PetRow` with `photoUrl: string | null`; update `fetchPets()` to select it (field already on `Pet`)
- Server-computed species breakdown via `prisma.pet.groupBy({ by: ["species"] })` → bento cards: Total / Dogs / Cats / Other
- Client-side species filter chips: All / Dog / Cat / Bird / Rabbit / Other
- Row redesign: circular `Avatar` (`photoUrl`, fallback `PawPrintIcon`), name + "Added Xd ago", species `Badge`, breed, age, owner, created date
- Do **not** invent Energy Level bars or Verified/Flagged status pills

### Users

- Role filter chips: All / Admin / User (local client filter)
- Role `Badge`: Admin = solid `default` (coral), User = `secondary`
- `UserDetailView` hero: large avatar, name, email, role badge, "Joined {date}", bio
- Keep `RoleSelect` and pets/posts `DataTable`s functionally identical

## Before / after

```bash
nvm use 24
pnpm --filter admin typecheck && pnpm --filter admin lint
git add apps/admin/src/app/\(dashboard\)/pets apps/admin/src/hooks/use-pets apps/admin/src/app/\(dashboard\)/users
git commit -m "style(admin): restyle pets and users pages"
```
