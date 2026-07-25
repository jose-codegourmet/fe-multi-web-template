import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CalendarIcon, HomeIcon, SettingsIcon, UsersIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const menuItems = [
  { title: "Home", icon: HomeIcon },
  { title: "Matches", icon: UsersIcon },
  { title: "Events", icon: CalendarIcon },
  { title: "Settings", icon: SettingsIcon },
];

function SidebarDemo({ variant = "sidebar" as const, collapsible = "offcanvas" as const }) {
  return (
    <SidebarProvider>
      <Sidebar variant={variant} collapsible={collapsible}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>PawPair</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.title === "Home"}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <span className="font-medium">Dashboard</span>
        </header>
        <main className="p-6">
          <p className="text-sm text-muted-foreground">
            Main content area alongside the collapsible sidebar.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export const Default: Story = {
  render: () => <SidebarDemo />,
};

export const Floating: Story = {
  render: () => <SidebarDemo variant="floating" />,
};

export const IconCollapsible: Story = {
  render: () => <SidebarDemo collapsible="icon" />,
};
