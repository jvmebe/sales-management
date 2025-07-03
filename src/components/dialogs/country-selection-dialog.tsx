"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Country } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CountryCreationForm } from "@/components/forms/country-form";
import { PlusCircle } from "lucide-react";

interface CountrySelectionDialogProps {
  countries: Country[];
  onSelect: (country: Country) => void;
}

export function CountrySelectionDialog({ countries, onSelect }: CountrySelectionDialogProps) {
  const router = useRouter();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const columns: ColumnDef<Country>[] = [
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "sigla", header: "Sigla" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => onSelect(row.original)}>
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
        <DialogTitle>Selecione um País</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <DataTable columns={columns} data={countries} filterColumn="nome"/>
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar novo país
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo País</DialogTitle>
          </DialogHeader>
          <CountryCreationForm onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}