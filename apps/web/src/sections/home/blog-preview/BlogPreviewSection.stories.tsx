import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlogPreviewSection } from "./BlogPreviewSection";

const meta: Meta<typeof BlogPreviewSection> = {
  title: "Sections/Home/BlogPreviewSection",
  component: BlogPreviewSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BlogPreviewSection>;

export const Default: Story = {};
