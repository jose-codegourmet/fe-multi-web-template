# `apps/web` Development

How to run, debug, and validate the marketing site.

---

## Local setup

1. Install dependencies at the root:

```bash
pnpm install
```

2. Copy environment file:

```bash
cp apps/web/.env.example apps/web/.env.local
```

3. (Optional but recommended) Add `NEXT_PUBLIC_SITE_URL=http://localhost:9000` to `.env.local` for SSR self-fetch.

4. Generate the Prisma client (required for API routes):

```bash
pnpm --filter @fe-template/db db:generate
```

5. Run the app:

```bash
pnpm --filter web dev
```

---

## Available scripts

| Script | Command | Notes |
|---|---|---|
| Dev | `pnpm --filter web dev` | Port 9000, removes `.next/dev` first |
| Build | `pnpm --filter web build` | Production build |
| Start | `pnpm --filter web start` | Start built app on port 9000 |
| Type check | `pnpm --filter web typecheck` | `tsc --noEmit` |
| Lint | `pnpm --filter web lint` | ESLint flat config |
| Storybook | `pnpm --filter web storybook` | Port 6006 |
| Build Storybook | `pnpm --filter web build-storybook` | Static output |

---

## Common debugging

### Tailwind classes missing from shared UI

Check that `src/app/globals.css` still contains:

```css
@source "../../../../packages/ui/src/**/*.{ts,tsx}";
```

### `@fe-template/ui` import fails at runtime

Check that `next.config.ts` still contains:

```ts
transpilePackages: ["@fe-template/ui"];
```

### SSR self-fetch fails

Set `NEXT_PUBLIC_SITE_URL` to the app's URL (e.g., `http://localhost:9000`). The hooks fall back to that value.

---

## Validation requirements before completing a task

1. `pnpm --filter web typecheck`
2. `pnpm --filter web lint` (or `pnpm lint` for Biome-wide check)
3. `pnpm --filter web build` if the change affects pages, API routes, or the build output
4. `pnpm --filter web storybook` if the change affects stories or shared UI usage

---

## Environment notes

- `apps/web` does not currently use Supabase auth variables. They are scaffolding.
- `NEXT_PUBLIC_SITE_URL` is undocumented in `.env.example` but used in hooks. Add it when setting up the app.
