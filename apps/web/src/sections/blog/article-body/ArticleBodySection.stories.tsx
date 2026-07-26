import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArticleBodySection } from "./ArticleBodySection";

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
  body: [
    "A first meetup goes better when both pets and humans know what to expect.",
    "Bring treats, keep leashes on for the first greeting, and leave room to pause.",
  ],
};

const meta: Meta<typeof ArticleBodySection> = {
  title: "Sections/Blog/ArticleBodySection",
  component: ArticleBodySection,
  tags: ["autodocs"],
  args: { post: samplePost },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ArticleBodySection>;

export const Default: Story = {};
