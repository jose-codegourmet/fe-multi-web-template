import { prisma } from "@fe-template/db";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fe-template/ui";
import {
  ArrowRightIcon,
  FileTextIcon,
  type LucideIcon,
  MailIcon,
  PawPrintIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { CommunityGrowthChart, type GrowthPoint } from "../community-growth-chart";
import { type ActivityItem, RecentActivity } from "../recent-activity";

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDelta(current: number, previous: number) {
  if (previous === 0) {
    if (current === 0) return { label: "No change vs last week", positive: true };
    return { label: `+${current} vs last week`, positive: true };
  }
  const pct = Math.round(((current - previous) / previous) * 100);
  const sign = pct > 0 ? "+" : "";
  return {
    label: `${sign}${pct}% vs last week`,
    positive: pct >= 0,
  };
}

function greetingForHour(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

async function getDashboardData() {
  const now = new Date();
  const thisWeekStart = startOfDay(new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000));
  const lastWeekStart = startOfDay(new Date(thisWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000));

  try {
    const [
      userCount,
      petCount,
      postCount,
      unreadContacts,
      usersThisWeek,
      usersLastWeek,
      petsThisWeek,
      petsLastWeek,
      recentUsers,
      recentPets,
      recentPosts,
      recentContacts,
      recentTestimonials,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.pet.count(),
      prisma.post.count(),
      prisma.contact.count({ where: { status: "UNREAD" } }),
      prisma.user.count({ where: { createdAt: { gte: thisWeekStart } } }),
      prisma.user.count({
        where: { createdAt: { gte: lastWeekStart, lt: thisWeekStart } },
      }),
      prisma.pet.count({ where: { createdAt: { gte: thisWeekStart } } }),
      prisma.pet.count({
        where: { createdAt: { gte: lastWeekStart, lt: thisWeekStart } },
      }),
      prisma.user.findMany({
        select: { id: true, createdAt: true },
        where: {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
          },
        },
      }),
      prisma.pet.findMany({
        select: {
          id: true,
          name: true,
          species: true,
          createdAt: true,
          owner: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.post.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: { select: { name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.contact.findMany({
        select: { id: true, name: true, subject: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      prisma.testimonial.findMany({
        select: { id: true, authorName: true, content: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

    const petsForChart = await prisma.pet.findMany({
      select: { createdAt: true },
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
        },
      },
    });
    const postsForChart = await prisma.post.findMany({
      select: { createdAt: true },
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
        },
      },
    });

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        label: date.toLocaleString("en", { month: "short" }),
        year: date.getFullYear(),
        month: date.getMonth(),
      };
    });

    const growthByMonth: GrowthPoint[] = months.map(({ label, year, month }) => ({
      month: label,
      users: recentUsers.filter((row) => {
        const created = new Date(row.createdAt);
        return created.getFullYear() === year && created.getMonth() === month;
      }).length,
      pets: petsForChart.filter((row) => {
        const created = new Date(row.createdAt);
        return created.getFullYear() === year && created.getMonth() === month;
      }).length,
      posts: postsForChart.filter((row) => {
        const created = new Date(row.createdAt);
        return created.getFullYear() === year && created.getMonth() === month;
      }).length,
    }));

    const activity: ActivityItem[] = [
      ...recentPets.map((pet) => ({
        id: pet.id,
        type: "pet" as const,
        title: `${pet.name} joined`,
        subtitle: `${pet.species} · ${pet.owner.name ?? pet.owner.email}`,
        createdAt: pet.createdAt.toISOString(),
      })),
      ...recentPosts.map((post) => ({
        id: post.id,
        type: "post" as const,
        title: post.title,
        subtitle: `By ${post.author.name ?? post.author.email}`,
        createdAt: post.createdAt.toISOString(),
      })),
      ...recentContacts.map((contact) => ({
        id: contact.id,
        type: "contact" as const,
        title: contact.subject || "New contact message",
        subtitle: contact.name,
        createdAt: contact.createdAt.toISOString(),
      })),
      ...recentTestimonials.map((testimonial) => ({
        id: testimonial.id,
        type: "testimonial" as const,
        title: `Testimonial from ${testimonial.authorName}`,
        subtitle: testimonial.content.slice(0, 72),
        createdAt: testimonial.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    return {
      userCount,
      petCount,
      postCount,
      unreadContacts,
      usersThisWeek,
      usersLastWeek,
      petsThisWeek,
      petsLastWeek,
      growthByMonth,
      activity,
    };
  } catch {
    return {
      userCount: 0,
      petCount: 0,
      postCount: 0,
      unreadContacts: 0,
      usersThisWeek: 0,
      usersLastWeek: 0,
      petsThisWeek: 0,
      petsLastWeek: 0,
      growthByMonth: Array.from({ length: 6 }, (_, index) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - index));
        return {
          month: date.toLocaleString("en", { month: "short" }),
          users: 0,
          pets: 0,
          posts: 0,
        };
      }),
      activity: [] as ActivityItem[],
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const usersDelta = formatDelta(data.usersThisWeek, data.usersLastWeek);
  const petsDelta = formatDelta(data.petsThisWeek, data.petsLastWeek);
  const greeting = greetingForHour(new Date().getHours());

  const stats: {
    label: string;
    value: number;
    icon: LucideIcon;
    delta: { label: string; positive: boolean };
  }[] = [
    {
      label: "Users",
      value: data.userCount,
      icon: UsersIcon,
      delta: usersDelta,
    },
    {
      label: "Pets",
      value: data.petCount,
      icon: PawPrintIcon,
      delta: petsDelta,
    },
    {
      label: "Posts",
      value: data.postCount,
      icon: FileTextIcon,
      delta: { label: "All-time published stories", positive: true },
    },
    {
      label: "Unread contacts",
      value: data.unreadContacts,
      icon: MailIcon,
      delta: {
        label: data.unreadContacts === 0 ? "Inbox clear" : "Needs attention",
        positive: data.unreadContacts === 0,
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{greeting}, Admin.</p>
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">
            Your community at a glance
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            {data.usersThisWeek} new users and {data.petsThisWeek} new pets this week
            {data.usersLastWeek > 0
              ? ` (${usersDelta.label.replace(" vs last week", "")} users vs last week)`
              : ""}
            .
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, delta }) => (
          <Card
            key={label}
            className="relative overflow-hidden rounded-3xl border-border/60 shadow-sm"
          >
            <div className="pointer-events-none absolute -top-8 -right-8 size-28 rounded-full bg-primary/10 blur-2xl" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <Icon className="size-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-semibold tracking-tight">{value}</div>
              <p
                className={`mt-1 text-xs ${delta.positive ? "text-muted-foreground" : "text-destructive"}`}
              >
                {delta.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        <Card className="rounded-3xl border-border/60 shadow-sm xl:col-span-3">
          <CardHeader>
            <CardTitle className="font-display text-xl">Community growth</CardTitle>
            <CardDescription>New users, pets, and posts over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <CommunityGrowthChart data={data.growthByMonth} />
          </CardContent>
        </Card>

        <div className="space-y-4 xl:col-span-2">
          <RecentActivity items={data.activity} />
          <Card className="overflow-hidden rounded-3xl border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-xl">Share a new story</CardTitle>
              <CardDescription>Publish a blog post to keep the community inspired.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button render={<Link href="/posts/new" />} className="rounded-full">
                Write a post
                <ArrowRightIcon className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
