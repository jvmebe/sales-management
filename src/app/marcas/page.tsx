import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { fetchProductBrands } from "@/lib/data/marcas";
import { columns } from "./columns";

export default async function ProductBrandsPage() {
  const data = await fetchProductBrands();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marcas de Produto</h1>
        <Button asChild>
          <Link href="/marcas/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Marca
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} filterColumn="nome" filterPlaceholder="Filtrar por nome..."/>
    </div>
  );
}
