import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PricingHeroSection } from "./PricingHeroSection";

const meta: Meta<typeof PricingHeroSection> = {
  title: "Sections/Pricing/PricingHeroSection",
  component: PricingHeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof PricingHeroSection>;

export const Default: Story = {};
