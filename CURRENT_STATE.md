# Current State — fe-multi-web-template

Documentation-versus-code drift audit. Written for AI agents and maintainers working in this repository.

- **Audit date**: 2026-08-27
- **Method**: static read-only analysis of `docs/`, every `AGENTS.md`, every `README.md`, and the actual source tree. No commands were run (no `lint`, `typecheck`, `build`, `test`, or `prisma` execution).
- **Rule applied**: where documentation and implementation disagree, the implementation is treated as the source of truth.
- **Working tree**: the audit reflects the working tree including uncommitted changes. A large form-structure refactor and the entire `docs/` system are currently untracked or modified, which is the origin of most drift below.

---

## 1. Verdict

The repository is **functionally coherent and structurally sound**. The `docs/` root system (written recently) is largely accurate and even self-documents several known issues. The drift is concentrated in three places:

1. **Pre-refactor docs still point at deleted files.** An in-flight refactor moved admin forms from flat kebab-case files into nested folders with PascalCase components. `apps/admin/docs/patterns.md`, `docs/frontend-conventions.md`, `docs/template/PAGES.md`, `docs/repository-structure.md`, and `apps/admin/README.md` still reference the old paths.
2. **Three competing filename conventions** for form default values coexist across code and docs.
3. **The admin portal has no authorization layer.** Public self-signup plus session-only middleware plus zero auth checks in Server Actions means any person who can sign up gets full write access to every entity.

Counts: **3 security issues** (section 3.1), **4 functional gaps** (3.2), **8 dead file references** (3.3), **~22 incorrect doc claims** (3.4), **1 missing referenced document** (3.6), **~15 undocumented code items** (3.7).

---

## 2. Ground Truth (verified)

### Workspaces

| Workspace | Package name | Filter | Port | State |
|---|---|---|---|---|
| `apps/web` | `web` | `web` | 9000 (Storybook 6006) | Active, feature-complete marketing site |
| `apps/admin` | `admin` | `admin` | 9001 (Storybook 6007) | Active, full CRUD, auth incomplete |
| `packages/ui` | `@fe-template/ui` | `@fe-template/ui` | — | 63 component folders, source-only |
| `packages/db` | `@fe-template/db` | `@fe-template/db` | — | 8 models, 4 migrations, seed present |
| `packages/config` | `@fe-template/config` | — | — | Empty placeholder (`package.json` + `AGENTS.md` only) |

### Declared versions

| Tool | Version | Where |
|---|---|---|
| pnpm | `11.0.8` | root `package.json` `packageManager` only (not in `pnpm-workspace.yaml`) |
| Node | 24 | `.nvmrc` |
| Turborepo | `^2.10.6` | root |
| Next.js | `16.2.10` | both apps |
| React / React DOM | `19.2.4` | both apps; `^19.2.0` peer in `packages/ui` |
| Tailwind CSS | `^4` | both apps |
| Prisma / `@prisma/client` | `^6.3.0` declared, **`6.19.3` resolved** (`pnpm-lock.yaml`) | `packages/db` |
| TanStack Query | `^5.101.2` | both apps |
| Redux Toolkit | `^2.12.0` | `apps/web` only |
| Storybook | `^10.5.0` | both apps |
| Vitest | `^4.1.10` | `apps/web` only |
| Biome | `^2.5.4` | root |
| TypeScript | `^5` | everywhere |

### Inventory counts

| Item | Count | Notes |
|---|---|---|
| `apps/web` pages | 10 | `/`, `/about`, `/blog`, `/blog/grid`, `/blog/[slug]`, `/contact`, `/pricing`, `/otp`, `/showcase`, `not-found` |
| `apps/web` API routes | 3 | `/api/blog`, `/api/pricing`, `/api/testimonials` — all query Prisma |
| `apps/web` sections | 40 | `src/sections/<page>/<section>/PascalCase.tsx` |
| `apps/web` Storybook stories | 42 | 39 sections + Header, Footer, Sidebar |
| `apps/admin` routes | 15 pages + 1 API route | see per-workspace section |
| `apps/admin` Storybook stories | **0** | Storybook config exists and globs `packages/ui` |
| Unit tests, repo-wide | **0** | no `test` script in any `package.json` |
| `packages/ui` component folders | 63 | 65 export lines in `src/index.ts` |
| `.usecase.md` files in `apps/` | **1** | only `apps/web/src/modules/providers/Providers.usecase.md` |
| Prisma models / enums | 8 / 5 | `User`, `Profile`, `Pet`, `PetMatch`, `Post`, `Contact`, `Testimonial`, `PricingPlan` |
| Prisma migrations | 4 | all schema changes have matching SQL |

