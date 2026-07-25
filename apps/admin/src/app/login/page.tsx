"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@fe-template/ui";
import {
  EyeIcon,
  EyeOffIcon,
  KeyRoundIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  PawPrintIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <MailIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl pr-10 pl-9"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-full"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="size-4" />
                  ) : (
                    <EyeIcon className="size-4" />
                  )}
                </Button>
              </div>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="h-11 w-full rounded-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
