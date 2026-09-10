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
import { testimonialsQueryKey } from "@/hooks/use-testimonials/query";
import type { TestimonialRow } from "@/hooks/use-testimonials/types";
import { deleteTestimonial } from "../actions";
import { TestimonialDialogForm } from "./testimonial-dialog-form/TestimonialDialogForm";

type TestimonialDialogProps = {
  testimonial?: TestimonialRow;
  trigger?: React.ReactElement;
};

export function TestimonialDialog({ testimonial, trigger }: TestimonialDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger ?? (
            <Button size="sm">
              <PlusIcon className="mr-1 size-4" />
              New Testimonial
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
        </DialogHeader>
        <TestimonialDialogForm testimonial={testimonial} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

type DeleteTestimonialDialogProps = {
  testimonial: TestimonialRow;
  trigger: React.ReactElement;
};

export function DeleteTestimonialDialog({ testimonial, trigger }: DeleteTestimonialDialogProps) {
  const qc = useQueryClient();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    const result = await deleteTestimonial(testimonial.id);
    setPending(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("Testimonial deleted");
    await qc.invalidateQueries({ queryKey: testimonialsQueryKey.list() });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={trigger} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete testimonial from {testimonial.authorName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this testimonial. This action cannot be undone.
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
