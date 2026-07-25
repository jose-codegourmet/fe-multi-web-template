import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FinalCtaSection } from "./FinalCtaSection";

const meta: Meta<typeof FinalCtaSection> = {
  title: "Sections/Home/FinalCtaSection",
  component: FinalCtaSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof FinalCtaSection>;

export const Default: Story = {};
