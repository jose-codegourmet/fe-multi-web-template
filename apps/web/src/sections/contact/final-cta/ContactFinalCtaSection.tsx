import Link from "next/link";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type ContactFinalCtaSectionProps = {
  className?: string;
};

function ContactFinalCtaSection({ className }: ContactFinalCtaSectionProps) {
  return (
    <section
      data-slot="contact-final-cta-section"
      className={cn(
        "relative overflow-hidden bg-brand-deep-ink px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,107,107,0.22),_transparent_60%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold text-brand-white md:text-4xl">
            Looking for a playmate instead?
          </h2>
          <p className="mt-4 text-base text-brand-soft-white/80 md:text-lg">
            Create a free pet profile and start discovering compatible companions nearby.
          </p>
          <Link
            href={ROUTES.createProfile}
            className="mt-8 inline-flex h-10 items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white hover:bg-brand-coral/90"
          >
            Start matching
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { ContactFinalCtaSection };
