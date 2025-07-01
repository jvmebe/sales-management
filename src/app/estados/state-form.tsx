"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { State, StateForm as StateFormType, StateSchema, Country } from "@/lib/definitions";
import { createState, updateState } from "@/lib/actions/estados";
import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CountrySelectionDialog } from "@/components/dialogs/country-selection-dialog";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
//import { DeleteStateButton } from "./delete-button";

interface StateFormProps {
  initialData?: State;
  countries: Country[];
}

export default function StateForm({ initialData, countries }: StateFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [selectedCountryName, setSelectedCountryName] = useState(
    initialData
      ? countries.find(c => c.id === initialData.country_id)?.nome
      : ""
  );

  const form = useForm<StateFormType>({
    resolver: zodResolver(StateSchema),
    defaultValues: {
      nome: initialData?.nome || "",
      sigla: initialData?.sigla || "",
      country_id: initialData?.country_id,
      ativo: initialData?.ativo ?? true,
    },
  });

  const onSubmit = async (data: StateFormType) => {
    const action = isEditMode
      ? updateState(initialData.id, data)
      : createState(data);

    const result = await action;

    if (result.success) {
      toast.success(result.message);
      router.push("/estados");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleCountrySelect = (country: Country) => {
    form.setValue("country_id", country.id, { shouldValidate: true });
    setSelectedCountryName(country.nome);
    setDialogOpen(false);
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Ativo</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Estado</FormLabel>
              <FormControl><Input placeholder="Ex: Paraná" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sigla"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sigla (UF)</FormLabel>
              <FormControl><Input placeholder="Ex: PR" maxLength={2} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="country_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>País</FormLabel>
              <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    {selectedCountryName || "Selecione um país"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <CountrySelectionDialog
                    countries={countries}
                    onSelect={handleCountrySelect}
                  />
                </DialogContent>
              </Dialog>
              <FormMessage />
            </FormItem>
          )}
        />

        {isEditMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Data de Criação</p>
              <p>{formatDate(initialData.data_criacao)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Última Modificação</p>
              <p>{formatDate(initialData.data_modificacao)}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div>
            {/* isEditMode && 
              <DeleteStateButton id={initialData.id}>
                <Button variant="destructive" type="button">Excluir</Button>
              </DeleteStateButton>
            */}
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" type="button" asChild>
              <Link href="/estados">Cancelar</Link>
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