---

## 3. Drift Register

### 3.1 Security-critical

| ID | Issue | Evidence |
|---|---|---|
| S-1 | **No authorization anywhere in the admin portal.** `apps/admin/middleware.ts` gates on Supabase session presence only (explicit `TODO` at line 37). `/signup` is a public route, so anyone can self-register and reach every dashboard route. Additionally, 7 of 8 Server Action files perform Prisma writes with no session or role check — `updateUserRole`, `deleteUser`, `inviteUser` (service-role client), `createPost`, `deletePet`, `deleteContact`, `deletePricingPlan`, and the rest are callable by any authenticated session. Only `profile/actions.ts` calls `supabase.auth.getUser()`, and even that omits a role check. | `apps/admin/middleware.ts:37-54`, `apps/admin/src/app/(dashboard)/users/actions.ts` (no auth check in any of 5 exports), `apps/admin/src/app/(dashboard)/{posts,pets,contacts,testimonials,pricing-plans}/actions.ts` |
| S-2 | `createProfile` is an unauthenticated Server Action taking arbitrary `userId` and `email` and upserting a `Profile` row. | `apps/admin/src/modules/auth/otp-form/actions.ts:5-16` |
| S-3 | **Root `env` file is not gitignored.** `/env` is a 695-byte plain-text duplicate of `/.env`. `.gitignore` ignores `.env` and `.env.*` but not a bare `env`, so `git add .` would commit it. It also contains two variable names used nowhere in source and documented nowhere: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `DATABASE_PASSWORD`. | `/env` (untracked, shows as `?? env` in `git status`), `.gitignore:9-11` |

### 3.2 Functional gaps

| ID | Issue | Evidence |
|---|---|---|
| F-1 | **`User` / `Profile` tables are not linked.** Signup and OTP write to `Profile` (keyed by Supabase UUID); the profile page, sidebar, and all CRUD read `User` (keyed by cuid, looked up by email). A self-registered user therefore has a `Profile` row but no `User` row, so `fetchCurrentUserByEmail` returns `null` and the profile page degrades — while the user still has full dashboard access. | `apps/admin/src/modules/auth/otp-form/actions.ts` (writes `prisma.profile`) vs `apps/admin/src/hooks/current-user.ts:14-27` (reads `prisma.user`) |
| F-2 | **`apps/web` Storybook import is broken.** `.storybook/preview.tsx` imports `../src/components/providers/Providers`; that path does not exist (the file is at `src/modules/providers/Providers.tsx`). `apps/admin/.storybook/preview.tsx` uses the correct path. | `apps/web/.storybook/preview.tsx:3` |
| F-3 | **`/auth/callback` does not exist.** `SignupForm` sets `emailRedirectTo` to `.../auth/callback`, so email-link confirmation dead-ends. The OTP flow is the only working confirmation path. | `apps/admin/src/modules/auth/signup-form/SignupForm.tsx:40`; no `apps/admin/src/app/auth/` directory |
| F-4 | **14 route constants have no page.** All are linked from the footer, header, or CTAs and 404: `/careers`, `/partners`, `/press`, `/resources/community-guide`, `/resources/first-meet-checklist`, `/help`, `/status`, `/legal/privacy`, `/legal/terms`, `/legal/community-guidelines`, `/legal/cookies`, `/legal/accessibility`, `/sign-in`, `/create-profile`. | `apps/web/src/constants/routes.ts:13-26` vs `apps/web/src/app/` |

### 3.3 Documentation drift — dead file references

Every path below is cited by a document and does not exist in the working tree.

