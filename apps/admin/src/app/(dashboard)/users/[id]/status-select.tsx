"use client";

import { Button } from "@fe-template/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useTransition } from "react";
import { toast } from "sonner";
import { usersQueryKey } from "@/hooks/use-users/query";
import type { UserStatus } from "@/hooks/use-users/types";
import { updateUserStatus } from "../actions";
import { STATUS_OPTIONS } from "../status-badge";

export function StatusSelect({ userId, status }: { userId: string; status: UserStatus }) {
  const qc = useQueryClient();
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const nextStatus = formData.get("status") as UserStatus;
        if (nextStatus === status) return;
        startTransition(async () => {
          const result = await updateUserStatus(userId, nextStatus);
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          toast.success(`Status set to ${nextStatus.toLowerCase()}`);
          await Promise.all([
            qc.invalidateQueries({ queryKey: usersQueryKey.detail(userId) }),
            qc.invalidateQueries({ queryKey: usersQueryKey.list() }),
          ]);
        });
      }}
    >
      <select
        name="status"
        defaultValue={status}
        key={status}
        className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Update status"}
      </Button>
    </form>
  );
}
