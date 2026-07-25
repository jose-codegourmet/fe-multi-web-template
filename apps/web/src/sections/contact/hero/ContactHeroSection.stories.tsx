import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactHeroSection } from "./ContactHeroSection";

const meta: Meta<typeof ContactHeroSection> = {
  title: "Sections/Contact/ContactHeroSection",
  component: ContactHeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ContactHeroSection>;

export const Default: Story = {};
