# Admin CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add full Create/Read/Update/Delete to every admin entity (Pets, PricingPlan, Posts, Testimonials, Users, Contacts) using React Hook Form, dialogs, and image upload support.

**Architecture:** React Hook Form handles client-side validation and form state. On submit, `handleSubmit` calls a Server Action directly (not via `<form action>`). Server Actions accept typed objects (not FormData). A reusable Form kit and FileUploader component live in `packages/ui`. Image uploads go through a REST API route at `POST /api/images` in the admin app, which writes to Supabase Storage.

**Tech Stack:** Next.js 16 App Router, React Hook Form + @hookform/resolvers, Zod v4, Prisma, Supabase Storage, TanStack React Query v5, Base UI dialogs via `@fe-template/ui`

## Global Constraints

- Workspace root: `/Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template`
- All new components follow existing patterns in `apps/admin` (Server Component page → `HydrationBoundary` → client component using React Query hook)
- Use components from `@fe-template/ui` (Dialog, AlertDialog, Button, Input, Label, Textarea, NativeSelect, Switch, etc.)
- Server Actions are `"use server"` functions that accept typed objects and return `ActionResult = { success: true } | { success: false; error: string }`
- All mutations call `revalidatePath` after success
- `FileUploader` lives in `packages/ui/src/components/file-uploader/FileUploader.tsx`, exported from `packages/ui/src/index.ts`
- Form kit (Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage) lives in `packages/ui/src/components/form/Form.tsx`, exported from `packages/ui/src/index.ts`
- Image upload API route: `apps/admin/src/app/api/images/route.ts`, accepts `POST` with `FormData` containing a `file` field, returns `{ url: string }`
- Client-side upload helper: `apps/admin/src/lib/upload-image.ts` exports `uploadImage(file: File): Promise<string>`
- Install `react-hook-form` and `@hookform/resolvers` in `apps/admin` only (run `pnpm add react-hook-form @hookform/resolvers` from `apps/admin`)
- PricingPlan price is stored as cents (integer); display/input as dollars (float) in UI, convert on save (`Math.round(dollars * 100)`)
- Zod v4 syntax throughout (`z.string().min(1)`) — matches existing codebase style
- `NativeSelect` renders a native `<select>` via spread props — pass `<option>` children directly, not `<NativeSelectOption>`
- Toast notifications via `sonner`: `import { toast } from "sonner"`
- Query invalidation after mutations: `useQueryClient()` → `qc.invalidateQueries({ queryKey: ... })`

---

### Task 1: Foundation — RHF Install + Form Kit + FileUploader

**Files:**
- Modify: `apps/admin/package.json` — add react-hook-form, @hookform/resolvers (via pnpm)
- Create: `packages/ui/src/components/form/Form.tsx`
- Create: `packages/ui/src/components/file-uploader/FileUploader.tsx`
- Modify: `packages/ui/src/index.ts` — add two new exports

**Interfaces:**
- Produces:
  - `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` from `@fe-template/ui`
  - `FileUploader` from `@fe-template/ui` with props: `{ value?: string | null; onChange: (url: string | null) => void; onUpload: (file: File) => Promise<string>; accept?: string; disabled?: boolean; className?: string }`

- [ ] **Step 1: Install react-hook-form in apps/admin**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template/apps/admin && pnpm add react-hook-form @hookform/resolvers
```

Expected output: packages installed, `apps/admin/package.json` now lists both.

- [ ] **Step 2: Create Form kit**

Create `packages/ui/src/components/form/Form.tsx` with the following content exactly:

```tsx
"use client";

import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { cn } from "../../lib/utils";
import { Label } from "../label/Label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = { name: TName };

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

type FormItemContextValue = { id: string };
const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext.name) {
    throw new Error("useFormField must be used inside <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div data-slot="form-item" className={cn("space-y-1.5", className)} {...props} />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  const { error, formItemId } = useFormField();
  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<"div">) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return (
    <div
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { formDescriptionId } = useFormField();
  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) return null;
  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormField,
  FormMessage,
};
```

- [ ] **Step 3: Create FileUploader component**

Create `packages/ui/src/components/file-uploader/FileUploader.tsx` with the following content:

```tsx
"use client";

import { ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../button/Button";

export type FileUploaderProps = {
  value?: string | null;
  onChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string>;
  accept?: string;
  disabled?: boolean;
  className?: string;
};

export function FileUploader({
  value,
  onChange,
  onUpload,
  accept = "image/*",
  disabled = false,
  className,
}: FileUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploadError(null);
    setUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  if (value) {
    return (
      <div className={cn("relative inline-block", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt="Uploaded image"
          className="h-32 w-32 rounded-xl object-cover ring-1 ring-border"
        />
        {!disabled && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 size-6 rounded-full"
            onClick={() => onChange(null)}
          >
            <XIcon className="size-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload image"
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center transition-colors",
        !disabled && !uploading && "cursor-pointer hover:bg-muted/50",
        (disabled || uploading) && "pointer-events-none opacity-60",
        className,
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => !disabled && !uploading && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={handleInputChange}
        disabled={disabled || uploading}
      />
      {uploading ? (
        <>
          <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Uploading…</p>
        </>
      ) : (
        <>
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
            <ImageIcon className="size-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Drop image here or{" "}
            <span className="text-foreground underline">browse</span>
          </p>
          {uploadError && (
            <p className="text-sm text-destructive">{uploadError}</p>
          )}
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Export from packages/ui index**

Add the following two lines to `packages/ui/src/index.ts` (add them before the `export * from "./lib/utils"` line):

```typescript
export * from "./components/form/Form";
export * from "./components/file-uploader/FileUploader";
```

- [ ] **Step 5: Type-check packages/ui**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template/packages/ui && pnpm tsc --noEmit
```

Expected: 0 errors (or only pre-existing errors unrelated to the new files).

- [ ] **Step 6: Commit**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template
git add packages/ui/src/components/form/ packages/ui/src/components/file-uploader/ packages/ui/src/index.ts apps/admin/package.json pnpm-lock.yaml
git commit -m "feat(ui): add Form kit and FileUploader; install react-hook-form in admin"
```

---

### Task 2: Image Upload API Route

**Files:**
- Create: `apps/admin/src/app/api/images/route.ts`
- Create: `apps/admin/src/lib/upload-image.ts`

**Interfaces:**
- Consumes: `createClient` from `@/lib/supabase/server` (check exact import name by reading `apps/admin/src/lib/supabase/server.ts`)
- Produces:
  - `POST /api/images` → `{ url: string }` (200) or `{ error: string }` (400/401/500)
  - `uploadImage(file: File): Promise<string>` — throws on failure

- [ ] **Step 1: Read the supabase server client file**

Read `apps/admin/src/lib/supabase/server.ts` to find the exact function name and import path for the server-side Supabase client before writing the route.

- [ ] **Step 2: Create the API route**

Create `apps/admin/src/app/api/images/route.ts`:

```typescript
import { NextResponse } from "next/server";

const BUCKET = "admin-uploads";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: Request) {
  // Import the supabase server client using the exact function found in Step 1
  // e.g.: const { createClient } = await import("@/lib/supabase/server");
  //       const supabase = await createClient();
  // Replace the lines below with what you found:
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File too large (max 5 MB)" },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    // Storage bucket may not exist yet — return the real error for debugging
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
```

- [ ] **Step 3: Create uploadImage helper**

Create `apps/admin/src/lib/upload-image.ts`:

```typescript
export async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch("/api/images", { method: "POST", body });

  if (!res.ok) {
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(json.error ?? "Image upload failed");
  }

  const { url } = (await res.json()) as { url: string };
  return url;
}
```

- [ ] **Step 4: Typecheck admin**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template/apps/admin && pnpm typecheck
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template
git add apps/admin/src/app/api/images/ apps/admin/src/lib/upload-image.ts
git commit -m "feat(admin): add image upload API route and uploadImage helper"
```

---

### Task 3: Pets Full CRUD

**Files:**
- Create: `apps/admin/src/app/(dashboard)/pets/actions.ts`
- Create: `apps/admin/src/app/(dashboard)/pets/pet-dialog.tsx`
- Modify: `apps/admin/src/app/(dashboard)/pets/pets-table.tsx` — add Actions column
- Modify: `apps/admin/src/app/(dashboard)/pets/page.tsx` — add New Pet button + fetch ownerOptions

**Interfaces:**
- Consumes (from Task 1):
  - `Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FileUploader` from `@fe-template/ui`
  - `uploadImage` from `@/lib/upload-image`
- Consumes (existing):
  - `petsQueryKey` from `@/hooks/use-pets/query`
  - `PetRow` from `@/hooks/use-pets/types`
  - `Dialog, AlertDialog, Button, Input, NativeSelect, Textarea, Switch` from `@fe-template/ui`
  - `useQueryClient` from `@tanstack/react-query`
  - `toast` from `sonner`

Before starting: read `apps/admin/src/app/(dashboard)/pets/pets-table.tsx` and `apps/admin/src/app/(dashboard)/pets/page.tsx` in full to understand current structure.

- [ ] **Step 1: Create pets/actions.ts**

Create `apps/admin/src/app/(dashboard)/pets/actions.ts`:

```typescript
"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const petSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.enum(["DOG", "CAT", "BIRD", "RABBIT", "OTHER"]),
  breed: z.string().optional(),
  age: z.number().int().min(0).max(30).optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  ownerId: z.string().min(1, "Owner is required"),
});

export type PetFormValues = z.infer<typeof petSchema>;
export type ActionResult = { success: true } | { success: false; error: string };

export async function createPet(data: PetFormValues): Promise<ActionResult> {
  const parsed = petSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    await prisma.pet.create({
      data: {
        name: parsed.data.name,
        species: parsed.data.species,
        breed: parsed.data.breed || null,
        age: parsed.data.age ?? null,
        bio: parsed.data.bio || null,
        photoUrl: parsed.data.photoUrl || null,
        ownerId: parsed.data.ownerId,
      },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create pet" };
  }

  revalidatePath("/pets");
  return { success: true };
}

export async function updatePet(id: string, data: PetFormValues): Promise<ActionResult> {
  const parsed = petSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };

  try {
    await prisma.pet.update({
      where: { id },
      data: {
        name: parsed.data.name,
        species: parsed.data.species,
        breed: parsed.data.breed || null,
        age: parsed.data.age ?? null,
        bio: parsed.data.bio || null,
        photoUrl: parsed.data.photoUrl || null,
        ownerId: parsed.data.ownerId,
      },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update pet" };
  }

  revalidatePath("/pets");
  return { success: true };
}

export async function deletePet(id: string): Promise<ActionResult> {
  try {
    await prisma.pet.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete pet" };
  }
  revalidatePath("/pets");
  return { success: true };
}
```

- [ ] **Step 2: Create pet-dialog.tsx**

Create `apps/admin/src/app/(dashboard)/pets/pet-dialog.tsx`.

This file exports two components: `PetDialog` (create/edit) and `DeletePetDialog` (delete confirm).

```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { petsQueryKey } from "@/hooks/use-pets/query";
import type { PetRow } from "@/hooks/use-pets/types";
import { uploadImage } from "@/lib/upload-image";
import { createPet, deletePet, updatePet, type PetFormValues } from "./actions";

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

type PetForEdit = PetRow & { ownerId?: string; bio?: string | null };

// ---- Create / Edit Dialog ----

type PetDialogProps = {
  pet?: PetForEdit;
  ownerOptions: OwnerOption[];
  trigger?: React.ReactNode;
};

export function PetDialog({ pet, ownerOptions, trigger }: PetDialogProps) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const form = useForm<FormValues>({
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
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm">
            <PlusIcon className="mr-1 size-4" />
            New Pet
          </Button>
        )}
      </DialogTrigger>
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
                        value={field.value ?? ""}
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

type DeletePetDialogProps = {
  pet: PetRow;
  trigger: React.ReactNode;
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
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
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
```

- [ ] **Step 3: Update pets-table.tsx to add Actions column**

Read `apps/admin/src/app/(dashboard)/pets/pets-table.tsx` first.

Add an `ownerOptions: OwnerOption[]` prop to `PetsTable`. Add an `actions` column at the end of `columns`:

```typescript
{
  id: "actions",
  header: "",
  cell: ({ row }) => {
    const pet = row.original;
    return (
      <div className="flex items-center justify-end gap-1">
        <PetDialog
          pet={pet}
          ownerOptions={ownerOptions}
          trigger={
            <Button variant="ghost" size="icon" className="size-8">
              <PencilIcon className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>
          }
        />
        <DeletePetDialog
          pet={pet}
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:text-destructive"
            >
              <Trash2Icon className="size-4" />
              <span className="sr-only">Delete</span>
            </Button>
          }
        />
      </div>
    );
  },
},
```

Add imports: `PencilIcon, Trash2Icon` from `lucide-react`; `PetDialog, DeletePetDialog, type OwnerOption` from `./pet-dialog`.

Because `columns` references `ownerOptions`, the column definitions must be created inside the component function where `ownerOptions` is in scope (not at module level).

- [ ] **Step 4: Update pets page.tsx**

Read `apps/admin/src/app/(dashboard)/pets/page.tsx` first.

Add to the server component:
1. Fetch owner options: `const ownerOptions = await prisma.user.findMany({ select: { id: true, name: true, email: true }, orderBy: { name: "asc" } });`
2. Add import: `import { PetDialog } from "./pet-dialog";`
3. Add a page header with "New Pet" button before the bento grid:
```tsx
<div className="flex items-center justify-between">
  <h1 className="text-2xl font-semibold">Pets</h1>
  <PetDialog ownerOptions={ownerOptions} />
</div>
```
4. Pass `ownerOptions` to `<PetsTable ownerOptions={ownerOptions} />` (update the call site).
5. Pass `ownerOptions` into the `HydrationBoundary` by updating the component to accept and pass it.

- [ ] **Step 5: Typecheck**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template/apps/admin && pnpm typecheck
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template
git add "apps/admin/src/app/(dashboard)/pets/"
git commit -m "feat(admin): add full CRUD for Pets with dialog and image upload"
```

---

### Task 4: PricingPlan Full CRUD + Sidebar

**Files:**
- Create: `apps/admin/src/hooks/use-pricing-plans/types.ts`
- Create: `apps/admin/src/hooks/use-pricing-plans/query.ts`
- Create: `apps/admin/src/hooks/use-pricing-plans/server.ts`
- Create: `apps/admin/src/hooks/use-pricing-plans/client.ts`
- Create: `apps/admin/src/app/(dashboard)/pricing-plans/actions.ts`
- Create: `apps/admin/src/app/(dashboard)/pricing-plans/pricing-plan-dialog.tsx`
- Create: `apps/admin/src/app/(dashboard)/pricing-plans/pricing-plans-list.tsx`
- Create: `apps/admin/src/app/(dashboard)/pricing-plans/page.tsx`
- Modify: `apps/admin/src/modules/layout/AdminSidebar.tsx`

**Interfaces:**
- Produces:
  - `PricingPlanRow`: `{ id, name, nickname, price, interval, description, features, ctaLabel, featured, active, createdAt }`
  - `usePricingPlans()` from `@/hooks/use-pricing-plans/client`
  - `pricingPlansQueryKey` from `@/hooks/use-pricing-plans/query`
  - `/pricing-plans` route in admin

Before starting: Read existing hook files in `apps/admin/src/hooks/use-testimonials/` to follow the exact pattern.

- [ ] **Step 1: Create hooks suite**

`apps/admin/src/hooks/use-pricing-plans/types.ts`:
```typescript
export type PricingPlanRow = {
  id: string;
  name: string;
  nickname: string | null;
  price: number;
  interval: string;
  description: string | null;
  features: string[];
  ctaLabel: string | null;
  featured: boolean;
  active: boolean;
  createdAt: string;
};
```

`apps/admin/src/hooks/use-pricing-plans/query.ts`:
```typescript
export const pricingPlansQueryKey = {
  all: () => ["pricing-plans"] as const,
  list: () => ["pricing-plans", "list"] as const,
};
```

`apps/admin/src/hooks/use-pricing-plans/server.ts`:
```typescript
"use server";

import { prisma } from "@fe-template/db";
import type { PricingPlanRow } from "./types";

export async function fetchPricingPlans(): Promise<PricingPlanRow[]> {
  const plans = await prisma.pricingPlan.findMany({ orderBy: { createdAt: "asc" } });
  return plans.map((p) => ({
    id: p.id,
    name: p.name,
    nickname: p.nickname,
    price: p.price,
    interval: p.interval,
    description: p.description,
    features: p.features,
    ctaLabel: p.ctaLabel,
    featured: p.featured,
    active: p.active,
    createdAt: p.createdAt.toISOString(),
  }));
}
```

`apps/admin/src/hooks/use-pricing-plans/client.ts`:
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { pricingPlansQueryKey } from "./query";
import { fetchPricingPlans } from "./server";

export function usePricingPlans() {
  return useQuery({
    queryKey: pricingPlansQueryKey.list(),
    queryFn: fetchPricingPlans,
  });
}
```

- [ ] **Step 2: Create pricing-plans/actions.ts**

Create `apps/admin/src/app/(dashboard)/pricing-plans/actions.ts`:

```typescript
"use server";

import { prisma } from "@fe-template/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nickname: z.string().optional(),
  price: z.number().int().min(0, "Price must be non-negative"),
  interval: z.enum(["month", "year"]),
  description: z.string().optional(),
  features: z.array(z.string()),
  ctaLabel: z.string().optional(),
  featured: z.boolean(),
  active: z.boolean(),
});

export type PlanFormValues = z.infer<typeof planSchema>;
export type ActionResult = { success: true } | { success: false; error: string };

export async function createPricingPlan(data: PlanFormValues): Promise<ActionResult> {
  const parsed = planSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  try {
    await prisma.pricingPlan.create({ data: { ...parsed.data, description: parsed.data.description || null, nickname: parsed.data.nickname || null, ctaLabel: parsed.data.ctaLabel || null } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create plan" };
  }
  revalidatePath("/pricing-plans");
  return { success: true };
}

export async function updatePricingPlan(id: string, data: PlanFormValues): Promise<ActionResult> {
  const parsed = planSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  try {
    await prisma.pricingPlan.update({ where: { id }, data: { ...parsed.data, description: parsed.data.description || null, nickname: parsed.data.nickname || null, ctaLabel: parsed.data.ctaLabel || null } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update plan" };
  }
  revalidatePath("/pricing-plans");
  return { success: true };
}

export async function deletePricingPlan(id: string): Promise<ActionResult> {
  try {
    await prisma.pricingPlan.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete plan" };
  }
  revalidatePath("/pricing-plans");
  return { success: true };
}
```

- [ ] **Step 3: Create pricing-plan-dialog.tsx**

Create `apps/admin/src/app/(dashboard)/pricing-plans/pricing-plan-dialog.tsx`.

Exports `PricingPlanDialog` (create/edit) and `DeletePricingPlanDialog`.

Form fields:
- `name` (Input, required)
- `nickname` (Input, optional — e.g. "Pro", "Starter")
- `price` (Input type=number, step=0.01, in dollars; multiply by 100 and round when submitting: `Math.round(parseFloat(value) * 100)`)
- `interval` (NativeSelect with options "month" / "year")
- `description` (Textarea, optional)
- `features` (Textarea, one feature per line; split on `\n` when submitting, join with `\n` for display)
- `ctaLabel` (Input, optional — e.g. "Get started")
- `featured` (a row with Label + Switch from `@fe-template/ui`)
- `active` (a row with Label + Switch)

For Switch fields, use `FormField` + `Controller` with `render={({ field }) => <Switch checked={field.value} onCheckedChange={field.onChange} />}`.

In `onSubmit`:
```typescript
const data: PlanFormValues = {
  name: values.name,
  nickname: values.nickname || undefined,
  price: Math.round(values.priceInDollars * 100),
  interval: values.interval,
  description: values.description || undefined,
  features: values.featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
  ctaLabel: values.ctaLabel || undefined,
  featured: values.featured,
  active: values.active,
};
```

Pattern: Same `useForm` + `zodResolver` + Server Action + `useQueryClient().invalidateQueries` + `toast` as PetDialog.

- [ ] **Step 4: Create pricing-plans-list.tsx**

Create `apps/admin/src/app/(dashboard)/pricing-plans/pricing-plans-list.tsx`:

```typescript
"use client";

import { Badge, Button } from "@fe-template/ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { usePricingPlans } from "@/hooks/use-pricing-plans/client";
import { DeletePricingPlanDialog, PricingPlanDialog } from "./pricing-plan-dialog";

export function PricingPlansList() {
  const { data: plans = [] } = usePricingPlans();

  if (plans.length === 0) {
    return <p className="text-sm text-muted-foreground">No pricing plans yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{plan.name}</h3>
              {plan.nickname && (
                <p className="text-sm text-muted-foreground">{plan.nickname}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <PricingPlanDialog
                plan={plan}
                trigger={
                  <Button variant="ghost" size="icon" className="size-8">
                    <PencilIcon className="size-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                }
              />
              <DeletePricingPlanDialog
                plan={plan}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                  >
                    <Trash2Icon className="size-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                }
              />
            </div>
          </div>
          <p className="mb-2 text-2xl font-bold">
            ${(plan.price / 100).toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground">/{plan.interval}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {plan.featured && <Badge>Featured</Badge>}
            <Badge variant={plan.active ? "default" : "secondary"}>
              {plan.active ? "Active" : "Inactive"}
            </Badge>
          </div>
          {plan.features.length > 0 && (
            <ul className="mt-3 space-y-1">
              {plan.features.map((f, i) => (
                <li key={i} className="text-sm text-muted-foreground">
                  · {f}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create pricing-plans page.tsx**

Create `apps/admin/src/app/(dashboard)/pricing-plans/page.tsx`:

```typescript
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { pricingPlansQueryKey } from "@/hooks/use-pricing-plans/query";
import { fetchPricingPlans } from "@/hooks/use-pricing-plans/server";
import { PricingPlanDialog } from "./pricing-plan-dialog";
import { PricingPlansList } from "./pricing-plans-list";

export default async function PricingPlansPage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: pricingPlansQueryKey.list(),
    queryFn: fetchPricingPlans,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pricing Plans</h1>
          <PricingPlanDialog />
        </div>
        <PricingPlansList />
      </div>
    </HydrationBoundary>
  );
}
```

- [ ] **Step 6: Update AdminSidebar**

In `apps/admin/src/modules/layout/AdminSidebar.tsx`:

1. Add import: `CreditCardIcon` from `lucide-react`
2. Add to `NAV_ITEMS` array: `{ href: "/pricing-plans", label: "Pricing", icon: CreditCardIcon }`
   — place it after Blog and before Testimonials.

- [ ] **Step 7: Typecheck**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template/apps/admin && pnpm typecheck
```

Expected: 0 errors.

- [ ] **Step 8: Commit**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template
git add "apps/admin/src/app/(dashboard)/pricing-plans/" apps/admin/src/hooks/use-pricing-plans/ apps/admin/src/modules/layout/AdminSidebar.tsx
git commit -m "feat(admin): add PricingPlan CRUD page and sidebar nav entry"
```

---

### Task 5: Posts CRUD (delete + RHF refactor)

**Files:**
- Modify: `apps/admin/src/app/(dashboard)/posts/actions.ts` — change `createPost`/`updatePost` to accept typed objects; add `deletePost`
- Modify: `apps/admin/src/app/(dashboard)/posts/post-form/PostForm.tsx` — rewrite to use React Hook Form
- Modify: `apps/admin/src/app/(dashboard)/posts/posts-table.tsx` — add Delete column

Before starting: Read all three files in full.

**Interfaces:**
- Consumes (from Task 1): `Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FileUploader` from `@fe-template/ui`
- Consumes (from Task 2): `uploadImage` from `@/lib/upload-image`

- [ ] **Step 1: Refactor actions.ts**

Rewrite `apps/admin/src/app/(dashboard)/posts/actions.ts`.

Change `createPost` and `updatePost` to accept a typed `PostFormData` object (not `FormData`). Remove the `useActionState` pattern (`_prev: PostFormState` signature). Return `ActionResult = { success: true } | { success: false; error: string }` instead of `PostFormState`. After success, call `revalidatePath` and `redirect` (keep redirect for post save to navigate back to list).

Add `deletePost`:
```typescript
export async function deletePost(id: string): Promise<ActionResult> {
  try {
    await prisma.post.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete post" };
  }
  revalidatePath("/posts");
  return { success: true };
}
```

New action signatures:
```typescript
export type PostFormData = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  tags?: string;
  published: boolean;
  authorId: string;
};

export async function createPost(data: PostFormData): Promise<ActionResult>
export async function updatePost(id: string, data: PostFormData): Promise<ActionResult>
```

Keep the Zod schema and validation logic internally. After success: call `revalidatePath("/posts")`, then `redirect("/posts")`.

- [ ] **Step 2: Rewrite PostForm.tsx**

Rewrite `apps/admin/src/app/(dashboard)/posts/post-form/PostForm.tsx` to use React Hook Form.

Keep the same visual layout but use `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `FileUploader` from `@fe-template/ui`.

Replace `useActionState` with:
```typescript
const form = useForm<PostFormValues>({ resolver: zodResolver(postSchema), defaultValues });
```

The `onSubmit` handler calls the Server Action with the form values object directly:
```typescript
async function onSubmit(values: PostFormValues) {
  const result = defaultValues.id
    ? await updatePost(defaultValues.id, values)
    : await createPost(values);
  if (!result.success) {
    toast.error(result.error);
  }
  // redirect happens server-side on success
}
```

Add `FileUploader` for `coverImage` field with `onUpload={uploadImage}`.

- [ ] **Step 3: Add Delete to posts-table.tsx**

Read `apps/admin/src/app/(dashboard)/posts/posts-table.tsx`.

Add an `actions` column with a Delete button using `AlertDialog`. On confirm: call `deletePost(post.id)`, then `qc.invalidateQueries({ queryKey: postsQueryKey.list() })`, toast.

Import `postsQueryKey` from `@/hooks/use-posts/query` (read that file to find the exact export name).

- [ ] **Step 4: Typecheck**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template/apps/admin && pnpm typecheck
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template
git add "apps/admin/src/app/(dashboard)/posts/"
git commit -m "feat(admin): add post delete; refactor post-form to React Hook Form"
```

---

### Task 6: Testimonials Full CRUD

**Files:**
- Modify: `apps/admin/src/app/(dashboard)/testimonials/actions.ts` — add create, update, delete
- Create: `apps/admin/src/app/(dashboard)/testimonials/testimonial-dialog.tsx`
- Modify: `apps/admin/src/app/(dashboard)/testimonials/testimonials-list.tsx` — add Edit/Delete buttons per card
- Modify: `apps/admin/src/app/(dashboard)/testimonials/page.tsx` — add "New Testimonial" button

Before starting: Read all existing files in `apps/admin/src/app/(dashboard)/testimonials/`.

- [ ] **Step 1: Update testimonials/actions.ts**

Keep `toggleTestimonialPublished`. Add:

```typescript
import { z } from "zod";

const testimonialSchema = z.object({
  content: z.string().min(1, "Content is required"),
  authorName: z.string().min(1, "Author name is required"),
  petName: z.string().optional(),
  rating: z.number().int().min(1).max(5),
  published: z.boolean(),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;
export type ActionResult = { success: true } | { success: false; error: string };

export async function createTestimonial(data: TestimonialFormValues): Promise<ActionResult> {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  try {
    await prisma.testimonial.create({
      data: { ...parsed.data, petName: parsed.data.petName || null },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to create" };
  }
  revalidatePath("/testimonials");
  return { success: true };
}

export async function updateTestimonial(id: string, data: TestimonialFormValues): Promise<ActionResult> {
  const parsed = testimonialSchema.safeParse(data);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid data" };
  try {
    await prisma.testimonial.update({
      where: { id },
      data: { ...parsed.data, petName: parsed.data.petName || null },
    });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to update" };
  }
  revalidatePath("/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  try {
    await prisma.testimonial.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete" };
  }
  revalidatePath("/testimonials");
  return { success: true };
}
```

- [ ] **Step 2: Create testimonial-dialog.tsx**

Create `apps/admin/src/app/(dashboard)/testimonials/testimonial-dialog.tsx`.

Exports: `TestimonialDialog` (create/edit) and `DeleteTestimonialDialog`.

Form fields:
- `content` (Textarea, required)
- `authorName` (Input, required)
- `petName` (Input, optional)
- `rating` (Input type=number, min=1, max=5, default 5)
- `published` (Switch with label)

Pattern: Same RHF + SA + `useQueryClient` + toast as PetDialog.
Query key: `testimonialsQueryKey` from `@/hooks/use-testimonials/query`.

- [ ] **Step 3: Update testimonials-list.tsx**

In `TestimonialCard`, add an Edit button (opens `TestimonialDialog` with the row data) and a Delete button (opens `DeleteTestimonialDialog`) in the card header action area alongside the existing Switch.

The `TestimonialCard` receives the full `TestimonialRow` — all fields needed for the edit form are already on the type.

- [ ] **Step 4: Update testimonials page.tsx**

Read `apps/admin/src/app/(dashboard)/testimonials/page.tsx`.

Add a "New Testimonial" button opening `TestimonialDialog` in the page header. Keep the HydrationBoundary structure.

- [ ] **Step 5: Typecheck + commit**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template/apps/admin && pnpm typecheck
git add "apps/admin/src/app/(dashboard)/testimonials/"
git commit -m "feat(admin): add full CRUD for Testimonials"
```

---

### Task 7: Users Full CRUD

**Files:**
- Modify: `apps/admin/src/app/(dashboard)/users/actions.ts` — add createUser, updateUser, deleteUser
- Create: `apps/admin/src/app/(dashboard)/users/user-dialog.tsx`
- Modify: `apps/admin/src/app/(dashboard)/users/users-table.tsx` — add Actions column
- Modify: `apps/admin/src/app/(dashboard)/users/page.tsx` — add "New User" button

Before starting: Read all files in `apps/admin/src/app/(dashboard)/users/` (including `[id]/`), plus `apps/admin/src/hooks/use-users/types.ts`.

**Note on user creation:** Admin creates a DB `User` row directly via Prisma. The `email` field is the unique key. This is sufficient for admin management; Supabase auth is a separate concern.

- [ ] **Step 1: Update users/actions.ts**

Keep `updateUserRole`. Add:

```typescript
import { z } from "zod";

const userCreateSchema = z.object({
  email: z.string().email("Valid email required"),
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

const userUpdateSchema = z.object({
  name: z.string().optional(),
  role: z.enum(["USER", "ADMIN"]),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type UserCreateValues = z.infer<typeof userCreateSchema>;
export type UserUpdateValues = z.infer<typeof userUpdateSchema>;
export type ActionResult = { success: true } | { success: false; error: string };

export async function createUser(data: UserCreateValues): Promise<ActionResult> { ... }
export async function updateUser(id: string, data: UserUpdateValues): Promise<ActionResult> { ... }
export async function deleteUser(id: string): Promise<ActionResult> { ... }
```

For `createUser`: `prisma.user.create(...)`. For `updateUser`: `prisma.user.update(...)`. For `deleteUser`: `prisma.user.delete(...)`. All follow the same Zod + try/catch + revalidatePath pattern.

- [ ] **Step 2: Create user-dialog.tsx**

Create `apps/admin/src/app/(dashboard)/users/user-dialog.tsx`.

Exports: `UserDialog` (create/edit) and `DeleteUserDialog`.

Create form fields: email (Input), name (Input, optional), role (NativeSelect: USER/ADMIN), bio (Textarea, optional), avatarUrl (FileUploader with `onUpload={uploadImage}`).

Edit form fields: same but without email (email is unique key, don't allow changing it).

The dialog component distinguishes create vs edit by whether a `user` prop is passed:
```typescript
type UserDialogProps = {
  user?: UserRow;
  trigger?: React.ReactNode;
};
```

Pattern: Same as PetDialog (useForm, zodResolver, handleSubmit → SA, useQueryClient invalidate, toast).
Query key: `usersQueryKey` from `@/hooks/use-users/query`.

- [ ] **Step 3: Update users-table.tsx**

Add an `actions` column with Edit (opens `UserDialog` with the row) and Delete (opens `DeleteUserDialog`) buttons. Keep the existing user detail link on the name column.

Move the `columns` definition inside the component body so it can close over `qc` if needed, or pass handlers as props.

- [ ] **Step 4: Update users page.tsx**

Add a "New User" button opening `UserDialog` in the page header.

- [ ] **Step 5: Typecheck + commit**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template/apps/admin && pnpm typecheck
git add "apps/admin/src/app/(dashboard)/users/"
git commit -m "feat(admin): add full CRUD for Users"
```

---

### Task 8: Contacts Delete

**Files:**
- Modify: `apps/admin/src/app/(dashboard)/contacts/actions.ts` — add deleteContact
- Modify: `apps/admin/src/app/(dashboard)/contacts/contacts-list.tsx` — add delete button per contact

Before starting: Read both files in full. Also read `apps/admin/src/hooks/use-contacts/query.ts` for the query key.

- [ ] **Step 1: Add deleteContact to actions.ts**

```typescript
export type ActionResult = { success: true } | { success: false; error: string };

export async function deleteContact(id: string): Promise<ActionResult> {
  try {
    await prisma.contact.delete({ where: { id } });
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to delete contact" };
  }
  revalidatePath("/contacts");
  return { success: true };
}
```

- [ ] **Step 2: Add Delete button to contacts-list.tsx**

In each contact item, add a Trash2 icon button wrapped in `AlertDialog`.

On confirm: call `deleteContact(contact.id)` (wrapped in `useTransition` for pending state), then `qc.invalidateQueries({ queryKey: contactsQueryKey.list() })`, toast.

Import `useQueryClient` from `@tanstack/react-query` and `contactsQueryKey` from `@/hooks/use-contacts/query`.

- [ ] **Step 3: Typecheck + commit**

```bash
cd /Users/joseadrianbuctuanon/Documents/web_work/templates/fe-multi-web-template/apps/admin && pnpm typecheck
git add "apps/admin/src/app/(dashboard)/contacts/"
git commit -m "feat(admin): add delete action for Contacts"
```
