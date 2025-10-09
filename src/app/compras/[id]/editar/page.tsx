import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import PurchaseForm from "../../form";
import { fetchPurchaseById } from "@/lib/data/compras";
import { fetchSuppliers } from "@/lib/data/fornecedores";
import { fetchProducts } from "@/lib/data/produtos";
import { fetchPaymentConditions } from "@/lib/data/condicoes-pagamento";
import { fetchActivePaymentMethods } from "@/lib/data/formas-pagamento";
import { fetchCities } from "@/lib/data/cidades";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchActiveCountries } from "@/lib/data/paises";

export default async function EditPurchasePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [
    purchase,
    suppliers,
    products,
    paymentConditions,
    paymentMethods,
    cities,
    states,
    countries
  ] = await Promise.all([
    fetchPurchaseById(id),
    fetchSuppliers(),
    fetchProducts(),
    fetchPaymentConditions(),
    fetchActivePaymentMethods(),
    fetchCities(),
    fetchActiveStates(),
    fetchActiveCountries(),
  ]);

  if (!purchase) notFound();

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Editar Compra #{purchase.numero_nota}</h1>
      </div>
      <Separator className="my-6" />
      <PurchaseForm
        initialData={purchase as any}
        suppliers={suppliers}
        products={products}
        paymentConditions={paymentConditions}
        paymentMethods={paymentMethods}
        cities={cities}
        states={states}
        countries={countries}
      />
    </div>
  );
}