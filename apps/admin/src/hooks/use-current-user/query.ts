export const currentUserQueryKey = {
  all: () => ["current-user"] as const,
  current: () => currentUserQueryKey.all(),
};
