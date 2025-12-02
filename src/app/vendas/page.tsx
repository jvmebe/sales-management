import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { fetchSales } from "@/lib/data/vendas";
import { columns } from "./columns";

export default async function VendasPage() {
  const data = await fetchSales();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendas Realizadas</h1>
        <Button asChild>
          <Link href="/vendas/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Venda
          </Link>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        filterColumn="client_nome"
        filterPlaceholder="Filtrar por cliente..."
      />
    </div>
  );
}
