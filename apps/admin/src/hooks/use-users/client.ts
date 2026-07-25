"use client";

import { useQuery } from "@tanstack/react-query";
import { usersQueryKey } from "./query";
import { fetchUser, fetchUsers } from "./server";

export function useUsers() {
  return useQuery({
    queryKey: usersQueryKey.list(),
    queryFn: fetchUsers,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersQueryKey.detail(id),
    queryFn: () => fetchUser(id),
  });
}
