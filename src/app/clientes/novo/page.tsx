import { Separator } from "@/components/ui/separator";
import ClientForm from "../form";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchCities } from "@/lib/data/cidades";
import { fetchPaymentConditions } from "@/lib/data/condicoes-pagamento";
import { fetchActivePaymentMethods } from "@/lib/data/formas-pagamento";

export default async function NewClientPage() {
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
        <h1 className="text-2xl font-bold">Novo Cliente</h1>
      </div>
      <Separator className="my-6" />
      <ClientForm 
        countries={countries} 
        states={states} 
        cities={cities}
        paymentConditions={paymentConditions}
        paymentMethods={paymentMethods}
      />
    </div>
  );
}
