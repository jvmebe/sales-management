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
import { Checkbox } from "@/components/ui/checkbox";


interface SupplierSelectionDialogProps {
  suppliers: Supplier[];
  cities: City[];
  states: State[];
  countries: Country[];
  onSelect: (suppliers: Supplier[]) => void;
}

export function SupplierSelectionDialog({ suppliers, cities, states, countries, onSelect }: SupplierSelectionDialogProps) {
  const router = useRouter();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);

  const handleSelect = (supplier: Supplier) => {
    setSelectedSuppliers(prev =>
      prev.find(s => s.id === supplier.id)
        ? prev.filter(s => s.id !== supplier.id)
        : [...prev, supplier]
    );
  };


  const columns: ColumnDef<Supplier>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
                table.toggleAllPageRowsSelected(!!value);
                setSelectedSuppliers(value ? suppliers : []);
            }}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
                row.toggleSelected(!!value)
                handleSelect(row.original);
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
    { accessorKey: "nome", header: "Fornecedor" },
    { accessorKey: "cidade_nome", header: "Cidade" },
  ];

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    router.refresh();
  };

  return (
    <>
      <DialogHeader><DialogTitle>Selecione um Fornecedor</DialogTitle></DialogHeader>
      <div className="py-4"><DataTable columns={columns} data={suppliers} filterColumn="nome" filterPlaceholder="Filtrar fornecedores..."/></div>
      <div className="flex justify-between">
        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild><Button variant="ghost"><PlusCircle className="mr-2 h-4 w-4" />Criar novo fornecedor</Button></DialogTrigger>
            <DialogContent className="max-w-4xl"><DialogHeader><DialogTitle>Criar Novo Fornecedor</DialogTitle></DialogHeader><SupplierCreationForm cities={cities} states={states} countries={countries} onSuccess={handleCreateSuccess} /></DialogContent>
        </Dialog>
        <Button onClick={() => onSelect(selectedSuppliers)}>Confirmar</Button>
      </div>
    </>
  );
}