"use client";

import { Badge, Switch } from "@fe-template/ui";
import { StarIcon } from "lucide-react";
import { useTransition } from "react";
import { useTestimonials } from "@/hooks/use-testimonials/client";
import type { TestimonialRow } from "@/hooks/use-testimonials/types";
import { toggleTestimonialPublished } from "./actions";

export function TestimonialsList() {
  const { data: items = [] } = useTestimonials();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{items.length} testimonials</p>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No testimonials yet.</p>
      ) : (
        items.map((item) => <TestimonialCard key={item.id} item={item} />)
      )}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  const stars = ["star-1", "star-2", "star-3", "star-4", "star-5"] as const;
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {stars.map((key, index) => {
        const filled = index < rating;
        return (
          <StarIcon
            key={key}
            className={`size-4 ${filled ? "fill-[color:var(--color-brand-yellow)] text-[color:var(--color-brand-yellow)]" : "text-muted-foreground/40"}`}
          />
        );
      })}
    </div>
  );
}

function TestimonialCard({ item }: { item: TestimonialRow }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{item.authorName}</span>
          {item.petName ? (
            <span className="text-sm text-muted-foreground">· {item.petName}</span>
          ) : null}
          <StarRating rating={item.rating} />
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
          <Badge variant={item.published ? "default" : "secondary"} className="rounded-full">
            {item.published ? "Published" : "Hidden"}
          </Badge>
        </div>
      </div>
      <p className="font-display text-lg leading-relaxed text-foreground/90 italic">
        “{item.content}”
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        {new Date(item.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
