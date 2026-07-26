"use client";

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, DataTable } from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useUsers } from "@/hooks/use-users/client";
import type { UserRow } from "@/hooks/use-users/types";
import { DeleteUserDialog, UserDialog } from "./user-dialog";

const ROLE_FILTERS = ["ALL", "ADMIN", "USER"] as const;

export function UsersTable() {
  const { data = [] } = useUsers();
  const [role, setRole] = useState<(typeof ROLE_FILTERS)[number]>("ALL");

  const filtered = useMemo(
    () => (role === "ALL" ? data : data.filter((user) => user.role === role)),
    [data, role],
  );

  const columns: ColumnDef<UserRow>[] = useMemo(
    () => [
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
          <Badge
            variant={row.original.role === "ADMIN" ? "default" : "secondary"}
            className="rounded-full"
          >
            {row.original.role === "ADMIN" ? "Admin" : "User"}
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
      {
        id: "actions",
        header: "",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex items-center justify-end gap-1">
              <UserDialog
                user={user}
                trigger={
                  <Button variant="ghost" size="icon" className="size-8">
                    <PencilIcon className="size-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                }
              />
              <DeleteUserDialog
                user={user}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                  >
                    <Trash2Icon className="size-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                }
              />
            </div>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="space-y-4 rounded-3xl border border-border/60 bg-card p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {data.length} users
        </p>
        <div className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={role === value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setRole(value)}
            >
              {value === "ALL" ? "All" : value === "ADMIN" ? "Admin" : "User"}
            </Button>
          ))}
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        filterColumn="email"
        filterPlaceholder="Search by email…"
      />
    </div>
  );
}
