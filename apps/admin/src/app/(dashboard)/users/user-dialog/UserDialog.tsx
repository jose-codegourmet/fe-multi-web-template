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
} from "@fe-template/ui";
import { useQueryClient } from "@tanstack/react-query";
import { MailIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usersQueryKey } from "@/hooks/use-users/query";
import type { UserRow } from "@/hooks/use-users/types";
import { deleteUser } from "../actions";
import { EditUserDialogForm } from "./edit-user-dialog-form/EditUserDialogForm";
import { InviteUserDialogForm } from "./invite-user-dialog-form/InviteUserDialogForm";

type UserDialogProps = {
  user?: UserRow;
  trigger?: React.ReactElement;
};

export function UserDialog({ user, trigger }: UserDialogProps) {
  if (user) {
    return <EditUserDialog user={user} trigger={trigger} />;
  }
  return <InviteUserDialog trigger={trigger} />;
}

function InviteUserDialog({ trigger }: { trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm">
              <MailIcon className="mr-1 size-4" />
              Invite User
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <InviteUserDialogForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function EditUserDialog({ user, trigger }: { user: UserRow; trigger?: React.ReactElement }) {
  const [open, setOpen] = useState(false);

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
        <EditUserDialogForm user={user} onSuccess={() => setOpen(false)} />
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
            This will permanently delete {displayName}, their sign-in account, all blog posts they
            authored, and all related pets. This action cannot be undone.
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
