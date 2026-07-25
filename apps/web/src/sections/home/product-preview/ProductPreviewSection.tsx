import Image from "next/image";
import { Badge } from "@/components/badge/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/card/Card";
import { ScrollReveal } from "@/components/motion/scroll-reveal/ScrollReveal";
import { DEMO_PETS } from "@/constants/demo-content";
import { cn } from "@/lib/utils";
import { SectionImage } from "@/sections/_shared/SectionImage";

type ProductPreviewSectionProps = {
  className?: string;
};

const mochi = DEMO_PETS[0];

function ProductPreviewSection({ className }: ProductPreviewSectionProps) {
  return (
    <section
      id="download"
      data-slot="product-preview-section"
      className={cn("bg-brand-warm-cream px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display mx-auto max-w-2xl text-center text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Everything you need before the leashes come out.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <ScrollReveal>
            <SectionImage
              src="/images/product/product-phone-mockups.png"
              alt="PawPair app screens showing discovery, matches, and messaging"
              objectFit="contain"
              className="aspect-[4/5] w-full bg-transparent md:aspect-square"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <Card className="border-none bg-brand-white ring-brand-ink-200/40">
              <CardHeader className="flex-row items-start gap-4">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-[20px] bg-brand-cream-200">
                  <Image
                    src={mochi.image}
                    alt={mochi.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="font-display text-2xl text-brand-deep-ink">
                      {mochi.name}
                    </CardTitle>
                    <Badge className="bg-brand-coral/15 text-brand-coral">
                      {mochi.compatibilityScore}% match
                    </Badge>
                  </div>
                  <CardDescription className="text-brand-ink-500">
                    {mochi.breed} · {mochi.age} years · {mochi.size}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-brand-ink-500">Energy</dt>
                    <dd className="font-medium capitalize text-brand-deep-ink">
                      {mochi.energyLevel}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-brand-ink-500">Play style</dt>
                    <dd className="font-medium text-brand-deep-ink">
                      {mochi.playStyles.join(", ")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-brand-ink-500">Distance</dt>
                    <dd className="font-medium text-brand-deep-ink">{mochi.distanceKm} km away</dd>
                  </div>
                  <div>
                    <dt className="text-brand-ink-500">Looking for</dt>
                    <dd className="font-medium text-brand-deep-ink">
                      {mochi.lookingFor.join(", ")}
                    </dd>
                  </div>
                </dl>
                <p className="text-sm leading-relaxed text-brand-ink-500">{mochi.bio}</p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

export { ProductPreviewSection };
