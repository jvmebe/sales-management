"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductBrand, ProductBrandForm, ProductBrandSchema } from "@/lib/definitions";
import { createProductBrand, updateProductBrand } from "@/lib/actions/marcas";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DeleteProductBrandButton } from "./delete-button";
import { Separator } from "@/components/ui/separator";

interface ProductBrandFormProps {
  initialData?: ProductBrand;
}

export default function ProductBrandForm({ initialData }: ProductBrandFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<ProductBrandForm>({
    resolver: zodResolver(ProductBrandSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      ativo: Boolean(initialData?.ativo) ?? true,
    },
  });

  const onSubmit = async (data: ProductBrandForm) => {
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField control={form.control} name="nome" render={({ field }) => (
            <FormItem><FormLabel>Nome da Marca</FormLabel><FormControl><Input placeholder="Ex: Nike, Adidas..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="ativo" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <FormLabel>Ativo</FormLabel>
              <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
            </FormItem>
          )} />
          
          {isEditMode && (
            <><Separator /><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-4">
              <div><p className="text-sm font-medium text-muted-foreground">Data de Criação</p><p className="text-sm">{formatDate(initialData.data_criacao)}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Última Modificação</p><p className="text-sm">{formatDate(initialData.data_modificacao)}</p></div>
            </div></>
          )}

          <div className="flex justify-between items-center">
            <div>{isEditMode && (<DeleteProductBrandButton id={initialData.id}><Button variant="destructive" type="button">Excluir</Button></DeleteProductBrandButton>)}</div>
            <div className="flex space-x-4 ml-auto">
              <Button variant="outline" type="button" asChild><Link href="/marcas">Cancelar</Link></Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Salvando..." : "Salvar"}</Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
