import { Separator } from "@/components/ui/separator";
import SupplierForm from "../form";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchCities } from "@/lib/data/cidades";
import { fetchPaymentConditions } from "@/lib/data/condicoes-pagamento";
import { fetchActivePaymentMethods } from "@/lib/data/formas-pagamento";

export default async function NewSupplierPage() {
  const [countries, states, cities, paymentConditions, paymentMethods] = await Promise.all([
    fetchActiveCountries(),
    fetchActiveStates(),
    fetchCities(),
    fetchPaymentConditions(),
    fetchActivePaymentMethods(),
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
      <SupplierForm
        countries={countries}
        states={states}
        cities={cities}
        paymentConditions={paymentConditions}
        paymentMethods={paymentMethods}
      />
    </div>
  );
}