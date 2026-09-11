"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Textarea,
} from "@fe-template/ui";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon, LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useActionState, useEffect, useState } from "react";
import { getInitials, useCurrentUser } from "@/hooks/use-current-user/client";
import { currentUserQueryKey } from "@/hooks/use-current-user/query";
import { createClient } from "@/lib/supabase/client";
import { type ProfileActionState, updateProfile } from "../actions";

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

const initialState: ProfileActionState = {};

export function ProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { data: currentUser, isLoading } = useCurrentUser();
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (state.success) {
      void queryClient.invalidateQueries({ queryKey: currentUserQueryKey.current() });
    }
  }, [state.success, queryClient]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setPasswordLoading(false);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setPasswordSuccess("Password updated.");
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2Icon className="size-4 animate-spin" />
        Loading profile…
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Card className="rounded-3xl border-border/60">
        <CardHeader>
          <CardTitle>Profile unavailable</CardTitle>
          <CardDescription>
            We couldn&apos;t find a matching user record for your signed-in email.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const displayName = currentUser.name?.trim() || currentUser.email;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-accent to-transparent" />
        <CardHeader className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end">
          <Avatar className="size-20 border-4 border-card shadow-sm">
            {currentUser.avatarUrl ? (
              <AvatarImage src={currentUser.avatarUrl} alt={displayName} />
            ) : null}
            <AvatarFallback className="text-lg">
              {getInitials(currentUser.name, currentUser.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <CardTitle className="font-display text-2xl">{displayName}</CardTitle>
            <CardDescription>{currentUser.email}</CardDescription>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
              <Badge
                variant={currentUser.role === "ADMIN" ? "default" : "secondary"}
                className="rounded-full"
              >
                {currentUser.role === "ADMIN" ? "Admin" : "User"}
              </Badge>
              <span className="text-muted-foreground">
                Member since {new Date(currentUser.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={currentUser.name ?? ""}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-readonly">Email</Label>
              <Input
                id="email-readonly"
                value={currentUser.email}
                readOnly
                className="rounded-xl bg-muted/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={currentUser.bio ?? ""}
                className="rounded-2xl"
              />
            </div>
            {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
            {state.success ? <p className="text-sm text-primary">{state.success}</p> : null}
            <Button type="submit" disabled={pending} className="rounded-full">
              {pending ? "Saving…" : "Save profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-xl">Change password</CardTitle>
          <CardDescription>Update your Supabase Auth password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="rounded-xl"
              />
            </div>
            {passwordError ? <p className="text-sm text-destructive">{passwordError}</p> : null}
            {passwordSuccess ? <p className="text-sm text-primary">{passwordSuccess}</p> : null}
            <Button type="submit" disabled={passwordLoading} className="rounded-full">
              {passwordLoading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Updating…
                </>
              ) : (
                "Update password"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-xl">Preferences</CardTitle>
          <CardDescription>Theme and session controls.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button type="button" variant="outline" className="rounded-full" />}
            >
              <SunIcon className="size-4 dark:hidden" />
              <MoonIcon className="hidden size-4 dark:block" />
              Theme
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-36">
              {THEME_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className="justify-between"
                >
                  {option.label}
                  {theme === option.value ? <CheckIcon className="size-4" /> : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            type="button"
            variant="destructive"
            className="rounded-full"
            onClick={handleSignOut}
          >
            <LogOutIcon className="size-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
