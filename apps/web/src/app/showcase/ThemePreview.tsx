"use client";

import { buttonVariants } from "@fe-template/ui";
import Image from "next/image";
import { cn } from "@/lib/utils";

function MiniLandingCard({ mode }: { mode: "light" | "dark" }) {
  return (
    <div
      className={cn(
        mode === "dark" && "dark",
        "overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-sm",
      )}
    >
      <div className="border-b border-border/60 bg-background/90 px-5 py-3">
        <div className="flex items-center justify-between gap-3">
          <Image
            src="/images/brand/logo-pawpair-primary.png"
            alt="PawPair"
            width={110}
            height={28}
            className="h-6 w-auto dark:brightness-0 dark:invert"
          />
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-[0.7rem] font-medium text-muted-foreground">
            {mode === "light" ? "Light" : "Dark"}
          </span>
        </div>
      </div>

      <div className="space-y-4 bg-muted/30 px-5 py-8">
        <p className="inline-flex rounded-full bg-brand-coral/15 px-2.5 py-0.5 text-[0.7rem] font-medium text-brand-coral">
          Better matches. Happier tails.
        </p>
        <h3 className="font-display text-2xl leading-tight tracking-tight text-foreground">
          Find playmates and pet-parent friends nearby
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Compatibility-first matching for safer meetups, walking buddies, and local community.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-brand-coral text-white hover:bg-brand-coral/90",
            )}
          >
            Create a profile
          </span>
          <span className={buttonVariants({ variant: "outline", size: "sm" })}>How it works</span>
        </div>
      </div>
    </div>
  );
}

function ThemePreview() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Light mode</p>
        <MiniLandingCard mode="light" />
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Dark mode</p>
        <MiniLandingCard mode="dark" />
      </div>
    </div>
  );
}

export { ThemePreview };
