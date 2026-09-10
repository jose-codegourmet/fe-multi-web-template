"use server";

import { prisma } from "@fe-template/db";

export async function createProfile(userId: string, email: string) {
  await prisma.profile.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email,
    },
    update: {
      email,
    },
  });
}
