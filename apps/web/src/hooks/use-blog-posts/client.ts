"use client";

import { useQuery } from "@tanstack/react-query";
import { blogPostsQueryKey } from "./query";
import { fetchBlogPosts } from "./server";

export function useBlogPosts() {
  return useQuery({
    queryKey: blogPostsQueryKey.list(),
    queryFn: fetchBlogPosts,
  });
}
