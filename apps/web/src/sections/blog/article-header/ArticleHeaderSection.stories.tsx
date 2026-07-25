import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DEMO_BLOG_POSTS } from "@/constants/demo-content";
import { ArticleHeaderSection } from "./ArticleHeaderSection";

const meta: Meta<typeof ArticleHeaderSection> = {
  title: "Sections/Blog/ArticleHeaderSection",
  component: ArticleHeaderSection,
  tags: ["autodocs"],
  args: { post: DEMO_BLOG_POSTS[0] },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ArticleHeaderSection>;

export const Default: Story = {};
