"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const testimonialSchema = z.object({
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required"),
  petName: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  published: z.boolean(),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
export type ActionResult = { success: true } | { success: false; error: string };

export async function toggleTestimonialPublished(id: string, published: boolean) {
  await prisma.testimonial.update({
    where: { id },
    data: { published },
  });
  revalidatePath("/testimonials");
}

export async function createTestimonial(data: TestimonialFormValues): Promise<ActionResult> {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    await prisma.testimonial.create({
      data: { ...parsed.data, petName: parsed.data.petName || null },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create" };
  }

  revalidatePath("/testimonials");
  return { success: true };
}

export async function updateTestimonial(
  id: string,
  data: TestimonialFormValues,
): Promise<ActionResult> {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    await prisma.testimonial.update({
      where: { id },
      data: { ...parsed.data, petName: parsed.data.petName || null },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update" };
  }

  revalidatePath("/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await prisma.testimonial.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete" };
  }

  revalidatePath("/testimonials");
  return { success: true };
}
