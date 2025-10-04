"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  PurchaseForm as PurchaseFormType,
  PurchaseSchema,
  Supplier,
  Product,
  PaymentCondition,
  PaymentMethod,
  City,
  State,
  Country,
} from "@/lib/definitions";
import { createPurchase } from "@/lib/actions/compras";
import { fetchPaymentConditionById } from "@/lib/data/condicoes-pagamento";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { SupplierSelectionDialog } from "@/components/dialogs/supplier-selection-dialog";
import { PaymentConditionSelectionDialog } from "@/components/dialogs/payment-condition-selection-dialog";
import { ProductSelectionDialog } from "@/components/dialogs/product-selection-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { FormFooter } from "@/components/ui/form-footer";

interface PurchaseFormProps {
  initialData?: PurchaseFormType;
  suppliers: Supplier[];
  products: Product[];
  paymentConditions: PaymentCondition[];
  paymentMethods: PaymentMethod[];
  cities: City[];
  states: State[];
  countries: Country[];
}

export default function PurchaseForm({
  initialData,
  suppliers,
  products,
  paymentConditions,
  paymentMethods,
  cities,
  states,
  countries,
}: PurchaseFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const [formStep, setFormStep] = useState(1); // 1: Header, 2: Items, 3: Installments

  const [dialogsOpen, setDialogsOpen] = useState({
    supplier: false,
    product: false,
    paymentCondition: false,
  });
  const [selectedNames, setSelectedNames] = useState({
    supplier: initialData?.supplier_id ? suppliers.find(s => s.id === initialData.supplier_id)?.nome : "",
    paymentCondition: initialData?.payment_condition_id ? paymentConditions.find(pc => pc.id === initialData.payment_condition_id)?.descricao : "",
  });

  const form = useForm<PurchaseFormType>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: initialData || {
      ativo: true,
      items: [],
      installments: [],
    },
  });

  const { fields: items, append: appendItem, remove: removeItem } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const { fields: installments, replace: replaceInstallments } = useFieldArray({
    control: form.control,
    name: "installments",
  });

  const watchedItems = useWatch({ control: form.control, name: "items" });
  const watchedFrete = useWatch({ control: form.control, name: "valor_frete" }) || 0;
  const watchedSeguro = useWatch({ control: form.control, name: "seguro" }) || 0;
  const watchedDespesas = useWatch({ control: form.control, name: "despesas" }) || 0;

  const totalItems = watchedItems.reduce((acc, item) => acc + (item.quantidade * item.valor_unitario), 0);
  const totalOutros = Number(watchedFrete) + Number(watchedSeguro) + Number(watchedDespesas);
  const totalNota = totalItems + totalOutros;

  const headerFields = ["modelo", "serie", "numero_nota", "supplier_id", "data_emissao"];

  const checkHeader = () => {
    const headerValues = form.getValues();
    const allFilled = headerFields.every(field => !!headerValues[field as keyof PurchaseFormType]);
    if (allFilled) {
      setFormStep(2);
    }
  };

  const handleGenerateInstallments = async () => {
    const pcId = form.getValues("payment_condition_id");
    if (!pcId) {
      toast.error("Selecione uma condição de pagamento primeiro.");
      return;
    }

    const condition = await fetchPaymentConditionById(pcId);
    if (!condition || !condition.parcelas) {
      toast.error("Condição de pagamento não encontrada ou sem parcelas.");
      return;
    }

    const newInstallments = condition.parcelas.map(p => {
      const dueDate = new Date(form.getValues("data_emissao"));
      dueDate.setDate(dueDate.getDate() + p.dias_vencimento);
      return {
        numero_parcela: p.numero_parcela,
        data_vencimento: dueDate,
        valor_parcela: (totalNota * p.percentual_valor) / 100
      };
    });

    replaceInstallments(newInstallments);
    setFormStep(3);
    toast.success("Parcelas geradas com sucesso!");
  };


  const onSubmit = async (data: PurchaseFormType) => {
    const result = await createPurchase(data);
    if (result.success) {
      toast.success(result.message);
      router.push("/compras");
    } else {
      toast.error("Erro ao salvar", { description: result.message });
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Etapa 1: Cabeçalho */}
        <fieldset disabled={formStep > 1} className="space-y-4">
          <legend className="text-lg font-medium">Dados da Nota</legend>
          <div className="grid md:grid-cols-3 gap-4">
            <FormField control={form.control} name="modelo" render={({ field }) => ( <FormItem><FormLabel>Modelo</FormLabel><FormControl><Input {...field} onBlur={checkHeader} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="serie" render={({ field }) => ( <FormItem><FormLabel>Série</FormLabel><FormControl><Input {...field} onBlur={checkHeader} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="numero_nota" render={({ field }) => ( <FormItem><FormLabel>Número da Nota</FormLabel><FormControl><Input {...field} onBlur={checkHeader} /></FormControl><FormMessage /></FormItem> )} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField name="supplier_id" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Fornecedor</FormLabel>
                  <Dialog open={dialogsOpen.supplier} onOpenChange={(isOpen) => setDialogsOpen((p) => ({ ...p, supplier: isOpen }))}>
                    <DialogTrigger asChild><Button variant="outline" className="justify-start font-normal">{selectedNames.supplier || "Selecione um fornecedor"}</Button></DialogTrigger>
                    <DialogContent className="max-w-5xl"><SupplierSelectionDialog suppliers={suppliers} cities={cities} states={states} countries={countries} onSelect={(s) => {
                        field.onChange(s[0].id);
                        setSelectedNames(p => ({ ...p, supplier: s[0].nome }));
                        form.setValue("payment_condition_id", s[0].payment_condition_id);
                        setSelectedNames(p => ({ ...p, paymentCondition: s[0].payment_condition_descricao }));
                        setDialogsOpen(p => ({...p, supplier: false}));
                        checkHeader();
                    }} /></DialogContent>
                  </Dialog>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
                <FormField name="data_emissao" render={({ field }) => (<FormItem className="flex flex-col w-1/2"><FormLabel>Data de Emissão</FormLabel><DatePicker value={field.value} onChange={field.onChange} onSelect={checkHeader} /><FormMessage /></FormItem>)} />
                <FormField name="data_entrega" render={({ field }) => (<FormItem className="flex flex-col w-1/2"><FormLabel>Data de Entrega</FormLabel><DatePicker value={field.value} onChange={field.onChange} /><FormMessage /></FormItem>)} />
            </div>
          </div>
        </fieldset>

        <Separator />

        {/* Etapa 2: Itens */}
        <fieldset disabled={formStep < 2 || formStep > 2} className="space-y-4">
          <legend className="text-lg font-medium">Itens da Compra</legend>
          <Dialog open={dialogsOpen.product} onOpenChange={(isOpen) => setDialogsOpen(p => ({ ...p, product: isOpen }))}>
            <DialogTrigger asChild><Button type="button" variant="outline" disabled={formStep < 2}>Adicionar Produtos</Button></DialogTrigger>
            <DialogContent className="max-w-4xl"><ProductSelectionDialog products={products} onSelect={(selected) => {
              const newItems = selected.map(p => ({ product_id: p.id, quantidade: 1, valor_unitario: p.valor_compra }));
              appendItem(newItems);
              setDialogsOpen(p => ({...p, product: false}));
            }} /></DialogContent>
          </Dialog>

          <Table>
            <TableHeader><TableRow><TableHead>Produto</TableHead><TableHead>Qtd.</TableHead><TableHead>Vlr. Unitário</TableHead><TableHead>Total</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{products.find(p => p.id === item.product_id)?.nome}</TableCell>
                  <TableCell><Input type="number" {...form.register(`items.${index}.quantidade` as const)} /></TableCell>
                  <TableCell><Input type="number" step="0.01" {...form.register(`items.${index}.valor_unitario` as const)} /></TableCell>
                  <TableCell>R$ {(watchedItems[index]?.quantidade * watchedItems[index]?.valor_unitario || 0).toFixed(2)}</TableCell>
                  <TableCell><Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="grid md:grid-cols-4 gap-4">
            <FormField control={form.control} name="valor_frete" render={({ field }) => (<FormItem><FormLabel>Frete</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>)} />
            <FormField control={form.control} name="seguro" render={({ field }) => (<FormItem><FormLabel>Seguro</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>)} />
            <FormField control={form.control} name="despesas" render={({ field }) => (<FormItem><FormLabel>Outras Despesas</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl></FormItem>)} />
            <div className="flex flex-col space-y-2">
              <FormLabel>Total da Nota</FormLabel>
              <Input value={`R$ ${totalNota.toFixed(2)}`} disabled />
            </div>
          </div>

        </fieldset>

        <Separator />

        {/* Etapa 3: Financeiro */}
        <fieldset disabled={formStep < 2} className="space-y-4">
            <legend className="text-lg font-medium">Financeiro</legend>
            <div className="flex items-end gap-4">
            <FormField name="payment_condition_id" control={form.control} render={({ field }) => (
                <FormItem className="flex flex-col w-1/2"><FormLabel>Condição de Pagamento</FormLabel>
                <Dialog open={dialogsOpen.paymentCondition} onOpenChange={(isOpen) => setDialogsOpen(p => ({ ...p, paymentCondition: isOpen }))}>
                    <DialogTrigger asChild><Button variant="outline" className="justify-start font-normal">{selectedNames.paymentCondition || "Selecione uma condição"}</Button></DialogTrigger>
                    <DialogContent className="max-w-6xl"><PaymentConditionSelectionDialog paymentConditions={paymentConditions} paymentMethods={paymentMethods} onSelect={(pc) => {
                        field.onChange(pc.id);
                        setSelectedNames(p => ({ ...p, paymentCondition: pc.descricao }));
                        setDialogsOpen(p => ({ ...p, paymentCondition: false }));
                    }} /></DialogContent>
                </Dialog>
                <FormMessage />
                </FormItem>
            )} />
                <Button type="button" onClick={handleGenerateInstallments} disabled={formStep > 2}>Gerar Parcelas</Button>
            </div>

            <Table>
                <TableHeader><TableRow><TableHead>Nº</TableHead><TableHead>Vencimento</TableHead><TableHead>Valor</TableHead></TableRow></TableHeader>
                <TableBody>
                    {installments.map((installment) => (
                        <TableRow key={installment.id}>
                            <TableCell>{installment.numero_parcela}</TableCell>
                            <TableCell>{format(new Date(installment.data_vencimento), "dd/MM/yyyy")}</TableCell>
                            <TableCell>R$ {installment.valor_parcela.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </fieldset>

        <FormFooter
            formId="purchase-form"
            cancelHref="/compras"
            isEditMode={isEditMode}
            isSubmitting={form.formState.isSubmitting}
            isDirty={form.formState.isDirty}
        />

      </form>
    </Form>
  );
}