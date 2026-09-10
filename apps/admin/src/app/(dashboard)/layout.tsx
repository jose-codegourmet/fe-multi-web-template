"use client";

import { usePathname } from "next/navigation";
import { AdminHeader } from "@/modules/layout/AdminHeader";
import { AdminSidebar } from "@/modules/layout/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/modules/layout/sidebar/Sidebar";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/users": "Users",
  "/pets": "Pets",
  "/posts": "Blog",
  "/posts/new": "New post",
  "/testimonials": "Testimonials",
  "/pricing-plans": "Pricing",
  "/contacts": "Contacts",
  "/profile": "Profile",
};

function resolveTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/users/")) return "User detail";
  if (pathname.startsWith("/posts/")) return "Edit post";
  return "Admin";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader title={title} />
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
