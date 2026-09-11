import { BLOG_CATEGORIES, BLOG_CATEGORY_ALL, type BlogCategory } from "@/constants/blog";
import type { BlogPost } from "@/types/blog";

export function parseBlogCategory(value: string | string[] | undefined | null): BlogCategory {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw || raw === BLOG_CATEGORY_ALL) {
    return BLOG_CATEGORY_ALL;
  }

  return (BLOG_CATEGORIES as readonly string[]).includes(raw)
    ? (raw as BlogCategory)
    : BLOG_CATEGORY_ALL;
}

export function filterPostsByCategory(posts: BlogPost[], category: BlogCategory): BlogPost[] {
  if (category === BLOG_CATEGORY_ALL) {
    return posts;
  }

  return posts.filter((post) => post.category === category);
}
