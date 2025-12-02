"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { SaleSchema, SaleForm as SaleFormType, Client, Employee, Product, PaymentCondition } from "@/lib/definitions";
import { fetchPaymentConditionById } from "@/lib/data/condicoes-pagamento";
import { createSale } from "@/lib/actions/vendas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Search, XCircle } from "lucide-react";
import { FormFooter } from "@/components/ui/form-footer";

import { ClientSelectionDialog } from "@/components/dialogs/client-selection-dialog";
import { EmployeeSelectionDialog } from "@/components/dialogs/employee-selection-dialog";
import { ProductSelectionDialog } from "@/components/dialogs/product-selection-dialog";
import { PaymentConditionSelectionDialog } from "@/components/dialogs/payment-condition-selection-dialog";
import { CancelSaleButton } from "./cancel-button";

interface SaleFormProps {
  clients: Client[];
  employees: Employee[];
  products: Product[];
  paymentConditions: PaymentCondition[];
  initialData?: SaleFormType & { ativo?: boolean };
  readOnly?: boolean;
}

export default function SaleForm({
  clients,
  employees,
  products,
  paymentConditions,
  initialData,
  readOnly = false
}: SaleFormProps) {
  const router = useRouter();

  const [dialogsOpen, setDialogsOpen] = useState({ client: false, employee: false, product: false, condition: false });

  const [selectedNames, setSelectedNames] = useState({
    client: initialData ? clients.find(c => c.id === initialData.client_id)?.nome : "",
    employee: initialData ? employees.find(e => e.id === initialData.employee_id)?.nome : "",
    condition: initialData ? paymentConditions.find(p => p.id === initialData.payment_condition_id)?.descricao : ""
  });

  const [tempProduct, setTempProduct] = useState<Product | null>(null);
  const [tempQty, setTempQty] = useState<string>("1");
  const [tempPrice, setTempPrice] = useState<string>("0");

  const form = useForm<SaleFormType>({
    resolver: zodResolver(SaleSchema),
    defaultValues: initialData ? {
        ...initialData,
        data_emissao: new Date(initialData.data_emissao),
    } : {
      data_emissao: new Date(),
      items: [],
      installments: []
    }
  });

  const { fields: items, append: appendItem, remove: removeItem } = useFieldArray({
    control: form.control,
    name: "items"
  });

  const { fields: installments, replace: replaceInstallments } = useFieldArray({
    control: form.control,
    name: "installments"
  });

  const watchedItems = useWatch({ control: form.control, name: "items" }) || [];
  const watchedInstallments = useWatch({ control: form.control, name: "installments" }) || [];

  const totalVenda = watchedItems.reduce((acc, item) => acc + (item.quantidade * item.valor_unitario), 0);

  // Bloqueia se for readOnly (venda salva) OU se já tiver parcelas geradas (no modo criação)
  const isLocked = readOnly || watchedInstallments.length > 0;

  const handleProductSelected = (p: Product) => {
    setTempProduct(p);
    setTempPrice(p.valor_venda.toString());
    setTempQty("1");
    setDialogsOpen(prev => ({ ...prev, product: false }));
  };

  const handleAddItem = () => {
    if (!tempProduct) return;
    appendItem({
        product_id: tempProduct.id,
        quantidade: Number(tempQty),
        valor_unitario: Number(tempPrice)
    });
    setTempProduct(null);
    setTempQty("1");
    setTempPrice("0");
  };

  const tempTotal = (Number(tempQty) || 0) * (Number(tempPrice) || 0);

  const handleGenerateInstallments = async () => {
      if (readOnly) return;
      const conditionId = form.getValues("payment_condition_id");
      const date = form.getValues("data_emissao");

      if (!conditionId || totalVenda <= 0 || !date) {
        toast.error("Dados incompletos para gerar parcelas.");
        return;
      }

      const condition = await fetchPaymentConditionById(conditionId);
      if (!condition || !condition.parcelas.length) return;

      const totalCentavos = Math.round(totalVenda * 100);

      const parcelasCalculadas = condition.parcelas.map((p) => {
        const percentual = Number(p.percentual_valor);
        const valorCentavos = Math.floor(totalCentavos * (percentual / 100));
        return {
          ...p,
          valor_centavos: valorCentavos,
          percentual_original: percentual
        };
      });

      const somaCalculada = parcelasCalculadas.reduce((acc, p) => acc + p.valor_centavos, 0);
      let diferencaCentavos = totalCentavos - somaCalculada;

      let indiceParaAjuste = 0;
      let maiorPercentual = -1;

      parcelasCalculadas.forEach((p, idx) => {
        if (p.percentual_original >= maiorPercentual) {
          maiorPercentual = p.percentual_original;
          indiceParaAjuste = idx;
        }
      });

      parcelasCalculadas[indiceParaAjuste].valor_centavos += diferencaCentavos;

      const newInstallments = parcelasCalculadas.map((p) => {
        const dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + p.dias_vencimento);

        return {
          numero_parcela: p.numero_parcela,
          data_vencimento: dueDate,
          valor_parcela: p.valor_centavos / 100
        };
      });

      replaceInstallments(newInstallments);
    };

  const handleClearInstallments = () => {
    if (readOnly) return;
    replaceInstallments([]);
  };

  const onSubmit = async (data: SaleFormType) => {
    if (readOnly) return;
    const result = await createSale(data);
    if (result.success) {
      toast.success(result.message);
      router.push("/vendas");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };

  return (
    <Form {...form}>
      <form id="sale-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-24">

        {readOnly && initialData?.ativo === false && (
             <div className="bg-destructive/15 p-4 rounded-md border border-destructive text-destructive font-bold text-center">
                VENDA CANCELADA
             </div>
        )}

        <fieldset disabled={isLocked} className="space-y-6 border p-4 rounded-lg bg-card">
                  <legend className="text-lg font-semibold px-2">Dados da Venda</legend>

                  {/* LINHA 1: Dados Fiscais (Novos Campos) */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                     <div className="flex flex-col space-y-2">
                        <FormLabel>Modelo</FormLabel>
                        <Input value="55" disabled className="bg-slate-100 dark:bg-slate-800" />
                     </div>
                     <div className="flex flex-col space-y-2">
                        <FormLabel>Série</FormLabel>
                        <Input value="1" disabled className="bg-slate-100 dark:bg-slate-800" />
                     </div>
                     <div className="flex flex-col space-y-2">
                        <FormLabel>Número da Nota</FormLabel>
                        <Input
                          value={initialData?.numero_nota ? String(initialData.numero_nota).padStart(6, '0') : "Gerado ao Salvar"}
                          disabled
                          className="bg-slate-100 dark:bg-slate-800 font-mono font-bold"
                        />
                     </div>
                  </div>

                  <Separator className="mb-4" />

                  {/* LINHA 2: Cliente, Vendedor, Data (Campos Existentes) */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Picker de Cliente */}
                    <FormField name="client_id" control={form.control} render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Cliente</FormLabel>
                        <Dialog open={dialogsOpen.client} onOpenChange={o => setDialogsOpen({...dialogsOpen, client: o})}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="justify-start font-normal text-left truncate" disabled={isLocked}>
                              {selectedNames.client || "Selecione um cliente"}
                            </Button>
                          </DialogTrigger>
                          {!readOnly && (
                          <DialogContent className="max-w-6xl w-full h-[80vh]">
                            <ClientSelectionDialog
                              clients={clients}
                              onSelect={(c) => {
                                const client = Array.isArray(c) ? c[0] : c;
                                if(client) {
                                    field.onChange(client.id);
                                    setSelectedNames(p => ({...p, client: client.nome}));
                                    setDialogsOpen(p => ({...p, client: false}));
                                }
                              }}
                            />
                          </DialogContent>
                          )}
                        </Dialog>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Picker de Funcionário */}
                    <FormField name="employee_id" control={form.control} render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Vendedor</FormLabel>
                        <Dialog open={dialogsOpen.employee} onOpenChange={o => setDialogsOpen({...dialogsOpen, employee: o})}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="justify-start font-normal text-left truncate" disabled={isLocked}>
                              {selectedNames.employee || "Selecione um vendedor"}
                            </Button>
                          </DialogTrigger>
                          {!readOnly && (
                          <DialogContent className="min-w-7xl h-[70vh]">
                            <EmployeeSelectionDialog
                               employees={employees}
                               onSelect={(e) => {
                                 const emp = Array.isArray(e) ? e[0] : e;
                                 if(emp){
                                     field.onChange(emp.id);
                                     setSelectedNames(p => ({...p, employee: emp.nome}));
                                     setDialogsOpen(p => ({...p, employee: false}));
                                 }
                               }}
                            />
                          </DialogContent>
                          )}
                        </Dialog>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* Data de Emissão - SEMPRE TRAVADA */}
                    <FormField name="data_emissao" control={form.control} render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Emissão</FormLabel>
                        <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            disabled={true}
                        />
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </fieldset>

        <Separator />

        <fieldset disabled={isLocked} className="space-y-4">
          <legend className="text-lg font-medium">Itens da Venda</legend>

          {!readOnly && (
          <div className="grid grid-cols-12 gap-2 items-end border p-3 rounded-lg bg-muted/30">
             <div className="col-span-2 md:col-span-1">
                <FormLabel className="text-xs">Cód.</FormLabel>
                <Input value={tempProduct?.id || ""} readOnly className="bg-background cursor-pointer" onClick={() => setDialogsOpen(p => ({...p, product: true}))} placeholder="ID"/>
            </div>
            <div className="col-span-8 md:col-span-3">
                <FormLabel className="text-xs">Produto</FormLabel>
                <div className="flex gap-1">
                    <Input value={tempProduct?.nome || ""} placeholder="Buscar..." readOnly className="cursor-pointer bg-background" onClick={() => setDialogsOpen(p => ({...p, product: true}))}/>
                    <Button type="button" size="icon" variant="outline" onClick={() => setDialogsOpen(p => ({...p, product: true}))}><Search className="h-4 w-4"/></Button>
                </div>
                <Dialog open={dialogsOpen.product} onOpenChange={o => setDialogsOpen({...dialogsOpen, product: o})}>
                    <DialogContent className="max-w-6xl w-full h-[80vh]">
                        <ProductSelectionDialog products={products} selectionMode="single" onSelect={(p) => handleProductSelected(p as Product)}/>
                    </DialogContent>
                </Dialog>
            </div>
            <div className="col-span-2 md:col-span-1">
                <FormLabel className="text-xs">Unid.</FormLabel>
                <Input value={tempProduct?.unit_sigla || ""} disabled className="bg-muted" />
            </div>
            <div className="col-span-3 md:col-span-2">
                <FormLabel className="text-xs">Qtd.</FormLabel>
                <Input type="number" value={tempQty} onChange={e => setTempQty(e.target.value)} className="bg-background" min={1}/>
            </div>
            <div className="col-span-3 md:col-span-2">
                <FormLabel className="text-xs">Preço (R$)</FormLabel>
                <Input type="number" step="0.01" value={tempPrice} onChange={e => setTempPrice(e.target.value)} className="bg-background"/>
            </div>
            <div className="col-span-3 md:col-span-2">
                <FormLabel className="text-xs">Total (R$)</FormLabel>
                <Input value={tempTotal.toFixed(2)} disabled className="bg-muted font-bold text-right" />
            </div>
            <div className="col-span-3 md:col-span-1">
                <Button type="button" onClick={handleAddItem} className="w-full" disabled={!tempProduct}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
          </div>
          )}

          <div className="rounded-md border mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[10%]">Cód.</TableHead>
                  <TableHead className="w-[30%]">Produto</TableHead>
                  <TableHead className="w-[10%]">Unid.</TableHead>
                  <TableHead className="w-[15%]">Qtd.</TableHead>
                  <TableHead className="w-[15%]">Unitário (R$)</TableHead>
                  <TableHead className="w-[15%] text-right">Total (R$)</TableHead>
                  {!readOnly && <TableHead className="w-[50px]"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => {
                    const product = products.find(p => p.id === item.product_id);
                    return (
                        <TableRow key={item.id}>
                            <TableCell>{item.product_id}</TableCell>
                            <TableCell>{product?.nome}</TableCell>
                            <TableCell>{product?.unit_sigla}</TableCell>
                            <TableCell>
                                {readOnly ? item.quantidade : (
                                <Input type="number" {...form.register(`items.${index}.quantidade`)} min={1} className="h-8" />
                                )}
                            </TableCell>
                            <TableCell>
                                {readOnly ? `R$ ${Number(item.valor_unitario).toFixed(2)}` : (
                                <Input type="number" step="0.01" {...form.register(`items.${index}.valor_unitario`)} className="h-8" />
                                )}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                R$ {((watchedItems[index]?.quantidade || 0) * (watchedItems[index]?.valor_unitario || 0)).toFixed(2)}
                            </TableCell>
                            {!readOnly && (
                            <TableCell>
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            </TableCell>
                            )}
                        </TableRow>
                    )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end items-center gap-4 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <span className="text-lg">Total da Venda:</span>
            <span className="text-2xl font-bold text-primary">R$ {totalVenda.toFixed(2)}</span>
          </div>
        </fieldset>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-end gap-4">
            <FormField name="payment_condition_id" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-col w-1/3">
                  <FormLabel>Condição de Pagamento</FormLabel>
                  <Dialog open={dialogsOpen.condition} onOpenChange={o => setDialogsOpen({...dialogsOpen, condition: o})}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="justify-start font-normal text-left truncate" disabled={isLocked}>
                        {selectedNames.condition || "Selecione a condição"}
                      </Button>
                    </DialogTrigger>
                    {!readOnly && (
                    <DialogContent className="max-w-4xl h-[80vh]">
                      <PaymentConditionSelectionDialog paymentConditions={paymentConditions} paymentMethods={[]} onSelect={(pc) => {
                          field.onChange(pc.id);
                          setSelectedNames(p => ({...p, condition: pc.descricao}));
                          setDialogsOpen(p => ({...p, condition: false}));
                        }}
                      />
                    </DialogContent>
                    )}
                  </Dialog>
                  <FormMessage />
                </FormItem>
            )} />

            {!readOnly && !isLocked && (
              <Button type="button" onClick={handleGenerateInstallments} className="mb-2">Gerar Parcelas</Button>
            )}

            {!readOnly && isLocked && (
              <Button type="button" variant="destructive" onClick={handleClearInstallments} className="mb-2">
                <XCircle className="mr-2 h-4 w-4" /> Refazer Parcelas
              </Button>
            )}

          </div>

          {installments.length > 0 && (
            <div className="rounded-md border p-4">
              <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Financeiro</h4>
              <Table>
                <TableHeader><TableRow><TableHead>Nº</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead></TableRow></TableHeader>
                <TableBody>
                  {installments.map((inst, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{inst.numero_parcela}</TableCell>
                      <TableCell>{format(new Date(inst.data_vencimento), "dd/MM/yyyy")}</TableCell>
                      <TableCell>R$ {Number(inst.valor_parcela).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <FormFooter
          formId="sale-form"
          cancelHref="/vendas"
          isEditMode={false}
          isSubmitting={form.formState.isSubmitting}
          isDirty={form.formState.isDirty}
          deleteButton={readOnly && initialData?.ativo ? <CancelSaleButton id={initialData.id!} /> : undefined}
        />
        {readOnly && <style>{`button[type="submit"] { display: none; }`}</style>}
      </form>
    </Form>
  );
}
