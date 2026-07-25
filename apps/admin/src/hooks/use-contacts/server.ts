"use server";

import { prisma } from "@fe-template/db";
import type { ContactRow } from "./types";

export async function fetchContacts(): Promise<ContactRow[]> {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return contacts.map((contact) => ({
    id: contact.id,
    name: contact.name,
    email: contact.email,
    subject: contact.subject,
    message: contact.message,
    status: contact.status,
    createdAt: contact.createdAt.toISOString(),
  }));
}
