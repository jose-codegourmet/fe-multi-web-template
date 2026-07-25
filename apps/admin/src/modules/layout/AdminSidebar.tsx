"use client";

import {
  FileTextIcon,
  LayoutDashboardIcon,
  MailIcon,
  MessageSquareQuoteIcon,
  PawPrintIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
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
  { href: "/posts", label: "Posts", icon: FileTextIcon },
  { href: "/testimonials", label: "Testimonials", icon: MessageSquareQuoteIcon },
  { href: "/contacts", label: "Contacts", icon: MailIcon },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
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
    </Sidebar>
  );
}
