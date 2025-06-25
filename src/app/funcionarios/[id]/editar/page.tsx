import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { fetchEmployeeById } from "@/lib/data/funcionarios";
import { fetchActiveCountries } from "@/lib/data/paises";
import { fetchActiveStates } from "@/lib/data/estados";
import { fetchCities } from "@/lib/data/cidades";
import EmployeeForm from "../../form";

export default async function EditEmployeePage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  const [employee, countries, states, cities] = await Promise.all([
    fetchEmployeeById(id),
    fetchActiveCountries(),
    fetchActiveStates(),
    fetchCities(),
  ]);

  if (!employee) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Editar Funcionário</h1>
      </div>
      <Separator className="my-6" />
      <EmployeeForm 
        initialData={employee} 
        countries={countries} 
        states={states} 
        cities={cities} 
      />
    </div>
  );
}
