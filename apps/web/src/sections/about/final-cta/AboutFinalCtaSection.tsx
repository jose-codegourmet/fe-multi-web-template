import { ScrollReveal } from "@fe-template/ui";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const headline = "Help us build better local packs.";
const supporting =
  "Whether you are creating a profile, partnering with us, or just saying hello—we would love to hear from you.";
const ctas = [
  { label: "Join PawPair", href: ROUTES.createProfile, variant: "primary" as const },
  { label: "Partner with us", href: ROUTES.contact, variant: "secondary" as const },
  { label: "Contact the team", href: ROUTES.contact, variant: "ghost" as const },
];

const ctaClassName = {
  primary:
    "inline-flex h-10 items-center justify-center rounded-full bg-brand-coral px-5 text-sm font-medium text-white hover:bg-brand-coral/90",
  secondary:
    "inline-flex h-10 items-center justify-center rounded-full border border-brand-ink-200 bg-brand-white px-5 text-sm font-medium text-brand-deep-ink hover:bg-brand-cream-200",
  ghost:
    "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium text-brand-deep-ink underline-offset-4 hover:underline",
} as const;

type AboutFinalCtaSectionProps = {
  className?: string;
};

function AboutFinalCtaSection({ className }: AboutFinalCtaSectionProps) {
  return (
    <section
      data-slot="about-final-cta-section"
      className={cn(
        "relative overflow-hidden bg-brand-deep-ink px-4 py-16 md:px-8 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,107,107,0.22),_transparent_60%)]"
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <ScrollReveal className="mx-auto max-w-2xl">
          <h2 className="font-display text-3xl leading-tight font-semibold text-brand-white md:text-4xl">
            {headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-ink-200 md:text-lg">
            {supporting}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {ctas.map((cta) => (
              <Link key={cta.label} href={cta.href} className={ctaClassName[cta.variant]}>
                {cta.label}
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { AboutFinalCtaSection };
