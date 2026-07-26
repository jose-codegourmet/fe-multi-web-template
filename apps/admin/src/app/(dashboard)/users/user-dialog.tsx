"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { usersQueryKey } from "@/hooks/use-users/query";
import type { UserRow } from "@/hooks/use-users/types";
import { uploadImage } from "@/lib/upload-image";
import {
  createUser,
  deleteUser,
  type UserCreateValues,
  type UserUpdateValues,
  updateUser,
} from "./actions";

const userCreateSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]),
  bio: z.string().optional(),
  avatarUrl: z.string().optional().nullable(),
});

const userUpdateSchema = z.object({
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]),
  bio: z.string().optional(),
  avatarUrl: z.string().optional().nullable(),
});

type CreateFormValues = z.infer<typeof userCreateSchema>;
type UpdateFormValues = z.infer<typeof userUpdateSchema>;

type UserDialogProps = {
  user?: UserRow;
  trigger?: React.ReactElement;
};

export function UserDialog({ user, trigger }: UserDialogProps) {
  if (user) {
    return <EditUserDialog user={user} trigger={trigger} />;
  }
  return <CreateUserDialog trigger={trigger} />;
}

function CreateUserDialog({ trigger }: { trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const form = useForm({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      email: "",
      name: "",
      role: "USER" as const,
      bio: "",
      avatarUrl: null as string | null,
    },
  });

  async function onSubmit(values: CreateFormValues) {
    const data: UserCreateValues = {
      email: values.email,
      name: values.name || undefined,
      role: values.role,
      bio: values.bio || undefined,
      avatarUrl: values.avatarUrl ?? undefined,
    };

    const result = await createUser(data);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("User created");
    await qc.invalidateQueries({ queryKey: usersQueryKey.list() });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm">
              <PlusIcon className="mr-1 size-4" />
              New User
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New User</DialogTitle>
        </DialogHeader>
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function EditUserDialog({ user, trigger }: { user: UserRow; trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const form = useForm({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user.name ?? "",
      role: user.role,
      bio: user.bio ?? "",
      avatarUrl: user.avatarUrl ?? null,
    },
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
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm">
              <PlusIcon className="mr-1 size-4" />
              Edit User
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
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
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

type DeleteUserDialogProps = {
  user: UserRow;
  trigger: React.ReactElement;
};

export function DeleteUserDialog({ user, trigger }: DeleteUserDialogProps) {
  const qc = useQueryClient();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const result = await deleteUser(user.id);
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("User deleted");
    await qc.invalidateQueries({ queryKey: usersQueryKey.list() });
  }

  const displayName = user.name ?? user.email;

  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {displayName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {displayName}, all blog posts they authored, and all
            related pets. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {pending ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
