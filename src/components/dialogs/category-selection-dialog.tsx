"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCategory } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryCreationForm } from "@/components/forms/category-form";
import { PlusCircle } from "lucide-react";

interface CategorySelectionDialogProps {
  categories: ProductCategory[];
  onSelect: (category: ProductCategory) => void;
}

export function CategorySelectionDialog({ categories, onSelect }: CategorySelectionDialogProps) {
  const router = useRouter();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const columns: ColumnDef<ProductCategory>[] = [
    { accessorKey: "nome", header: "Categoria" },
    { id: "actions", cell: ({ row }) => <Button variant="outline" size="sm" onClick={() => onSelect(row.original)}>Selecionar</Button> },
  ];

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    router.refresh();
  };

  return (
    <>
      <DialogHeader><DialogTitle>Selecione uma Categoria</DialogTitle></DialogHeader>
      <div className="py-4"><DataTable columns={columns} data={categories} filterColumn="nome" filterPlaceholder="Filtrar categorias..."/></div>
      <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger asChild><Button variant="ghost"><PlusCircle className="mr-2 h-4 w-4" />Criar nova categoria</Button></DialogTrigger>
        <DialogContent><DialogHeader><DialogTitle>Criar Nova Categoria</DialogTitle></DialogHeader><CategoryCreationForm onSuccess={handleCreateSuccess} /></DialogContent>
      </Dialog>
    </>
  );
}
