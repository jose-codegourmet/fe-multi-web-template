import { prisma } from "@fe-template/db";
import { NextResponse } from "next/server";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    testimonials.map((testimonial) => ({
      id: testimonial.id,
      quote: testimonial.content,
      petParentName: testimonial.authorName,
      petName: testimonial.petName ?? "their pet",
      rating: testimonial.rating,
    })),
  );
}
