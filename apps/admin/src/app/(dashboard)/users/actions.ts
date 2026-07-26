"use server";

import { prisma, type Role } from "@fe-template/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const userCreateSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const userUpdateSchema = z.object({
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type UserCreateValues = z.infer<typeof userCreateSchema>;
export type UserUpdateValues = z.infer<typeof userUpdateSchema>;
export type ActionResult = { success: true } | { success: false; error: string };

export async function updateUserRole(userId: string, role: Role) {
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath(`/users/${userId}`);
  revalidatePath("/users");
}

export async function createUser(data: UserCreateValues): Promise<ActionResult> {
  const parsed = userCreateSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    await prisma.user.create({
      data: {
        email: parsed.data.email,
        name: parsed.data.name || null,
        role: parsed.data.role,
        bio: parsed.data.bio || null,
        avatarUrl: parsed.data.avatarUrl || null,
      },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create user" };
  }

  revalidatePath("/users");
  return { success: true };
}

export async function updateUser(id: string, data: UserUpdateValues): Promise<ActionResult> {
  const parsed = userUpdateSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name: parsed.data.name || null,
        role: parsed.data.role,
        bio: parsed.data.bio || null,
        avatarUrl: parsed.data.avatarUrl || null,
      },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update user" };
  }

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
  return { success: true };
}

export async function deleteUser(id: string): Promise<ActionResult> {
  try {
    await prisma.post.deleteMany({ where: { authorId: id } });
    await prisma.user.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete user" };
  }

  revalidatePath("/users");
  return { success: true };
}
