"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { CityForm, CitySchema, State, Country } from "@/lib/definitions";
import { createCity } from "@/lib/actions/cidades";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StateSelectionDialog } from "@/components/dialogs/state-selection-dialog";

interface CityCreationFormProps {
  states: State[];
  countries: Country[];
  onSuccess: () => void;
}

export function CityCreationForm({ states, countries, onSuccess }: CityCreationFormProps) {
  const [isStateDialogOpen, setStateDialogOpen] = useState(false);
  const [selectedStateName, setSelectedStateName] = useState<string | undefined>();

  const form = useForm<CityForm>({
    resolver: zodResolver(CitySchema),
    defaultValues: { nome: "", state_id: undefined, ativo: true },
  });

  const onSubmit = async (data: CityForm) => {
    const result = await createCity(data);
    if (result.success) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error("Erro ao criar cidade", { description: result.message });
    }
  };
  
  const handleStateSelect = (state: State) => {
    form.setValue("state_id", state.id, { shouldValidate: true });
    setSelectedStateName(state.nome);
    setStateDialogOpen(false);
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField control={form.control} name="nome" render={({ field }) => (
          <FormItem><FormLabel>Nome da Cidade</FormLabel><FormControl><Input placeholder="Ex: Curitiba" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="state_id" render={() => (
          <FormItem className="flex flex-col">
            <FormLabel>Estado</FormLabel>
            <Dialog open={isStateDialogOpen} onOpenChange={setStateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start font-normal">
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
        )} />

        <FormField control={form.control} name="ativo" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><FormLabel>Ativo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
        )} />
        
        <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? "Salvando..." : "Salvar Cidade"}
        </Button>
      </form>
    </Form>
  );
}