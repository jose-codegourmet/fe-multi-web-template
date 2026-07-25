import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactFormSection } from "./ContactFormSection";
import { contactFormSectionDefaultValues } from "./ContactFormSection.defaultvalues";

const meta: Meta<typeof ContactFormSection> = {
  title: "Sections/Contact/ContactFormSection",
  component: ContactFormSection,
  tags: ["autodocs"],
  args: { ...contactFormSectionDefaultValues },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ContactFormSection>;

export const Default: Story = {};

export const CustomCopy: Story = {
  args: {
    headline: "Partner with PawPair",
    supporting: "Tell us about your shelter, rescue, or community group.",
    submitLabel: "Submit partnership inquiry",
  },
};
