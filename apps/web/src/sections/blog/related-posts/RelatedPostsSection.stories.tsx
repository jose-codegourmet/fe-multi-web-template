import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DEMO_BLOG_POSTS } from "@/constants/demo-content";
import { RelatedPostsSection } from "./RelatedPostsSection";

const meta: Meta<typeof RelatedPostsSection> = {
  title: "Sections/Blog/RelatedPostsSection",
  component: RelatedPostsSection,
  tags: ["autodocs"],
  args: { currentSlug: DEMO_BLOG_POSTS[0].slug },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof RelatedPostsSection>;

export const Default: Story = {};
