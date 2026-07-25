import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommunityCommitmentSection } from "./CommunityCommitmentSection";

const meta: Meta<typeof CommunityCommitmentSection> = {
  title: "Sections/About/CommunityCommitmentSection",
  component: CommunityCommitmentSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof CommunityCommitmentSection>;

export const Default: Story = {};
