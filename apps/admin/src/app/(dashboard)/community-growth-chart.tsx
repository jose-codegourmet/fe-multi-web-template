"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@fe-template/ui";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  users: {
    label: "Users",
    color: "var(--chart-1)",
  },
  pets: {
    label: "Pets",
    color: "var(--chart-2)",
  },
  posts: {
    label: "Posts",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export type GrowthPoint = {
  month: string;
  users: number;
  pets: number;
  posts: number;
};

type CommunityGrowthChartProps = {
  data: GrowthPoint[];
};

export function CommunityGrowthChart({ data }: CommunityGrowthChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[280px] w-full">
      <AreaChart accessibilityLayer data={data} margin={{ left: 8, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-users)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-users)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillPets" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-pets)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-pets)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillPosts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-posts)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--color-posts)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="users"
          stroke="var(--color-users)"
          fill="url(#fillUsers)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="pets"
          stroke="var(--color-pets)"
          fill="url(#fillPets)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="posts"
          stroke="var(--color-posts)"
          fill="url(#fillPosts)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
