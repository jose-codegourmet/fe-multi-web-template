"use client";

import { Badge, Button } from "@fe-template/ui";
import { useTransition } from "react";
import { useContacts } from "@/hooks/use-contacts/client";
import type { ContactRow, ContactStatus } from "@/hooks/use-contacts/types";
import { updateContactStatus } from "./actions";

function statusBadgeClass(status: ContactStatus) {
  if (status === "RESOLVED") {
    return "border-[color:var(--color-brand-mint)]/40 bg-[color:var(--color-brand-mint)]/15 text-[color:var(--color-brand-ink-700)] dark:text-[color:var(--color-brand-mint)]";
  }
  return "";
}

export function ContactsList() {
  const { data: items = [] } = useContacts();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{items.length} contacts</p>
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
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground">{item.email}</div>
          {item.subject ? <div className="mt-1 text-sm font-medium">{item.subject}</div> : null}
        </div>
        <Badge
          variant={
            item.status === "UNREAD" ? "default" : item.status === "READ" ? "secondary" : "outline"
          }
          className={`rounded-full ${statusBadgeClass(item.status)}`}
        >
          {item.status}
        </Badge>
      </div>
      <p className="mb-4 text-sm leading-relaxed whitespace-pre-wrap">{item.message}</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full"
          disabled={pending || item.status === "READ"}
          onClick={() => setStatus("READ")}
        >
          Mark read
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="rounded-full"
          disabled={pending || item.status === "RESOLVED"}
          onClick={() => setStatus("RESOLVED")}
        >
          Resolve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="rounded-full"
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
