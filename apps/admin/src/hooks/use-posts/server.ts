"use server";

import { prisma } from "@fe-template/db";
import type { AuthorOption, PostDetail, PostRow } from "./types";

export async function fetchPosts(): Promise<PostRow[]> {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    published: post.published,
    coverImage: post.coverImage,
    authorName: post.author.name,
    authorEmail: post.author.email,
    createdAt: post.createdAt.toISOString(),
  }));
}

export async function fetchPost(id: string): Promise<PostDetail | null> {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return null;

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    tags: post.tags,
    published: post.published,
    authorId: post.authorId,
  };
}

export async function fetchAuthors(): Promise<AuthorOption[]> {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { email: "asc" },
  });
}
