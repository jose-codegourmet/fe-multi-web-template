import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { testimonialsQueryKey } from "@/hooks/use-testimonials/query";
import { fetchTestimonials } from "@/hooks/use-testimonials/server";
import { TestimonialDialog } from "./testimonial-dialog/TestimonialDialog";
import { TestimonialsList } from "./testimonials-list/TestimonialsList";

export default async function TestimonialsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: testimonialsQueryKey.list(),
    queryFn: fetchTestimonials,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Testimonials</h1>
          <TestimonialDialog />
        </div>
        <TestimonialsList />
      </div>
    </HydrationBoundary>
  );
}
