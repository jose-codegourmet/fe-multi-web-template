"use client";

import { useQuery } from "@tanstack/react-query";
import { postsQueryKey } from "./query";
import { fetchAuthors, fetchPost, fetchPosts } from "./server";

export function usePosts() {
  return useQuery({
    queryKey: postsQueryKey.list(),
    queryFn: fetchPosts,
  });
}

export function usePost(id: string) {
  return useQuery({
    queryKey: postsQueryKey.detail(id),
    queryFn: () => fetchPost(id),
  });
}

export function usePostAuthors() {
  return useQuery({
    queryKey: postsQueryKey.authors(),
    queryFn: fetchAuthors,
  });
}
