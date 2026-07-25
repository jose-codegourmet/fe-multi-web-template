"use server";

import { prisma } from "@fe-template/db";
import type { TestimonialRow } from "./types";

export async function fetchTestimonials(): Promise<TestimonialRow[]> {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return testimonials.map((testimonial) => ({
    id: testimonial.id,
    content: testimonial.content,
    authorName: testimonial.authorName,
    petName: testimonial.petName,
    rating: testimonial.rating,
    published: testimonial.published,
    createdAt: testimonial.createdAt.toISOString(),
  }));
}
