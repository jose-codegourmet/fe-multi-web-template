"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  type ProfileFormValues,
  type ProfilePasswordValues,
  profileFormSchema,
  profilePasswordSchema,
} from "./profile-form/ProfileForm.schema";

export type ActionResult = { success: true; message: string } | { success: false; error: string };

export async function updateProfile(data: ProfileFormValues): Promise<ActionResult> {
  const parsed = profileFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const name = parsed.data.name.trim();
  const bio = parsed.data.bio.trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { success: false, error: "You must be signed in to update your profile." };
  }

  try {
    await prisma.user.update({
      where: { email: user.email },
      data: {
        name: name || null,
        bio: bio || null,
      },
    });
  } catch {
    return {
      success: false,
      error: "Could not update profile. Make sure your account exists in the database.",
    };
  }

  revalidatePath("/profile");
  return { success: true, message: "Profile updated." };
}

export async function updatePassword(data: ProfilePasswordValues): Promise<ActionResult> {
  const parsed = profilePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be signed in to update your password." };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, message: "Password updated." };
}
