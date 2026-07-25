import { prisma } from "@fe-template/db";
import { type ContactRow, ContactsList } from "./contacts-list";

async function getContacts(): Promise<ContactRow[]> {
  try {
    const items = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
    });

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject,
      message: item.message,
      status: item.status,
      createdAt: item.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function ContactsPage() {
  const items = await getContacts();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{items.length} contacts</p>
      <ContactsList items={items} />
    </div>
  );
}
