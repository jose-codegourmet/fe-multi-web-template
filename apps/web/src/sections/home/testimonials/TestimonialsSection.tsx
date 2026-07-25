import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ScrollReveal,
} from "@fe-template/ui";
import Image from "next/image";
import { DEMO_TESTIMONIALS } from "@/constants/demo-content";
import { cn } from "@/lib/utils";

type TestimonialsSectionProps = {
  className?: string;
};

function TestimonialsSection({ className }: TestimonialsSectionProps) {
  return (
    <section
      data-slot="testimonials-section"
      className={cn("bg-brand-white px-4 py-16 md:px-8 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <h2 className="font-display mx-auto max-w-2xl text-center text-3xl font-semibold text-brand-deep-ink md:text-4xl">
            Friendships approved by pets and humans.
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {DEMO_TESTIMONIALS.map((testimonial, index) => (
            <ScrollReveal key={testimonial.id} delay={0.1 * (index + 1)}>
              <Card className="h-full border-none bg-brand-warm-cream ring-transparent">
                <CardHeader>
                  <div className="mb-3 flex items-center gap-3">
                    <div className="relative size-12 overflow-hidden rounded-full bg-brand-cream-200">
                      <Image
                        src={testimonial.avatar}
                        alt={`${testimonial.petName}'s avatar`}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <CardTitle className="font-display text-base text-brand-deep-ink">
                        {testimonial.petParentName} & {testimonial.petName}
                      </CardTitle>
                      <CardDescription className="text-brand-ink-500">
                        {testimonial.location}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-sm leading-relaxed text-brand-ink-700">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div
                    className="mt-3 text-xs text-brand-coral"
                    role="img"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {"★".repeat(testimonial.rating)}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { TestimonialsSection };
