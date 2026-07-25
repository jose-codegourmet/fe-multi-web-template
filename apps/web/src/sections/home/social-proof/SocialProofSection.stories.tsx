import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SocialProofSection } from "./SocialProofSection";

const meta: Meta<typeof SocialProofSection> = {
  title: "Sections/Home/SocialProofSection",
  component: SocialProofSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SocialProofSection>;

export const Default: Story = {};
