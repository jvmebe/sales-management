import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { fetchProductCategories } from "@/lib/data/categorias-produto";
import { columns } from "./columns";

export default async function ProductCategoriesPage() {
  const data = await fetchProductCategories();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorias de Produto</h1>
        <Button asChild>
          <Link href="/categorias/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Categoria
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} filterColumn="nome" filterPlaceholder="Filtrar por nome..."/>
    </div>
  );
}
