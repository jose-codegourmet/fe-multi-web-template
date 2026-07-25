"use client";

import type { ContactStatus } from "@fe-template/db";
import { Badge, Button } from "@fe-template/ui";
import { useTransition } from "react";
import { updateContactStatus } from "./actions";

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactStatus;
  createdAt: string;
};

const STATUS_VARIANT: Record<ContactStatus, "default" | "secondary" | "outline"> = {
  UNREAD: "default",
  READ: "secondary",
  RESOLVED: "outline",
};

export function ContactsList({ items }: { items: ContactRow[] }) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No contact submissions yet.</p>
      ) : (
        items.map((item) => <ContactCard key={item.id} item={item} />)
      )}
    </div>
  );
}

function ContactCard({ item }: { item: ContactRow }) {
  const [pending, startTransition] = useTransition();

  function setStatus(status: ContactStatus) {
    startTransition(async () => {
      await updateContactStatus(item.id, status);
    });
  }

  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground">{item.email}</div>
          {item.subject ? <div className="mt-1 text-sm font-medium">{item.subject}</div> : null}
        </div>
        <Badge variant={STATUS_VARIANT[item.status]}>{item.status}</Badge>
      </div>
      <p className="mb-3 text-sm whitespace-pre-wrap">{item.message}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending || item.status === "READ"}
          onClick={() => setStatus("READ")}
        >
          Mark read
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={pending || item.status === "RESOLVED"}
          onClick={() => setStatus("RESOLVED")}
        >
          Resolve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={pending || item.status === "UNREAD"}
          onClick={() => setStatus("UNREAD")}
        >
          Mark unread
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          {new Date(item.createdAt).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
