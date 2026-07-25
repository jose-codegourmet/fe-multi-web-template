export const testimonialsQueryKey = {
  all: () => ["testimonials"] as const,
  list: () => [...testimonialsQueryKey.all(), "list"] as const,
};
