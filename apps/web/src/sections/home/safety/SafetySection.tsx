import { buttonVariants, ScrollReveal } from "@fe-template/ui";
import { Check } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

type SafetySectionProps = {
  className?: string;
};

const CHECKLIST = [
  "Profile verification",
  "Owner-controlled messaging",
  "Public meetup suggestions",
  "Block and report tools",
  "Clear pet behavior notes",
  "Community guidelines",
  "Optional vaccination-status field",
  "Meetup checklists",
];

function SafetySection({ className }: SafetySectionProps) {
  return (
    <section
      id="safety"
      data-slot="safety-section"
      className={cn("bg-brand-white px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <ScrollReveal>
          <SectionImage
            src="/images/features/safety-public-meetup.jpg"
            alt="Pet parents meeting safely in a public park"
            className="aspect-[4/5] w-full md:aspect-[5/6]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-medium tracking-wide text-brand-coral uppercase">
              Designed for responsible introductions
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold text-brand-deep-ink md:text-4xl">
              Meet with more context and less guesswork.
            </h2>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-brand-ink-700">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-mint/30 text-brand-deep-ink">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3">
            <Link
              href={ROUTES.firstMeetChecklist}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 w-fit rounded-xl bg-brand-coral px-5 text-white hover:bg-brand-coral/90",
              )}
            >
              Read the safety guide
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-brand-ink-500">
              Verification and safety tools reduce uncertainty, but they do not remove all risk.
              Always use your judgment and meet in public places.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { SafetySection };
