"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { State, Country, City } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CityCreationForm } from "@/components/forms/city-form";
import { PlusCircle } from "lucide-react";

interface CitySelectionDialogProps {
  cities: City[];
  states: State[];
  countries: Country[];
  onSelect: (city: City) => void;
}

export function CitySelectionDialog({
  cities,
  states,
  countries,
  onSelect,
}: CitySelectionDialogProps) {
  const router = useRouter();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const columns: ColumnDef<City>[] = [
    { accessorKey: "nome", header: "Cidade" },
    { accessorKey: "state_sigla", header: "UF" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect(row.original)}
        >
          Selecionar
        </Button>
      ),
    },
  ];

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    router.refresh();
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Selecione uma Cidade</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <DataTable
          columns={columns}
          data={cities}
          filterColumn="nome"
          filterPlaceholder="Filtrar por cidade..."
        />
      </div>
      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar nova cidade
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Criar Nova Cidade</DialogTitle>
          </DialogHeader>
          <CityCreationForm
            states={states}
            countries={countries}
            onSuccess={handleCreateSuccess}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
