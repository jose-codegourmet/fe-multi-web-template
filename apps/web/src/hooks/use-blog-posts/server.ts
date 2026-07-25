import type { BlogPost } from "./types";

const apiOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const response = await fetch(new URL("/api/blog", apiOrigin), {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Unable to load blog posts.");
  }

  return response.json();
}
