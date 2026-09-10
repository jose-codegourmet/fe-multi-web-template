# `@fe-template/ui` Examples

Practical examples of using the shared UI package in consuming apps.

---

## Basic import

```tsx
import { Button, Card, Badge } from "@fe-template/ui";

export function Example() {
  return (
    <Card>
      <CardHeader>
        <Badge>New</Badge>
      </CardHeader>
      <CardContent>
        <Button>Click me</Button>
      </CardContent>
    </Card>
  );
}
```

---

## Using variant helpers

```tsx
import { buttonVariants } from "@fe-template/ui";
import Link from "next/link";

export function LinkButton() {
  return (
    <Link href="/" className={buttonVariants({ variant: "outline" })}>
      Home
    </Link>
  );
}
```

---

## Form integration (admin)

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, Input, Button } from "@fe-template/ui";

export function SampleForm() {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

Real reference: `apps/admin/src/modules/auth/login-form/LoginForm.tsx`.

---

## DataTable (admin)

```tsx
import { DataTable } from "@fe-template/ui";
import { columns } from "./columns";

export function UserList({ users }: { users: User[] }) {
  return <DataTable columns={columns} data={users} />;
}
```

Real reference: `apps/admin/src/app/(dashboard)/users/users-table.tsx`.

---

## ScrollReveal (web)

```tsx
import { ScrollReveal } from "@fe-template/ui";

export function FeatureSection() {
  return (
    <ScrollReveal>
      <div className="...">Feature content</div>
    </ScrollReveal>
  );
}
```

Real reference: most sections under `apps/web/src/sections/home/`.

---

## Chart (admin)

```tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@fe-template/ui";

export function StatsChart() {
  return (
    <ChartContainer config={config}>
      {/* Recharts chart here */}
    </ChartContainer>
  );
}
```

Real reference: `apps/admin/src/app/(dashboard)/community-growth-chart.tsx`.

---

## Tailwind wiring in consuming apps

Each app must declare both of these for the package to work correctly:

```ts
// next.config.ts
export default {
  transpilePackages: ["@fe-template/ui"],
};
```

```css
/* globals.css */
@source "../../../../packages/ui/src/**/*.{ts,tsx}";
```

Real references:
- `apps/web/next.config.ts`
- `apps/web/src/app/globals.css`
- `apps/admin/next.config.ts`
- `apps/admin/src/app/globals.css`

---

## Discouraged usage

- Do not import app-specific code into `packages/ui`.
- Do not use the subpath exports (`@fe-template/ui/button`) unless the project has agreed on subpath usage. Today all apps use the barrel.
- Do not add business logic to primitives. Keep them composable.
