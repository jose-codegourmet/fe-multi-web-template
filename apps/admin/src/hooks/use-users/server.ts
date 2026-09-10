"use server";

import { prisma } from "@fe-template/db";
import type { UserDetail, UserRow } from "./types";

export async function fetchUsers(): Promise<UserRow[]> {
  const users = await prisma.user.findMany({
    include: { _count: { select: { pets: true } } },
    orderBy: { createdAt: "desc" },
  });

  return users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    status: user.status,
    bio: user.bio,
    petsCount: user._count.pets,
    createdAt: user.createdAt.toISOString(),
  }));
}

export async function fetchUser(id: string): Promise<UserDetail | null> {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      pets: { orderBy: { createdAt: "desc" } },
      posts: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    status: user.status,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
    pets: user.pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
    })),
    posts: user.posts.map((post) => ({
      id: post.id,
      title: post.title,
      published: post.published,
      createdAt: post.createdAt.toISOString(),
    })),
  };
}
