import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { testimonialsQueryKey } from "@/hooks/use-testimonials/query";
import { fetchTestimonials } from "@/hooks/use-testimonials/server";
import { TestimonialsList } from "./testimonials-list";

export default async function TestimonialsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: testimonialsQueryKey.list(),
    queryFn: fetchTestimonials,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TestimonialsList />
    </HydrationBoundary>
  );
}
