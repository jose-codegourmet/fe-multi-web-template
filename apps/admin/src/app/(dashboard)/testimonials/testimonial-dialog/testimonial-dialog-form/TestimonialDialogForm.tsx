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
  Switch,
  Textarea,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { testimonialsQueryKey } from "@/hooks/use-testimonials/query";
import type { TestimonialRow } from "@/hooks/use-testimonials/types";
import {
  createTestimonial,
  type TestimonialFormValues as TestimonialActionValues,
  updateTestimonial,
} from "../../actions";
import { getTestimonialDefaultValues } from "./TestimonialDialogForm.defaults";
import { type TestimonialFormValues, testimonialFormSchema } from "./TestimonialDialogForm.schema";

type TestimonialDialogFormProps = {
  testimonial?: TestimonialRow;
  onSuccess?: () => void;
};

export function TestimonialDialogForm({ testimonial, onSuccess }: TestimonialDialogFormProps) {
  const qc = useQueryClient();
  const form = useForm({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: getTestimonialDefaultValues(testimonial),
  });

  async function onSubmit(values: TestimonialFormValues) {
    const data: TestimonialActionValues = {
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
    form.reset();
    onSuccess?.();
  }

  return (
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
