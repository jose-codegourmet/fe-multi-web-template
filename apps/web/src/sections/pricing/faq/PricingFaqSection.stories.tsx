import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PricingFaqSection } from "./PricingFaqSection";

const meta: Meta<typeof PricingFaqSection> = {
  title: "Sections/Pricing/PricingFaqSection",
  component: PricingFaqSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PricingFaqSection>;

export const Default: Story = {};
