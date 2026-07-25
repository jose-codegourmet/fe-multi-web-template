import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { UseCasesSection } from "./UseCasesSection";

const meta: Meta<typeof UseCasesSection> = {
  title: "Sections/Home/UseCasesSection",
  component: UseCasesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof UseCasesSection>;

export const Default: Story = {};
