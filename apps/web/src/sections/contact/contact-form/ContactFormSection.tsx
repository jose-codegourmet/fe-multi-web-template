"use client";

import {
  Button,
  Checkbox,
  Input,
  Label,
  NativeSelect,
  NativeSelectOption,
  ScrollReveal,
  Textarea,
} from "@fe-template/ui";
import { type FormEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { contactFormSectionDefaultValues } from "./ContactFormSection.defaultvalues";
import type { ContactFormSectionProps } from "./ContactFormSection.schema";

function ContactFormSection({
  className,
  headline = contactFormSectionDefaultValues.headline,
  supporting = contactFormSectionDefaultValues.supporting,
  submitLabel = contactFormSectionDefaultValues.submitLabel,
  successTitle = contactFormSectionDefaultValues.successTitle,
  successMessage = contactFormSectionDefaultValues.successMessage,
  topics = contactFormSectionDefaultValues.topics,
}: ContactFormSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!consent) return;
    setSubmitted(true);
  };

  return (
    <section
      data-slot="contact-form-section"
      className={cn("bg-brand-white px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-semibold text-brand-deep-ink md:text-4xl">
              {headline}
            </h2>
            <p className="mt-3 text-base text-brand-ink-500">{supporting}</p>
          </div>

          {submitted ? (
            <div
              role="status"
              className="rounded-[28px] border border-brand-mint/40 bg-brand-mint/15 px-8 py-12 text-center"
            >
              <p className="font-display text-2xl font-semibold text-brand-deep-ink">
                {successTitle}
              </p>
              <p className="mt-3 text-brand-ink-500">{successMessage}</p>
              <Button
                type="button"
                variant="outline"
                className="mt-6 rounded-full border-brand-ink-200"
                onClick={() => {
                  setSubmitted(false);
                  setConsent(false);
                }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-[28px] border border-brand-ink-200/60 bg-brand-warm-cream/50 p-6 md:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-full-name">Full name</Label>
                  <Input
                    id="contact-full-name"
                    name="fullName"
                    required
                    autoComplete="name"
                    placeholder="Jordan Lee"
                    className="h-10 bg-brand-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-10 bg-brand-white"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="contact-topic">Topic</Label>
                  <NativeSelect
                    id="contact-topic"
                    name="topic"
                    required
                    defaultValue=""
                    className="w-full [&_select]:h-10 [&_select]:bg-brand-white"
                  >
                    <NativeSelectOption value="" disabled>
                      Select a topic
                    </NativeSelectOption>
                    {topics?.map((topic) => (
                      <NativeSelectOption key={topic} value={topic}>
                        {topic}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-pet-name">
                    Pet name <span className="font-normal text-brand-ink-500">(optional)</span>
                  </Label>
                  <Input
                    id="contact-pet-name"
                    name="petName"
                    placeholder="Mochi"
                    className="h-10 bg-brand-white"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="contact-city">
                    City <span className="font-normal text-brand-ink-500">(optional)</span>
                  </Label>
                  <Input
                    id="contact-city"
                    name="city"
                    autoComplete="address-level2"
                    placeholder="Cebu"
                    className="h-10 bg-brand-white"
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label htmlFor="contact-message">Message</Label>
                  <Textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className="min-h-28 bg-brand-white"
                  />
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <Checkbox
                    id="contact-consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked === true)}
                    required
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="contact-consent"
                    className="items-start leading-relaxed font-normal text-brand-ink-500"
                  >
                    I agree to be contacted about this inquiry and accept PawPair&apos;s privacy
                    practices for demo messages.
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={!consent}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white hover:bg-brand-coral/90"
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

export { ContactFormSection };
