import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactFinalCtaSection } from "./ContactFinalCtaSection";

const meta: Meta<typeof ContactFinalCtaSection> = {
  title: "Sections/Contact/ContactFinalCtaSection",
  component: ContactFinalCtaSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ContactFinalCtaSection>;

export const Default: Story = {};
