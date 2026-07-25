"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  ScrollReveal,
} from "@fe-template/ui";
import { cn } from "@/lib/utils";

const eyebrow = "FAQ";
const headline = "Questions about plans and pricing.";
const supporting = "Straight answers so you can pick a plan with confidence.";
const faqs = [
  {
    question: "Can I use PawPair for free?",
    answer:
      "Yes. The Free plan lets you create a meaningful pet profile, discover nearby companions, match, and chat—without paying. Paid plans add convenience and visibility when you need them.",
  },
  {
    question: "Is PawPair for dogs only?",
    answer:
      "No. PawPair welcomes dogs, cats, and other pets. Profiles and filters help you find companions who match energy, play style, and comfort level—whatever species you share life with.",
  },
  {
    question: "Can I create profiles for multiple pets?",
    answer:
      "Free and Plus include one pet profile. Pack supports up to four pet profiles, which is ideal for multi-pet households and community hosts.",
  },
  {
    question: "Does PawPair verify every user?",
    answer:
      "Verification helps build trust, but not every profile is verified on day one. We surface verification status clearly and pair it with reporting tools, meetup guidance, and community standards.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel a paid subscription at any time. You keep access through the end of your current billing period, then return to Free features.",
  },
  {
    question: "Is PawPair intended for breeding?",
    answer:
      "No. PawPair is built for friendships and community—not breeding. Profiles and tools are designed around playdates, walks, and responsible local connections.",
  },
  {
    question: "How does the compatibility score work?",
    answer:
      "Compatibility considers signals like energy level, size preferences, play style, and distance. It is a helpful guide for introductions—not a guarantee—and humans always stay in control of who to meet.",
  },
  {
    question: "Are subscriptions charged monthly?",
    answer:
      "Yes. Plus and Pack are billed monthly at the listed demo prices. You can upgrade, downgrade, or cancel from account settings whenever you are ready.",
  },
];

type PricingFaqSectionProps = {
  className?: string;
};

function PricingFaqSection({ className }: PricingFaqSectionProps) {
  return (
    <section
      data-slot="pricing-faq-section"
      className={cn("bg-background px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">{eyebrow}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-semibold text-brand-deep-ink md:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-ink-500 md:text-lg">
            {supporting}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <Accordion className="rounded-2xl bg-brand-warm-cream/50 px-4 py-2 ring-1 ring-brand-ink-200/30 md:px-6">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="py-4 font-display text-base font-semibold text-brand-deep-ink hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-sm leading-relaxed text-brand-ink-500 md:text-[0.9375rem]">
                  <p>{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { PricingFaqSection };
