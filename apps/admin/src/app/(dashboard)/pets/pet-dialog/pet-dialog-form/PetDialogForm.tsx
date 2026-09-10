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
import { petsQueryKey } from "@/hooks/use-pets/query";
import type { PetRow } from "@/hooks/use-pets/types";
import { uploadImage } from "@/lib/upload-image";
import { createPet, type PetFormValues as PetActionValues, updatePet } from "../../actions";
import { getPetDefaultValues, type OwnerOption } from "./PetDialogForm.defaults";
import { type PetFormValues, petSchema } from "./PetDialogForm.schema";

type PetDialogFormProps = {
  pet?: PetRow;
  ownerOptions: OwnerOption[];
  onSuccess?: () => void;
};

export function PetDialogForm({ pet, ownerOptions, onSuccess }: PetDialogFormProps) {
  const qc = useQueryClient();
  const form = useForm({
    resolver: zodResolver(petSchema),
    defaultValues: getPetDefaultValues(pet, ownerOptions),
  });

  async function onSubmit(values: PetFormValues) {
    const data: PetActionValues = {
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
    form.reset();
    onSuccess?.();
  }

  return (
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
          <Button type="submit" disabled={ownerOptions.length === 0 || form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
