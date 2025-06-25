"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitErrorHandler } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { Country, CountryForm, CountrySchema } from "@/lib/definitions";
import { updateCountry } from "@/lib/actions/paises";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteCountryButton } from "../../delete-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

interface EditCountryFormProps {
  country: Country;
}

export default function EditCountryForm({ country }: EditCountryFormProps) {
  const router = useRouter();
  const form = useForm<CountryForm>({
    resolver: zodResolver(CountrySchema),
    defaultValues: {
      nome: country.nome || "",
      sigla: country.sigla || "",
      ativo: Boolean(country.ativo),
    },
  });

  const onSubmit = async (data: CountryForm) => {
    console.log("PLEASE");
    const result = await updateCountry(country.id, data);

    if (result.success) {
      toast.success(result.message);
      router.push("/paises");
    } else {
      toast.error("Erro ao salvar", {
        description: result.message,
      });
    }
  };

  const onError: SubmitErrorHandler<CountryForm> = (errors, e) => {
    console.log("Form submission failed:", errors);
    if (errors) {
      console.log(errors);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-8"
      >
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-4">
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-muted-foreground">
              Data de Criação
            </p>
            <p className="text-sm">{formatDate(country.data_criacao)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-sm font-medium text-muted-foreground">
              Última Modificação
            </p>
            <p className="text-sm">{formatDate(country.data_modificacao)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {/* Botão Excluir à esquerda */}
          <DeleteCountryButton id={country.id}>
            <Button variant="destructive" type="button">
              Excluir
            </Button>
          </DeleteCountryButton>

          {/* Botões Salvar e Cancelar à direita */}
          <div className="flex space-x-4">
            <Button variant="outline" type="button" asChild>
              <Link href="/paises">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting
                ? "Salvando..."
                : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
