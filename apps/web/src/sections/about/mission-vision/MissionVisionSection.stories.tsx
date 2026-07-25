import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MissionVisionSection } from "./MissionVisionSection";

const meta: Meta<typeof MissionVisionSection> = {
  title: "Sections/About/MissionVisionSection",
  component: MissionVisionSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof MissionVisionSection>;

export const Default: Story = {};
