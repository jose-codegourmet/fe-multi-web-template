import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleGridSection } from "./ArticleGridSection";

const meta: Meta<typeof ArticleGridSection> = {
  title: "Sections/Blog/ArticleGridSection",
  component: ArticleGridSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ArticleGridSection>;

export const Default: Story = {};
