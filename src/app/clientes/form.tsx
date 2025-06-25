"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { City, Country, State, Client, ClientForm, ClientSchema, PaymentCondition, PaymentMethod } from "@/lib/definitions";
import { createClient, updateClient } from "@/lib/actions/clientes";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DeleteClientButton } from "./delete-button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { CitySelectionDialog } from "@/components/dialogs/city-selection-dialog";
import { PaymentConditionSelectionDialog } from "@/components/dialogs/payment-condition-selection-dialog";

interface ClientFormProps {
  initialData?: Client;
  cities: City[];
  states: State[];
  countries: Country[];
  paymentConditions: PaymentCondition[];
  paymentMethods: PaymentMethod[];
}

export default function ClientForm({ initialData, cities, states, countries, paymentConditions, paymentMethods }: ClientFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [dialogsOpen, setDialogsOpen] = useState({ city: false, paymentCondition: false });
  const [selectedNames, setSelectedNames] = useState({
    city: initialData ? cities.find(c => c.id === initialData.cidade_id)?.nome : undefined,
    paymentCondition: initialData ? paymentConditions.find(pc => pc.id === initialData.cond_pag_id)?.descricao : undefined,
  });

  const form = useForm<ClientForm>({
    resolver: zodResolver(ClientSchema),
    defaultValues: initialData 
      ? { ...initialData, data_nascimento: initialData.data_nascimento ? new Date(initialData.data_nascimento) : undefined } 
      : { is_juridica: false, ativo: true, limite_credito: 0 },
  });

  const isJuridica = form.watch("is_juridica");

  const onSubmit = async (data: ClientForm) => {
    const action = isEditMode ? updateClient(initialData!.id, data) : createClient(data);
    const result = await action;
    if (result.success) {
      toast.success(result.message);
      router.push("/clientes");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  const handleCitySelect = (city: City) => {
    form.setValue("cidade_id", city.id, { shouldValidate: true });
    setSelectedNames(p => ({...p, city: city.nome}));
    setDialogsOpen(p => ({...p, city: false}));
  };
  
  const handlePaymentConditionSelect = (pc: PaymentCondition) => {
    form.setValue("cond_pag_id", pc.id, { shouldValidate: true });
    setSelectedNames(p => ({...p, paymentCondition: pc.descricao}));
    setDialogsOpen(p => ({...p, paymentCondition: false}));
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="is_juridica" render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-4 pt-2"><FormLabel>Pessoa Jurídica?</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>
            )} />

            <Separator />
            <h3 className="text-lg font-medium">Dados Principais</h3>
            <FormField control={form.control} name="nome" render={({ field }) => (<FormItem><FormLabel>{isJuridica ? 'Razão Social' : 'Nome Completo'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="apelido" render={({ field }) => (<FormItem><FormLabel>{isJuridica ? 'Nome Fantasia' : 'Apelido'}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="cpf" render={({ field }) => (<FormItem><FormLabel>{isJuridica ? 'CNPJ' : 'CPF'}</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="rg" render={({ field }) => (<FormItem><FormLabel>{isJuridica ? 'Inscrição Estadual' : 'RG'}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="data_nascimento" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>{isJuridica ? 'Data de Abertura' : 'Data de Nascimento'}</FormLabel><DatePicker value={field.value ?? undefined} onChange={field.onChange} /><FormMessage /></FormItem>)} />
            </div>
            
            <Separator />
            <h3 className="text-lg font-medium">Contato e Endereço</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="telefone" render={({ field }) => (<FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
                 <FormField control={form.control} name="cep" render={({ field }) => (
                    <FormItem><FormLabel>CEP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cidade_id" render={() => (
                    <FormItem className="flex flex-col md:col-span-2"><FormLabel>Cidade</FormLabel>
                        <Dialog open={dialogsOpen.city} onOpenChange={(isOpen) => setDialogsOpen(p => ({...p, city: isOpen}))}>
                            <DialogTrigger asChild><Button variant="outline" className="w-full justify-start font-normal">{selectedNames.city || "Selecione uma cidade"}</Button></DialogTrigger>
                            <DialogContent className="max-w-4xl h-5/6 flex flex-col"><CitySelectionDialog cities={cities} states={states} countries={countries} onSelect={handleCitySelect}/></DialogContent>
                        </Dialog>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
             <FormField control={form.control} name="endereco" render={({ field }) => (
                <FormItem><FormLabel>Endereço (Rua, Av.)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid md:grid-cols-3 gap-4">
                <FormField control={form.control} name="numero" render={({ field }) => (
                    <FormItem><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bairro" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
            </div>
             <FormField control={form.control} name="complemento" render={({ field }) => (
                <FormItem><FormLabel>Complemento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />

            <Separator />
            <h3 className="text-lg font-medium">Financeiro</h3>
            <div className="grid md:grid-cols-2 gap-4">
                 <FormField control={form.control} name="cond_pag_id" render={() => (
                    <FormItem className="flex flex-col"><FormLabel>Condição de Pagamento</FormLabel>
                        <Dialog open={dialogsOpen.paymentCondition} onOpenChange={(isOpen) => setDialogsOpen(p => ({...p, paymentCondition: isOpen}))}>
                            <DialogTrigger asChild><Button variant="outline" className="w-full justify-start font-normal">{selectedNames.paymentCondition || "Selecione uma condição"}</Button></DialogTrigger>
                            <DialogContent className="max-w-4xl h-5/6 flex flex-col"><PaymentConditionSelectionDialog paymentConditions={paymentConditions} paymentMethods={paymentMethods} onSelect={handlePaymentConditionSelect} /></DialogContent>
                        </Dialog>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="limite_credito" render={({ field }) => ( <FormItem><FormLabel>Limite de Crédito (R$)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </div>
            
            <Separator />
            <FormField control={form.control} name="ativo" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><FormLabel>Ativo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />
            
            <div className="flex justify-between items-center pt-4">
                <div>{isEditMode && (<DeleteClientButton id={initialData!.id}><Button variant="destructive" type="button">Excluir</Button></DeleteClientButton>)}</div>
                <div className="flex space-x-4 ml-auto">
                    <Button variant="outline" type="button" asChild><Link href="/clientes">Cancelar</Link></Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Salvando..." : "Salvar"}</Button>
                </div>
            </div>
        </form>
      </Form>
    </div>
  );
}
