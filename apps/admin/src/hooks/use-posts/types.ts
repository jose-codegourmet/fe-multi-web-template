export type AuthorOption = {
  id: string;
  name: string | null;
  email: string;
};

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  coverImage: string | null;
  authorName: string | null;
  authorEmail: string;
  createdAt: string;
};

export type PostDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  tags: string[];
  published: boolean;
  authorId: string;
};
