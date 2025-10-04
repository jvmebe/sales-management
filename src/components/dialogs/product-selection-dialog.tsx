"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "../ui/checkbox";

interface ProductSelectionDialogProps {
  products: Product[];
  onSelect: (products: Product[]) => void;
}

export function ProductSelectionDialog({ products, onSelect }: ProductSelectionDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleSelect = (product: Product) => {
    setSelectedProducts(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            setSelectedProducts(value ? products : []);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            handleSelect(row.original);
          }}
          aria-label="Select row"
        />
      ),
    },
    { accessorKey: "nome", header: "Produto" },
    { accessorKey: "brand_nome", header: "Marca" },
    { accessorKey: "category_nome", header: "Categoria" },
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>Selecione os Produtos</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <DataTable columns={columns} data={products} filterColumn="nome" filterPlaceholder="Filtrar produtos..." />
      </div>
      <div className="flex justify-end">
        <Button onClick={() => onSelect(selectedProducts)}>Adicionar Produtos</Button>
      </div>
    </>
  );
}