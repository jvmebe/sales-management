import { Separator } from "@/components/ui/separator";
import ProductUnitForm from "../form";

export default function NewProductUnitPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Nova Unidade de Medida</h1>
        <p className="text-muted-foreground">Preencha os campos abaixo.</p>
      </div>
      <Separator className="my-6" />
      <ProductUnitForm />
    </div>
  );
}
