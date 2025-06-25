import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchStateById } from "@/lib/data/estados";
import { fetchActiveCountries } from "@/lib/data/paises";
import StateForm from "../../state-form";

export default async function EditStatePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [state, countries] = await Promise.all([
    fetchStateById(id),
    fetchActiveCountries(),
  ]);

  if (!state) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Editar Estado</h1>
      </div>
      <Separator className="my-6" />
      <StateForm initialData={state} countries={countries} />
    </div>
  );
}