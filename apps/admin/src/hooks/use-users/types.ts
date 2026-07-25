export type UserRow = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  petsCount: number;
  createdAt: string;
};

export type UserDetail = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  bio: string | null;
  createdAt: string;
  pets: Array<{
    id: string;
    name: string;
    species: string;
    breed: string | null;
    age: number | null;
  }>;
  posts: Array<{
    id: string;
    title: string;
    published: boolean;
    createdAt: string;
  }>;
};
