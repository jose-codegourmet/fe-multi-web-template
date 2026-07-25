"use client";

import { useQuery } from "@tanstack/react-query";
import { petsQueryKey } from "./query";
import { fetchPets } from "./server";

export function usePets() {
  return useQuery({
    queryKey: petsQueryKey.list(),
    queryFn: fetchPets,
  });
}
