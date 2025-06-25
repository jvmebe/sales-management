"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CountryForm, CountrySchema } from "@/lib/definitions";
import { createCountry } from "@/lib/actions/paises";
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
  FormDescription,
} from "@/components/ui/form";


interface CountryCreationFormProps {
  onSuccess: () => void;
}

export function CountryCreationForm({ onSuccess }: CountryCreationFormProps) {
  const form = useForm<CountryForm>({
    resolver: zodResolver(CountrySchema),
    defaultValues: { nome: "", sigla: "", ativo: true },
  });

  const onSubmit = async (data: CountryForm) => {
    const result = await createCountry(data);
    if (result.success) {
      toast.success(result.message);
      onSuccess(); // Chama funcao para fechar modal e atualizar lista
    } else {
      toast.error("Erro ao criar", { description: result.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Ativo</FormLabel>
                <FormDescription>
                  Se o país estará ativo e disponível para uso no sistema.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do País</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Brasil" {...field} />
              </FormControl>
              <FormDescription>O nome completo do país.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sigla"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sigla</FormLabel>
              <FormControl>
                <Input placeholder="Ex: BR" maxLength={2} {...field} />
              </FormControl>
              <FormDescription>A sigla de duas letras do país.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Salvando..." : "Salvar País"}
        </Button>
      </form>
    </Form>
  );
}
