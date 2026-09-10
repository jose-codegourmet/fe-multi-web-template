import type { Testimonial } from "./types";

const apiOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:9000";

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const response = await fetch(new URL("/api/testimonials", apiOrigin), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Unable to load testimonials.");
  }

  return response.json();
}
