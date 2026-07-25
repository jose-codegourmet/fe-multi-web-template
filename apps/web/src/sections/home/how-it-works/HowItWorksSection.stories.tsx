import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorksSection } from "./HowItWorksSection";

const meta: Meta<typeof HowItWorksSection> = {
  title: "Sections/Home/HowItWorksSection",
  component: HowItWorksSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof HowItWorksSection>;

export const Default: Story = {};