| Document | Cites | Actual path |
|---|---|---|
| `apps/admin/docs/patterns.md:23,119,159` | `(dashboard)/users/user-dialog.tsx` | `(dashboard)/users/user-dialog/UserDialog.tsx` |
| `apps/admin/docs/patterns.md:26,118,150` | `(dashboard)/posts/post-form.tsx` | `(dashboard)/posts/post-form/PostForm.tsx` |
| `apps/admin/docs/patterns.md:137` | `(dashboard)/contacts/contacts-table.tsx` | `(dashboard)/contacts/contacts-list.tsx` |
| `apps/admin/docs/patterns.md:112-113` | `modules/auth/login-form/.schema.ts`, `.defaultValues.ts` | `LoginForm.schema.ts`, `LoginForm.defaults.ts` |
| `docs/frontend-conventions.md:57` | `(dashboard)/posts/post-form.tsx` | `post-form/PostForm.tsx` |
| `docs/repository-structure.md:98` | `posts/.../post-form.tsx` | `post-form/PostForm.tsx` |
| `docs/template/PAGES.md:177,188` | `(dashboard)/page.tsx`, `posts/post-form.tsx` | `(dashboard)/dashboard/page.tsx`, `post-form/PostForm.tsx` |
| `docs/api-and-data-fetching.md:43` | `getApiOrigin` from `@/lib/utils` | Symbol does not exist anywhere in the repo; hooks inline `process.env.NEXT_PUBLIC_SITE_URL` |

### 3.4 Documentation drift — incorrect claims

| Document | Claim | Reality |
|---|---|---|
| `docs/api-and-data-fetching.md:45`, `apps/admin/docs/patterns.md:56,62` | Server fetchers named `getBlogPosts` / `getUsers` | Actual exports are `fetchBlogPosts`, `fetchUsers`, `fetchPets`, `fetchPosts`, etc. |
| `apps/admin/docs/patterns.md:57-62`, `docs/api-and-data-fetching.md:99` | `getQueryClient` imported from `Providers` | Symbol does not exist; dashboard pages construct `new QueryClient()` |
| `apps/admin/docs/patterns.md:62`, `docs/api-and-data-fetching.md:100` | Query key `["users"]` | Actual: `usersQueryKey.list()` → `["users","list"]` (`use-users/query.ts`) |
| `docs/llm/PATTERNS.md:22`, `docs/template/COMPONENTS.md` | Every component requires `.tsx` + `.stories.tsx` + `.usecase.md` | Only 1 `.usecase.md` exists in all of `apps/` (40 sections have stories, none have usecase docs) |
| `docs/llm/CONTEXT.md:99` | Prisma models back the admin portal, "not the public site" | `apps/web/src/app/api/{blog,pricing,testimonials}/route.ts` all query Prisma |
| `README.md:153`, `apps/web/README.md`, `apps/web/.env.example` | `apps/web` does not query Supabase or Prisma | Same as above; `@fe-template/db` is a real runtime dependency of `apps/web` |
| `packages/db/README.md:5` | `apps/web` "does not query the database yet" | Same as above |
| `packages/ui/AGENTS.md:32`, `packages/ui/docs/README.md:26`, `packages/db/AGENTS.md:31` | "No package currently consumes `@fe-template/ui` / `@fe-template/db`" | Both apps consume both packages extensively. The sentence is technically about *packages* consuming them, but reads as if nothing does — remove or reword. |
| `docs/template/HOOKS.md:5` | "Today both apps ship only the utility hook `use-mobile.ts`" | web has 3 data hooks + `use-mobile`; admin has 6 data hooks + `use-current-user` + `use-mobile` |
| `docs/template/HOOKS.md:56` | Example uses `process.env.API_URL` | Code uses `process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:9000"` |
| `docs/template/PAGES.md:177` | Admin dashboard is at `/` | `/` redirects to `/dashboard`; dashboard is `(dashboard)/dashboard/page.tsx`. `/dashboard`, `/signup`, `/otp`, `/profile`, `/pricing-plans` are all absent from the route table |
| `apps/admin/README.md` | Dashboard at `/`; hooks folder is `use-mobile.ts` only; no signup/otp/profile/pricing-plans; signed-in user on `/login` goes to `/` | All wrong; middleware redirects to `/dashboard` (`middleware.ts:52`) |
| `docs/architecture.md:135`, `docs/development-workflow.md:10` | pnpm version pinned in `pnpm-workspace.yaml` | Only in root `package.json` `packageManager`; the workspace file has globs and `allowBuilds` |
| `docs/development-workflow.md:115` | `pnpm typecheck` runs in every workspace | Only web, admin, ui, db have a `typecheck` script; `packages/config` has none |
| `README.md:147` | `.env` is declared in `turbo.json` `globalEnv` | `.env` is in `globalDependencies`; `globalEnv` lists variable names |
| `README.md:55` | "Tests: Vitest" | Vitest exists in `apps/web` for the Storybook addon; there is no `test` script anywhere. `docs/testing.md` states this correctly |
| `docs/repository-structure.md:123`, `packages/ui/AGENTS.md:40`, `packages/ui/docs/README.md:9` | "~60 components" | 63 |
| `docs/template/README.md:161` | Cleanup script scans `apps/web/src/{app,components,hooks,store}` | `apps/web/src/components/` does not exist; `scripts/cleanup-unused.py:20-25` still references it |
| `apps/web/docs/patterns.md` | Contact form at `sections/contact/form/` | Actual: `sections/contact/contact-form/` |
| `packages/db/README.md:31,41` | `user.prisma` contains "User, Profile, Role"; the `User` row lists only `role` | `UserStatus` enum and `User.status UserStatus @default(PENDING)` also exist (`prisma/schema/user.prisma`) |
| `packages/db/docs/api.md` | Model list omits `PetMatch` (the enums line at `:33` does include `UserStatus`) | `PetMatch` exists in `prisma/schema/pet.prisma` and is documented in `packages/db/README.md:44` |
| `packages/db/docs/examples.md:93` | Seed upserts on `where: { email: user.email }` | `prisma/seed.ts:10-14` upserts on `where: { id }` |
| `docs/styling-and-design-system.md:69` | "Primary CTA: PawPair Coral `#FF6B6B`" | The brand token `--color-brand-coral: #ff6b6b` exists (`apps/web/src/app/globals.css:58`), but the shadcn semantic token that drives the default `Button` is neutral: `--primary: oklch(0.205 0 0)` at `:83` (and `oklch(0.922 0 0)` dark at `:118`). Default buttons render near-black, not coral |
| `docs/environment-variables.md:19` | Lists the 5 `globalEnv` vars | Accurate, but does not flag that `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SITE_URL` are deployment-required and absent from `globalEnv` |

