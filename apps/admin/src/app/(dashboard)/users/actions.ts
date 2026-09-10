"use server";

import { prisma, type Role, type UserStatus } from "@fe-template/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const userInviteSchema = z.object({
  email: z.string().email("Valid email required"),
  role: z.enum(["USER", "ADMIN"]),
});

const userUpdateSchema = z.object({
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type UserInviteValues = z.infer<typeof userInviteSchema>;
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

export async function inviteUser(data: UserInviteValues): Promise<ActionResult> {
  const parsed = userInviteSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.inviteUserByEmail(parsed.data.email);

    if (error) {
      return { success: false, error: error.message };
    }

    await prisma.user.upsert({
      where: { email: parsed.data.email },
      create: {
        email: parsed.data.email,
        role: parsed.data.role,
        status: "PENDING",
      },
      update: {
        role: parsed.data.role,
        status: "PENDING",
      },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to invite user" };
  }

  revalidatePath("/users");
  return { success: true };
}

export async function updateUserStatus(id: string, status: UserStatus): Promise<ActionResult> {
  try {
    await prisma.user.update({
      where: { id },
      data: { status },
    });
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update status",
    };
  }

  revalidatePath("/users");
  revalidatePath(`/users/${id}`);
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
