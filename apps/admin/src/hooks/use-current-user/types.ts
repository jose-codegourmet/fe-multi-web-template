export type CurrentUser = {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  bio: string | null;
  createdAt: string;
};
