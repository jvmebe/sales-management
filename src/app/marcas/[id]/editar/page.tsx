import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchProductBrandById } from "@/lib/data/marcas";
import ProductBrandForm from "../../form";

export default async function EditProductBrandPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const data = await fetchProductBrandById(id);
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Editar Marca de Produto</h1>
      </div>
      <Separator className="my-6" />
      <ProductBrandForm initialData={data} />
    </div>
  );
}
