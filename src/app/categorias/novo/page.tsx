import { Separator } from "@/components/ui/separator";
import ProductCategoryForm from "../form";

export default function NewProductCategoryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Nova Categoria de Produto</h1>
        <p className="text-muted-foreground">Preencha os campos para adicionar uma nova categoria.</p>
      </div>
      <Separator className="my-6" />
      <ProductCategoryForm />
    </div>
  );
}
