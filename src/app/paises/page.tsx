import { PlusCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { fetchCountries } from "@/lib/data/paises";
import { Country } from "@/lib/definitions";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

export default async function PaisesPage() {
  const data: Country[] = await fetchCountries();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Países</h1>
        <Button asChild>
          <Link href="/paises/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo País
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={data} filterColumn="nome" />
    </div>
  );
}