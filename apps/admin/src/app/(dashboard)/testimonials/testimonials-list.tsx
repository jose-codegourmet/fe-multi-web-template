"use client";

import { Badge, Switch } from "@fe-template/ui";
import { useTransition } from "react";
import { toggleTestimonialPublished } from "./actions";

export type TestimonialRow = {
  id: string;
  content: string;
  authorName: string;
  petName: string | null;
  rating: number;
  published: boolean;
  createdAt: string;
};

export function TestimonialsList({ items }: { items: TestimonialRow[] }) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No testimonials yet.</p>
      ) : (
        items.map((item) => <TestimonialCard key={item.id} item={item} />)
      )}
    </div>
  );
}

function TestimonialCard({ item }: { item: TestimonialRow }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.authorName}</span>
          {item.petName ? (
            <span className="text-sm text-muted-foreground">· {item.petName}</span>
          ) : null}
          <Badge variant="secondary">{item.rating}/5</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={item.published}
            disabled={pending}
            onCheckedChange={(checked) => {
              startTransition(async () => {
                await toggleTestimonialPublished(item.id, checked);
              });
            }}
          />
          <span className="text-sm text-muted-foreground">
            {item.published ? "Published" : "Hidden"}
          </span>
        </div>
      </div>
      <p className="text-sm">{item.content}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        {new Date(item.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
