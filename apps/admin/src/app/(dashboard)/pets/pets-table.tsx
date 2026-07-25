"use client";

import { Badge, DataTable } from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";

export type PetRow = {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  ownerName: string | null;
  ownerEmail: string;
  createdAt: string;
};

const columns: ColumnDef<PetRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "species",
    header: "Species",
    cell: ({ row }) => <Badge variant="secondary">{row.original.species}</Badge>,
  },
  {
    accessorKey: "breed",
    header: "Breed",
    cell: ({ row }) => row.original.breed ?? "—",
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => row.original.age ?? "—",
  },
  {
    id: "owner",
    accessorFn: (row) => row.ownerName ?? row.ownerEmail,
    header: "Owner",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.ownerName ?? "—"}</div>
        <div className="text-xs text-muted-foreground">{row.original.ownerEmail}</div>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];

export function PetsTable({ data }: { data: PetRow[] }) {
  return (
    <DataTable columns={columns} data={data} filterColumn="name" filterPlaceholder="Search pets…" />
  );
}
