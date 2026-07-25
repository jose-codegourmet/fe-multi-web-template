import { prisma } from "@fe-template/db";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json(
    posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
      tags: post.tags,
      authorName: post.author.name,
      publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
    })),
  );
}
