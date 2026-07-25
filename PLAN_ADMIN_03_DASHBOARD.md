# Plan ADMIN_03 — Dashboard

## Purpose

Turn the dashboard into a data-driven PawPair overview with a real graph, meaningful current-period trends, and recent activity.

## Files

- `apps/admin/src/app/(dashboard)/page.tsx`
- `apps/admin/src/app/(dashboard)/community-growth-chart.tsx` (renamed from `posts-chart.tsx`)
- `apps/admin/src/app/(dashboard)/recent-activity.tsx` (new)

## Implementation

### Hero header

Fraunces greeting ("Good morning, Admin.") + live stat call-out. Compute a real week-over-week delta from `prisma.user.count()` / `prisma.pet.count()` (this-week vs last-week `createdAt` windows). No fake "12% this week" text.

### Stat cards

Existing 4 (Users, Pets, Posts, Unread contacts) restyled as bigger rounded cards with icon chips, decorative blurred glow, and the computed trend delta.

### Growth chart

Extend `getDashboardData()` to compute **3 real monthly series** (new users, new pets, new posts per month, last 6 months) from Prisma — no mock numbers.

Rebuild as a `recharts` `AreaChart` with `linearGradient` fill, `type="monotone"`, `ChartTooltip`, using `--chart-1` / `--chart-2` / `--chart-4` tokens, inside `ChartContainer` from `@fe-template/ui`. Component name: `CommunityGrowthChart`.

### Recent activity feed

Merge the latest N `Pet`, `Post`, `Contact`, `Testimonial` rows by `createdAt` into one unified, real feed rendered as a vertical timeline with per-type icon chips.

### Spotlight banner

Static promotional card ("Share a new story on the blog") linking to `/posts/new` — decorative only, no fabricated metrics.

## Before / after

```bash
nvm use 24
pnpm --filter admin typecheck && pnpm --filter admin lint
git add apps/admin/src/app/\(dashboard\)/page.tsx apps/admin/src/app/\(dashboard\)/community-growth-chart.tsx apps/admin/src/app/\(dashboard\)/recent-activity.tsx apps/admin/src/app/\(dashboard\)/posts-chart.tsx
git commit -m "feat(admin): redesign dashboard with growth chart and activity feed"
```
