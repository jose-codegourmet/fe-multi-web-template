import type { ContactFormSectionProps } from "./ContactFormSection.schema";

export const contactFormSectionDefaultValues: Partial<ContactFormSectionProps> = {
  headline: "Send us a message",
  supporting:
    "We read every note. Choose a topic so we can route your message to the right teammate.",
  submitLabel: "Send message",
  successTitle: "Message sent",
  successMessage: "Thanks for reaching out. A PawPair teammate will reply as soon as we can.",
  topics: [
    "General question",
    "Account support",
    "Safety concern",
    "Community partnership",
    "Shelter or rescue partnership",
    "Press and media",
    "Product feedback",
  ],
};
