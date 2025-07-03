"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductCategory, ProductCategoryForm as ProductCategoryFormType, ProductCategorySchema } from "@/lib/definitions";
import { createProductCategory, updateProductCategory } from "@/lib/actions/categorias-produto";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DeleteProductCategoryButton } from "./delete-button";
import { Separator } from "@/components/ui/separator";
import { FormFooter } from "@/components/ui/form-footer";

interface ProductCategoryFormProps {
  initialData?: ProductCategory;
}

export default function ProductCategoryForm({ initialData }: ProductCategoryFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<ProductCategoryFormType>({
    resolver: zodResolver(ProductCategorySchema),
    defaultValues: {
      nome: initialData?.nome || "",
      descricao: initialData?.descricao || "",
      ativo: initialData?.ativo ?? true,
    },
  });

  const FORM_ID = "category-form";

   const {
    formState: { errors, isDirty, isSubmitting },
  } = form;

    const deleteButton = isEditMode ? (
    <DeleteProductCategoryButton id={initialData.id}>
      <Button variant="destructive" type="button">Excluir</Button>
    </DeleteProductCategoryButton>
  ) : undefined;


  const onSubmit = async (data: ProductCategoryFormType) => {
    const action = isEditMode ? updateProductCategory(initialData.id, data) : createProductCategory(data);
    const result = await action;
    if (result.success) {
      toast.success(result.message);
      router.push("/categorias");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" id={FORM_ID}>
          <FormField control={form.control} name="ativo" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <FormLabel>Ativo</FormLabel>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
          )} />
          <FormField control={form.control} name="nome" render={({ field }) => (
            <FormItem><FormLabel>Nome da Categoria</FormLabel><FormControl><Input placeholder="Ex: Bebidas, Limpeza..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="descricao" render={({ field }) => (
            <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea placeholder="Detalhes sobre a categoria (opcional)" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          
          {isEditMode && (
            <><Separator /><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-4">
              <div><p className="text-sm font-medium text-muted-foreground">Data de Criação</p><p className="text-sm">{formatDate(initialData.data_criacao)}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Última Modificação</p><p className="text-sm">{formatDate(initialData.data_modificacao)}</p></div>
            </div></>
          )}
        <FormFooter
        formId={FORM_ID}
        cancelHref="/categorias"
        isEditMode={isEditMode}
        isSubmitting={isSubmitting}
        isDirty={isDirty}
        deleteButton={deleteButton}
      />

        </form>
      </Form>
    </div>
  );
}
