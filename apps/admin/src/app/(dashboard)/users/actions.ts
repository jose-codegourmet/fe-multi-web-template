"use server";

import { prisma, type Role } from "@fe-template/db";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: Role) {
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath(`/users/${userId}`);
  revalidatePath("/users");
}
