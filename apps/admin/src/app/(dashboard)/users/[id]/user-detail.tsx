"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
} from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useUser } from "@/hooks/use-users/client";
import type { UserDetail } from "@/hooks/use-users/types";
import { StatusBadge } from "../status-badge";
import { RoleSelect } from "./role-select";
import { StatusSelect } from "./status-select";

const petColumns: ColumnDef<UserDetail["pets"][number]>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "species", header: "Species" },
  { accessorKey: "breed", header: "Breed", cell: ({ row }) => row.original.breed ?? "—" },
  { accessorKey: "age", header: "Age", cell: ({ row }) => row.original.age ?? "—" },
];

const postColumns: ColumnDef<UserDetail["posts"][number]>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link href={`/posts/${row.original.id}`} className="font-medium hover:underline">
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.published ? "default" : "outline"} className="rounded-full">
        {row.original.published ? "Published" : "Draft"}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];

export function UserDetailView({ id }: { id: string }) {
  const { data: user } = useUser(id);
  if (!user) return null;

  const initials = (user.name ?? user.email).slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden rounded-3xl border-border/60 shadow-sm">
        <div className="h-24 bg-gradient-to-r from-primary/20 via-accent to-transparent" />
        <CardHeader className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end">
          <Avatar className="size-20 border-4 border-card shadow-sm">
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <CardTitle className="font-display text-2xl">{user.name ?? user.email}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
              <Badge
                variant={user.role === "ADMIN" ? "default" : "secondary"}
                className="rounded-full"
              >
                {user.role === "ADMIN" ? "Admin" : "User"}
              </Badge>
              <StatusBadge status={user.status} />
              <span className="text-muted-foreground">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.bio ? <p className="text-sm leading-relaxed">{user.bio}</p> : null}
          <div>
            <p className="mb-2 text-sm font-medium">Change role</p>
            <RoleSelect userId={user.id} role={user.role} />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Change status</p>
            <StatusSelect userId={user.id} status={user.status} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-xl">Pets ({user.pets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={petColumns} data={user.pets} />
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-xl">Posts ({user.posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={postColumns} data={user.posts} />
        </CardContent>
      </Card>
    </div>
  );
}
