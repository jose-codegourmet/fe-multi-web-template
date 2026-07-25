import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { usersQueryKey } from "@/hooks/use-users/query";
import { fetchUser } from "@/hooks/use-users/server";
import { UserDetailView } from "./user-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();
  const user = await queryClient.fetchQuery({
    queryKey: usersQueryKey.detail(id),
    queryFn: () => fetchUser(id),
  });
  if (!user) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserDetailView id={id} />
    </HydrationBoundary>
  );
}
