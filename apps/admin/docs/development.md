# `apps/admin` Development

How to run, set up, and validate the admin portal.

---

## Local setup

1. Install dependencies at the root:

```bash
pnpm install
```

2. Copy environment files:

```bash
cp .env.example .env
cp packages/db/.env.example packages/db/.env
cp apps/admin/.env.example apps/admin/.env.local
```

3. Fill in your Supabase credentials in all three files.

4. Generate the Prisma client:

```bash
pnpm --filter @fe-template/db db:generate
```

5. Run the app:

```bash
pnpm --filter admin dev
```

---

## First admin login

1. In the Supabase dashboard, create a user under **Authentication → Users → Add user** and confirm the email.
2. Make sure a matching `User` row exists in Prisma with the same email and `role = ADMIN`:

```bash
pnpm --filter @fe-template/db db:studio
# or seed demo data:
pnpm --filter @fe-template/db db:seed
```

3. Visit http://localhost:9001 and sign in.

---

## Available scripts

| Script | Command | Notes |
|---|---|---|
| Dev | `pnpm --filter admin dev` | Port 9001, removes `.next/dev` first |
| Build | `pnpm --filter admin build` | Production build |
| Start | `pnpm --filter admin start` | Start built app on port 9001 |
| Type check | `pnpm --filter admin typecheck` | `tsc --noEmit` |
| Lint | `pnpm --filter admin lint` | ESLint flat config |
| Storybook | `pnpm --filter admin storybook` | Port 6007 |
| Build Storybook | `pnpm --filter admin build-storybook` | Static output |

---

## Common debugging

### "Prisma client not found" or type errors after schema change

```bash
pnpm --filter @fe-template/db db:generate
```

### Supabase session not persisting

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set in `apps/admin/.env.local`.
- Verify middleware is not being skipped (it matches all non-static paths).

### User invite fails

- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `apps/admin/.env.local`.
- Verify the service role client is used only in server code (`src/lib/supabase/admin.ts`).

### Tailwind classes missing from shared UI

Check that `src/app/globals.css` still contains:

```css
@source "../../../../packages/ui/src/**/*.{ts,tsx}";
```

---

## Validation requirements before completing a task

1. `pnpm --filter admin typecheck`
2. `pnpm --filter admin lint` (or `pnpm lint` for Biome-wide check)
3. `pnpm --filter admin build` if the change affects pages, auth, or the build output
4. `pnpm --filter admin storybook` if the change affects shared UI usage

---

## Known boundaries

- Middleware gates on session presence only. Role enforcement is a TODO.
- The empty `src/login/` directory is not used.
- Signup references `/auth/callback` which does not exist.
