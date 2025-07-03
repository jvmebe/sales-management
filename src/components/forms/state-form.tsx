"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";

import { Country, StateForm, StateSchema } from "@/lib/definitions";
import { createState } from "@/lib/actions/estados";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CountrySelectionDialog } from "@/components/dialogs/country-selection-dialog";

interface StateCreationFormProps {
  countries: Country[];
  onSuccess: () => void;
}

export function StateCreationForm({ countries, onSuccess }: StateCreationFormProps) {
  const [isCountryDialogOpen, setCountryDialogOpen] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState<string | undefined>(undefined);
  
  const form = useForm<StateForm>({
    resolver: zodResolver(StateSchema),
    defaultValues: {
      nome: "",
      sigla: "",
      country_id: undefined,
      ativo: true,
    },
  });

  const onSubmit = async (data: StateForm) => {
    const result = await createState(data);
    if (result.success) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error("Erro ao criar estado", { description: result.message });
    }
  };
  
  const handleCountrySelect = (country: Country) => {
    form.setValue("country_id", country.id, { shouldValidate: true });
    setSelectedCountryName(country.nome);
    setCountryDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
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
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>País</FormLabel>
              <Dialog open={isCountryDialogOpen} onOpenChange={setCountryDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-normal">
                    {selectedCountryName || "Selecione um país"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl flex flex-col">
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

        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <FormLabel>Ativo</FormLabel>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "Salvando..." : "Salvar Estado"}
        </Button>
      </form>
    </Form>
  );
}
