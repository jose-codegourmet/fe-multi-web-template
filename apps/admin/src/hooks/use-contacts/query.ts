export const contactsQueryKey = {
  all: () => ["contacts"] as const,
  list: () => [...contactsQueryKey.all(), "list"] as const,
};
