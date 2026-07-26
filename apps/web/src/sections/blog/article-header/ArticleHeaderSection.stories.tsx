import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleHeaderSection } from "./ArticleHeaderSection";

const samplePost = {
  slug: "planning-a-first-pet-meetup",
  title: "How to plan a low-stress first pet meetup",
  excerpt: "A practical checklist for choosing the right place, timing, and expectations.",
  category: "First Meetups",
  publishedAt: "2026-03-12",
  readingTime: "3 min",
  author: {
    name: "Aya Santos",
    role: "Community Experience Lead",
    avatar: "/images/brand/logo-pawpair-icon.png",
  },
  image: "/images/blog/blog-first-meetup.jpg",
  body: [],
};

const meta: Meta<typeof ArticleHeaderSection> = {
  title: "Sections/Blog/ArticleHeaderSection",
  component: ArticleHeaderSection,
  tags: ["autodocs"],
  args: { post: samplePost },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ArticleHeaderSection>;

export const Default: Story = {};
