import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeaturedArticleSection } from "./FeaturedArticleSection";

const meta: Meta<typeof FeaturedArticleSection> = {
  title: "Sections/Blog/FeaturedArticleSection",
  component: FeaturedArticleSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof FeaturedArticleSection>;

export const Default: Story = {};
