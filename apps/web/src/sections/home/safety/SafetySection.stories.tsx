import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SafetySection } from "./SafetySection";

const meta: Meta<typeof SafetySection> = {
  title: "Sections/Home/SafetySection",
  component: SafetySection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SafetySection>;

export const Default: Story = {};
