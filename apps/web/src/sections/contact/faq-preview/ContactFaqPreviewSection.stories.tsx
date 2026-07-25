import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactFaqPreviewSection } from "./ContactFaqPreviewSection";

const meta: Meta<typeof ContactFaqPreviewSection> = {
  title: "Sections/Contact/ContactFaqPreviewSection",
  component: ContactFaqPreviewSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ContactFaqPreviewSection>;

export const Default: Story = {};
