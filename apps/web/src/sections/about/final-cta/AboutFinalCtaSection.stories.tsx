import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AboutFinalCtaSection } from "./AboutFinalCtaSection";

const meta: Meta<typeof AboutFinalCtaSection> = {
  title: "Sections/About/AboutFinalCtaSection",
  component: AboutFinalCtaSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AboutFinalCtaSection>;

export const Default: Story = {};
