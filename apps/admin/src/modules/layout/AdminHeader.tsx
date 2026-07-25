"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@fe-template/ui";
import {
  BellIcon,
  CheckIcon,
  HelpCircleIcon,
  LogOutIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { getInitials, useCurrentUser } from "@/hooks/use-current-user";
import { createClient } from "@/lib/supabase/client";
import { SidebarTrigger } from "@/modules/layout/sidebar/Sidebar";

type AdminHeaderProps = {
  title: string;
};

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export function AdminHeader({ title }: AdminHeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { data: currentUser } = useCurrentUser();
  const displayName = currentUser?.name?.trim() || currentUser?.email || "Admin";

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger />
      <h1 className="hidden text-lg font-semibold tracking-tight sm:block">{title}</h1>
      <div className="relative ml-auto w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search records, pets, or users..."
          className="h-10 rounded-full bg-muted/50 pl-9"
          aria-label="Search records, pets, or users"
          readOnly
        />
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Notifications"
        className="rounded-full"
      >
        <BellIcon className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Help"
        className="rounded-full"
        render={<a href="mailto:support@pawpair.example" />}
      >
        <HelpCircleIcon className="size-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button type="button" variant="ghost" size="icon-sm" aria-label="Select theme" />}
        >
          <SunIcon className="size-4 dark:hidden" />
          <MoonIcon className="hidden size-4 dark:block" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-36">
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
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Account menu"
              className="rounded-full"
            />
          }
        >
          <Avatar size="sm" className="size-8">
            {currentUser?.avatarUrl ? (
              <AvatarImage src={currentUser.avatarUrl} alt={displayName} />
            ) : null}
            <AvatarFallback>{getInitials(currentUser?.name, currentUser?.email)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem render={<Link href="/profile" />}>
            <UserIcon className="size-4" />
            View profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOutIcon className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
