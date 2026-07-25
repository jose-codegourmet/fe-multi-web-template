import { Badge, Card, CardContent, CardHeader, CardTitle } from "@fe-template/ui";
import {
  FileTextIcon,
  type LucideIcon,
  MailIcon,
  MessageSquareQuoteIcon,
  PawPrintIcon,
} from "lucide-react";

export type ActivityItem = {
  id: string;
  type: "pet" | "post" | "contact" | "testimonial";
  title: string;
  subtitle: string;
  createdAt: string;
};

const TYPE_META: Record<
  ActivityItem["type"],
  { label: string; icon: LucideIcon; className: string }
> = {
  pet: {
    label: "Pet",
    icon: PawPrintIcon,
    className: "bg-primary/15 text-primary",
  },
  post: {
    label: "Post",
    icon: FileTextIcon,
    className: "bg-[color:var(--color-brand-lavender)]/20 text-[color:var(--color-brand-lavender)]",
  },
  contact: {
    label: "Contact",
    icon: MailIcon,
    className: "bg-[color:var(--color-brand-sky)]/20 text-[color:var(--color-brand-sky)]",
  },
  testimonial: {
    label: "Testimonial",
    icon: MessageSquareQuoteIcon,
    className: "bg-[color:var(--color-brand-mint)]/20 text-[color:var(--color-brand-mint)]",
  },
};

function formatRelative(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  return date.toLocaleDateString();
}

type RecentActivityProps = {
  items: ActivityItem[];
};

export function RecentActivity({ items }: RecentActivityProps) {
  return (
    <Card className="rounded-3xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="font-display text-xl">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity yet.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => {
              const meta = TYPE_META[item.type];
              const Icon = meta.icon;
              return (
                <li key={`${item.type}-${item.id}`} className="flex gap-3">
                  <div
                    className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl ${meta.className}`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">{item.title}</p>
                      <Badge variant="secondary" className="rounded-full text-[10px]">
                        {meta.label}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelative(item.createdAt)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
