"use client";

import { type FormEvent, useState } from "react";
import { Button } from "@/components/button/Button";
import { Input } from "@/components/input/Input";
import { Label } from "@/components/label/Label";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { cn } from "@/lib/utils";
import { blogNewsletterSectionDefaultValues } from "./BlogNewsletterSection.defaultvalues";
import type { BlogNewsletterSectionProps } from "./BlogNewsletterSection.schema";

function BlogNewsletterSection({
  className,
  headline = blogNewsletterSectionDefaultValues.headline,
  supporting = blogNewsletterSectionDefaultValues.supporting,
  placeholder = blogNewsletterSectionDefaultValues.placeholder,
  submitLabel = blogNewsletterSectionDefaultValues.submitLabel,
  successTitle = blogNewsletterSectionDefaultValues.successTitle,
  successMessage = blogNewsletterSectionDefaultValues.successMessage,
}: BlogNewsletterSectionProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      data-slot="blog-newsletter-section"
      className={cn(
        "relative overflow-hidden bg-brand-deep-ink px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(121,199,255,0.2),_transparent_55%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-semibold text-brand-white md:text-4xl">
            {headline}
          </h2>
          <p className="mt-3 text-base text-brand-soft-white/80">{supporting}</p>

          {submitted ? (
            <div
              role="status"
              className="mt-8 rounded-[28px] border border-brand-mint/30 bg-brand-mint/10 px-6 py-8"
            >
              <p className="font-display text-xl font-semibold text-brand-white">{successTitle}</p>
              <p className="mt-2 text-sm text-brand-soft-white/80">{successMessage}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end"
            >
              <div className="flex flex-1 flex-col gap-2 text-left">
                <Label htmlFor="blog-newsletter-email" className="text-brand-soft-white">
                  Email
                </Label>
                <Input
                  id="blog-newsletter-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={placeholder}
                  className="h-10 border-brand-ink-200/30 bg-brand-night-elevated text-brand-white placeholder:text-brand-soft-white/50"
                />
              </div>
              <Button
                type="submit"
                className="inline-flex h-10 items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white hover:bg-brand-coral/90 sm:shrink-0"
              >
                {submitLabel}
              </Button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}

export { BlogNewsletterSection };
