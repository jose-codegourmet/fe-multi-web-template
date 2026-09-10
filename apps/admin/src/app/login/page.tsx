"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fe-template/ui";
import { KeyRoundIcon, PawPrintIcon, ShieldCheckIcon } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/modules/auth/login-form/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-4">
      <div className="pointer-events-none absolute -top-24 left-1/4 size-72 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full bg-[color:var(--color-brand-lavender)]/15 blur-[120px]" />

      <Card className="relative z-10 w-full max-w-[480px] rounded-3xl border-border/60 shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <PawPrintIcon className="size-6" />
          </div>
          <CardTitle className="font-display text-3xl tracking-tight">
            Welcome back, Admin.
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to manage the PawPair community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />

          <div className="mt-6 space-y-3 border-t border-border/60 pt-5 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              <ShieldCheckIcon className="size-3.5" />
              Encrypted admin access
            </p>
            <div className="flex items-center justify-center gap-4 text-muted-foreground/50">
              <PawPrintIcon className="size-4" />
              <ShieldCheckIcon className="size-4" />
              <KeyRoundIcon className="size-4" />
            </div>
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
