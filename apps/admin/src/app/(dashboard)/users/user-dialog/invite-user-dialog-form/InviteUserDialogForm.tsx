"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  NativeSelect,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usersQueryKey } from "@/hooks/use-users/query";
import { inviteUser, type UserInviteValues } from "../../actions";
import { inviteUserDefaultValues } from "./InviteUserDialogForm.defaults";
import { type InviteFormValues, userInviteSchema } from "./InviteUserDialogForm.schema";

type InviteUserDialogFormProps = {
  onSuccess?: () => void;
};

export function InviteUserDialogForm({ onSuccess }: InviteUserDialogFormProps) {
  const qc = useQueryClient();
  const form = useForm({
    resolver: zodResolver(userInviteSchema),
    defaultValues: inviteUserDefaultValues,
  });

  async function onSubmit(values: InviteFormValues) {
    const data: UserInviteValues = {
      email: values.email,
      role: values.role,
    };

    const result = await inviteUser(data);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Invite sent");
    await qc.invalidateQueries({ queryKey: usersQueryKey.list() });
    form.reset();
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <NativeSelect {...field}>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </NativeSelect>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-sm text-muted-foreground">
          An invitation email will be sent. The user starts with Pending status until they verify.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Sending…" : "Send invite"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
