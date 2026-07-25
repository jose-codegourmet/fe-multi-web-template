import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PricingComparisonSection } from "./PricingComparisonSection";

const meta: Meta<typeof PricingComparisonSection> = {
  title: "Sections/Pricing/PricingComparisonSection",
  component: PricingComparisonSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PricingComparisonSection>;

export const Default: Story = {};
