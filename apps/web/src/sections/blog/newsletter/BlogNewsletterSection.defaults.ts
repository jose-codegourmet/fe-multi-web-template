import type { BlogNewsletterSectionProps } from "./BlogNewsletterSection.schema";

export const blogNewsletterSectionDefaultValues: Partial<BlogNewsletterSectionProps> = {
  headline: "Subscribe for pet tips",
  supporting:
    "Get occasional guides on first meetups, play signals, and neighborhood walks—no spam, just useful notes.",
  placeholder: "you@example.com",
  submitLabel: "Subscribe",
  successTitle: "You're on the list",
  successMessage: "Thanks for joining. Watch your inbox for the next PawPair tip.",
};
