"use client";

import { useQuery } from "@tanstack/react-query";
import { testimonialsQueryKey } from "./query";
import { fetchTestimonials } from "./server";

export function useTestimonials() {
  return useQuery({
    queryKey: testimonialsQueryKey.list(),
    queryFn: fetchTestimonials,
  });
}
