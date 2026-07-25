"use client";

import { useQuery } from "@tanstack/react-query";
import { type CurrentUser, fetchCurrentUserByEmail } from "@/hooks/current-user";
import { createClient } from "@/lib/supabase/client";

export type { CurrentUser };

export const currentUserQueryKey = ["current-user"] as const;

async function loadCurrentUser(): Promise<CurrentUser | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;
  return fetchCurrentUserByEmail(user.email);
}

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: loadCurrentUser,
  });
}

export function getInitials(name: string | null | undefined, email: string | null | undefined) {
  const source = name?.trim() || email?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}
