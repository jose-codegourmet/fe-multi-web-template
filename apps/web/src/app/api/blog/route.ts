import { prisma } from "@fe-template/db";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { avatarUrl: true, name: true } } },
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json(
    posts.map((post) => {
      const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length;

      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt ?? "",
        category: post.tags[0] ?? "General",
        publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
        readingTime: `${Math.max(1, Math.ceil(wordCount / 200))} min`,
        author: {
          name: post.author.name ?? "PawPair team",
          role: "Contributor",
          avatar: post.author.avatarUrl ?? "/images/brand/logo-pawpair-icon.png",
        },
        image: post.coverImage ?? "/images/brand/logo-pawpair-icon.png",
        body: post.content.split("\n\n"),
      };
    }),
  );
}
