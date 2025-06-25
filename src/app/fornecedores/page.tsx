import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { fetchSuppliers } from "@/lib/data/fornecedores";
import { columns } from "./columns";

export default async function FornecedoresPage() {
  const data = await fetchSuppliers();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Fornecedores</h1>
        <Button asChild>
          <Link href="/fornecedores/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Fornecedor
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} filterColumn="nome" filterPlaceholder="Filtrar por nome ou razão social..."/>
    </div>
  );
}
