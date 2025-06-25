import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { fetchTransportadoras } from "@/lib/data/transportadoras";
import { columns } from "./columns";

export default async function TransportadorasPage() {
  const data = await fetchTransportadoras();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transportadoras</h1>
        <Button asChild>
          <Link href="/transportadoras/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Transportadora
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} filterColumn="nome" filterPlaceholder="Filtrar por nome ou razão social..."/>
    </div>
  );
}
