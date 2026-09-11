"use client";

import { Button } from "@fe-template/ui";
import { AlertTriangleIcon, PawPrintIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-8 h-28 w-40">
        <div className="absolute top-2 left-2 flex size-16 rotate-[-8deg] items-center justify-center rounded-3xl bg-destructive/15 text-destructive shadow-sm">
          <AlertTriangleIcon className="size-7" />
        </div>
        <div className="absolute right-0 bottom-0 flex size-16 rotate-[10deg] items-center justify-center rounded-3xl bg-accent text-accent-foreground shadow-sm">
          <PawPrintIcon className="size-7" />
        </div>
      </div>
      <p className="text-sm font-medium tracking-wide text-primary uppercase">Error</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
        This fetch went <span className="italic text-primary">sideways</span>
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        Something broke while loading this admin page. Try again, or return to the dashboard.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button className="rounded-full" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="outline" className="rounded-full" render={<Link href="/dashboard" />}>
          Return to dashboard
        </Button>
      </div>
    </div>
  );
}
