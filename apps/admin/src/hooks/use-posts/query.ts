export const postsQueryKey = {
  all: () => ["posts"] as const,
  list: () => [...postsQueryKey.all(), "list"] as const,
  detail: (id: string) => [...postsQueryKey.all(), "detail", id] as const,
  authors: () => [...postsQueryKey.all(), "authors"] as const,
};
