import { Separator } from "@/components/ui/separator";
import ProductForm from "../form";
// Importe todas as funções de busca necessárias
import { fetchProductBrands } from "@/lib/data/marcas";
import { fetchProductCategories } from "@/lib/data/categorias-produto";
import { fetchProductUnits } from "@/lib/data/unidades-medida";
import { fetchSuppliers } from "@/lib/data/fornecedores";
import { fetchCities } from "@/lib/data/cidades";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchActiveCountries } from "@/lib/data/paises";

export default async function NewProductPage() {
  const [brands, categories, units, suppliers, cities, states, countries] = await Promise.all([
    fetchProductBrands(),
    fetchProductCategories(),
    fetchProductUnits(),
    fetchSuppliers(),
    fetchCities(),
    fetchActiveStates(),
    fetchActiveCountries(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Novo Produto</h1>
      </div>
      <Separator className="my-6" />
      <ProductForm 
        brands={brands} 
        categories={categories} 
        units={units}
        suppliers={suppliers}
        cities={cities}
        states={states}
        countries={countries}
      />
    </div>
  );
}
