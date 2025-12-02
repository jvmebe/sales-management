import { Separator } from "@/components/ui/separator";
import PurchaseForm from "../form";
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

export default async function NewPurchasePage() {
  // Busca todos os dados necessários em paralelo
  const [
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

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Nova Compra</h1>
        <p className="text-muted-foreground">Preencha os campos para registrar uma nova compra.</p>
      </div>
      <Separator className="my-6" />
      <PurchaseForm
        suppliers={suppliers}
        products={products}
        paymentConditions={paymentConditions}
        paymentMethods={paymentMethods}
        cities={cities}
        states={states}
        countries={countries}
        // Repassando as novas props
        brands={brands}
        categories={categories}
        units={units}
      />
    </div>
  );
}
