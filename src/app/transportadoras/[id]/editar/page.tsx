import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchTransportadoraById } from "@/lib/data/transportadoras";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchCities } from "@/lib/data/cidades";
import TransportadoraForm from "../../form";

export default async function EditTransportadoraPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [transportadora, countries, states, cities] = await Promise.all([
    fetchTransportadoraById(id),
    fetchActiveCountries(),
    fetchActiveStates(),
    fetchCities(),
  ]);

  if (!transportadora) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Editar Transportadora</h1>
      </div>
      <Separator className="my-6" />
      <TransportadoraForm 
        initialData={transportadora} 
        countries={countries} 
        states={states} 
        cities={cities} 
      />
    </div>
  );
}
