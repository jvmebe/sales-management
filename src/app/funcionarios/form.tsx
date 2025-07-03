"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  City,
  Country,
  State,
  Employee,
  EmployeeForm as EmployeeFormType,
  EmployeeSchema,
} from "@/lib/definitions";
import { createEmployee, updateEmployee } from "@/lib/actions/funcionarios";
import { formatDate } from "@/lib/utils";

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
} from "@/components/ui/form";
import { DeleteEmployeeButton } from "./delete-button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CitySelectionDialog } from "@/components/dialogs/city-selection-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { FormFooter } from "@/components/ui/form-footer";

interface EmployeeFormProps {
  initialData?: Employee;
  cities: City[];
  states: State[];
  countries: Country[];
}

export default function EmployeeForm({
  initialData,
  cities,
  states,
  countries,
}: EmployeeFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [selectedNames, setSelectedNames] = useState({
    city: initialData
      ? cities.find((c) => c.id === initialData.cidade_id)?.nome
      : undefined,
  });

  const form = useForm<EmployeeFormType>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          data_nascimento: initialData.data_nascimento
            ? new Date(initialData.data_nascimento)
            : undefined,
          data_admissao: initialData.data_admissao
            ? new Date(initialData.data_admissao)
            : undefined,
        }
      : { ativo: true },
  });

  const FORM_ID = "employee-form";

  const {
    formState: { errors, isDirty, isSubmitting },
  } = form;

  const deleteButton = isEditMode ? (
    <DeleteEmployeeButton id={initialData.id}>
      <Button variant="destructive" type="button">
        Excluir
      </Button>
    </DeleteEmployeeButton>
  ) : undefined;

  const [dialogsOpen, setDialogsOpen] = useState({
    city: false,
    paymentCondition: false,
  });

  const onSubmit = async (data: EmployeeFormType) => {
    const action = isEditMode
      ? updateEmployee(initialData!.id, data)
      : createEmployee(data);
    const result = await action;
    if (result.success) {
      toast.success(result.message);
      router.push("/funcionarios");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  const handleCitySelect = (city: City) => {
    form.setValue("cidade_id", city.id, { shouldValidate: true, shouldDirty: true });
    setSelectedNames((p) => ({...p, city: city.nome}));
    setDialogsOpen((p) => ({...p, city:false}));
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          id={FORM_ID}
        >
          <FormField
            control={form.control}
            name="ativo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <FormLabel>Ativo</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Separator />
          <h3 className="text-lg font-medium">Dados Pessoais</h3>
          <div className="flex items-start flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem className="w-2/4">
                  <FormLabel>Nome Completo*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apelido"
              render={({ field }) => (
                <FormItem className="w-2/4">
                  <FormLabel>Apelido</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-start flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0">
            <FormField
              control={form.control}
              name="data_nascimento"
              render={({ field }) => (
                <FormItem className="flex flex-col w-1/3">
                  <FormLabel>Data de Nascimento*</FormLabel>
                  <DatePicker
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                    disableFutureDates={true}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>CPF*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rg"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>RG</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <h3 className="text-lg font-medium">Contato e Endereço</h3>
          <div className="flex items-start flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-2/4">
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem className="w-2/4">
                  <FormLabel>Telefone*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-start flex-col md:flex-row md:space-x-5 space-y-5 md:space-y-0">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem className="w-1/7">
                  <FormLabel>CEP*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cidade_id"
              render={() => (
                <FormItem className="flex flex-col md:col-span-2 w-2/7">
                  <FormLabel>Cidade*</FormLabel>
                  <Dialog
                    open={dialogsOpen.city}
                    onOpenChange={(isOpen) =>
                      setDialogsOpen((p) => ({ ...p, city: isOpen }))
                    }
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start font-normal"
                      >
                        {selectedNames.city || "Selecione uma cidade"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl h-5/6 flex flex-col">
                      <CitySelectionDialog
                        cities={cities}
                        states={states}
                        countries={countries}
                        onSelect={handleCitySelect}
                      />
                    </DialogContent>
                  </Dialog>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem className="w-3/7">
                  <FormLabel>Endereço*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem className="w-1/7">
                  <FormLabel>Número*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-start md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem className="md:col-span-2 w-2/4">
                  <FormLabel>Bairro*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="complemento"
              render={({ field }) => (
                <FormItem className="w-2/4">
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <h3 className="text-lg font-medium">Dados Profissionais</h3>
          <div className="flex items-start md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="matricula"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Matrícula*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_admissao"
              render={({ field }) => (
                <FormItem className="flex flex-col w-1/3">
                  <FormLabel>Data de Admissão*</FormLabel>
                  <DatePicker
                    value={field.value ?? undefined}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cargo"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Cargo*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-start md:grid-cols-2 gap-4">
              <FormField
            control={form.control}
            name="salario"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Salário (R$)*</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="turno"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Turno</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carga_horaria"
            render={({ field }) => (
              <FormItem className="w-1/3">
                <FormLabel>Carga Horária (h)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          </div>
            {isEditMode && (
            <><Separator /><div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-lg border p-4">
              <div><p className="text-sm font-medium text-muted-foreground">Data de Criação</p><p className="text-sm">{formatDate(initialData.data_criacao)}</p></div>
              <div><p className="text-sm font-medium text-muted-foreground">Última Modificação</p><p className="text-sm">{formatDate(initialData.data_modificacao)}</p></div>
            </div></>
          )}
          <FormFooter
            formId={FORM_ID}
            cancelHref="/funcionarios"
            isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            isDirty={isDirty}
            deleteButton={deleteButton}
          />
        </form>
      </Form>
    </div>
  );
}
