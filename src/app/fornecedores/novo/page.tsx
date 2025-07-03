import { Separator } from "@/components/ui/separator";
import SupplierForm from "../form";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchCities } from "@/lib/data/cidades";

export default async function NewSupplierPage() {
  const [countries, states, cities] = await Promise.all([
    fetchActiveCountries(),
    fetchActiveStates(),
    fetchCities(),
  ]);

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Novo Fornecedor</h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para adicionar um novo fornecedor.
        </p>
      </div>
      <Separator className="my-6" />
      <SupplierForm countries={countries} states={states} cities={cities} />
    </div>
  );
}
