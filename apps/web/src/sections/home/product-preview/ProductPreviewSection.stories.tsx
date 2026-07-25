import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProductPreviewSection } from "./ProductPreviewSection";

const meta: Meta<typeof ProductPreviewSection> = {
  title: "Sections/Home/ProductPreviewSection",
  component: ProductPreviewSection,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ProductPreviewSection>;

export const Default: Story = {};
