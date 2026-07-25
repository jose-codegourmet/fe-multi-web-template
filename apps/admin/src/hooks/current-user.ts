"use server";

import { prisma } from "@fe-template/db";

export type CurrentUser = {
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  bio: string | null;
  createdAt: string;
};

export async function fetchCurrentUserByEmail(email: string): Promise<CurrentUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      email: true,
      name: true,
      avatarUrl: true,
      role: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) return null;

  return {
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
  };
}
