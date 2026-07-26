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
import { petsQueryKey } from "@/hooks/use-pets/query";
import type { PetRow } from "@/hooks/use-pets/types";
import { uploadImage } from "@/lib/upload-image";
import { createPet, deletePet, type PetFormValues, updatePet } from "./actions";

const petSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.enum(["DOG", "CAT", "BIRD", "RABBIT", "OTHER"]),
  breed: z.string().optional(),
  age: z.coerce.number().int().min(0).max(30).optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional().nullable(),
  ownerId: z.string().min(1, "Owner is required"),
});

type FormValues = z.infer<typeof petSchema>;

export type OwnerOption = { id: string; name: string | null; email: string };

type PetForEdit = PetRow;

// ---- Create / Edit Dialog ----

type PetDialogProps = {
  pet?: PetForEdit;
  ownerOptions: OwnerOption[];
  trigger?: React.ReactElement;
};

export function PetDialog({ pet, ownerOptions, trigger }: PetDialogProps) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const form = useForm({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: pet?.name ?? "",
      species: (pet?.species as FormValues["species"]) ?? "DOG",
      breed: pet?.breed ?? "",
      age: pet?.age ?? undefined,
      bio: pet?.bio ?? "",
      photoUrl: pet?.photoUrl ?? null,
      ownerId: pet?.ownerId ?? ownerOptions[0]?.id ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const data: PetFormValues = {
      name: values.name,
      species: values.species,
      breed: values.breed || undefined,
      age: values.age,
      bio: values.bio || undefined,
      photoUrl: values.photoUrl ?? undefined,
      ownerId: values.ownerId,
    };

    const result = pet ? await updatePet(pet.id, data) : await createPet(data);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(pet ? "Pet updated" : "Pet created");
    await qc.invalidateQueries({ queryKey: petsQueryKey.list() });
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
              New Pet
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{pet ? "Edit Pet" : "New Pet"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo</FormLabel>
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
                    <Input placeholder="Buddy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="species"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Species</FormLabel>
                    <FormControl>
                      <NativeSelect {...field}>
                        {(["DOG", "CAT", "BIRD", "RABBIT", "OTHER"] as const).map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0) + s.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (years)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={30}
                        placeholder="3"
                        {...field}
                        value={(field.value as number | undefined) ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="Golden Retriever" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <FormControl>
                    <NativeSelect {...field}>
                      {ownerOptions.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name ?? u.email}
                        </option>
                      ))}
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
            {ownerOptions.length === 0 && (
              <p className="text-sm text-destructive">No users found. Create a user first.</p>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={ownerOptions.length === 0 || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving…" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ---- Delete Dialog ----

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
