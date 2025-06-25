"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductBrand } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BrandCreationForm } from "@/components/forms/brand-form";
import { PlusCircle } from "lucide-react";

interface BrandSelectionDialogProps {
  brands: ProductBrand[];
  onSelect: (brand: ProductBrand) => void;
}

export function BrandSelectionDialog({ brands, onSelect }: BrandSelectionDialogProps) {
  const router = useRouter();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const columns: ColumnDef<ProductBrand>[] = [
    { accessorKey: "nome", header: "Marca" },
    { id: "actions", cell: ({ row }) => <Button variant="outline" size="sm" onClick={() => onSelect(row.original)}>Selecionar</Button> },
  ];

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    router.refresh();
  };

  return (
    <>
      <DialogHeader><DialogTitle>Selecione uma Marca</DialogTitle></DialogHeader>
      <div className="py-4"><DataTable columns={columns} data={brands} filterColumn="nome" filterPlaceholder="Filtrar marcas..."/></div>
      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild><Button variant="ghost"><PlusCircle className="mr-2 h-4 w-4" />Criar nova marca</Button></DialogTrigger>
        <DialogContent><DialogHeader><DialogTitle>Criar Nova Marca</DialogTitle></DialogHeader><BrandCreationForm onSuccess={handleCreateSuccess} /></DialogContent>
      </Dialog>
    </>
  );
}
