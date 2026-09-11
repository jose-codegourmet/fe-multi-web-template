"use client";

import { ScrollReveal } from "@fe-template/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BLOG_CATEGORIES, BLOG_CATEGORY_ALL, BLOG_CATEGORY_QUERY } from "@/constants/blog";
import { parseBlogCategory } from "@/lib/blog-category";
import { cn } from "@/lib/utils";

type BlogFiltersSectionProps = {
  className?: string;
};

function BlogFiltersSection({ className }: BlogFiltersSectionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = parseBlogCategory(searchParams.get(BLOG_CATEGORY_QUERY));

  function selectCategory(category: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (category === BLOG_CATEGORY_ALL) {
      params.delete(BLOG_CATEGORY_QUERY);
    } else {
      params.set(BLOG_CATEGORY_QUERY, category);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

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
            {BLOG_CATEGORIES.map((category) => {
              const isActive = active === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => selectCategory(category)}
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
