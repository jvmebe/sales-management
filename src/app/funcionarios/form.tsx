"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { City, Country, State, Employee, EmployeeForm, EmployeeSchema } from "@/lib/definitions";
import { createEmployee, updateEmployee } from "@/lib/actions/funcionarios";
import { formatDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DeleteEmployeeButton } from "./delete-button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CitySelectionDialog } from "@/components/dialogs/city-selection-dialog";
import { DatePicker } from "@/components/ui/date-picker";

interface EmployeeFormProps {
  initialData?: Employee;
  cities: City[];
  states: State[];
  countries: Country[];
}

export default function EmployeeForm({ initialData, cities, states, countries }: EmployeeFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [isCityDialogOpen, setCityDialogOpen] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState<string | undefined>(
    initialData ? cities.find(c => c.id === initialData.cidade_id)?.nome : undefined
  );

  const form = useForm<EmployeeForm>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: initialData 
      ? { ...initialData, data_nascimento: initialData.data_nascimento ? new Date(initialData.data_nascimento) : undefined, data_admissao: initialData.data_admissao ? new Date(initialData.data_admissao) : undefined } 
      : { ativo: true },
  });

  const onSubmit = async (data: EmployeeForm) => {
    const action = isEditMode ? updateEmployee(initialData!.id, data) : createEmployee(data);
    const result = await action;
    if (result.success) {
      toast.success(result.message);
      router.push("/funcionarios");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  const handleCitySelect = (city: City) => {
    form.setValue("cidade_id", city.id, { shouldValidate: true });
    setSelectedCityName(city.nome);
    setCityDialogOpen(false);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <h3 className="text-lg font-medium">Dados Pessoais</h3>
            <FormField control={form.control} name="nome" render={({ field }) => ( <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="apelido" render={({ field }) => (<FormItem><FormLabel>Apelido</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="data_nascimento" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Data de Nascimento</FormLabel><DatePicker value={field.value ?? undefined} onChange={field.onChange} /><FormMessage /></FormItem>)} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="cpf" render={({ field }) => (<FormItem><FormLabel>CPF</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                <FormField control={form.control} name="rg" render={({ field }) => (<FormItem><FormLabel>RG</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            </div>
            
            <Separator />
            <h3 className="text-lg font-medium">Contato e Endereço</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="telefone" render={({ field }) => (<FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
            </div>
             <FormField control={form.control} name="cidade_id" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Cidade</FormLabel>
                    <Dialog open={isCityDialogOpen} onOpenChange={setCityDialogOpen}>
                        <DialogTrigger asChild><Button variant="outline" className="w-full justify-start font-normal">{selectedCityName || "Selecione uma cidade"}</Button></DialogTrigger>
                        <DialogContent className="max-w-4xl h-5/6 flex flex-col"><CitySelectionDialog cities={cities} states={states} countries={countries} onSelect={handleCitySelect}/></DialogContent>
                    </Dialog>
                    <FormMessage />
                </FormItem>
            )} />
            <Separator />
            <h3 className="text-lg font-medium">Dados Profissionais</h3>
            <div className="grid md:grid-cols-2 gap-4">
                <FormField control={form.control} name="matricula" render={({ field }) => ( <FormItem><FormLabel>Matrícula</FormLabel><FormControl><Input {...field} /></FormControl></FormItem> )} />
                <FormField control={form.control} name="data_admissao" render={({ field }) => ( <FormItem className="flex flex-col"><FormLabel>Data de Admissão</FormLabel><DatePicker value={field.value ?? undefined} onChange={field.onChange} /><FormMessage /></FormItem> )} />
            </div>
            <FormField control={form.control} name="cargo" render={({ field }) => ( <FormItem><FormLabel>Cargo</FormLabel><FormControl><Input {...field} /></FormControl></FormItem> )} />
             <div className="grid md:grid-cols-3 gap-4">
                 <FormField control={form.control} name="salario" render={({ field }) => ( <FormItem><FormLabel>Salário (R$)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem> )} />
                 <FormField control={form.control} name="turno" render={({ field }) => ( <FormItem><FormLabel>Turno</FormLabel><FormControl><Input {...field} /></FormControl></FormItem> )} />
                 <FormField control={form.control} name="carga_horaria" render={({ field }) => ( <FormItem><FormLabel>Carga Horária (h)</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem> )} />
             </div>
            
            <Separator />
            <FormField control={form.control} name="ativo" render={({ field }) => (<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4"><FormLabel>Ativo</FormLabel><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem>)} />

            <div className="flex justify-between items-center">
                <div>{isEditMode && (<DeleteEmployeeButton id={initialData!.id}><Button variant="destructive" type="button">Excluir</Button></DeleteEmployeeButton>)}</div>
                <div className="flex space-x-4 ml-auto">
                    <Button variant="outline" type="button" asChild><Link href="/funcionarios">Cancelar</Link></Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? "Salvando..." : "Salvar"}</Button>
                </div>
            </div>
        </form>
      </Form>
    </div>
  );
}
