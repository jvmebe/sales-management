"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { City, CityForm as CityFormType, CitySchema, State, Country } from "@/lib/definitions";
import { createCity, updateCity } from "@/lib/actions/cidades";
import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StateSelectionDialog } from "@/components/dialogs/state-selection-dialog";
import { DeleteCityButton } from "./delete-button";

interface CityFormProps {
  initialData?: City;
  states: State[];
  countries: Country[];
}

export default function CityForm({ initialData, states, countries }: CityFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [selectedStateName, setSelectedStateName] = useState(
    initialData ? states.find((s) => s.id === initialData.state_id)?.nome : ""
  );
  const [isDialogOpen, setDialogOpen] = useState(false);

  const form = useForm<CityFormType>({
    resolver: zodResolver(CitySchema),
    defaultValues: {
      nome: initialData?.nome || "",
      state_id: initialData?.state_id,
      ativo: initialData?.ativo ?? true,
    },
  });

  const onSubmit = async (data: CityFormType) => {
    const action = isEditMode
      ? updateCity(initialData.id, data)
      : createCity(data);

    const result = await action;

    if (result.success) {
      toast.success(result.message);
      router.push("/cidades");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  const handleStateSelect = (state: State) => {
    form.setValue("state_id", state.id, { shouldValidate: true });
    setSelectedStateName(state.nome);
    setDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Cidade</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Foz do Iguaçu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state_id"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Estado</FormLabel>
              <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-start font-normal">
                    {selectedStateName || "Selecione um estado"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl h-5/6 flex flex-col">
                    <StateSelectionDialog
                      states={states}
                      countries={countries}
                      onSelect={handleStateSelect}
                    />
                </DialogContent>
              </Dialog>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <FormLabel>Ativo</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        {isEditMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
              <p className="text-sm">{formatDate(initialData.data_criacao)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Última Modificação</p>
              <p className="text-sm">{formatDate(initialData.data_modificacao)}</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <div>
            {isEditMode && (
              <DeleteCityButton id={initialData.id}>
                <Button variant="destructive" type="button">Excluir</Button>
              </DeleteCityButton>
            )}
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" type="button" asChild>
              <Link href="/cidades">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
