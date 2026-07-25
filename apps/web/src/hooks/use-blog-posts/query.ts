export const blogPostsQueryKey = {
  all: () => ["blog-posts"] as const,
  list: () => [...blogPostsQueryKey.all(), "list"] as const,
};
