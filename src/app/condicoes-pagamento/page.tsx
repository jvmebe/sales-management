import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { fetchPaymentConditions } from "@/lib/data/condicoes-pagamento";
import { columns } from "./columns";

export default async function PaymentConditionsPage() {
  const data = await fetchPaymentConditions();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Condições de Pagamento</h1>
        <Button asChild><Link href="/condicoes-pagamento/novo"><PlusCircle className="mr-2 h-4 w-4" /> Nova Condição</Link></Button>
      </div>
      <DataTable columns={columns} data={data} filterColumn="descricao" />
    </div>
  );
}
