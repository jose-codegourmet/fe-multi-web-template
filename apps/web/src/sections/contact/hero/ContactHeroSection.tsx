import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { cn } from "@/lib/utils";

type ContactHeroSectionProps = {
  className?: string;
};

function ContactHeroSection({ className }: ContactHeroSectionProps) {
  return (
    <section
      data-slot="contact-hero-section"
      className={cn(
        "relative overflow-hidden bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,107,107,0.14),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(114,230,193,0.16),_transparent_50%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl leading-tight font-semibold text-brand-deep-ink md:text-5xl">
            Let&apos;s talk pets, partnerships, or product.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-brand-ink-500 md:text-lg">
            Send a message and choose the topic that best matches what you need.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { ContactHeroSection };
