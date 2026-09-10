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
  Label,
  Textarea,
} from "@fe-template/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { uploadImage } from "@/lib/upload-image";
import { createPost, type PostFormData, updatePost } from "../actions";
import type { PostFormValues } from "./PostForm.defaults";
import { type PostFormSchemaValues, postFormSchema } from "./PostForm.schema";

type AuthorOption = {
  id: string;
  name: string | null;
  email: string;
};

export function PostForm({
  authors,
  defaultValues,
}: {
  authors: AuthorOption[];
  defaultValues: PostFormValues;
}) {
  const form = useForm({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: defaultValues.title,
      slug: defaultValues.slug,
      excerpt: defaultValues.excerpt,
      content: defaultValues.content,
      coverImage: defaultValues.coverImage || null,
      tags: defaultValues.tags,
      published: defaultValues.published,
      authorId: defaultValues.authorId,
    },
  });

  async function onSubmit(values: PostFormSchemaValues) {
    const data: PostFormData = {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt || undefined,
      content: values.content,
      coverImage: values.coverImage || undefined,
      tags: values.tags,
      published: values.published,
      authorId: values.authorId,
    };

    const result = defaultValues.id
      ? await updatePost(defaultValues.id, data)
      : await createPost(data);

    if (!result.success) {
      toast.error(result.error);
      return;
    }
    // redirect happens server-side on success
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative mx-auto max-w-3xl space-y-6 pb-24"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Post title"
                  className="h-auto border-0 bg-transparent px-0 font-display text-3xl font-semibold tracking-tight shadow-none focus-visible:ring-0 md:text-4xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover image</FormLabel>
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

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
                  >
                    <option value="" disabled>
                      Select author
                    </option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name ? `${author.name} (${author.email})` : author.email}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} className="rounded-2xl" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} rows={14} className="rounded-2xl font-sans leading-relaxed" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <div className="flex items-center gap-3">
                <input
                  id="published"
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="size-4 rounded border border-input"
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {authors.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Create at least one user in the database before publishing posts.
          </p>
        ) : null}

        <div className="sticky bottom-4 z-10 flex items-center justify-end gap-2 rounded-2xl border border-border/60 bg-card/95 p-3 shadow-lg backdrop-blur">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || authors.length === 0}
            className="rounded-full"
          >
            {form.formState.isSubmitting
              ? "Saving…"
              : defaultValues.id
                ? "Update post"
                : "Create post"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export type { PostFormValues } from "./PostForm.defaults";
