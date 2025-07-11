import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchCityById } from "@/lib/data/cidades";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import CityForm from "../../form";

export default async function EditCityPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [city, countries, states] = await Promise.all([
    fetchCityById(id),
    fetchActiveCountries(),
    fetchActiveStates(),
  ]);

  if (!city) notFound();

  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Editar Cidade</h1>
      </div>
      <Separator className="my-6" />
      <CityForm initialData={city} countries={countries} states={states} />
    </div>
  );
}
