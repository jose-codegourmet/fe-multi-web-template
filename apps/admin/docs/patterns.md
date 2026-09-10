# `apps/admin` Patterns

Concrete patterns found in the admin portal. Imitate these files when adding new code.

---

## CRUD page structure

A typical dashboard page has a Server Component page and route-colocated client components/actions:

```text
src/app/(dashboard)/[entity]/
  ├── page.tsx              # Server Component: fetch data, prefetch query
  ├── actions.ts            # Server Actions: create, update, delete
  ├── [entity]-table.tsx    # Client table (TanStack Table)
  └── [entity]-dialog.tsx   # Client create/edit dialog with form
```

Real references:
- `src/app/(dashboard)/users/page.tsx`
- `src/app/(dashboard)/users/actions.ts`
- `src/app/(dashboard)/users/users-table.tsx`
- `src/app/(dashboard)/users/user-dialog.tsx`
- `src/app/(dashboard)/posts/page.tsx`
- `src/app/(dashboard)/posts/posts-table.tsx`
- `src/app/(dashboard)/posts/post-form.tsx`
- `src/app/(dashboard)/posts/actions.ts`

---

## Server Action pattern

```ts
"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";

export async function createEntity(formData: FormData) {
  // parse + validate with zod
  await prisma.entity.create({ data });
  revalidatePath("/entities");
}
```

Real references:
- `src/app/(dashboard)/users/actions.ts` — create, update, delete, invite user
- `src/app/(dashboard)/posts/actions.ts` — create, update, delete post
- `src/app/(dashboard)/contacts/actions.ts` — update contact status, delete

---

## Server Component + prefetch pattern

```tsx
import { getUsers } from "@/hooks/use-users/server";
import { getQueryClient } from "@/modules/providers/Providers";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function UsersPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({ queryKey: ["users"], queryFn: getUsers });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersTable />
    </HydrationBoundary>
  );
}
```

Real references:
- `src/app/(dashboard)/users/page.tsx`
- `src/app/(dashboard)/posts/page.tsx`
- `src/hooks/use-users/server.ts`

---

## Hook structure

Standard `use-*/` folder with `client.ts` and `server.ts`:

```text
src/hooks/use-users/
  ├── client.ts
  ├── server.ts
  ├── query.ts
  └── types.ts
```

Real references:
- `src/hooks/use-users/client.ts`
- `src/hooks/use-users/server.ts`
- `src/hooks/use-posts/client.ts`
- `src/hooks/use-posts/server.ts`

---

## Form pattern (react-hook-form + zod)

Auth modules use the following structure:

```text
src/modules/auth/login-form/
  ├── LoginForm.tsx
  ├── .schema.ts
  └── .defaultValues.ts
```

Real references:
- `src/modules/auth/login-form/LoginForm.tsx`
- `src/modules/auth/login-form/.schema.ts`
- `src/modules/auth/login-form/.defaultValues.ts`
- `src/modules/auth/signup-form/SignupForm.tsx`
- `src/modules/auth/otp-form/OtpForm.tsx`

Dashboard forms use the `Form` primitives from `@fe-template/ui` directly in the page or dialog component. See:
- `src/app/(dashboard)/posts/post-form.tsx`
- `src/app/(dashboard)/users/user-dialog.tsx`

---

## Table pattern (TanStack Table + DataTable)

```tsx
import { DataTable } from "@fe-template/ui";

export function UsersTable({ users }: { users: User[] }) {
  // columns definition
  return <DataTable columns={columns} data={users} />;
}
```

Real references:
- `src/app/(dashboard)/users/users-table.tsx`
- `src/app/(dashboard)/posts/posts-table.tsx`
- `src/app/(dashboard)/contacts/contacts-table.tsx`

---

## Image upload pattern

Client helper:
- `src/lib/upload-image.ts`

API endpoint:
- `src/app/api/images/route.ts` — uploads to Supabase Storage bucket `admin-uploads`

Form usage:
- `src/app/(dashboard)/posts/post-form.tsx` or other forms using `FileUploader` from `@fe-template/ui`

---

## Dialog + alert dialog pattern

Use `Dialog` and `AlertDialog` from `@fe-template/ui` for create/edit/delete flows.

Real references:
- `src/app/(dashboard)/users/user-dialog.tsx`
- `src/app/(dashboard)/posts/posts-table.tsx` (delete alert dialog)
