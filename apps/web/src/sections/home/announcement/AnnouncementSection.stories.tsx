import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AnnouncementSection } from "./AnnouncementSection";

const meta: Meta<typeof AnnouncementSection> = {
  title: "Sections/Home/AnnouncementSection",
  component: AnnouncementSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AnnouncementSection>;

export const Default: Story = {};
