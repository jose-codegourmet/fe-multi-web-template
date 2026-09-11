import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite";
import { usersQueryKey } from "@/hooks/use-users/query";
import type { UserRow } from "@/hooks/use-users/types";
import { SeededQueryProvider } from "@/storybook/seeded-query";
import { UsersTable } from "./UsersTable";

const storyUsers: UserRow[] = [
  {
    id: "user_ada",
    name: "Ada Admin",
    email: "ada@pawpair.example",
    avatarUrl: null,
    role: "ADMIN",
    status: "VERIFIED",
    bio: "Operations",
    petsCount: 2,
    createdAt: "2025-11-02T00:00:00.000Z",
  },
  {
    id: "user_ben",
    name: "Ben Walker",
    email: "ben@pawpair.example",
    avatarUrl: null,
    role: "USER",
    status: "PENDING",
    bio: null,
    petsCount: 1,
    createdAt: "2026-02-18T00:00:00.000Z",
  },
  {
    id: "user_cara",
    name: "Cara Nguyen",
    email: "cara@pawpair.example",
    avatarUrl: null,
    role: "USER",
    status: "DEACTIVATED",
    bio: null,
    petsCount: 0,
    createdAt: "2025-08-09T00:00:00.000Z",
  },
  {
    id: "user_demo",
    name: "Demo Owner",
    email: "demo@pawpair.example",
    avatarUrl: null,
    role: "USER",
    status: "MOCK",
    bio: "Seed account",
    petsCount: 3,
    createdAt: "2026-03-01T00:00:00.000Z",
  },
];

function withUsers(users: UserRow[]): Decorator {
  return function SeededUsersDecorator(Story) {
    return (
      <SeededQueryProvider
        seed={(client) => {
          client.setQueryData(usersQueryKey.list(), users);
        }}
      >
        <Story />
      </SeededQueryProvider>
    );
  };
}

const meta: Meta<typeof UsersTable> = {
  title: "Admin/Users/UsersTable",
  component: UsersTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [withUsers(storyUsers)],
};

export default meta;
type Story = StoryObj<typeof UsersTable>;

export const Default: Story = {};

export const Empty: Story = {
  decorators: [withUsers([])],
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