### 3.5 Naming convention fragmentation

Form default-value files use **three different names** across code and docs. Pick one and normalize.

| Convention | Where |
|---|---|
| `*.defaults.ts` | All of `apps/admin` (9 form folders) — the de facto standard |
| `*.defaultvalues.ts` | `apps/web` sections (`ContactFormSection.defaultvalues.ts`, `BlogNewsletterSection.defaultvalues.ts`), and prescribed by `docs/llm/PATTERNS.md:32`, `docs/template/PAGES.md:109,126,148` |
| `*.defaultValues.ts` | Prescribed by `docs/frontend-conventions.md:94`, `apps/admin/AGENTS.md`, `apps/admin/docs/patterns.md:107` — **used by no file in the repo** |

Related inconsistencies:

- Admin dashboard components mix conventions: refactored features use nested folders with PascalCase (`pets/pet-dialog/pet-dialog-form/PetDialogForm.tsx`), while `contacts-list.tsx`, `testimonials-list.tsx`, `pricing-plans-list.tsx`, `users-table.tsx`, `pets-table.tsx`, `posts-table.tsx`, `post-editor.tsx`, `users/[id]/role-select.tsx`, `users/[id]/user-detail.tsx` remain flat kebab-case.
- `apps/admin/src/hooks/use-pricing-plans/` has no barrel re-export file; the other five hook folders do.
- `apps/admin/src/hooks/` has both `use-current-user.ts` (client) and `current-user.ts` (server action) — outside the `use-<name>/` folder convention.

### 3.6 Missing document

| Referenced from | Path | Status |
|---|---|---|
| `docs/README.md:43` (root docs table) and `docs/README.md:83` (task routing) | `docs/documentation-guidelines.md` | **Does not exist.** Either write it or remove both references. |

`packages/config/README.md` is also absent, which is acceptable for a placeholder.

### 3.7 Code present but undocumented

