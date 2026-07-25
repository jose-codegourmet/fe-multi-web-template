import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PricingPreviewSection } from "./PricingPreviewSection";

const meta: Meta<typeof PricingPreviewSection> = {
  title: "Sections/Home/PricingPreviewSection",
  component: PricingPreviewSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PricingPreviewSection>;

export const Default: Story = {};
