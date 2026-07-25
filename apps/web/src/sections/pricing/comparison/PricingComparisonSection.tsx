import { ScrollReveal } from "@fe-template/ui";
import { cn } from "@/lib/utils";

const eyebrow = "Compare";
const headline = "See what each plan unlocks.";
const supporting = "A quick look at the differences across Free, Plus, and Pack.";
const columns = ["Feature", "Free", "Plus", "Pack"];
const rows = [
  { feature: "Pet profiles", free: "1", plus: "1", pack: "Up to 4" },
  {
    feature: "Daily likes",
    free: "Limited",
    plus: "Unlimited",
    pack: "Unlimited",
  },
  {
    feature: "Compatibility filters",
    free: "Basic",
    plus: "Advanced",
    pack: "Advanced",
  },
  {
    feature: "See who liked your pet",
    free: "—",
    plus: "Yes",
    pack: "Yes",
  },
  {
    feature: "Discovery radius",
    free: "Standard",
    plus: "Extended",
    pack: "Extended",
  },
  {
    feature: "Profile boost",
    free: "—",
    plus: "Monthly",
    pack: "Monthly",
  },
  {
    feature: "Group walks & pet circles",
    free: "—",
    plus: "—",
    pack: "Yes",
  },
  {
    feature: "Priority support",
    free: "—",
    plus: "—",
    pack: "Yes",
  },
];

type PricingComparisonSectionProps = {
  className?: string;
};

function PricingComparisonSection({ className }: PricingComparisonSectionProps) {
  return (
    <section
      data-slot="pricing-comparison-section"
      className={cn("bg-brand-warm-cream/50 px-4 py-16 md:px-8 md:py-24", className)}
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

        <ScrollReveal delay={0.12} className="mt-10">
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-2xl bg-brand-white ring-1 ring-brand-ink-200/40 md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-brand-ink-200/50 bg-brand-cream-200/40">
                  {columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className={cn(
                        "px-5 py-4 font-display text-base font-semibold text-brand-deep-ink",
                        column !== "Feature" && "text-center",
                      )}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="border-b border-brand-ink-200/30 last:border-0">
                    <th scope="row" className="px-5 py-3.5 font-medium text-brand-deep-ink">
                      {row.feature}
                    </th>
                    <td className="px-5 py-3.5 text-center text-brand-ink-500">{row.free}</td>
                    <td className="px-5 py-3.5 text-center font-medium text-brand-coral">
                      {row.plus}
                    </td>
                    <td className="px-5 py-3.5 text-center text-brand-ink-700">{row.pack}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <div className="grid gap-4 md:hidden">
            {rows.map((row) => (
              <div
                key={row.feature}
                className="rounded-2xl bg-brand-white p-4 ring-1 ring-brand-ink-200/40"
              >
                <p className="font-display text-base font-semibold text-brand-deep-ink">
                  {row.feature}
                </p>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <dt className="font-medium text-brand-ink-500">Free</dt>
                    <dd className="mt-1 text-brand-deep-ink">{row.free}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-brand-coral">Plus</dt>
                    <dd className="mt-1 font-medium text-brand-coral">{row.plus}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-brand-ink-500">Pack</dt>
                    <dd className="mt-1 text-brand-deep-ink">{row.pack}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export { PricingComparisonSection };
