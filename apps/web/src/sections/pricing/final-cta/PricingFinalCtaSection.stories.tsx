import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PricingFinalCtaSection } from "./PricingFinalCtaSection";

const meta: Meta<typeof PricingFinalCtaSection> = {
  title: "Sections/Pricing/PricingFinalCtaSection",
  component: PricingFinalCtaSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PricingFinalCtaSection>;

export const Default: Story = {};
