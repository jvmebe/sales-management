import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchCountryById } from "@/lib/data/paises";
import CountryForm from "../../form";

export default async function EditCountryPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const data = await fetchCountryById(id);
  if (!data) notFound();

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Editar País</h1>
      </div>
      <Separator className="my-6" />
      <CountryForm initialData={data} />
    </div>
  );
}
