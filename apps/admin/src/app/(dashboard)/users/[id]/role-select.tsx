"use client";

import type { Role } from "@fe-template/db";
import { Button } from "@fe-template/ui";
import { useTransition } from "react";
import { updateUserRole } from "../actions";

export function RoleSelect({ userId, role }: { userId: string; role: Role }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const nextRole = formData.get("role") as Role;
        startTransition(async () => {
          await updateUserRole(userId, nextRole);
        });
      }}
    >
      <select
        name="role"
        defaultValue={role}
        className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
      >
        <option value="USER">USER</option>
        <option value="ADMIN">ADMIN</option>
      </select>
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Saving…" : "Update role"}
      </Button>
    </form>
  );
}
