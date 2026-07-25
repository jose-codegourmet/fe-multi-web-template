import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OriginStorySection } from "./OriginStorySection";

const meta: Meta<typeof OriginStorySection> = {
  title: "Sections/About/OriginStorySection",
  component: OriginStorySection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof OriginStorySection>;

export const Default: Story = {};
