"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Badge,
  Button,
  DataTable,
} from "@fe-template/ui";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { ImageIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { usePosts } from "@/hooks/use-posts/client";
import { postsQueryKey } from "@/hooks/use-posts/query";
import type { PostRow } from "@/hooks/use-posts/types";
import { deletePost } from "./actions";

function DeletePostDialog({ post }: { post: PostRow }) {
  const qc = useQueryClient();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const result = await deletePost(post.id);
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Post deleted");
    await qc.invalidateQueries({ queryKey: postsQueryKey.list() });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{post.title}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this post. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {pending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
              // eslint-disable-next-line @next/next/no-img-element -- cover URLs are arbitrary remote strings
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
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          render={<Link href={`/posts/${row.original.id}`} />}
        >
          Edit
        </Button>
        <DeletePostDialog post={row.original} />
      </div>
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
