"use client";

import { Button } from "@fe-template/ui";
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { SidebarTrigger } from "@/modules/layout/sidebar/Sidebar";

type AdminHeaderProps = {
  title: string;
};

export function AdminHeader({ title }: AdminHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <h1 className="flex-1 text-lg font-semibold tracking-tight">{title}</h1>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Toggle theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <SunIcon className="size-4 dark:hidden" />
        <MoonIcon className="hidden size-4 dark:block" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Sign out"
        onClick={handleSignOut}
      >
        <LogOutIcon className="size-4" />
      </Button>
    </header>
  );
}
