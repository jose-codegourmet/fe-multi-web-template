import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TeamSection } from "./TeamSection";

const meta: Meta<typeof TeamSection> = {
  title: "Sections/About/TeamSection",
  component: TeamSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TeamSection>;

export const Default: Story = {};
