"use client";

import { usePost, usePostAuthors } from "@/hooks/use-posts/client";
import { PostForm } from "./post-form";

export function NewPostEditor() {
  const { data: authors = [] } = usePostAuthors();

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

export function EditPostEditor({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const { data: authors = [] } = usePostAuthors();
  if (!post) return null;

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
