import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlogHeroSection } from "./BlogHeroSection";

const meta: Meta<typeof BlogHeroSection> = {
  title: "Sections/Blog/BlogHeroSection",
  component: BlogHeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BlogHeroSection>;

export const Default: Story = {};
