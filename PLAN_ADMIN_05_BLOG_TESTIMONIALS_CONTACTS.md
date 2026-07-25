# Plan ADMIN_05 — Blog, Testimonials, and Contacts

## Purpose

Give content, testimonial, and support-management views a consistent PawPair editorial treatment without changing existing mutations.

## Files

- `apps/admin/src/app/(dashboard)/posts/page.tsx`
- `apps/admin/src/app/(dashboard)/posts/posts-table.tsx`
- `apps/admin/src/app/(dashboard)/posts/post-editor.tsx` / `post-form.tsx`
- `apps/admin/src/app/(dashboard)/testimonials/page.tsx`
- `apps/admin/src/app/(dashboard)/testimonials/testimonials-list.tsx`
- `apps/admin/src/app/(dashboard)/contacts/page.tsx`
- `apps/admin/src/app/(dashboard)/contacts/contacts-list.tsx`

## Implementation

### Posts / Blog

- Published/draft `Badge` (coral solid vs muted outline)
- Small square cover-image thumbnail (`coverImage`) with fallback gradient block
- Author + date columns restyled

### Post form

- Keep all fields/server actions unchanged functionally
- Borderless Fraunces `title` input at the top
- Manrope `Textarea` for content/excerpt
- Sticky bottom action bar with existing submit `Button`

### Testimonials

- Fraunces italic quote styling for `content`
- 5-star visual rating from `rating` (replace plain "x/5" Badge)
- Existing `Switch` recolored via tokens (no logic change)

### Contacts

- Status pills: `UNREAD` = coral solid, `READ` = secondary, `RESOLVED` = mint-tinted outline
- Same three action buttons/logic untouched

## Before / after

```bash
nvm use 24
pnpm --filter admin typecheck && pnpm --filter admin lint
git add apps/admin/src/app/\(dashboard\)/posts apps/admin/src/app/\(dashboard\)/testimonials apps/admin/src/app/\(dashboard\)/contacts
git commit -m "style(admin): restyle blog, testimonials, and contacts pages"
```
