import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { postsQueryKey } from "@/hooks/use-posts/query";
import { fetchAuthors, fetchPost } from "@/hooks/use-posts/server";
import { EditPostEditor } from "../post-editor";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  const [post] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: postsQueryKey.detail(id),
      queryFn: () => fetchPost(id),
    }),
    queryClient.prefetchQuery({
      queryKey: postsQueryKey.authors(),
      queryFn: fetchAuthors,
    }),
  ]);
  if (!post) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EditPostEditor id={id} />
    </HydrationBoundary>
  );
}
