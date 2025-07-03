"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ProductUnit,
  ProductUnitForm as ProductUnitFormType,
  ProductUnitSchema,
} from "@/lib/definitions";
import {
  createProductUnit,
  updateProductUnit,
} from "@/lib/actions/unidades-medida";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DeleteProductUnitButton } from "./delete-button";
import { Separator } from "@/components/ui/separator";
import { FormFooter } from "@/components/ui/form-footer";

interface ProductUnitFormProps {
  initialData?: ProductUnit;
}

export default function ProductUnitForm({ initialData }: ProductUnitFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<ProductUnitFormType>({
    resolver: zodResolver(ProductUnitSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      sigla: initialData?.sigla || "",
      ativo: initialData?.ativo ?? true,
    },
  });

 const FORM_ID = "city-form";
  
 const {
    formState: { errors, isDirty, isSubmitting },
  } = form;


  const deleteButton = isEditMode ? (
    <DeleteProductUnitButton id={initialData.id}>
      <Button variant="destructive" type="button">Excluir</Button>
    </DeleteProductUnitButton>
  ) : undefined;
  

  const onSubmit = async (data: ProductUnitFormType) => {
    const action = isEditMode
      ? updateProductUnit(initialData.id, data)
      : createProductUnit(data);
    const result = await action;
    if (result.success) {
      toast.success(result.message);
      router.push("/unidades-medida");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <FormLabel>Ativo</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade de Medida*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Quilograma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sigla"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sigla*</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: KG" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {isEditMode && (
            <>
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Data de Criação
                  </p>
                  <p className="text-sm">
                    {formatDate(initialData.data_criacao)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Última Modificação
                  </p>
                  <p className="text-sm">
                    {formatDate(initialData.data_modificacao)}
                  </p>
                </div>
              </div>
            </>
          )}

            
      <FormFooter
        formId={FORM_ID}
        cancelHref="/unidades-medida"
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
