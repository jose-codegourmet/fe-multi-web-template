"use client";

import { Avatar, AvatarFallback, AvatarImage, Badge, DataTable } from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type UserRow = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  petsCount: number;
  createdAt: string;
};

const columns: ColumnDef<UserRow>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => {
      const user = row.original;
      const initials = (user.name ?? user.email).slice(0, 2).toUpperCase();
      return (
        <Link href={`/users/${user.id}`} className="flex items-center gap-3 hover:underline">
          <Avatar size="sm">
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.name ?? "—"}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge variant={row.original.role === "ADMIN" ? "default" : "secondary"}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "petsCount",
    header: "Pets",
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];

export function UsersTable({ data }: { data: UserRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="email"
      filterPlaceholder="Search by email…"
    />
  );
}
