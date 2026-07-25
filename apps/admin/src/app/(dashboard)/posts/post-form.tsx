"use client";

import { Button, Input, Label, Textarea } from "@fe-template/ui";
import { useActionState, useState } from "react";
import { createPost, type PostFormState, updatePost } from "./actions";

export type PostFormValues = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string;
  published: boolean;
  authorId: string;
};

type AuthorOption = {
  id: string;
  name: string | null;
  email: string;
};

const initialState: PostFormState = {};

export function PostForm({
  authors,
  defaultValues,
}: {
  authors: AuthorOption[];
  defaultValues: PostFormValues;
}) {
  const action = defaultValues.id ? updatePost.bind(null, defaultValues.id) : createPost;

  const [state, formAction, pending] = useActionState(action, initialState);
  const [published, setPublished] = useState(defaultValues.published);

  return (
    <form action={formAction} className="relative mx-auto max-w-3xl space-y-6 pb-24">
      <div className="space-y-2">
        <Label htmlFor="title" className="sr-only">
          Title
        </Label>
        <Input
          id="title"
          name="title"
          required
          defaultValue={defaultValues.title}
          placeholder="Post title"
          className="h-auto border-0 bg-transparent px-0 font-display text-3xl font-semibold tracking-tight shadow-none focus-visible:ring-0 md:text-4xl"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" required defaultValue={defaultValues.slug} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="authorId">Author</Label>
          <select
            id="authorId"
            name="authorId"
            required
            defaultValue={defaultValues.authorId}
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
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={defaultValues.excerpt}
          className="rounded-2xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          required
          rows={14}
          defaultValue={defaultValues.content}
          className="rounded-2xl font-sans leading-relaxed"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" name="tags" defaultValue={defaultValues.tags} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover image URL</Label>
          <Input
            id="coverImage"
            name="coverImage"
            type="url"
            defaultValue={defaultValues.coverImage}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          id="published"
          name="published"
          type="checkbox"
          checked={published}
          onChange={(event) => setPublished(event.target.checked)}
          className="size-4 rounded border border-input"
        />
        <Label htmlFor="published">Published</Label>
      </div>

      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

      {authors.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Create at least one user in the database before publishing posts.
        </p>
      ) : null}

      <div className="sticky bottom-4 z-10 flex items-center justify-end gap-2 rounded-2xl border border-border/60 bg-card/95 p-3 shadow-lg backdrop-blur">
        <Button type="submit" disabled={pending || authors.length === 0} className="rounded-full">
          {pending ? "Saving…" : defaultValues.id ? "Update post" : "Create post"}
        </Button>
      </div>
    </form>
  );
}
