"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { SupplierForm, SupplierSchema, City, State, Country } from "@/lib/definitions";
import { createSupplier } from "@/lib/actions/fornecedores";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/date-picker";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CitySelectionDialog } from "@/components/dialogs/city-selection-dialog";

interface SupplierCreationFormProps {
  cities: City[];
  states: State[];
  countries: Country[];
  onSuccess: () => void;
}

export function SupplierCreationForm({ cities, states, countries, onSuccess }: SupplierCreationFormProps) {
  const [isCityDialogOpen, setCityDialogOpen] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState<string | undefined>();

  const form = useForm<SupplierForm>({
    resolver: zodResolver(SupplierSchema),
    defaultValues: {
      is_juridica: false,
      ativo: true,
      nome: "",
      apelido: "",
      cpf: "",
      rg: "",
      data_nascimento: undefined,
      email: "",
      telefone: "",
      endereco: "",
      numero: "",
      complemento: "",
      bairro: "",
      cep: "",
      cidade_id: undefined,
      inscricao_estadual: "",
    },
  });

  const isJuridica = form.watch("is_juridica");

  const onSubmit = async (data: SupplierForm) => {
    const result = await createSupplier(data);
    if (result.success) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error("Erro ao criar fornecedor", { description: result.message });
    }
  };

  const handleCitySelect = (city: City) => {
    form.setValue("cidade_id", city.id, { shouldValidate: true });
    setSelectedCityName(city.nome);
    setCityDialogOpen(false);
  };

  return (
    <div className="overflow-y-auto max-h-[80vh] p-1">
      <Form {...form}>
        <form className="space-y-6 px-4">
          <FormField control={form.control} name="is_juridica" render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-4 pt-2"><FormLabel>Pessoa Jurídica?</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
          )} />
          
          <Separator />
          <h3 className="text-lg font-medium">Dados Principais</h3>
          <FormField control={form.control} name="nome" render={({ field }) => (
            <FormItem><FormLabel>{isJuridica ? 'Razão Social' : 'Nome Completo'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="apelido" render={({ field }) => (
              <FormItem><FormLabel>{isJuridica ? 'Nome Fantasia' : 'Apelido'}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="cpf" render={({ field }) => (
              <FormItem><FormLabel>{isJuridica ? 'CNPJ' : 'CPF'}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="rg" render={({ field }) => (
              <FormItem><FormLabel>{isJuridica ? 'Inscrição Estadual' : 'RG'}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="data_nascimento" render={({ field }) => (
              <FormItem className="flex flex-col"><FormLabel>{isJuridica ? 'Data de Abertura' : 'Data de Nascimento'}</FormLabel><DatePicker value={field.value ?? undefined} onChange={field.onChange} /><FormMessage /></FormItem>
            )} />
          </div>
        
          <Separator />
          <h3 className="text-lg font-medium">Contato e Endereço</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="telefone" render={({ field }) => (
              <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField control={form.control} name="cep" render={({ field }) => (<FormItem><FormLabel>CEP</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            <FormField control={form.control} name="cidade_id" render={({ field }) => (
              <FormItem className="flex flex-col md:col-span-2"><FormLabel>Cidade</FormLabel>
                <Dialog open={isCityDialogOpen} onOpenChange={setCityDialogOpen}>
                  <DialogTrigger asChild><Button variant="outline" className="w-full justify-start font-normal">{selectedCityName || "Selecione uma cidade"}</Button></DialogTrigger>
                  <DialogContent className="max-w-4xl h-5/6 flex flex-col"><CitySelectionDialog cities={cities} states={states} countries={countries} onSelect={handleCitySelect}/></DialogContent>
                </Dialog>
                <FormMessage />
              </FormItem>
            )} />
          </div>
          <FormField control={form.control} name="endereco" render={({ field }) => (<FormItem><FormLabel>Endereço (Rua, Av.)</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
          <div className="grid md:grid-cols-3 gap-4">
            <FormField control={form.control} name="numero" render={({ field }) => (<FormItem><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            <FormField control={form.control} name="bairro" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
          </div>
          <FormField control={form.control} name="complemento" render={({ field }) => (<FormItem><FormLabel>Complemento</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
          
          <Separator />
          <FormField control={form.control} name="ativo" render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3"><FormLabel>Ativo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
          )} />
          <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full">
            {form.formState.isSubmitting ? "Salvando..." : "Salvar Fornecedor"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