| Item | Path |
|---|---|
| `/showcase` dev catalog page (three large client components) | `apps/web/src/app/showcase/{ComponentsShowcase,SectionsShowcase,ThemePreview}.tsx` — absent from `apps/web/AGENTS.md` route table and `PAGE_SEO` |
| `/blog/grid` and `/otp` routes | Present in `docs/template/PAGES.md` but missing from `apps/web/AGENTS.md` entry points |
| Dashboard widgets at route-group root | `apps/admin/src/app/(dashboard)/{community-growth-chart,recent-activity}.tsx` (imported by `dashboard/page.tsx` via `../`) |
| Post editor wrappers `NewPostEditor` / `EditPostEditor` | `apps/admin/src/app/(dashboard)/posts/post-editor.tsx` |
| `(dashboard)/layout.tsx` is a **client** component | `apps/admin/src/app/(dashboard)/layout.tsx` — unusual for an App Router shell, undocumented |
| Two 404 boundaries | `apps/admin/src/app/not-found.tsx` and `apps/admin/src/app/(dashboard)/not-found.tsx` |
| `Form` and `FileUploader` primitives | `packages/ui/src/components/{form/Form.tsx,file-uploader/FileUploader.tsx}` — the only 2 of 63 components with **neither** a `.stories.tsx` nor a `.usecase.md`, and both absent from `docs/component-guide.md` |
| `date-fns@^4.4.0` dependency | `packages/ui/package.json` — zero imports in `packages/ui/src`; either use or remove |
| `scripts/migrate-components.py` | Exists alongside the documented `cleanup-unused.py`; undocumented |
| `.superpowers/` directory | Repo root; not mentioned in any doc |
| `apps/web/components.json` | shadcn CLI config with aliases pointing at non-existent `@/components` and `@/components/ui` |
| Admin-only brand tokens | `--color-brand-coral-soft`, `--color-brand-night-elevated-2` in `apps/admin/src/app/globals.css` |
| Unseeded models | `Profile`, `Contact`, `PetMatch` are not seeded; `prisma/seed.ts` covers 6 users, 5 pets, 4 posts, 3 testimonials, 3 plans |
| Empty directory | `apps/admin/src/login/` — correctly flagged in `apps/admin/AGENTS.md` and `docs/repository-structure.md` |

---

## 4. Per-Workspace State

### `apps/web` — public marketing site

**Working**: 10 routes, 40 sections, layout/providers wiring, Redux theme slice synced to `next-themes`, TanStack Query with 60s `staleTime`, 3 Prisma-backed API routes, all 17 referenced image assets present in `public/images/`.

**Data flow (actual)**:

```text
Prisma (@fe-template/db)
  -> src/app/api/{blog,pricing,testimonials}/route.ts
  -> src/hooks/use-*/server.ts   (absolute fetch via NEXT_PUBLIC_SITE_URL, next: { revalidate: 60 })
  -> Server Components (direct import)  OR  React Query (client.ts re-imports the same fetcher)
  -> sections / pages
```

**Notes and gaps**:

- `client.ts` imports the fetcher from `server.ts` rather than calling `/api/...` directly (`use-blog-posts/client.ts:5`). It works because the origin is a public env var, but `next: { revalidate: 60 }` is a no-op in the browser, and this differs from the pattern in `docs/template/HOOKS.md`.
- `NEXT_PUBLIC_SITE_URL` is required for SSR self-fetch but is absent from `apps/web/.env.example`. `DATABASE_URL` / `DIRECT_URL` are also absent there despite being required at runtime by the API routes.
- UI-only demos with no backend: contact form, blog newsletter, OTP verify (accepts any 6 digits), blog filters (toggles state without filtering).
- `src/modules/layout/sidebar/Sidebar.tsx` (~690 lines) is referenced only by its own story.
- Hook barrel files (`useBlogPosts.ts`, `usePricingPlans.ts`, `useTestimonials.ts`) and the `useTestimonials` client hook have no importers.
- 5 pages are `force-dynamic`, which contradicts the "static when possible" guidance in `apps/web/docs/architecture.md`.
- `HydrationBoundary` is used on `/blog` and `/pricing` only; `/blog/grid` and `/` skip it.

### `apps/admin` — admin portal

**Routes**: `/` (redirect to `/dashboard`), `/login`, `/signup`, `/otp`, `/dashboard`, `/users`, `/users/[id]`, `/pets`, `/posts`, `/posts/new`, `/posts/[id]`, `/testimonials`, `/contacts`, `/pricing-plans`, `/profile`, `POST /api/images`. No `loading.tsx` or `error.tsx` anywhere.

**Working**: full CRUD for users, pets, posts, testimonials, contacts, pricing plans; TanStack Table via shared `DataTable`; Supabase session middleware; image upload to the `admin-uploads` bucket; dashboard stats, growth chart, recent activity.

