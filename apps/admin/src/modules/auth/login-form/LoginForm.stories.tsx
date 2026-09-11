import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LoginForm } from "./LoginForm";

const meta: Meta<typeof LoginForm> = {
  title: "Admin/Auth/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[min(100%,24rem)]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
