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
  coverImage: z.string().url().optional().or(z.literal("")),
  tags: z.string().optional(),
  published: z.boolean(),
  authorId: z.string().min(1, "Author is required"),
});

function parseTags(raw: string | undefined) {
  if (!raw?.trim()) return [] as string[];
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export type PostFormState = {
  error?: string;
};

export async function createPost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || "",
    tags: formData.get("tags") || undefined,
    published: formBoolean(formData.get("published")),
    authorId: formData.get("authorId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const { coverImage, tags, published, ...data } = parsed.data;

  try {
    await prisma.post.create({
      data: {
        ...data,
        excerpt: data.excerpt || null,
        coverImage: coverImage || null,
        tags: parseTags(tags),
        published,
        publishedAt: published ? new Date() : null,
      },
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }

  revalidatePath("/posts");
  redirect("/posts");
}

export async function updatePost(
  postId: string,
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || "",
    tags: formData.get("tags") || undefined,
    published: formBoolean(formData.get("published")),
    authorId: formData.get("authorId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid form data" };
  }

  const { coverImage, tags, published, ...data } = parsed.data;

  try {
    const existing = await prisma.post.findUnique({ where: { id: postId } });
    await prisma.post.update({
      where: { id: postId },
      data: {
        ...data,
        excerpt: data.excerpt || null,
        coverImage: coverImage || null,
        tags: parseTags(tags),
        published,
        publishedAt: published ? (existing?.publishedAt ?? new Date()) : null,
      },
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to update post",
    };
  }

  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
  redirect("/posts");
}
