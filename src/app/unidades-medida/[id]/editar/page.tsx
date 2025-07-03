import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchProductUnitById } from "@/lib/data/unidades-medida";
import ProductUnitForm from "../../form";

export default async function EditProductUnitPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const data = await fetchProductUnitById(id);
  if (!data) notFound();

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Editar Unidade de Medida</h1>
      </div>
      <Separator className="my-6" />
      <ProductUnitForm initialData={data} />
    </div>
  );
}
