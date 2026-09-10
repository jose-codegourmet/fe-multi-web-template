"use client";

import {
  Button,
  FileUploader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  NativeSelect,
  Textarea,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { usersQueryKey } from "@/hooks/use-users/query";
import type { UserRow } from "@/hooks/use-users/types";
import { uploadImage } from "@/lib/upload-image";
import { type UserUpdateValues, updateUser } from "../../actions";
import { getEditUserDefaultValues } from "./EditUserDialogForm.defaults";
import { type UpdateFormValues, userUpdateSchema } from "./EditUserDialogForm.schema";

type EditUserDialogFormProps = {
  user: UserRow;
  onSuccess?: () => void;
};

export function EditUserDialogForm({ user, onSuccess }: EditUserDialogFormProps) {
  const qc = useQueryClient();
  const form = useForm({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: getEditUserDefaultValues(user),
  });

  async function onSubmit(values: UpdateFormValues) {
    const data: UserUpdateValues = {
      name: values.name || undefined,
      role: values.role,
      bio: values.bio || undefined,
      avatarUrl: values.avatarUrl ?? undefined,
    };

    const result = await updateUser(user.id, data);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("User updated");
    await qc.invalidateQueries({ queryKey: usersQueryKey.list() });
    form.reset();
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar</FormLabel>
              <FormControl>
                <FileUploader
                  value={field.value}
                  onChange={field.onChange}
                  onUpload={uploadImage}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
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
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={3} className="rounded-2xl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
