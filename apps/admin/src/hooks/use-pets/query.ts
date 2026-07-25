export const petsQueryKey = {
  all: () => ["pets"] as const,
  list: () => [...petsQueryKey.all(), "list"] as const,
};
