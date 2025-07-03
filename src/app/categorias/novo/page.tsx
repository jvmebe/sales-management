import { Separator } from "@/components/ui/separator";
import ProductCategoryForm from "../form";

export default function NewProductCategoryPage() {
  return (
    <div className="form-container">
      <div>
        <h1 className="text-2xl font-bold">Nova Categoria de Produto</h1>
        <p className="text-muted-foreground">Preencha os campos para adicionar uma nova categoria.</p>
      </div>
      <Separator className="my-6" />
      <ProductCategoryForm />
    </div>
  );
}
