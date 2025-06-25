import { Separator } from "@/components/ui/separator";
import CityForm from "../city-form";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";

export default async function NewCityPage() {
  // Busca todos os dados necessários para a cascata de diálogos
  const [countries, states] = await Promise.all([
    fetchActiveCountries(),
    fetchActiveStates(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Nova Cidade</h1>
        <p className="text-muted-foreground">
          Preencha os campos para adicionar uma nova cidade.
        </p>
      </div>
      <Separator className="my-6" />
      <CityForm countries={countries} states={states} />
    </div>
  );
}
