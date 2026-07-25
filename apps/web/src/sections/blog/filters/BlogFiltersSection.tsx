"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { cn } from "@/lib/utils";

type BlogFiltersSectionProps = {
  className?: string;
};

const CATEGORIES = [
  "All",
  "Pet Socialization",
  "First Meetups",
  "Behavior and Play",
  "Walking and Exercise",
  "Community Stories",
  "Safety",
] as const;

function BlogFiltersSection({ className }: BlogFiltersSectionProps) {
  const [active, setActive] = useState<string>("All");

  return (
    <section
      data-slot="blog-filters-section"
      className={cn("bg-brand-warm-cream px-4 py-10 md:px-8 md:py-12", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display mb-6 text-2xl font-semibold text-brand-deep-ink md:text-3xl">
            Browse by topic
          </h2>

          <fieldset className="m-0 flex flex-wrap gap-2 border-0 p-0">
            <legend className="sr-only">Filter articles by category</legend>
            {CATEGORIES.map((category) => {
              const isActive = active === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActive(category)}
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-coral text-white"
                      : "bg-brand-white text-brand-ink-700 ring-1 ring-brand-ink-200/70 hover:bg-brand-cream-200",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </fieldset>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { BlogFiltersSection };
