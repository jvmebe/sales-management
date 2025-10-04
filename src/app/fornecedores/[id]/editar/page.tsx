import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchSupplierById } from "@/lib/data/fornecedores";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchCities } from "@/lib/data/cidades";
import SupplierForm from "../../form";
import { fetchPaymentConditions } from "@/lib/data/condicoes-pagamento";
import { fetchActivePaymentMethods } from "@/lib/data/formas-pagamento";

export default async function EditSupplierPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [supplier, countries, states, cities, paymentConditions, paymentMethods] = await Promise.all([
    fetchSupplierById(id),
    fetchActiveCountries(),
    fetchActiveStates(),
    fetchCities(),
    fetchPaymentConditions(),
    fetchActivePaymentMethods(),
  ]);

  if (!supplier) notFound();

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Editar Fornecedor</h1>
      </div>
      <Separator className="my-6" />
      <SupplierForm
        initialData={supplier}
        countries={countries}
        states={states}
        cities={cities}
        paymentConditions={paymentConditions}
        paymentMethods={paymentMethods}
      />
    </div>
  );
}