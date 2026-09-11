import { Skeleton } from "@fe-template/ui";

const COLUMN_WIDTHS = ["w-28", "w-36", "w-24", "w-20", "w-16"] as const;
const SKELETON_ROWS = [
  "row-a",
  "row-b",
  "row-c",
  "row-d",
  "row-e",
  "row-f",
  "row-g",
  "row-h",
] as const;

export default function DashboardLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <div className="w-full space-y-4">
        <Skeleton className="h-9 w-full max-w-sm" />

        <div className="overflow-hidden rounded-md border">
          <div className="grid grid-cols-5 gap-4 border-b bg-muted/40 px-4 py-3">
            {COLUMN_WIDTHS.map((width) => (
              <Skeleton key={width} className={`h-4 ${width}`} />
            ))}
          </div>
          {SKELETON_ROWS.map((rowId) => (
            <div key={rowId} className="grid grid-cols-5 gap-4 border-b px-4 py-3 last:border-b-0">
              {COLUMN_WIDTHS.map((width) => (
                <Skeleton key={`${rowId}-${width}`} className={`h-4 ${width}`} />
              ))}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
