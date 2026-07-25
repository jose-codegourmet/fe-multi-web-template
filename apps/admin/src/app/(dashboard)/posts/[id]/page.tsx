import { prisma } from "@fe-template/db";
import { notFound } from "next/navigation";
import { PostForm } from "../post-form";

type PageProps = {
  params: Promise<{ id: string }>;
};

async function getPostAndAuthors(id: string) {
  try {
    return await Promise.all([
      prisma.post.findUnique({ where: { id } }),
      prisma.user.findMany({
        select: { id: true, name: true, email: true },
        orderBy: { email: "asc" },
      }),
    ]);
  } catch {
    return null;
  }
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  const result = await getPostAndAuthors(id);
  if (!result) notFound();

  const [post, authors] = result;
  if (!post) notFound();

  return (
    <PostForm
      authors={authors}
      defaultValues={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content,
        coverImage: post.coverImage ?? "",
        tags: post.tags.join(", "),
        published: post.published,
        authorId: post.authorId,
      }}
    />
  );
}
