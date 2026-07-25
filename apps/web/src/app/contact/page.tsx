import type { Metadata } from "next";
import { PAGE_SEO } from "@/constants/seo";
import { ContactFormSection } from "@/sections/contact/contact-form/ContactFormSection";
import { ContactOptionsSection } from "@/sections/contact/contact-options/ContactOptionsSection";
import { ContactFaqPreviewSection } from "@/sections/contact/faq-preview/ContactFaqPreviewSection";
import { ContactFinalCtaSection } from "@/sections/contact/final-cta/ContactFinalCtaSection";
import { ContactHeroSection } from "@/sections/contact/hero/ContactHeroSection";

export const metadata: Metadata = {
  title: PAGE_SEO.contact.title,
  description: PAGE_SEO.contact.description,
};

export default function ContactPage() {
  return (
    <>
      <ContactHeroSection />
      <ContactFormSection />
      <ContactOptionsSection />
      <ContactFaqPreviewSection />
      <ContactFinalCtaSection />
    </>
  );
}
