import { prisma } from "@fe-template/db";
import { NextResponse } from "next/server";

export async function GET() {
  const plans = await prisma.pricingPlan.findMany({
    where: { active: true },
    orderBy: { price: "asc" },
  });

  return NextResponse.json(
    plans.map((plan) => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      interval: plan.interval,
      nickname: plan.nickname ?? "",
      description: plan.description ?? "",
      features: plan.features,
      ctaLabel: plan.ctaLabel ?? "Get started",
      featured: plan.featured,
    })),
  );
}
