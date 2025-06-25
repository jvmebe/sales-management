import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { fetchProductUnits } from "@/lib/data/unidades-medida";
import { columns } from "./columns";

export default async function ProductUnitsPage() {
  const data = await fetchProductUnits();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Unidades de Medida</h1>
        <Button asChild>
          <Link href="/unidades-medida/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Unidade de Medida
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} filterColumn="nome" />
    </div>
  );
}
