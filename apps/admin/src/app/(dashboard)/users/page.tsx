import { prisma } from "@fe-template/db";
import { type UserRow, UsersTable } from "./users-table";

async function getUsers(): Promise<UserRow[]> {
  try {
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
      petsCount: user._count.pets,
      createdAt: user.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{users.length} users</p>
      <UsersTable data={users} />
    </div>
  );
}
