import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlogFiltersSection } from "./BlogFiltersSection";

const meta: Meta<typeof BlogFiltersSection> = {
  title: "Sections/Blog/BlogFiltersSection",
  component: BlogFiltersSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BlogFiltersSection>;

export const Default: Story = {};
