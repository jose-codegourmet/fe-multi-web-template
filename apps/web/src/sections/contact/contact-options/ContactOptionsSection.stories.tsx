import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactOptionsSection } from "./ContactOptionsSection";

const meta: Meta<typeof ContactOptionsSection> = {
  title: "Sections/Contact/ContactOptionsSection",
  component: ContactOptionsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ContactOptionsSection>;

export const Default: Story = {};
