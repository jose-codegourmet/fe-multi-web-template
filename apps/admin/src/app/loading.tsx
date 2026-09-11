import { Skeleton } from "@fe-template/ui";

export default function RootLoading() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center bg-background px-4"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <Skeleton className="size-12 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="mt-4 h-10 w-full rounded-full" />
      </div>
    </div>
  );
}
