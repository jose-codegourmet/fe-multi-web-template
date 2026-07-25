import { prisma } from "@fe-template/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fe-template/ui";
import { FileTextIcon, MailIcon, PawPrintIcon, UsersIcon } from "lucide-react";
import { PostsChart } from "./posts-chart";

async function getDashboardData() {
  try {
    const [userCount, petCount, postCount, unreadContacts, recentPosts] = await Promise.all([
      prisma.user.count(),
      prisma.pet.count(),
      prisma.post.count(),
      prisma.contact.count({ where: { status: "UNREAD" } }),
      prisma.post.findMany({
        select: { createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
    ]);

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - (5 - index));
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleString("en", { month: "short" }),
        year: date.getFullYear(),
        month: date.getMonth(),
      };
    });

    const postsByMonth = months.map(({ label, year, month }) => ({
      month: label,
      posts: recentPosts.filter((post) => {
        const created = new Date(post.createdAt);
        return created.getFullYear() === year && created.getMonth() === month;
      }).length,
    }));

    return { userCount, petCount, postCount, unreadContacts, postsByMonth };
  } catch {
    return {
      userCount: 0,
      petCount: 0,
      postCount: 0,
      unreadContacts: 0,
      postsByMonth: [
        { month: "Jan", posts: 0 },
        { month: "Feb", posts: 0 },
        { month: "Mar", posts: 0 },
        { month: "Apr", posts: 0 },
        { month: "May", posts: 0 },
        { month: "Jun", posts: 0 },
      ],
    };
  }
}

export default async function DashboardPage() {
  const { userCount, petCount, postCount, unreadContacts, postsByMonth } = await getDashboardData();

  const stats = [
    { label: "Users", value: userCount, icon: UsersIcon },
    { label: "Pets", value: petCount, icon: PawPrintIcon },
    { label: "Posts", value: postCount, icon: FileTextIcon },
    { label: "Unread contacts", value: unreadContacts, icon: MailIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posts per month</CardTitle>
          <CardDescription>Recent publishing activity (last 6 months)</CardDescription>
        </CardHeader>
        <CardContent>
          <PostsChart data={postsByMonth} />
        </CardContent>
      </Card>
    </div>
  );
}
