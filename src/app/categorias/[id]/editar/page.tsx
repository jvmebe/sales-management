import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchProductCategoryById } from "@/lib/data/categorias-produto";
import ProductCategoryForm from "../../form";

export default async function EditProductCategoryPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const data = await fetchProductCategoryById(id);
  if (!data) notFound();

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Editar Categoria de Produto</h1>
      </div>
      <Separator className="my-6" />
      <ProductCategoryForm initialData={data} />
    </div>
  );
}
