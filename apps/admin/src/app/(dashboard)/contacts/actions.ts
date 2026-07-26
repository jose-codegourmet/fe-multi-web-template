"use server";

import { type ContactStatus, prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";

export type ActionResult = { success: true } | { success: false; error: string };

export async function deleteContact(id: string): Promise<ActionResult> {
  try {
    await prisma.contact.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete contact" };
  }
  revalidatePath("/contacts");
  return { success: true };
}

export async function updateContactStatus(id: string, status: ContactStatus) {
  await prisma.contact.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/contacts");
}
