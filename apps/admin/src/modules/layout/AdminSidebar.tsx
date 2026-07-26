"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@fe-template/ui";
import {
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  MailIcon,
  MessageSquareQuoteIcon,
  PawPrintIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getInitials, useCurrentUser } from "@/hooks/use-current-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/modules/layout/sidebar/Sidebar";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/users", label: "Users", icon: UsersIcon },
  { href: "/pets", label: "Pets", icon: PawPrintIcon },
  { href: "/posts", label: "Blog", icon: FileTextIcon },
  { href: "/pricing-plans", label: "Pricing", icon: CreditCardIcon },
  { href: "/testimonials", label: "Testimonials", icon: MessageSquareQuoteIcon },
  { href: "/contacts", label: "Contacts", icon: MailIcon },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: currentUser } = useCurrentUser();
  const displayName = currentUser?.name?.trim() || currentUser?.email || "Admin";
  const roleLabel = currentUser?.role === "ADMIN" ? "Admin" : "User";

  return (
    <Sidebar collapsible="icon" className="bg-sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <PawPrintIcon className="size-5 shrink-0 text-primary" />
          <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
            PawPair Admin
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive =
                  href === "/"
                    ? pathname === "/"
                    : pathname === href || pathname.startsWith(`${href}/`);

                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={label}
                      className="data-[active=true]:shadow-sm"
                      render={<Link href={href} />}
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Profile"
              render={<Link href="/profile" />}
              className="gap-3"
            >
              <Avatar size="sm" className="size-8">
                {currentUser?.avatarUrl ? (
                  <AvatarImage src={currentUser.avatarUrl} alt={displayName} />
                ) : null}
                <AvatarFallback>
                  {getInitials(currentUser?.name, currentUser?.email)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">{roleLabel}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
