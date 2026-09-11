import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StatusBadge } from "./status-badge";

const meta: Meta<typeof StatusBadge> = {
  title: "Admin/Users/StatusBadge",
  component: StatusBadge,
  tags: ["autodocs"],
  args: {
    status: "VERIFIED",
  },
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const Verified: Story = {};

export const Pending: Story = {
  args: { status: "PENDING" },
};

export const Deactivated: Story = {
  args: { status: "DEACTIVATED" },
};

export const Mock: Story = {
  args: { status: "MOCK" },
};

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <StatusBadge status="PENDING" />
      <StatusBadge status="VERIFIED" />
      <StatusBadge status="DEACTIVATED" />
      <StatusBadge status="MOCK" />
    </div>
  ),
};