**Form refactor status** — PascalCase component + `.schema.ts` + `.defaults.ts` is consistent across 9 of 10 forms. Deviations:

- `profile/profile-form/ProfileForm.tsx` has no schema or defaults file; it uses `useActionState` with raw `FormData` and inline password validation.
- `posts/post-form/PostForm.defaults.ts` holds types rather than values, with `PostFormSchemaValues` exported from the schema file instead.

**Other gaps**: `AdminHeader` search input is `readOnly` with no handler; the notifications bell has no handler; `users/[id]` does not display status (only the list does); `getDashboardData()` swallows errors and returns zeros (`dashboard/page.tsx:202`); `deleteUser` removes the Prisma row but leaves the Supabase Auth user; `inviteUser` stores role in Prisma only and sends no role metadata to Supabase; `/api/images` is behind middleware, so unauthenticated API clients get an HTML redirect rather than a JSON 401; zero stories and zero tests.

### `packages/ui`

63 component folders, all exported from `src/index.ts`; no unexported components and no documented export path missing a file. Ships raw TSX (`noEmit`), consumed via `transpilePackages` plus a Tailwind `@source` directive in each app. `cn()` lives in `src/lib/utils.ts`. 61 of 63 components have both a story and a `.usecase.md`; `Form` and `FileUploader` have neither. `package.json` declares a `lint` script but the package has no `eslint.config.*`.

### `packages/db`

8 models, 5 enums, 4 migrations, all schema changes covered by SQL. Public API is `prisma` plus a re-export of `@prisma/client`; entry points `.` and `./client` match the docs. Multi-file schema at `prisma/schema/` with migrations at `prisma/schema/migrations/`.

Forward-looking items: configuration lives in the `package.json` `prisma` block, which Prisma deprecates in favor of `prisma.config.ts` and removes in Prisma 7. The `20260727060109_add_profiles_table` migration adds a foreign key to Supabase's `auth.users`, so it will fail against a plain Postgres instance. The seeded admin (`admin@example.com`, `Role.ADMIN`) gets the default `UserStatus.PENDING`.

### `packages/config`

Placeholder containing only `package.json` (no exports, scripts, or dependencies) and `AGENTS.md`. Zero consumers. This matches its documentation.

---

## 5. Not Drift — Do Not "Fix" These

| Item | Why it is correct |
|---|---|
| Migrations at `packages/db/prisma/schema/migrations/` | Since Prisma 6.6, the migrations directory is resolved next to the schema file containing the `datasource` block. With `prisma.schema = "prisma/schema"` and the datasource in `prisma/schema/schema.prisma`, this is the required location. Resolved Prisma is 6.19.3. Do not move it back to `prisma/migrations/`. The leftover empty `packages/db/prisma/migrations/` directory is harmless clutter and can be deleted. |
| `apps/web/public/images/` | Present and complete: all 17 image paths referenced in sections, layout, and stories exist on disk. |
| Absence of a `test` script | Intentional and correctly documented in `docs/testing.md` and `docs/development-workflow.md`. |
| No CI workflows, no `vercel.json` | Correctly stated in `docs/deployment.md`. |
| `docs/deployment.md` build outputs | Accurate. Line 18 already attributes `storybook-static/` to `build-storybook`, not to `pnpm build`. |
| `apps/web` has no auth or middleware | Intentional per `apps/web/AGENTS.md`. |
| Known issues listed in `docs/repository-structure.md:191-198` | That section is an accurate self-audit; treat it as intentional documentation, not drift. |

---

## 6. Prioritized Fix List

### P0 — security and correctness (code)

- **P0-1** Add an ADMIN authorization gate. At minimum, resolve the signed-in Supabase user to an admin record and enforce `role === ADMIN` in middleware **and** in every Server Action (middleware alone does not protect Server Actions, which are directly invocable POST endpoints). Files: `apps/admin/middleware.ts:37`, all 8 `actions.ts` files.
- **P0-2** Delete `/env` and add a bare `env` entry to `.gitignore`. Rotate any credential that file contains, since it is currently outside gitignore coverage.
- **P0-3** Decide the `User` vs `Profile` model story and make signup write both, or collapse to one table. Until then, self-signup produces a user who can administer everything but cannot load their own profile (`otp-form/actions.ts` vs `hooks/current-user.ts`).
- **P0-4** Either close public signup or gate it behind an invite, given P0-1.

### P1 — broken behavior (code)

