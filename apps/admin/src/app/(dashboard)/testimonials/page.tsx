import { prisma } from "@fe-template/db";
import { type TestimonialRow, TestimonialsList } from "./testimonials-list";

async function getTestimonials(): Promise<TestimonialRow[]> {
  try {
    const items = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return items.map((item) => ({
      id: item.id,
      content: item.content,
      authorName: item.authorName,
      petName: item.petName,
      rating: item.rating,
      published: item.published,
      createdAt: item.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function TestimonialsPage() {
  const items = await getTestimonials();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{items.length} testimonials</p>
      <TestimonialsList items={items} />
    </div>
  );
}
