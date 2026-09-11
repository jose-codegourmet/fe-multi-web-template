import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { currentUserQueryKey } from "@/hooks/use-current-user/query";
import type { CurrentUser } from "@/hooks/use-current-user/types";
import { SidebarProvider } from "@/modules/layout/sidebar/Sidebar";
import { SeededQueryProvider } from "@/storybook/seeded-query";
import { AdminHeader } from "./AdminHeader";

const storyAdmin: CurrentUser = {
  email: "ada@pawpair.example",
  name: "Ada Admin",
  avatarUrl: null,
  role: "ADMIN",
  bio: null,
  createdAt: "2026-01-15T00:00:00.000Z",
};

const meta: Meta<typeof AdminHeader> = {
  title: "Admin/Layout/AdminHeader",
  component: AdminHeader,
  tags: ["autodocs"],
  args: {
    title: "Users",
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <SeededQueryProvider
        seed={(client) => {
          client.setQueryData(currentUserQueryKey.current(), storyAdmin);
        }}
      >
        <SidebarProvider>
          <Story />
        </SidebarProvider>
      </SeededQueryProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AdminHeader>;

export const Default: Story = {};

export const DashboardTitle: Story = {
  args: {
    title: "Dashboard",
  },
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
};
