import { Separator } from "@/components/ui/separator";
import EmployeeForm from "../form";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchCities } from "@/lib/data/cidades";

export default async function NewEmployeePage() {
  const [countries, states, cities] = await Promise.all([
    fetchActiveCountries(),
    fetchActiveStates(),
    fetchCities(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Novo Funcionário</h1>
        <p className="text-muted-foreground">Preencha os campos para adicionar um novo funcionário.</p>
      </div>
      <Separator className="my-6" />
      <EmployeeForm countries={countries} states={states} cities={cities} />
    </div>
  );
}
