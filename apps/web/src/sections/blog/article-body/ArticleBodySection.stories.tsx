import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DEMO_BLOG_POSTS } from "@/constants/demo-content";
import { ArticleBodySection } from "./ArticleBodySection";

const meta: Meta<typeof ArticleBodySection> = {
  title: "Sections/Blog/ArticleBodySection",
  component: ArticleBodySection,
  tags: ["autodocs"],
  args: { post: DEMO_BLOG_POSTS[0] },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ArticleBodySection>;

export const Default: Story = {};
