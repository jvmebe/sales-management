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
import { fetchProductBrands } from "@/lib/data/marcas";
import { fetchProductCategories } from "@/lib/data/categorias-produto";
import { fetchProductUnits } from "@/lib/data/unidades-medida";
import { PurchaseForm as PurchaseFormType } from "@/lib/definitions";

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
    countries,
    brands,
    categories,
    units
  ] = await Promise.all([
    fetchPurchaseById(id),
    fetchSuppliers(),
    fetchProducts(),
    fetchPaymentConditions(),
    fetchActivePaymentMethods(),
    fetchCities(),
    fetchActiveStates(),
    fetchActiveCountries(),
    fetchProductBrands(),
    fetchProductCategories(),
    fetchProductUnits(),
  ]);

  if (!purchase) notFound();

  const formData: PurchaseFormType = {
    ...purchase,
    data_emissao: new Date(purchase.data_emissao),
    data_entrega: purchase.data_entrega ? new Date(purchase.data_entrega) : null,
    items: purchase.items.map(item => ({
      ...item,
      valor_unitario: Number(item.valor_unitario)
    })),
    installments: purchase.installments.map(inst => ({
      ...inst,
      data_vencimento: new Date(inst.data_vencimento),
      valor_parcela: Number(inst.valor_parcela)
    })),
  };

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Detalhes da Compra #{purchase.numero_nota}</h1>
      </div>
      <Separator className="my-6" />
      <PurchaseForm
        initialData={formData}
        suppliers={suppliers}
        products={products}
        paymentConditions={paymentConditions}
        paymentMethods={paymentMethods}
        cities={cities}
        states={states}
        countries={countries}
        brands={brands}
        categories={categories}
        units={units}
      />
    </div>
  );
}
