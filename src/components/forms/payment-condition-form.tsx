"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PaymentConditionForm, PaymentConditionSchema, PaymentMethod } from "@/lib/definitions";
import { createPaymentCondition } from "@/lib/actions/condicoes-pagamento";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, PlusCircle, Trash2 } from "lucide-react";

interface PaymentConditionCreationFormProps {
  paymentMethods: PaymentMethod[];
  onSuccess: () => void;
}

// Componente para exibir a soma das parcelas em tempo real
function InstallmentTotal({ control }: { control: any }) {
  const parcelas = useWatch({ control, name: "parcelas" });
  const totalPercent = (parcelas || []).reduce((sum, p) => sum + (Number(p.percentual_valor) || 0), 0);
  const isTotalCorrect = Math.abs(totalPercent - 100) < 0.001;

  return (
    <div className={cn("flex items-center gap-2 rounded-lg p-3 text-sm", isTotalCorrect ? "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300" : "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300")}>
      {isTotalCorrect ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
      <span>Soma: <strong>{totalPercent.toFixed(2)}%</strong></span>
    </div>
  );
}

export function PaymentConditionCreationForm({ paymentMethods, onSuccess }: PaymentConditionCreationFormProps) {
  const form = useForm<PaymentConditionForm>({
    resolver: zodResolver(PaymentConditionSchema),
    defaultValues: {
      descricao: "",
      juros: 0,
      multa: 0,
      desconto: 0,
      ativo: true,
      parcelas: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parcelas",
  });
  
  const { formState: { errors } } = form;

  const onSubmit = async (data: PaymentConditionForm) => {
    const numberedData = {
      ...data,
      parcelas: data.parcelas.map((p, index) => ({ ...p, numero_parcela: index + 1 })),
    };
    const result = await createPaymentCondition(numberedData);
    if (result.success) {
      toast.success(result.message);
      onSuccess();
    } else {
      toast.error("Erro ao criar condição", { description: result.message });
    }
  };

  return (
    <div className="overflow-y-auto max-h-[75vh] p-1">
      <Form {...form}>
        <form className="space-y-6 px-4">
          <FormField control={form.control} name="descricao" render={({ field }) => (
            <FormItem><FormLabel>Descrição</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField control={form.control} name="juros" render={({ field }) => (
                  <FormItem><FormLabel>Juros (%)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="multa" render={({ field }) => (
                  <FormItem><FormLabel>Multa (%)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="desconto" render={({ field }) => (
                  <FormItem><FormLabel>Desconto (%)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
          </div>
          
          <Separator />
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Parcelas</h3>
            {fields.length > 0 && <InstallmentTotal control={form.control} />}
          </div>
          {errors.parcelas?.root?.message && (
            <p className="text-sm font-medium text-destructive">{errors.parcelas.root.message}</p>
          )}
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-10 gap-2 items-start border p-4 rounded-lg relative">
                <div className="md:col-span-1 font-medium pt-8">#{index + 1}</div>
                <FormField control={form.control} name={`parcelas.${index}.dias_vencimento`} render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>Dias</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`parcelas.${index}.percentual_valor`} render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>% Valor</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`parcelas.${index}.forma_pagamento_id`} render={({ field }) => (<FormItem className="md:col-span-4"><FormLabel>Forma Pagto.</FormLabel><Select onValueChange={field.onChange} defaultValue={String(field.value) === '0' ? undefined : String(field.value)}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl><SelectContent>{paymentMethods.map(pm => <SelectItem key={pm.id} value={String(pm.id)}>{pm.descricao}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
                <div className="md:col-span-1 flex items-center pt-8"><Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" onClick={() => append({ numero_parcela: fields.length + 1, dias_vencimento: 0, percentual_valor: 0, forma_pagamento_id: 0 })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Parcela
          </Button>
          <Separator />
          <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full">
            {form.formState.isSubmitting ? "Salvando..." : "Salvar Condição"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
