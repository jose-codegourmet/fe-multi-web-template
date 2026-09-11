"use client";

import { useQuery } from "@tanstack/react-query";
import { blogPostsQueryKey } from "./query";
import type { BlogPost } from "./types";

async function fetchBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch("/api/blog");

  if (!response.ok) {
    throw new Error("Unable to load blog posts.");
  }

  return response.json();
}

export function useBlogPosts() {
  return useQuery({
    queryKey: blogPostsQueryKey.list(),
    queryFn: fetchBlogPosts,
  });
}
