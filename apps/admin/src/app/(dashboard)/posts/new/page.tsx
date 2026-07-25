import { prisma } from "@fe-template/db";
import { PostForm } from "../post-form";

async function getAuthors() {
  try {
    return await prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { email: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function NewPostPage() {
  const authors = await getAuthors();

  return (
    <PostForm
      authors={authors}
      defaultValues={{
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        coverImage: "",
        tags: "",
        published: false,
        authorId: authors[0]?.id ?? "",
      }}
    />
  );
}
