import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlogNewsletterSection } from "./BlogNewsletterSection";
import { blogNewsletterSectionDefaultValues } from "./BlogNewsletterSection.defaultvalues";

const meta: Meta<typeof BlogNewsletterSection> = {
  title: "Sections/Blog/BlogNewsletterSection",
  component: BlogNewsletterSection,
  tags: ["autodocs"],
  args: { ...blogNewsletterSectionDefaultValues },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof BlogNewsletterSection>;

export const Default: Story = {};

export const CustomCopy: Story = {
  args: {
    headline: "Stay in the loop",
    supporting: "Occasional tips for safer meetups and happier walks.",
    submitLabel: "Join the list",
  },
};
