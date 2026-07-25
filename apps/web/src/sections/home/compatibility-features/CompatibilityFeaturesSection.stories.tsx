import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CompatibilityFeaturesSection } from "./CompatibilityFeaturesSection";

const meta: Meta<typeof CompatibilityFeaturesSection> = {
  title: "Sections/Home/CompatibilityFeaturesSection",
  component: CompatibilityFeaturesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof CompatibilityFeaturesSection>;

export const Default: Story = {};
