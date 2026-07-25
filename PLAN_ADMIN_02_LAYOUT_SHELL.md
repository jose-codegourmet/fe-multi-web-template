# Plan ADMIN_02 — Layout Shell (Sidebar + Header)

## Purpose

Bring the dashboard navigation and utility chrome in line with the PawPair mockups while preserving existing routes and authentication behavior.

## Files

- `apps/admin/src/hooks/use-current-user.ts` (new)
- `apps/admin/src/modules/layout/AdminSidebar.tsx`
- `apps/admin/src/modules/layout/AdminHeader.tsx`
- `apps/admin/src/app/(dashboard)/layout.tsx` (if title map needs Blog)

## Implementation

### `use-current-user` hook

Client hook that:

1. Calls `supabase.auth.getUser()` for the session email
2. Fetches the matching Prisma `User` via a server action (`prisma.user.findUnique({ where: { email } })`) — systems linked by email
3. Exposes via TanStack Query: `{ email, name, avatarUrl, role, bio, createdAt }`

Used by sidebar footer, header profile menu, and the Profile page (ADMIN_06).

### AdminSidebar

- Keep the 6 existing `NAV_ITEMS`
- Rename `/posts` label from "Posts" to **Blog** (route unchanged)
- Add `SidebarFooter` with current user's avatar + name + role via `use-current-user`, linking to `/profile`

### AdminHeader

- Decorative search `Input` (`placeholder="Search records, pets, or users..."`) — not wired (no global search endpoint)
- Decorative `Bell` notification icon button
- `HelpCircle` icon button (mailto or docs URL)
- Theme Light/Dark/System dropdown (from ADMIN_01)
- Profile `DropdownMenu` (avatar trigger) with "View profile" (`/profile`) and "Sign out"
- Sticky translucent header: `backdrop-blur` + `bg-background/80`
- Active nav pills driven by `--sidebar-accent` tokens + `shadow-sm` on `data-active`

## Before / after

```bash
nvm use 24
pnpm --filter admin typecheck && pnpm --filter admin lint
git add apps/admin/src/hooks/use-current-user.ts apps/admin/src/modules/layout/AdminSidebar.tsx apps/admin/src/modules/layout/AdminHeader.tsx apps/admin/src/app/\(dashboard\)/layout.tsx
git commit -m "feat(admin): redesign sidebar and header shell"
```
