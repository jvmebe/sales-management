import { Separator } from "@/components/ui/separator";
import ProductBrandForm from "../form";

export default function NewProductBrandPage() {
  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Nova Marca de Produto</h1>
        <p className="text-muted-foreground">Preencha o campo abaixo para adicionar uma nova marca.</p>
      </div>
      <Separator className="my-6" />
      <ProductBrandForm />
    </div>
  );
}
