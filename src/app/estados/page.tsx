import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { fetchStates } from "@/lib/data/estados";
import { columns } from "./columns";

export default async function EstadosPage() {
  const data = await fetchStates();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Estados</h1>
        <Button asChild>
          <Link href="/estados/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Estado
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} filterColumn="nome" />
    </div>
  );
}