- **P1-1** Fix `apps/web/.storybook/preview.tsx:3` to import from `../src/modules/providers/Providers`.
- **P1-2** Add the `/auth/callback` route or remove `emailRedirectTo` from `SignupForm.tsx:40`.
- **P1-3** Add `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL`, and `DIRECT_URL` to `apps/web/.env.example`; add `SUPABASE_SERVICE_ROLE_KEY` and `NEXT_PUBLIC_SITE_URL` to `turbo.json` `globalEnv`.
- **P1-4** Resolve the 14 dead routes in `apps/web/src/constants/routes.ts` — add stub pages or remove the links.

### P2 — documentation (docs only, no code risk)

- **P2-1** Rewrite `apps/admin/docs/patterns.md` against the current tree: folder-based dialogs and forms, `fetch*` exports, `new QueryClient()`, `usersQueryKey.list()`, `contacts-list.tsx`, `*.defaults.ts`.
- **P2-2** Rewrite the admin sections of `docs/template/PAGES.md` and `apps/admin/README.md` (dashboard at `/dashboard`; add `/signup`, `/otp`, `/profile`, `/pricing-plans`).
- **P2-3** Pick one defaults-filename convention, update `docs/llm/PATTERNS.md`, `docs/frontend-conventions.md`, `docs/template/PAGES.md`, `apps/admin/AGENTS.md`, and rename the two `apps/web` files if you standardize on `*.defaults.ts`.
- **P2-4** Remove the `getApiOrigin` example from `docs/api-and-data-fetching.md:43` and document the actual inline-env pattern.
- **P2-5** Either create `docs/documentation-guidelines.md` or remove its two references in `docs/README.md`.
- **P2-6** Correct the "web does not use Prisma" claim in `README.md:153`, `apps/web/README.md`, `apps/web/.env.example`, `packages/db/README.md:5`, and `docs/llm/CONTEXT.md:99`.
- **P2-7** Remove the misleading "no package consumes this" lines from `packages/ui/AGENTS.md:32`, `packages/ui/docs/README.md:26`, `packages/db/AGENTS.md:31`.
- **P2-8** Update `docs/template/HOOKS.md` (real hook inventory, `NEXT_PUBLIC_SITE_URL`), `docs/development-workflow.md:10,115` and `docs/architecture.md:135` (pnpm pinning, typecheck coverage), component count 60 -> 63, `packages/db/README.md` for `User.status`, and `packages/db/docs/api.md` for `PetMatch`.
- **P2-9** Reconcile the `.usecase.md` requirement in `docs/llm/PATTERNS.md:22` with reality: either drop it to a recommendation or accept a 41-file documentation backlog.

### P3 — hygiene

- **P3-1** Add stories and a `.usecase.md` for `Form` and `FileUploader`; add both to `docs/component-guide.md`.
- **P3-2** Remove or use `date-fns` in `packages/ui`; remove the `lint` script or add an ESLint config there.
- **P3-3** Add the missing `use-pricing-plans` barrel; fold `current-user.ts` / `use-current-user.ts` into the `use-<name>/` convention.
- **P3-4** Delete the empty `apps/admin/src/login/` and `packages/db/prisma/migrations/` directories; fix or delete `apps/web/components.json`.
- **P3-5** Plan the `prisma.config.ts` migration before any Prisma 7 upgrade.

---

## 7. Audit Method and Limits

- **Not executed**: `pnpm lint`, `pnpm lint:apps`, `pnpm typecheck`, `pnpm build`, `prisma validate`, `prisma migrate status`. Every statement here is derived from reading files, so runtime and type errors may exist beyond what is listed.
- **Not audited in depth**: `docs/component-guide.md` (skimmed), `docs/about-example-site/*`, `docs/superpowers/*` (historical records), `prompt.md`, image content quality.
- **Claims corrected during the audit**: an initial inventory pass reported that `apps/web/public/images/` was missing, that the Prisma migrations relocation was risky, that `docs/deployment.md` misstated build outputs, and that `packages/db/README.md` omitted `PetMatch`. Direct inspection disproved all four. Treat any inherited finding as unverified until the cited line is read.
- **Line numbers** cited here were read from the working tree on the audit date and will shift as files change.
- **Volatility**: most of `docs/` and the admin form refactor are uncommitted. Re-run this audit after that work lands, since several drift items exist only because docs and code are mid-refactor.
