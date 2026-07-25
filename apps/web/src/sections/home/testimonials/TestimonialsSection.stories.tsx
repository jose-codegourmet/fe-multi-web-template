import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TestimonialsSection } from "./TestimonialsSection";

const meta: Meta<typeof TestimonialsSection> = {
  title: "Sections/Home/TestimonialsSection",
  component: TestimonialsSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TestimonialsSection>;

export const Default: Story = {};
