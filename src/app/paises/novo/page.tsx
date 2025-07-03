import { Separator } from "@/components/ui/separator";
import CountryForm from "../form";

export default function NewCountryPage() {
  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Novo País</h1>
        <p className="text-muted-foreground">Preencha os campos para adicionar um novo país. Campos com * são obrigatórios.</p>
      </div>
      <Separator className="my-6" />
      <CountryForm />
    </div>
  );
}
