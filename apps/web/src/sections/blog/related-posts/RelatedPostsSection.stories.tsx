import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { RelatedPostsSection } from "./RelatedPostsSection";

const sampleSlug = "planning-a-first-pet-meetup";

const meta: Meta<typeof RelatedPostsSection> = {
  title: "Sections/Blog/RelatedPostsSection",
  component: RelatedPostsSection,
  tags: ["autodocs"],
  args: { currentSlug: sampleSlug },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof RelatedPostsSection>;

export const Default: Story = {};
