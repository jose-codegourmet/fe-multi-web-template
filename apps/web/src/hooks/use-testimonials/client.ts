"use client";

import { useQuery } from "@tanstack/react-query";
import { testimonialsQueryKey } from "./query";
import type { Testimonial } from "./types";

async function fetchTestimonials(): Promise<Testimonial[]> {
  const response = await fetch("/api/testimonials");

  if (!response.ok) {
    throw new Error("Unable to load testimonials.");
  }

  return response.json();
}

export function useTestimonials() {
  return useQuery({
    queryKey: testimonialsQueryKey.list(),
    queryFn: fetchTestimonials,
  });
}
