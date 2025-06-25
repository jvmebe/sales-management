"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductUnit } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UnitCreationForm } from "@/components/forms/unit-form";
import { PlusCircle } from "lucide-react";

interface UnitSelectionDialogProps {
  units: ProductUnit[];
  onSelect: (unit: ProductUnit) => void;
}

export function UnitSelectionDialog({ units, onSelect }: UnitSelectionDialogProps) {
  const router = useRouter();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const columns: ColumnDef<ProductUnit>[] = [
    { accessorKey: "nome", header: "Unidade" },
    { accessorKey: "sigla", header: "Sigla" },
    { id: "actions", cell: ({ row }) => <Button variant="outline" size="sm" onClick={() => onSelect(row.original)}>Selecionar</Button> },
  ];

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    router.refresh();
  };

  return (
    <>
      <DialogHeader><DialogTitle>Selecione uma Unidade</DialogTitle></DialogHeader>
      <div className="py-4"><DataTable columns={columns} data={units} filterColumn="nome" filterPlaceholder="Filtrar unidades..."/></div>
      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild><Button variant="ghost"><PlusCircle className="mr-2 h-4 w-4" />Criar nova unidade</Button></DialogTrigger>
        <DialogContent><DialogHeader><DialogTitle>Criar Nova Unidade</DialogTitle></DialogHeader><UnitCreationForm onSuccess={handleCreateSuccess} /></DialogContent>
      </Dialog>
    </>
  );
}
