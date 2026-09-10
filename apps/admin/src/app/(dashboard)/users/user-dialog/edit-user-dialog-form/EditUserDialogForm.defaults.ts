import type { UserRow } from "@/hooks/use-users/types";
import type { UpdateFormValues } from "./EditUserDialogForm.schema";

export function getEditUserDefaultValues(user: UserRow): UpdateFormValues {
  return {
    name: user.name ?? "",
    role: user.role,
    bio: user.bio ?? "",
    avatarUrl: user.avatarUrl ?? null,
  };
}
