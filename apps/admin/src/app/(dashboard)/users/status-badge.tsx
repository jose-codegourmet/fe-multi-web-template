import { Badge } from "@fe-template/ui";
import type { UserStatus } from "@/hooks/use-users/types";

export const STATUS_OPTIONS: { value: UserStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "VERIFIED", label: "Verified" },
  { value: "DEACTIVATED", label: "Deactivated" },
  { value: "MOCK", label: "Mock" },
];

const STATUS_BADGE_CLASS: Record<UserStatus, string> = {
  PENDING: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  VERIFIED: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  DEACTIVATED: "border-transparent bg-destructive/10 text-destructive",
  MOCK: "border-transparent bg-slate-500/15 text-slate-600 dark:text-slate-400",
};

export function StatusBadge({ status }: { status: UserStatus }) {
  const label = STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
  return (
    <Badge variant="outline" className={`rounded-full ${STATUS_BADGE_CLASS[status]}`}>
      {label}
    </Badge>
  );
}
