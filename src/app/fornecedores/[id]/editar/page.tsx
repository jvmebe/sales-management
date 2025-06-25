import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchSupplierById } from "@/lib/data/fornecedores";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchCities } from "@/lib/data/cidades";
import SupplierForm from "../../form";

export default async function EditSupplierPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  // Busca todos os dados necessários em paralelo
  const [supplier, countries, states, cities] = await Promise.all([
    fetchSupplierById(id),
    fetchActiveCountries(),
    fetchActiveStates(),
    fetchCities(),
  ]);

  if (!supplier) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Editar Fornecedor</h1>
      </div>
      <Separator className="my-6" />
      <SupplierForm 
        initialData={supplier} 
        countries={countries} 
        states={states} 
        cities={cities} 
      />
    </div>
  );
}
