import { Button } from "@fe-template/ui";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { postsQueryKey } from "@/hooks/use-posts/query";
import { fetchPosts } from "@/hooks/use-posts/server";
import { PostsTable } from "./posts-table";

export default async function PostsPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ queryKey: postsQueryKey.list(), queryFn: fetchPosts });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl tracking-tight">Blog</h2>
            <p className="text-sm text-muted-foreground">Stories shared with the community</p>
          </div>
          <Button className="rounded-full" render={<Link href="/posts/new" />}>
            New post
          </Button>
        </div>
        <PostsTable />
      </div>
    </HydrationBoundary>
  );
}
