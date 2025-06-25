"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ProductCategoryForm, ProductCategorySchema } from "@/lib/definitions";
import { createProductCategory } from "@/lib/actions/categorias-produto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface CategoryCreationFormProps {
  onSuccess: () => void;
}

export function CategoryCreationForm({ onSuccess }: CategoryCreationFormProps) {
  const form = useForm<ProductCategoryForm>({
    resolver: zodResolver(ProductCategorySchema),
    defaultValues: { nome: "", descricao: "", ativo: true },
  });

  const onSubmit = async (data: ProductCategoryForm) => {
    const result = await createProductCategory(data);
    if (result.success) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error("Erro ao criar categoria", { description: result.message });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem><FormLabel>Nome da Categoria</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="descricao" render={({ field }) => (
          <FormItem><FormLabel>Descrição</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="ativo" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><FormLabel>Ativo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
        )} />
        <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? "Salvando..." : "Salvar Categoria"}
        </Button>
      </form>
    </Form>
  );
}
