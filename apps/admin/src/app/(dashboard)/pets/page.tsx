import { prisma } from "@fe-template/db";
import { Card, CardContent, CardHeader, CardTitle } from "@fe-template/ui";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { CatIcon, DogIcon, PawPrintIcon, RabbitIcon } from "lucide-react";
import { petsQueryKey } from "@/hooks/use-pets/query";
import { fetchPets } from "@/hooks/use-pets/server";
import { PetDialog } from "./pet-dialog/PetDialog";
import { PetsTable } from "./pets-table";

async function getSpeciesStats() {
  try {
    const [total, grouped] = await Promise.all([
      prisma.pet.count(),
      prisma.pet.groupBy({ by: ["species"], _count: { _all: true } }),
    ]);
    const counts = Object.fromEntries(grouped.map((row) => [row.species, row._count._all]));
    const dogs = counts.DOG ?? 0;
    const cats = counts.CAT ?? 0;
    const other = total - dogs - cats;
    return { total, dogs, cats, other };
  } catch {
    return { total: 0, dogs: 0, cats: 0, other: 0 };
  }
}

export default async function PetsPage() {
  const queryClient = new QueryClient();
  const [stats, ownerOptions] = await Promise.all([
    getSpeciesStats(),
    prisma.user.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    queryClient.prefetchQuery({ queryKey: petsQueryKey.list(), queryFn: fetchPets }),
  ]);

  const bento = [
    { label: "Total pets", value: stats.total, icon: PawPrintIcon },
    { label: "Dogs", value: stats.dogs, icon: DogIcon },
    { label: "Cats", value: stats.cats, icon: CatIcon },
    { label: "Other", value: stats.other, icon: RabbitIcon },
  ];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Pets</h1>
          <PetDialog ownerOptions={ownerOptions} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {bento.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="rounded-3xl border-border/60 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
                <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="font-display text-3xl font-semibold tracking-tight">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <PetsTable ownerOptions={ownerOptions} />
      </div>
    </HydrationBoundary>
  );
}
