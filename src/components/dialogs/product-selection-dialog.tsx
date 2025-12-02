"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductBrand, ProductCategory, ProductUnit, Supplier, City, State, Country } from "@/lib/definitions";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle } from "lucide-react";
import { ProductCreationForm } from "@/components/forms/product-form";

type SelectionMode = 'single' | 'multiple';

interface ProductSelectionDialogProps {
  products: Product[];
  // Novas props necessárias para a criação
  brands: ProductBrand[];
  categories: ProductCategory[];
  units: ProductUnit[];
  suppliers: Supplier[];
  cities: City[];
  states: State[];
  countries: Country[];

  onSelect: (products: Product | Product[]) => void;
  selectionMode?: SelectionMode;
}

export function ProductSelectionDialog({
  products,
  brands,
  categories,
  units,
  suppliers,
  cities,
  states,
  countries,
  onSelect,
  selectionMode = 'multiple'
}: ProductSelectionDialogProps) {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isCreateOpen, setCreateOpen] = useState(false); // Estado para o modal de criação

  const handleSelectMultiple = (product: Product) => {
    setSelectedProducts(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  const handleCreateSuccess = () => {
    setCreateOpen(false);
    router.refresh();
  };

  const columns: ColumnDef<Product>[] = [
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

      <div className="flex justify-between items-center pt-2 border-t">
         {/* Botão de Criar Novo Produto */}
         <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Criar novo produto
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Criar Novo Produto</DialogTitle>
                </DialogHeader>
                <ProductCreationForm
                    brands={brands}
                    categories={categories}
                    units={units}
                    suppliers={suppliers}
                    cities={cities}
                    states={states}
                    countries={countries}
                    onSuccess={handleCreateSuccess}
                />
            </DialogContent>
         </Dialog>

        {selectionMode === 'multiple' && (
            <Button onClick={() => onSelect(selectedProducts)}>Adicionar Selecionados</Button>
        )}
      </div>
    </div>
  );
}
