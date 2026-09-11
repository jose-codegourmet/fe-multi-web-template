import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { usersQueryKey } from "@/hooks/use-users/query";
import { fetchUsers } from "@/hooks/use-users/server";
import { UserDialog } from "./user-dialog/UserDialog";
import { UsersTable } from "./users-table/UsersTable";

export default async function UsersPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: usersQueryKey.list(),
    queryFn: fetchUsers,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Users</h1>
          <UserDialog />
        </div>
        <UsersTable />
      </div>
    </HydrationBoundary>
  );
}
