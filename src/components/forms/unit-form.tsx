"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ProductUnitForm, ProductUnitSchema } from "@/lib/definitions";
import { createProductUnit } from "@/lib/actions/unidades-medida";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface UnitCreationFormProps {
  onSuccess: () => void;
}

export function UnitCreationForm({ onSuccess }: UnitCreationFormProps) {
  const form = useForm<ProductUnitForm>({
    resolver: zodResolver(ProductUnitSchema),
    defaultValues: { nome: "", sigla: "", ativo: true },
  });

  const onSubmit = async (data: ProductUnitForm) => {
    const result = await createProductUnit(data);
    if (result.success) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error("Erro", { description: result.message });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem><FormLabel>Nome da Unidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="sigla" render={({ field }) => (
            <FormItem><FormLabel>Sigla</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="ativo" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><FormLabel>Ativo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
        )} />
        <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? "Salvando..." : "Salvar Unidade"}
        </Button>
      </form>
    </Form>
  );
}
