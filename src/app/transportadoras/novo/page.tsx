import { Separator } from "@/components/ui/separator";
import TransportadoraForm from "../form";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchCities } from "@/lib/data/cidades";

export default async function NewTransportadoraPage() {
  const [countries, states, cities] = await Promise.all([
    fetchActiveCountries(),
    fetchActiveStates(),
    fetchCities(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Nova Transportadora</h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para adicionar uma nova transportadora.
        </p>
      </div>
      <Separator className="my-6" />
      <TransportadoraForm countries={countries} states={states} cities={cities} />
    </div>
  );
}
