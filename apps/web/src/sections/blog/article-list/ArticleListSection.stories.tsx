import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleListSection } from "./ArticleListSection";

const meta: Meta<typeof ArticleListSection> = {
  title: "Sections/Blog/ArticleListSection",
  component: ArticleListSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ArticleListSection>;

export const Default: Story = {};
