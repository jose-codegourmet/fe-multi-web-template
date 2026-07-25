export const usersQueryKey = {
  all: () => ["users"] as const,
  list: () => [...usersQueryKey.all(), "list"] as const,
  detail: (id: string) => [...usersQueryKey.all(), "detail", id] as const,
};
