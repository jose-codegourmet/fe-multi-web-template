"use client";

import { Badge, Button, DataTable } from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type PostRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  authorName: string | null;
  authorEmail: string;
  createdAt: string;
};

const columns: ColumnDef<PostRow>[] = [
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
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => <code className="text-xs text-muted-foreground">{row.original.slug}</code>,
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.published ? "default" : "secondary"}>
        {row.original.published ? "Published" : "Draft"}
      </Badge>
    ),
  },
  {
    id: "author",
    accessorFn: (row) => row.authorName ?? row.authorEmail,
    header: "Author",
    cell: ({ row }) => row.original.authorName ?? row.original.authorEmail,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button variant="outline" size="sm" render={<Link href={`/posts/${row.original.id}`} />}>
        Edit
      </Button>
    ),
  },
];

export function PostsTable({ data }: { data: PostRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      filterColumn="title"
      filterPlaceholder="Search posts…"
    />
  );
}
