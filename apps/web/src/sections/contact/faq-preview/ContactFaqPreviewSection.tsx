import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/accordion/Accordion";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type ContactFaqPreviewSectionProps = {
  className?: string;
};

const FAQS = [
  {
    question: "How fast do you reply?",
    answer:
      "Most demo inquiries get a response within one to two business days. Safety reports are prioritized.",
  },
  {
    question: "Can shelters and rescues partner with PawPair?",
    answer:
      "Yes. Choose “Shelter or rescue partnership” in the form, or email partners@pawpair.example with your organization details.",
  },
  {
    question: "Where should I send a press request?",
    answer:
      "Use the Press and media topic, or write to press@pawpair.example for interviews and brand assets.",
  },
  {
    question: "Is PawPair free to start?",
    answer:
      "Yes—creating a pet profile is free. Plus and Pack unlock more discovery tools. See pricing for the full comparison.",
  },
] as const;

function ContactFaqPreviewSection({ className }: ContactFaqPreviewSectionProps) {
  return (
    <section
      data-slot="contact-faq-preview-section"
      className={cn("bg-brand-white px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <ScrollReveal>
            <h2 className="font-display text-3xl font-semibold text-brand-deep-ink md:text-4xl">
              Quick answers before you write
            </h2>
            <p className="mt-3 text-base text-brand-ink-500">
              A few questions we hear often. For plan details, visit the pricing FAQ.
            </p>
            <Link
              href={`${ROUTES.pricing}#faq`}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white hover:bg-brand-coral/90"
            >
              See pricing FAQ
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <Accordion className="rounded-[28px] border border-brand-ink-200/60 bg-brand-warm-cream/40 px-5">
              {FAQS.map((faq, index) => (
                <AccordionItem key={faq.question} value={`faq-${index}`}>
                  <AccordionTrigger className="py-4 font-display text-base text-brand-deep-ink hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-brand-ink-500">
                    <p>{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export { ContactFaqPreviewSection };
