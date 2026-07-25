import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { usersQueryKey } from "@/hooks/use-users/query";
import { fetchUsers } from "@/hooks/use-users/server";
import { UsersTable } from "./users-table";

export default async function UsersPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: usersQueryKey.list(),
    queryFn: fetchUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersTable />
    </HydrationBoundary>
  );
}
