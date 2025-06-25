"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ProductBrandForm, ProductBrandSchema } from "@/lib/definitions";
import { createProductBrand } from "@/lib/actions/marcas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface BrandCreationFormProps {
  onSuccess: () => void;
}

export function BrandCreationForm({ onSuccess }: BrandCreationFormProps) {
  const form = useForm<ProductBrandForm>({
    resolver: zodResolver(ProductBrandSchema),
    defaultValues: { nome: "", ativo: true },
  });

  const onSubmit = async (data: ProductBrandForm) => {
    const result = await createProductBrand(data);
    if (result.success) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error("Erro ao criar marca", { description: result.message });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem><FormLabel>Nome da Marca</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="ativo" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><FormLabel>Ativo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
        )} />
        <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? "Salvando..." : "Salvar Marca"}
        </Button>
      </form>
    </Form>
  );
}
