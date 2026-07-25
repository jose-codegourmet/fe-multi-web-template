import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ValuesSection } from "./ValuesSection";

const meta: Meta<typeof ValuesSection> = {
  title: "Sections/About/ValuesSection",
  component: ValuesSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ValuesSection>;

export const Default: Story = {};
