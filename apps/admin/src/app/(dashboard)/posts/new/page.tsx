import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { postsQueryKey } from "@/hooks/use-posts/query";
import { fetchAuthors } from "@/hooks/use-posts/server";
import { NewPostEditor } from "../post-editor";

export default async function NewPostPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: postsQueryKey.authors(),
    queryFn: fetchAuthors,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NewPostEditor />
    </HydrationBoundary>
  );
}
