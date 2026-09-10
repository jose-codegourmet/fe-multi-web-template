import type { TestimonialRow } from "@/hooks/use-testimonials/types";
import type { TestimonialFormValues } from "./TestimonialDialogForm.schema";

export function getTestimonialDefaultValues(
  testimonial: TestimonialRow | undefined,
): TestimonialFormValues {
  return {
    content: testimonial?.content ?? "",
    authorName: testimonial?.authorName ?? "",
    petName: testimonial?.petName ?? "",
    rating: testimonial?.rating ?? 5,
    published: testimonial?.published ?? false,
  };
}
