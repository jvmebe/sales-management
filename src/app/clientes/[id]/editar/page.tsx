import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import ClientForm from "../../form";
import { fetchClientById } from "@/lib/data/clientes";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchCities } from "@/lib/data/cidades";
import { fetchPaymentConditions } from "@/lib/data/condicoes-pagamento";
import { fetchActivePaymentMethods } from "@/lib/data/formas-pagamento";

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [client, countries, states, cities, paymentConditions, paymentMethods] = await Promise.all([
    fetchClientById(id),
    fetchActiveCountries(),
    fetchActiveStates(),
    fetchCities(),
    fetchPaymentConditions(),
    fetchActivePaymentMethods(),
  ]);

  if (!client) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Editar Cliente</h1>
      </div>
      <Separator className="my-6" />
      <ClientForm 
        initialData={client}
        countries={countries} 
        states={states} 
        cities={cities}
        paymentConditions={paymentConditions}
        paymentMethods={paymentMethods}
      />
    </div>
  );
}
