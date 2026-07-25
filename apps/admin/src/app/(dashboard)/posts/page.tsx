import { prisma } from "@fe-template/db";
import { Button } from "@fe-template/ui";
import Link from "next/link";
import { type PostRow, PostsTable } from "./posts-table";

async function getPosts(): Promise<PostRow[]> {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true },
      orderBy: { createdAt: "desc" },
    });

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      published: post.published,
      authorName: post.author.name,
      authorEmail: post.author.email,
      createdAt: post.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{posts.length} posts</p>
        <Button render={<Link href="/posts/new" />}>New post</Button>
      </div>
      <PostsTable data={posts} />
    </div>
  );
}
