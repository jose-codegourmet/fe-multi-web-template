"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().optional().nullable(),
  tags: z.string().optional(),
  published: z.boolean(),
  authorId: z.string().min(1, "Author is required"),
});

export type PostFormData = z.infer<typeof postSchema>;
export type ActionResult = { success: true } | { success: false; error: string };

export async function createPost(data: PostFormData): Promise<ActionResult> {
  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const { coverImage, tags, published, ...rest } = parsed.data;

  try {
    await prisma.post.create({
      data: {
        ...rest,
        excerpt: rest.excerpt || null,
        coverImage: coverImage || null,
        tags: (tags ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        published,
        publishedAt: published ? new Date() : null,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }

  revalidatePath("/posts");
  redirect("/posts");
}

export async function updatePost(id: string, data: PostFormData): Promise<ActionResult> {
  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const { coverImage, tags, published, ...rest } = parsed.data;

  try {
    const existing = await prisma.post.findUnique({ where: { id } });
    await prisma.post.update({
      where: { id },
      data: {
        ...rest,
        excerpt: rest.excerpt || null,
        coverImage: coverImage || null,
        tags: (tags ?? "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        published,
        publishedAt: published ? (existing?.publishedAt ?? new Date()) : null,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update post",
    };
  }

  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);
  redirect("/posts");
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    await prisma.post.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete post" };
  }
  revalidatePath("/posts");
  return { success: true };
}
