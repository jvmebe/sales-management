import { fetchCountryById } from "@/lib/data/paises";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import EditCountryForm from "./edit-form";

export default async function EditCountryPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }

  const country = await fetchCountryById(id);

  if (!country) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Editar País</h1>
        <p className="text-muted-foreground">Altere os dados do país abaixo.</p>
      </div>
      <Separator className="my-6" />
      <EditCountryForm country={country} />
    </div>
  );
}