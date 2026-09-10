"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fe-template/ui";
import { KeyRoundIcon, ShieldCheckIcon } from "lucide-react";
import { Suspense } from "react";
import { OtpForm } from "@/modules/auth/otp-form/OtpForm";

export default function OtpPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute -top-24 left-1/4 size-72 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-[color:var(--color-brand-lavender)]/15 blur-[120px]" />

      <Card className="relative z-10 w-full max-w-[480px] rounded-3xl border-border/60 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <KeyRoundIcon className="size-6" />
          </div>
          <CardTitle className="font-display text-3xl tracking-tight">
            Confirm your email.
          </CardTitle>
          <CardDescription className="text-base">
            Enter the one-time code we sent to finish creating your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<p className="text-center text-sm text-muted-foreground">Loading…</p>}
          >
            <OtpForm />
          </Suspense>

          <div className="mt-6 space-y-3 border-t border-border/60 pt-5 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              <ShieldCheckIcon className="size-3.5" />
              Encrypted admin access
            </p>
            <div className="flex items-center justify-center gap-4 text-muted-foreground/50">
              <KeyRoundIcon className="size-4" />
              <ShieldCheckIcon className="size-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
