"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

export async function updateProfile(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const name = String(formData.get("name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { error: "You must be signed in to update your profile." };
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
    return { error: "Could not update profile. Make sure your account exists in the database." };
  }

  revalidatePath("/profile");
  return { success: "Profile updated." };
}
