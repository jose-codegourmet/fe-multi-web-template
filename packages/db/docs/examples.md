# `@fe-template/db` Examples

Practical examples of using the shared database package in server code.

---

## Server Component query

```tsx
import { prisma } from "@fe-template/db";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: { pets: true },
    orderBy: { createdAt: "desc" },
  });

  return <UsersTable users={users} />;
}
```

Real reference: `apps/admin/src/app/(dashboard)/users/page.tsx`.

---

## Server Action mutation

```ts
"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";

export async function updateUserStatus(id: string, status: UserStatus) {
  await prisma.user.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/users");
}
```

Real reference: `apps/admin/src/app/(dashboard)/users/actions.ts`.

---

## API route query

```ts
import { prisma } from "@fe-template/db";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}
```

Real references: `apps/web/src/app/api/blog/route.ts`, `apps/web/src/app/api/pricing/route.ts`, `apps/web/src/app/api/testimonials/route.ts`.

---

## Using generated types

```ts
import { prisma } from "@fe-template/db";
import type { Role, UserStatus } from "@fe-template/db";

export async function createUser(data: { email: string; name?: string; role: Role }) {
  return prisma.user.create({ data });
}
```

Real reference: `apps/admin/src/app/(dashboard)/users/actions.ts`.

---

## Seeding

```ts
// prisma/seed.ts (excerpt)
import { prisma } from "@fe-template/db";
import { users } from "./constants/users";

async function main() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }
}

main();
```

Real reference: `packages/db/prisma/seed.ts` and `packages/db/prisma/constants/`.

---

## Profile upsert after Supabase OTP

```ts
"use server";

import { prisma } from "@fe-template/db";

export async function createProfile(input: { id: string; email: string; name?: string }) {
  await prisma.profile.upsert({
    where: { id: input.id },
    update: {},
    create: input,
  });
}
```

Real reference: `apps/admin/src/modules/auth/otp-form/actions.ts`.

---

## Discouraged usage

- Do not import `@fe-template/db` from client components (`"use client"`).
- Do not instantiate a new `PrismaClient` in app code; use the exported `prisma` singleton.
- Do not use `db:push` in production or shared environments.
