"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";

export async function toggleTestimonialPublished(id: string, published: boolean) {
  await prisma.testimonial.update({
    where: { id },
    data: { published },
  });
  revalidatePath("/testimonials");
}
