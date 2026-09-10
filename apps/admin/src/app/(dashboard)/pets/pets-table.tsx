"use client";

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, DataTable } from "@fe-template/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { PawPrintIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { usePets } from "@/hooks/use-pets/client";
import type { PetRow } from "@/hooks/use-pets/types";
import { DeletePetDialog, type OwnerOption, PetDialog } from "./pet-dialog/PetDialog";

const SPECIES_FILTERS = ["ALL", "DOG", "CAT", "BIRD", "RABBIT", "OTHER"] as const;

function speciesBadgeClass(species: string) {
  switch (species) {
    case "DOG":
      return "bg-primary/15 text-primary hover:bg-primary/15";
    case "CAT":
      return "bg-[color:var(--color-brand-lavender)]/20 text-[color:var(--color-brand-lavender)] hover:bg-[color:var(--color-brand-lavender)]/20";
    case "BIRD":
      return "bg-[color:var(--color-brand-sky)]/20 text-[color:var(--color-brand-sky)] hover:bg-[color:var(--color-brand-sky)]/20";
    case "RABBIT":
      return "bg-[color:var(--color-brand-mint)]/20 text-[color:var(--color-brand-mint)] hover:bg-[color:var(--color-brand-mint)]/20";
    default:
      return "";
  }
}

function addedAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Added today";
  if (days === 1) return "Added 1d ago";
  return `Added ${days}d ago`;
}

type PetsTableProps = {
  ownerOptions: OwnerOption[];
};

export function PetsTable({ ownerOptions }: PetsTableProps) {
  const { data = [] } = usePets();
  const [species, setSpecies] = useState<(typeof SPECIES_FILTERS)[number]>("ALL");

  const filtered = useMemo(
    () => (species === "ALL" ? data : data.filter((pet) => pet.species === species)),
    [data, species],
  );

  const columns: ColumnDef<PetRow>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Pet",
        cell: ({ row }) => {
          const pet = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                {pet.photoUrl ? <AvatarImage src={pet.photoUrl} alt={pet.name} /> : null}
                <AvatarFallback className="bg-primary/10 text-primary">
                  <PawPrintIcon className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{pet.name}</div>
                <div className="text-xs text-muted-foreground">{addedAgo(pet.createdAt)}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "species",
        header: "Species",
        cell: ({ row }) => (
          <Badge
            variant="secondary"
            className={`rounded-full ${speciesBadgeClass(row.original.species)}`}
          >
            {row.original.species}
          </Badge>
        ),
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
    ],
    [ownerOptions],
  );

  return (
    <div className="space-y-4 rounded-3xl border border-border/60 bg-card p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length} of {data.length} pets
        </p>
        <div className="flex flex-wrap gap-2">
          {SPECIES_FILTERS.map((value) => (
            <Button
              key={value}
              type="button"
              size="sm"
              variant={species === value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setSpecies(value)}
            >
              {value === "ALL" ? "All" : value.charAt(0) + value.slice(1).toLowerCase()}
            </Button>
          ))}
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filtered}
        filterColumn="name"
        filterPlaceholder="Search pets…"
      />
    </div>
  );
}
