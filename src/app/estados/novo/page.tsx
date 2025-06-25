import { Separator } from "@/components/ui/separator";
import { fetchActiveCountries } from "@/lib/data/paises";
import StateForm from "../state-form";

export default async function NewStatePage() {
  const countries = await fetchActiveCountries();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Novo Estado</h1>
        <p className="text-muted-foreground">
          Preencha os campos para adicionar um novo estado.
        </p>
      </div>
      <Separator className="my-6" />
      <StateForm countries={countries} />
    </div>
  );
}