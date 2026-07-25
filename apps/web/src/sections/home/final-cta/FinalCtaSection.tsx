import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/button/Button";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type FinalCtaSectionProps = {
  className?: string;
};

function FinalCtaSection({ className }: FinalCtaSectionProps) {
  return (
    <section
      data-slot="final-cta-section"
      className={cn("relative overflow-hidden px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="absolute inset-0">
        <Image
          src="/images/community/final-cta-happy-match.jpg"
          alt="Happy pets and humans after a successful match"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        <div aria-hidden className="absolute inset-0 bg-brand-deep-ink/70 mix-blend-multiply" />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-brand-deep-ink/80 via-brand-deep-ink/50 to-brand-deep-ink/40"
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <p className="text-sm font-medium tracking-wide text-brand-yellow uppercase">
            Ready when they are
          </p>
          <h2 className="font-display text-3xl font-semibold text-white md:text-5xl">
            Meet the right kind of wild.
          </h2>
          <p className="max-w-lg text-base text-white/85 md:text-lg">
            Create a free profile and start discovering compatible pets near you.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={ROUTES.createProfile}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-xl bg-brand-coral px-5 text-white hover:bg-brand-coral/90",
              )}
            >
              Create a pet profile
            </Link>
            <Link
              href={ROUTES.pricing}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 rounded-xl border-white/40 bg-transparent px-5 text-white hover:bg-white/10",
              )}
            >
              View pricing
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { FinalCtaSection };
