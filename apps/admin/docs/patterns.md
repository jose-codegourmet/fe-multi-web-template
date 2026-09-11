# `apps/admin` Patterns

Concrete patterns found in the admin portal. Imitate these files when adding new code. Paths below resolve to files in the current tree.

---

## CRUD page structure

A typical dashboard entity lives under `src/app/(dashboard)/[entity]/` as a Server Component page plus route-colocated actions and client UI.

Refactored create/edit flows use a nested folder with a PascalCase component, plus colocated `*.schema.ts` and `*.defaults.ts`. Some list/table files remain flat kebab-case.

```text
src/app/(dashboard)/users/
  ├── page.tsx
  ├── actions.ts
  ├── users-table.tsx
  ├── status-badge.tsx
  ├── [id]/
  │   ├── page.tsx
  │   ├── user-detail.tsx
  │   ├── role-select.tsx
  │   └── status-select.tsx
  └── user-dialog/
      ├── UserDialog.tsx
      ├── edit-user-dialog-form/
      │   ├── EditUserDialogForm.tsx
      │   ├── EditUserDialogForm.schema.ts
      │   └── EditUserDialogForm.defaults.ts
      └── invite-user-dialog-form/
          ├── InviteUserDialogForm.tsx
          ├── InviteUserDialogForm.schema.ts
          └── InviteUserDialogForm.defaults.ts
```

Posts use a nested form folder plus a dedicated editor wrapper for `/posts/new` and `/posts/[id]`:

```text
src/app/(dashboard)/posts/
  ├── page.tsx
  ├── actions.ts
  ├── posts-table.tsx
  ├── post-editor.tsx
  └── post-form/
      ├── PostForm.tsx
      ├── PostForm.schema.ts
      └── PostForm.defaults.ts
```

Contacts, testimonials, and pricing plans use list components (`*-list.tsx`) rather than tables.

Real references:

- `src/app/(dashboard)/users/page.tsx`
- `src/app/(dashboard)/users/actions.ts`
- `src/app/(dashboard)/users/users-table.tsx`
- `src/app/(dashboard)/users/user-dialog/UserDialog.tsx`
- `src/app/(dashboard)/posts/page.tsx`
- `src/app/(dashboard)/posts/posts-table.tsx`
- `src/app/(dashboard)/posts/post-form/PostForm.tsx`
- `src/app/(dashboard)/posts/actions.ts`
- `src/app/(dashboard)/pets/pet-dialog/PetDialog.tsx`
- `src/app/(dashboard)/contacts/contacts-list.tsx`
- `src/app/(dashboard)/testimonials/testimonials-list.tsx`
- `src/app/(dashboard)/pricing-plans/pricing-plans-list.tsx`

---

## Server Action pattern

Actions are `"use server"` modules colocated with the route. They parse input with zod, write through `prisma` from `@fe-template/db`, and call `revalidatePath`. Most action files do not check the session or role today (session gating is middleware-only).

```ts
"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";

export async function createEntity(data: EntityValues) {
  await prisma.entity.create({ data });
  revalidatePath("/entities");
}
```

Real references:

- `src/app/(dashboard)/users/actions.ts` — `updateUserRole`, `inviteUser`, `updateUser`, `updateUserStatus`, `deleteUser` (`inviteUser` writes `User.role` in Prisma and the same role to Supabase `app_metadata` after `inviteUserByEmail`; a Prisma failure rolls Auth back so the two stores do not diverge. `deleteUser` removes the Prisma row and the matching Supabase Auth user via `createAdminClient`; a missing Auth user is ignored so the Prisma delete still proceeds)
- `src/app/(dashboard)/posts/actions.ts` — create, update, delete post
- `src/app/(dashboard)/contacts/actions.ts` — update contact status, delete
- `src/app/(dashboard)/pets/actions.ts`
- `src/app/(dashboard)/testimonials/actions.ts`
- `src/app/(dashboard)/pricing-plans/actions.ts`
- `src/app/(dashboard)/profile/actions.ts` — the only dashboard action file that calls `supabase.auth.getUser()`

---

## Server Component + prefetch pattern

Dashboard list pages construct `new QueryClient()` locally. There is no `getQueryClient` export from `Providers`. Prefetch uses the hook folder's `fetch*` server function and `*QueryKey.list()` helper (for users that is `["users","list"]`).

```tsx
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { usersQueryKey } from "@/hooks/use-users/query";
import { fetchUsers } from "@/hooks/use-users/server";
import { UserDialog } from "./user-dialog/UserDialog";
import { UsersTable } from "./users-table";

export default async function UsersPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: usersQueryKey.list(),
    queryFn: fetchUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersTable />
    </HydrationBoundary>
  );
}
```

The same shape appears on posts (`fetchPosts` + `postsQueryKey.list()`) and contacts (`fetchContacts` + `contactsQueryKey.list()`). Other entity fetchers follow the same `fetch*` naming: `fetchPets`, `fetchTestimonials`, `fetchPricingPlans`.

Real references:

- `src/app/(dashboard)/users/page.tsx`
- `src/app/(dashboard)/posts/page.tsx`
- `src/app/(dashboard)/contacts/page.tsx`
- `src/hooks/use-users/server.ts`
- `src/hooks/use-users/query.ts`

---

## Hook structure

Standard `use-<entity>/` folder:

