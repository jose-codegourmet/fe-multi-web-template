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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch,
  Textarea,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { testimonialsQueryKey } from "@/hooks/use-testimonials/query";
import type { TestimonialRow } from "@/hooks/use-testimonials/types";
import {
  createTestimonial,
  deleteTestimonial,
  type TestimonialFormValues,
  updateTestimonial,
} from "./actions";

const testimonialFormSchema = z.object({
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required"),
  petName: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  published: z.boolean(),
});

type FormValues = z.infer<typeof testimonialFormSchema>;

// ---- Create / Edit Dialog ----

type TestimonialDialogProps = {
  testimonial?: TestimonialRow;
  trigger?: React.ReactElement;
};

export function TestimonialDialog({ testimonial, trigger }: TestimonialDialogProps) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const form = useForm({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      content: testimonial?.content ?? "",
      authorName: testimonial?.authorName ?? "",
      petName: testimonial?.petName ?? "",
      rating: testimonial?.rating ?? 5,
      published: testimonial?.published ?? false,
    },
  });

  async function onSubmit(values: FormValues) {
    const data: TestimonialFormValues = {
      content: values.content,
      authorName: values.authorName,
      petName: values.petName || undefined,
      rating: values.rating,
      published: values.published,
    };

    const result = testimonial
      ? await updateTestimonial(testimonial.id, data)
      : await createTestimonial(data);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(testimonial ? "Testimonial updated" : "Testimonial created");
    await qc.invalidateQueries({ queryKey: testimonialsQueryKey.list() });
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
              New Testimonial
            </Button>
          )
        }
      />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{testimonial ? "Edit Testimonial" : "New Testimonial"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea rows={4} className="rounded-2xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="petName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet name (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Buddy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={5} {...field} value={field.value as number} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Published</FormLabel>
                  </div>
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

// ---- Delete Dialog ----

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
