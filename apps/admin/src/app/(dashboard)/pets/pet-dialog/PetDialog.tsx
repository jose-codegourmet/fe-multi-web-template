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
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { petsQueryKey } from "@/hooks/use-pets/query";
import type { PetRow } from "@/hooks/use-pets/types";
import { deletePet } from "../actions";
import { PetDialogForm } from "./pet-dialog-form/PetDialogForm";
import type { OwnerOption } from "./pet-dialog-form/PetDialogForm.defaults";

type PetDialogProps = {
  pet?: PetRow;
  ownerOptions: OwnerOption[];
  trigger?: React.ReactElement;
};

export function PetDialog({ pet, ownerOptions, trigger }: PetDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm">
              <PlusIcon className="mr-1 size-4" />
              New Pet
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{pet ? "Edit Pet" : "New Pet"}</DialogTitle>
        </DialogHeader>
        <PetDialogForm pet={pet} ownerOptions={ownerOptions} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

type DeletePetDialogProps = {
  pet: PetRow;
  trigger: React.ReactElement;
};

export function DeletePetDialog({ pet, trigger }: DeletePetDialogProps) {
  const qc = useQueryClient();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const result = await deletePet(pet.id);
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Pet deleted");
    await qc.invalidateQueries({ queryKey: petsQueryKey.list() });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {pet.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {pet.name} and all related data. This action cannot be
            undone.
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

export type { OwnerOption } from "./pet-dialog-form/PetDialogForm.defaults";
