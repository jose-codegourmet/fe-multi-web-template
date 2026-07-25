import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PricingPlansSection } from "./PricingPlansSection";

const meta: Meta<typeof PricingPlansSection> = {
  title: "Sections/Pricing/PricingPlansSection",
  component: PricingPlansSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PricingPlansSection>;

export const Default: Story = {};
