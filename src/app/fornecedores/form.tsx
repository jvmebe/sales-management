"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import {
  City,
  Country,
  State,
  Supplier,
  SupplierForm as SupplierFormType,
  SupplierSchema,
} from "@/lib/definitions";
import { createSupplier, updateSupplier } from "@/lib/actions/fornecedores";
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
import { DeleteSupplierButton } from "./delete-button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CitySelectionDialog } from "@/components/dialogs/city-selection-dialog";
import { DatePicker } from "@/components/ui/date-picker";

interface SupplierFormProps {
  initialData?: Supplier;
  cities: City[];
  states: State[];
  countries: Country[];
}

export default function SupplierForm({
  initialData,
  cities,
  states,
  countries,
}: SupplierFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [isCityDialogOpen, setCityDialogOpen] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState<string | undefined>(
    initialData
      ? cities.find((c) => c.id === initialData.cidade_id)?.nome
      : undefined
  );

  const form = useForm<SupplierFormType>({
    resolver: zodResolver(SupplierSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          data_nascimento: initialData.data_nascimento?.split("T")[0],
        }
      : { is_juridica: false, ativo: true },
  });

  const isJuridica = form.watch("is_juridica");

  const onSubmit = async (data: SupplierFormType) => {
    const action = isEditMode
      ? updateSupplier(initialData!.id, data)
      : createSupplier(data);
    const result = await action;
    if (result.success) {
      toast.success(result.message);
      router.push("/fornecedores");
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
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <FormField
            control={form.control}
            name="is_juridica"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-4 pt-2">
                <FormLabel>Pessoa Jurídica?</FormLabel>
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
          <h3 className="text-lg font-medium">Dados Principais</h3>

          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isJuridica ? "Razão Social" : "Nome Completo"}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="apelido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isJuridica ? "Nome Fantasia" : "Apelido"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isJuridica ? "CNPJ" : "CPF"}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isJuridica ? "Inscrição Estadual" : "RG"}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="data_nascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isJuridica ? "Data de Abertura" : "Data de Nascimento"}
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Separator />
          <h3 className="text-lg font-medium">Contato e Endereço</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
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
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="cep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
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
              render={({ field }) => (
                <FormItem className="flex flex-col md:col-span-2">
                  <FormLabel>Cidade</FormLabel>
                  <Dialog
                    open={isCityDialogOpen}
                    onOpenChange={setCityDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start font-normal"
                      >
                        {selectedCityName || "Selecione uma cidade"}
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
          </div>
          <FormField
            control={form.control}
            name="endereco"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereço (Rua, Av.)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="numero"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bairro"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="complemento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator />
          

          <div className="flex justify-between items-center">
            <div>
              {isEditMode && (
                <DeleteSupplierButton id={initialData!.id}>
                  <Button variant="destructive" type="button">
                    Excluir
                  </Button>
                </DeleteSupplierButton>
              )}
            </div>
            <div className="flex space-x-4 ml-auto">
              <Button variant="outline" type="button" asChild>
                <Link href="/fornecedores">Cancelar</Link>
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
