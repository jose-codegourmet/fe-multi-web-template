export const BLOG_CATEGORY_ALL = "All" as const;

export const BLOG_CATEGORIES = [
  BLOG_CATEGORY_ALL,
  "Pet Socialization",
  "First Meetups",
  "Behavior and Play",
  "Walking and Exercise",
  "Community Stories",
  "Safety",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const BLOG_CATEGORY_QUERY = "category";
