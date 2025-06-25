import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import ProductForm from "../../form";
import { fetchProductById } from "@/lib/data/produtos";
import { fetchProductBrands } from "@/lib/data/marcas";
import { fetchProductCategories } from "@/lib/data/categorias-produto";
import { fetchProductUnits } from "@/lib/data/unidades-medida";
import { fetchSuppliers } from "@/lib/data/fornecedores";
import { fetchCities } from "@/lib/data/cidades";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchActiveCountries } from "@/lib/data/paises";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  // Busca o produto específico e todos os dados para os diálogos
  const [product, brands, categories, units, suppliers, cities, states, countries] = await Promise.all([
    fetchProductById(id),
    fetchProductBrands(),
    fetchProductCategories(),
    fetchProductUnits(),
    fetchSuppliers(),
    fetchCities(),
    fetchActiveStates(),
    fetchActiveCountries(),
  ]);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Editar Produto</h1>
      </div>
      <Separator className="my-6" />
      <ProductForm 
        initialData={product}
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
