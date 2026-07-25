"use client";

import { Badge, Button, DataTable } from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { usePosts } from "@/hooks/use-posts/client";
import type { PostRow } from "@/hooks/use-posts/types";

const columns: ColumnDef<PostRow>[] = [
  {
    accessorKey: "title",
    header: "Post",
    cell: ({ row }) => {
      const post = row.original;
      return (
        <Link href={`/posts/${post.id}`} className="flex items-center gap-3 hover:underline">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-accent to-muted">
            {post.coverImage ? (
              // biome-ignore lint/performance/noImgElement: cover URLs are arbitrary remote strings
              <img src={post.coverImage} alt="" className="size-full object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <ImageIcon className="size-4" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium">{post.title}</div>
            <code className="text-xs text-muted-foreground">{post.slug}</code>
          </div>
        </Link>
      );
    },
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
    id: "author",
    accessorFn: (row) => row.authorName ?? row.authorEmail,
    header: "Author",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.authorName ?? "—"}</div>
        <div className="text-xs text-muted-foreground">{row.original.authorEmail}</div>
      </div>
    ),
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
      <Button
        variant="outline"
        size="sm"
        className="rounded-full"
        render={<Link href={`/posts/${row.original.id}`} />}
      >
        Edit
      </Button>
    ),
  },
];

export function PostsTable() {
  const { data = [] } = usePosts();

  return (
    <div className="space-y-4 rounded-3xl border border-border/60 bg-card p-4 shadow-sm md:p-6">
      <p className="text-sm text-muted-foreground">{data.length} posts</p>
      <DataTable
        columns={columns}
        data={data}
        filterColumn="title"
        filterPlaceholder="Search posts…"
      />
    </div>
  );
}
