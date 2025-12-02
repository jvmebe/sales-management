"use client";
import { useState } from "react";
import { Product } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

type SelectionMode = 'single' | 'multiple';

interface ProductSelectionDialogProps {
  products: Product[];
  onSelect: (products: Product | Product[]) => void;
  selectionMode?: SelectionMode;
}

export function ProductSelectionDialog({ products, onSelect, selectionMode = 'multiple' }: ProductSelectionDialogProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const handleSelectMultiple = (product: Product) => {
    setSelectedProducts(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const columns: ColumnDef<Product>[] = [
    // Lógica para Multipla Seleção (Checkboxes)
    ...(selectionMode === 'multiple' ? [{
      id: "select",
      header: ({ table }: { table: any }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
            setSelectedProducts(value ? products : []);
          }}
          aria-label="Select all"
        />
      ),
      cell: ({ row }: { row: any }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
            handleSelectMultiple(row.original);
          }}
          aria-label="Select row"
        />
      ),
    }] : []),

    { accessorKey: "id", header: "Cód." },
    { accessorKey: "nome", header: "Produto" },
    { accessorKey: "brand_nome", header: "Marca" },
    { accessorKey: "estoque", header: "Estoque" },
    { accessorKey: "valor_venda", header: "Preço", cell: ({row}) => `R$ ${Number(row.original.valor_venda).toFixed(2)}` },

    // Lógica para Seleção Única (Botão na linha)
    ...(selectionMode === 'single' ? [{
        id: "actions",
        cell: ({ row }: { row: any }) => (
            <Button variant="outline" size="sm" onClick={() => onSelect(row.original)}>
                Selecionar
            </Button>
        )
    }] : [])
  ];

  return (
    <div className="flex flex-col h-full">
      <DialogHeader>
        <DialogTitle>Selecione o Produto</DialogTitle>
      </DialogHeader>
      <div className="py-4 flex-1 overflow-auto">
        <DataTable columns={columns} data={products} filterColumn="nome" filterPlaceholder="Filtrar produtos..." />
      </div>

      {selectionMode === 'multiple' && (
        <div className="flex justify-end pt-2">
            <Button onClick={() => onSelect(selectedProducts)}>Adicionar Selecionados</Button>
        </div>
      )}
    </div>
  );
}
