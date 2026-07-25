"use client";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@fe-template/ui";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  posts: {
    label: "Posts",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

type PostsChartProps = {
  data: { month: string; posts: number }[];
};

export function PostsChart({ data }: PostsChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[240px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="posts" fill="var(--color-posts)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
