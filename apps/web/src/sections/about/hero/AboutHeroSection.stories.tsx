import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AboutHeroSection } from "./AboutHeroSection";

const meta: Meta<typeof AboutHeroSection> = {
  title: "Sections/About/AboutHeroSection",
  component: AboutHeroSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AboutHeroSection>;

export const Default: Story = {};
