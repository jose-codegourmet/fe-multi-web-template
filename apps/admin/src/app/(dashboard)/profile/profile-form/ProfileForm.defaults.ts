import type { CurrentUser } from "@/hooks/use-current-user/types";
import type { ProfileFormValues, ProfilePasswordValues } from "./ProfileForm.schema";

export function getProfileDefaultValues(
  user: Pick<CurrentUser, "name" | "bio"> | undefined,
): ProfileFormValues {
  return {
    name: user?.name ?? "",
    bio: user?.bio ?? "",
  };
}

export const profilePasswordDefaultValues: ProfilePasswordValues = {
  password: "",
  confirmPassword: "",
};
