"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductBrand, ProductBrandForm as ProductBrandFormType, ProductBrandSchema } from "@/lib/definitions";
import { createProductBrand, updateProductBrand } from "@/lib/actions/marcas";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DeleteProductBrandButton } from "./delete-button";
import { Separator } from "@/components/ui/separator";
import { FormFooter } from "@/components/ui/form-footer";

interface ProductBrandFormProps {
  initialData?: ProductBrand;
}

export default function ProductBrandForm({ initialData }: ProductBrandFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<ProductBrandFormType>({
    resolver: zodResolver(ProductBrandSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      ativo: Boolean(initialData?.ativo) ?? true,
    },
  });

  const FORM_ID = "brand-form";
  
 const {
    formState: { errors, isDirty, isSubmitting },
  } = form;


  const deleteButton = isEditMode ? (
    <DeleteProductBrandButton id={initialData.id}>
      <Button variant="destructive" type="button">Excluir</Button>
    </DeleteProductBrandButton>
  ) : undefined;
  

  const onSubmit = async (data: ProductBrandFormType) => {
    const action = isEditMode ? updateProductBrand(initialData.id, data) : createProductBrand(data);
    const result = await action;
    if (result.success) {
      toast.success(result.message);
      router.push("/marcas");
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
            <FormItem><FormLabel>Nome da Marca</FormLabel><FormControl><Input placeholder="Ex: Nike, Adidas..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          
          {isEditMode && (
            <><Separator /><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-4">
              <div><p className="text-sm font-medium text-muted-foreground">Data de Criação</p><p className="text-sm">{formatDate(initialData.data_criacao)}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Última Modificação</p><p className="text-sm">{formatDate(initialData.data_modificacao)}</p></div>
            </div></>
          )}
        </form>
        <FormFooter
        formId={FORM_ID}
        cancelHref="/condicoes-pagamento"
        isEditMode={isEditMode}
        isSubmitting={isSubmitting}
        isDirty={isDirty}
        deleteButton={deleteButton}
      />

      </Form>
    </div>
  );
}
