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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Textarea,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CheckIcon, Loader2Icon, LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getInitials, useCurrentUser } from "@/hooks/use-current-user/client";
import { currentUserQueryKey } from "@/hooks/use-current-user/query";
import { createClient } from "@/lib/supabase/client";
import { updatePassword, updateProfile } from "../actions";
import { getProfileDefaultValues, profilePasswordDefaultValues } from "./ProfileForm.defaults";
import {
  type ProfileFormValues,
  type ProfilePasswordValues,
  profileFormSchema,
  profilePasswordSchema,
} from "./ProfileForm.schema";

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export function ProfileForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { data: currentUser, isLoading } = useCurrentUser();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: getProfileDefaultValues(currentUser),
  });

  const passwordForm = useForm<ProfilePasswordValues>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: profilePasswordDefaultValues,
  });

  useEffect(() => {
    if (currentUser) {
      profileForm.reset(getProfileDefaultValues(currentUser));
    }
  }, [currentUser, profileForm]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  async function onProfileSubmit(values: ProfileFormValues) {
    const result = await updateProfile(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    await queryClient.invalidateQueries({ queryKey: currentUserQueryKey.current() });
  }

  async function onPasswordSubmit(values: ProfilePasswordValues) {
    const result = await updatePassword(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(result.message);
    passwordForm.reset(profilePasswordDefaultValues);
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
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input id="name" className="rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label htmlFor="email-readonly">Email</Label>
                <Input
                  id="email-readonly"
                  value={currentUser.email}
                  readOnly
                  className="rounded-xl bg-muted/50"
                />
              </div>
              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea id="bio" rows={4} className="rounded-2xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={profileForm.formState.isSubmitting}
                className="rounded-full"
              >
                {profileForm.formState.isSubmitting ? "Saving…" : "Save profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-xl">Change password</CardTitle>
          <CardDescription>Update your Supabase Auth password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
                className="rounded-full"
              >
                {passwordForm.formState.isSubmitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Updating…
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          </Form>
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
