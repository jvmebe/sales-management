"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Supplier, City, State, Country } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SupplierCreationForm } from "@/components/forms/supplier-form";
import { PlusCircle } from "lucide-react";

interface SupplierSelectionDialogProps {
  suppliers: Supplier[];
  cities: City[];
  states: State[];
  countries: Country[];
  onSelect: (supplier: Supplier) => void;
}

export function SupplierSelectionDialog({ suppliers, cities, states, countries, onSelect }: SupplierSelectionDialogProps) {
  const router = useRouter();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const columns: ColumnDef<Supplier>[] = [
    { accessorKey: "nome", header: "Fornecedor" },
    { id: "actions", cell: ({ row }) => <Button variant="outline" size="sm" onClick={() => onSelect(row.original)}>Selecionar</Button> },
  ];

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    router.refresh();
  };

  return (
    <>
      <DialogHeader><DialogTitle>Selecione um Fornecedor</DialogTitle></DialogHeader>
      <div className="py-4"><DataTable columns={columns} data={suppliers} filterColumn="nome" filterPlaceholder="Filtrar fornecedores..."/></div>
      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild><Button variant="ghost"><PlusCircle className="mr-2 h-4 w-4" />Criar novo fornecedor</Button></DialogTrigger>
        <DialogContent className="max-w-4xl"><DialogHeader><DialogTitle>Criar Novo Fornecedor</DialogTitle></DialogHeader><SupplierCreationForm cities={cities} states={states} countries={countries} onSuccess={handleCreateSuccess} /></DialogContent>
      </Dialog>
    </>
  );
}
