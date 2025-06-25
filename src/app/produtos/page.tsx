import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { fetchProducts } from "@/lib/data/produtos";
import { columns } from "./columns";

export default async function ProductsPage() {
  const data = await fetchProducts();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button asChild>
          <Link href="/produtos/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Produto
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} filterColumn="nome" filterPlaceholder="Filtrar por nome do produto..."/>
    </div>
  );
}
