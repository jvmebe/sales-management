import { Separator } from "@/components/ui/separator";
import CityForm from "../city-form";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";

export default async function NewCityPage() {
  const [countries, states] = await Promise.all([
    fetchActiveCountries(),
    fetchActiveStates(),
  ]);

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Nova Cidade</h1>
        <p className="text-muted-foreground">
          Preencha os campos para adicionar uma nova cidade. Campos com * são obrigatórios.
        </p>
      </div>
      <Separator className="my-6" />
      <CityForm countries={countries} states={states} />
    </div>
  );
}
