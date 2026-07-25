"use server";

import { type ContactStatus, prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";

export async function updateContactStatus(id: string, status: ContactStatus) {
  await prisma.contact.update({
    where: { id },
    data: { status },
  });
  revalidatePath("/contacts");
}
