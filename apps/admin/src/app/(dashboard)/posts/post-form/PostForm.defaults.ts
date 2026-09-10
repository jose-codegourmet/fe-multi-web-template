import type { PostDetail } from "@/hooks/use-posts/types";
import type { PostFormValues } from "./PostForm.schema";

export function getNewPostDefaultValues(authorId: string): PostFormValues {
  return {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    tags: "",
    published: false,
    authorId,
  };
}

export function getPostDefaultValues(post: PostDetail): PostFormValues {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content,
    coverImage: post.coverImage ?? "",
    tags: post.tags.join(", "),
    published: post.published,
    authorId: post.authorId,
  };
}
