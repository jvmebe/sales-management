"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { State, Country } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { StateCreationForm } from "@/components/forms/state-form";
import { PlusCircle } from "lucide-react";

interface StateSelectionDialogProps {
  states: State[];
  countries: Country[];
  onSelect: (state: State) => void;
}

export function StateSelectionDialog({ states, countries, onSelect }: StateSelectionDialogProps) {
  const router = useRouter();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const columns: ColumnDef<State>[] = [
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "sigla", header: "UF" },
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
        <DialogTitle>Selecione um Estado</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <DataTable columns={columns} data={states} />
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar novo estado
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Estado</DialogTitle>
          </DialogHeader>
          <StateCreationForm countries={countries} onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}