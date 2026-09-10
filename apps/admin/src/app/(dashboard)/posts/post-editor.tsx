"use client";

import { usePost, usePostAuthors } from "@/hooks/use-posts/client";
import { PostForm } from "./post-form/PostForm";
import { getNewPostDefaultValues, getPostDefaultValues } from "./post-form/PostForm.defaults";

export function NewPostEditor() {
  const { data: authors = [] } = usePostAuthors();

  return (
    <PostForm authors={authors} defaultValues={getNewPostDefaultValues(authors[0]?.id ?? "")} />
  );
}

export function EditPostEditor({ id }: { id: string }) {
  const { data: post } = usePost(id);
  const { data: authors = [] } = usePostAuthors();
  if (!post) return null;

  return <PostForm authors={authors} defaultValues={getPostDefaultValues(post)} />;
}
