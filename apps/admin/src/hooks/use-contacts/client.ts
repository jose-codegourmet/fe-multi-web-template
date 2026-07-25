"use client";

import { useQuery } from "@tanstack/react-query";
import { contactsQueryKey } from "./query";
import { fetchContacts } from "./server";

export function useContacts() {
  return useQuery({
    queryKey: contactsQueryKey.list(),
    queryFn: fetchContacts,
  });
}