```text
src/hooks/use-users/
  ├── client.ts
  ├── server.ts
  ├── query.ts
  ├── types.ts
  └── useUsers.ts          # barrel (all six entity hooks have one)
```

`use-pricing-plans/` follows the same layout, including `usePricingPlans.ts`. Current-user helpers sit next to the folders as `use-current-user.ts` (client) and `current-user.ts` (server), plus the shared utility `use-mobile.ts`.

Real references:

- `src/hooks/use-users/client.ts`
- `src/hooks/use-users/server.ts`
- `src/hooks/use-users/query.ts`
- `src/hooks/use-posts/client.ts`
- `src/hooks/use-posts/server.ts`
- `src/hooks/use-pets/server.ts`
- `src/hooks/use-contacts/server.ts`
- `src/hooks/use-testimonials/server.ts`
- `src/hooks/use-pricing-plans/server.ts`
- `src/hooks/use-current-user.ts`
- `src/hooks/current-user.ts`
- `src/hooks/use-mobile.ts`

---

## Form pattern (react-hook-form + zod)

Auth modules and dashboard dialogs use PascalCase files plus colocated `*.schema.ts` and `*.defaults.ts`. No file in this app uses `.schema.ts` / `.defaultValues.ts` as hidden-dot names or camelCase `defaultValues`.

```text
src/modules/auth/login-form/
  ├── LoginForm.tsx
  ├── LoginForm.schema.ts
  └── LoginForm.defaults.ts
```

Dashboard form folders follow the same suffix convention:

```text
src/app/(dashboard)/posts/post-form/
  ├── PostForm.tsx
  ├── PostForm.schema.ts
  └── PostForm.defaults.ts
```

Exceptions to copy carefully:

- `src/app/(dashboard)/profile/profile-form/ProfileForm.tsx` has no schema or defaults file; it uses `useActionState` with raw `FormData`.
- `src/app/(dashboard)/posts/post-form/PostForm.defaults.ts` exports `getNewPostDefaultValues` and `getPostDefaultValues`. `PostFormValues` and `PostFormSchemaValues` live in `PostForm.schema.ts`. `PostFormValues` keeps an optional `id` so create vs update can branch on it; excerpt and coverImage stay non-nullable strings.

Real references:

- `src/modules/auth/login-form/LoginForm.tsx`
- `src/modules/auth/login-form/LoginForm.schema.ts`
- `src/modules/auth/login-form/LoginForm.defaults.ts`
- `src/modules/auth/signup-form/SignupForm.tsx`
- `src/modules/auth/otp-form/OtpForm.tsx`
- `src/app/(dashboard)/posts/post-form/PostForm.tsx`
- `src/app/(dashboard)/users/user-dialog/UserDialog.tsx`
- `src/app/(dashboard)/users/user-dialog/edit-user-dialog-form/EditUserDialogForm.tsx`
- `src/app/(dashboard)/pets/pet-dialog/pet-dialog-form/PetDialogForm.tsx`
- `src/app/(dashboard)/testimonials/testimonial-dialog/testimonial-dialog-form/TestimonialDialogForm.tsx`
- `src/app/(dashboard)/pricing-plans/pricing-plan-dialog/pricing-plan-dialog-form/PricingPlanDialogForm.tsx`

---

## Table and list pattern (TanStack Table + DataTable)

Table pages compose `DataTable` from `@fe-template/ui`. Inbox-style pages use a list component instead of a table.

```tsx
import { DataTable } from "@fe-template/ui";
import { useUsers } from "@/hooks/use-users/client";

export function UsersTable() {
  const { data = [] } = useUsers();
  return <DataTable columns={columns} data={data} />;
}
```

Route-group navigation uses `src/app/(dashboard)/loading.tsx` (DataTable-style `Skeleton` rows) while Server Components fetch. Uncaught page errors render `src/app/(dashboard)/error.tsx` with a `reset()` action.

Real references:

- `src/app/(dashboard)/loading.tsx`
- `src/app/(dashboard)/error.tsx`
- `src/app/(dashboard)/users/users-table.tsx`
- `src/app/(dashboard)/posts/posts-table.tsx`
- `src/app/(dashboard)/pets/pets-table.tsx`
- `src/app/(dashboard)/contacts/contacts-list.tsx`
- `src/app/(dashboard)/testimonials/testimonials-list.tsx`
- `src/app/(dashboard)/pricing-plans/pricing-plans-list.tsx`

---

## Image upload pattern

Client helper:

- `src/lib/upload-image.ts`

API endpoint:

- `src/app/api/images/route.ts` — uploads to the Supabase Storage bucket `admin-uploads`

Form usage:

- `src/app/(dashboard)/posts/post-form/PostForm.tsx` (uses `FileUploader` from `@fe-template/ui`)

---

## Dialog + alert dialog pattern

Use `Dialog` and `AlertDialog` from `@fe-template/ui` for create/edit/delete flows.

Real references:

- `src/app/(dashboard)/users/user-dialog/UserDialog.tsx`
- `src/app/(dashboard)/pets/pet-dialog/PetDialog.tsx`
- `src/app/(dashboard)/posts/posts-table.tsx` (delete alert dialog)
- `src/app/(dashboard)/testimonials/testimonial-dialog/TestimonialDialog.tsx`
- `src/app/(dashboard)/pricing-plans/pricing-plan-dialog/PricingPlanDialog.tsx`
