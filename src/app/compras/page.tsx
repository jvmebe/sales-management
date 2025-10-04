import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { fetchPurchases } from "@/lib/data/compras";
import { columns } from "./columns";

export default async function ComprasPage() {
  const data = await fetchPurchases();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Compras</h1>
        <Button asChild>
          <Link href="/compras/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Compra
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} filterColumn="numero_nota" filterPlaceholder="Filtrar por nº da nota..."/>
    </div>
  );
}