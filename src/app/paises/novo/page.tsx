"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CountryForm, CountrySchema } from "@/lib/definitions";
import { createCountry } from "@/lib/actions/paises";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function NewCountryPage() {
  const form = useForm<CountryForm>({
    resolver: zodResolver(CountrySchema),
    defaultValues: {
      nome: "",
      sigla: "",
      ativo: true,
    },
    // opcional, para mostrar erros ao “tocar” no campo
    mode: "onTouched",
  });

  // dispara validação e só cai aqui se tudo estiver válido
  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createCountry(data);
      // redireciona, show toast, etc.
    } catch (err: any) {
      // lidar com erro do server action (mensagem genérica, por ex)
      console.error(err);
    }
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-bold">Novo País</h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para adicionar um novo país.
        </p>
      </div>
      <Separator className="my-6" />

      <Form {...form}>
        {/* aqui substituímos `action={dispatch}` por onSubmit que chama handleSubmit */}
        <form onSubmit={onSubmit} className="space-y-8">
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
                <FormDescription>
                  A sigla de duas letras do país.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button variant="outline" asChild>
              <Link href="/paises">Cancelar</Link>
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
